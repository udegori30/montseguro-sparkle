import { useMemo, useState } from "react";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { KpiCard } from "../common/KpiCard.jsx";
import { Podium } from "../common/Podium.jsx";
import { RankingList } from "../common/RankingList.jsx";
import { useRankingChanges } from "../../hooks/useRankingChanges.js";
import {
  daysUntilEndOfMonth,
  formatCurrency,
  formatPercent,
  formatResetLabel,
} from "../../utils/format.js";
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
            contracts: consultant.monthContracts,
            trendDelta: consultant.monthRevenue - consultant.monthRevenueYesterday,
            temperature: temperature.key,
            secondaryMeta: `${consultant.activeLeads} leads ativos · ${temperature.icon} ${temperature.key}`,
          };
        }),
    [consultants],
  );

  const changes = useRankingChanges(ranking);

  function handleEditGoal() {
    const input = window.prompt("Nova demanda de faturamento dos times (R$):", String(goalValue));
    if (input === null) return;
    const parsed = Number(input.replace(/[^\d]/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) setGoalOverride(parsed);
  }

  return (
    <div className="view">
      <div className="kpi-strip">
        <KpiCard
          featured
          label="Faturamento dos Times · Implantado"
          value={formatCurrency(summary.revenueTeams)}
          subtitle={`${formatPercent(goalPct)} da demanda de ${formatCurrency(goalValue)}`}
          progress={goalPct}
          onEditGoal={handleEditGoal}
        />
        <KpiCard label="Análise · Mês" value={formatCurrency(summary.analysisMonth)} />
        <KpiCard label="Aguardando Pagamento · Mês" value={formatCurrency(summary.awaitingPayment)} />
        <KpiCard label="Ticket Médio" value={formatCurrency(summary.ticketMedio)} />
        <KpiCard label="Taxa de Conversão" value={formatPercent(summary.conversionPct, 1)} />
      </div>

      <div className="lead-split">
        <Podium
          items={ranking.slice(0, 3).map((item) => ({
            ...item,
            celebrating: changes.get(item.id)?.changeClass === "celebrating",
          }))}
          metricLabel="Vendas"
          secondaryLabel="Contratos Fechados"
          resetLabel={formatResetLabel(daysUntilEndOfMonth())}
        />

        <RankingList items={ranking} meta={`${ranking.length} consultores ativos`} changes={changes} />
      </div>
    </div>
  );
}
