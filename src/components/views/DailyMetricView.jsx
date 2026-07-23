import { useMemo } from "react";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { KpiCard } from "../common/KpiCard.jsx";
import { Podium } from "../common/Podium.jsx";
import { RankingList } from "../common/RankingList.jsx";
import { formatCurrency, formatNumber } from "../../utils/format.js";
import "./shared.css";

// Esqueleto reutilizado pelas abas "Assinaturas · Hoje" e "Implantações ·
// Hoje": 3 KpiCards de topo + Podium + RankingList, variando apenas a
// metrica diaria observada em cada consultor (todaySubscriptions|todayDeployments).
export function DailyMetricView({ metricKey, metricLabel, kpiLabels, rankingTitle }) {
  const { consultants } = useDashboardData();

  const ranking = useMemo(
    () =>
      [...consultants]
        .sort((a, b) => b[metricKey].value - a[metricKey].value)
        .map((consultant) => ({
          id: consultant.id,
          name: consultant.name,
          avatarUrl: consultant.avatarUrl,
          value: consultant[metricKey].value,
          trendDelta: consultant[metricKey].value - consultant[`${metricKey}Yesterday`].value,
          secondaryMeta: `${formatNumber(consultant[metricKey].qty)} ${metricLabel}`,
        })),
    [consultants, metricKey, metricLabel],
  );

  const totals = consultants.reduce(
    (acc, consultant) => ({
      qty: acc.qty + consultant[metricKey].qty,
      value: acc.value + consultant[metricKey].value,
    }),
    { qty: 0, value: 0 },
  );
  const averageTicket = totals.qty > 0 ? totals.value / totals.qty : 0;

  return (
    <div className="view">
      <div className="kpi-row">
        <KpiCard label={kpiLabels.qty} value={formatNumber(totals.qty)} />
        <KpiCard label={kpiLabels.value} value={formatCurrency(totals.value)} />
        <KpiCard label="Ticket Médio" value={formatCurrency(averageTicket)} />
      </div>

      <div className="section">
        <h2 className="section-title">Pódio do Dia</h2>
        <Podium items={ranking.slice(0, 3)} />
      </div>

      <div className="section">
        <h2 className="section-title">{rankingTitle}</h2>
        <RankingList items={ranking} />
      </div>
    </div>
  );
}
