import { useMemo, useState } from "react";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { KpiCard } from "../common/KpiCard.jsx";
import { Podium } from "../common/Podium.jsx";
import { RankingList } from "../common/RankingList.jsx";
import { formatCurrency, formatPercent } from "../../utils/format.js";
import { getDominantTemperature } from "../../utils/consultants.js";
import "../views/shared.css";

// Aba "Geral · Mensal": visao consolidada do mes, com meta editavel,
// podio e ranking completo dos 18 consultores por faturamento.
export function GeralView() {
  const { consultants, summary } = useDashboardData();
  const [goalOverride, setGoalOverride] = useState(null);
  const goalValue = goalOverride ?? summary.revenueGoalValue;
  const goalPct = Number(((summary.revenueTeams / goalValue) * 100).toFixed(1));

  const ranking = useMemo(
    () =>
      [...consultants]
        .sort((a, b) => b.monthRevenue - a.monthRevenue)
        .map((consultant) => {
          const temperature = getDominantTemperature(consultant);
          return {
            id: consultant.id,
            name: consultant.name,
            avatarUrl: consultant.avatarUrl,
            value: consultant.monthRevenue,
            trendDelta: consultant.monthRevenue - consultant.monthRevenueYesterday,
            secondaryMeta: `${consultant.activeLeads} leads ativos · ${temperature.icon} ${temperature.key}`,
          };
        }),
    [consultants],
  );

  function handleEditGoal() {
    const input = window.prompt("Nova meta de faturamento dos times (R$):", String(goalValue));
    if (input === null) return;
    const parsed = Number(input.replace(/[^\d]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) setGoalOverride(parsed);
  }

  return (
    <div className="view">
      <div className="kpi-row">
        <KpiCard
          label="Faturamento dos Times · Implantado"
          value={formatCurrency(summary.revenueTeams)}
          subtitle={`${formatPercent(goalPct)} da meta de ${formatCurrency(goalValue)}`}
          progress={goalPct}
          onEditGoal={handleEditGoal}
        />
        <KpiCard label="Análise · Mês" value={formatCurrency(summary.analysisMonth)} />
        <KpiCard label="Aguardando Pagamento · Mês" value={formatCurrency(summary.awaitingPayment)} />
        <KpiCard label="Ticket Médio" value={formatCurrency(summary.ticketMedio)} />
        <KpiCard label="Taxa de Conversão" value={formatPercent(summary.conversionPct, 1)} />
      </div>

      <div className="section">
        <h2 className="section-title">Pódio do Mês</h2>
        <Podium items={ranking.slice(0, 3)} />
      </div>

      <div className="section">
        <h2 className="section-title">Ranking Geral · 18 Consultores</h2>
        <RankingList items={ranking} />
      </div>
    </div>
  );
}
