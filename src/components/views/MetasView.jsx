import { useMemo, useState } from "react";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { useEditableGoals } from "../../hooks/useEditableGoals.js";
import { KpiCard } from "../common/KpiCard.jsx";
import { GoalRankingTable } from "./GoalRankingTable.jsx";
import { formatCurrency, formatPercent } from "../../utils/format.js";
import "./shared.css";
import "./MetasView.css";

// Monta as linhas de uma tabela de ranking por meta, ja ordenadas da maior
// para a menor % de atingimento. `period` ("monthly"|"quarterly") define
// qual override editavel (useEditableGoals) e aplicado sobre a demanda.
function buildGoalRows(consultants, { period, defaultDemandKey, achievedKey, contractsKey, getGoal }) {
  return consultants
    .map((consultant) => {
      const demand = getGoal(consultant.id, period, consultant[defaultDemandKey]);
      const achieved = consultant[achievedKey];
      const pct = demand > 0 ? (achieved / demand) * 100 : 0;
      return {
        id: consultant.id,
        name: consultant.name,
        demand,
        achieved,
        pct,
        remaining: Math.max(0, demand - achieved),
        contracts: consultant[contractsKey],
      };
    })
    .sort((a, b) => b.pct - a.pct);
}

function sumAchieved(rows) {
  return rows.reduce((sum, row) => sum + row.achieved, 0);
}

// Aba "Evolução de Metas": ranking de consultores por meta mensal/trimestral,
// com metas editaveis (useEditableGoals).
export function MetasView() {
  const { consultants, summary } = useDashboardData();
  const { getGoal, setGoal } = useEditableGoals();
  const [monthlyGoalOverride, setMonthlyGoalOverride] = useState(null);
  const [quarterlyGoalOverride, setQuarterlyGoalOverride] = useState(null);

  const monthlyRows = useMemo(
    () =>
      buildGoalRows(consultants, {
        period: "monthly",
        defaultDemandKey: "monthlyGoal",
        achievedKey: "monthRevenue",
        contractsKey: "monthContracts",
        getGoal,
      }),
    [consultants, getGoal],
  );

  const quarterlyRows = useMemo(
    () =>
      buildGoalRows(consultants, {
        period: "quarterly",
        defaultDemandKey: "quarterlyGoal",
        achievedKey: "quarterRevenue",
        contractsKey: "quarterContracts",
        getGoal,
      }),
    [consultants, getGoal],
  );

  const monthlyGoalValue = monthlyGoalOverride ?? summary.revenueGoalValue;
  const monthlyGoalPct = Number(((summary.revenueTeams / monthlyGoalValue) * 100).toFixed(1));

  const quarterlyAchieved = useMemo(() => sumAchieved(quarterlyRows), [quarterlyRows]);
  const quarterlyGoalValue = quarterlyGoalOverride ?? summary.revenueGoalValueQuarterly;
  const quarterlyGoalPct = Number(((quarterlyAchieved / quarterlyGoalValue) * 100).toFixed(1));

  function handleEditDemand(period, periodLabel) {
    return (consultantId, currentValue) => {
      const input = window.prompt(`Nova meta ${periodLabel} (R$):`, String(currentValue));
      if (input === null) return;
      const parsed = Number(input.replace(/[^\d]/g, ""));
      if (Number.isFinite(parsed) && parsed > 0) setGoal(consultantId, period, parsed);
    };
  }

  function handleEditCollectiveGoal(currentValue, label, setOverride) {
    return () => {
      const input = window.prompt(`Nova meta de ${label} (R$):`, String(currentValue));
      if (input === null) return;
      const parsed = Number(input.replace(/[^\d]/g, ""));
      if (Number.isFinite(parsed) && parsed > 0) setOverride(parsed);
    };
  }

  return (
    <div className="view">
      <div className="kpi-strip">
        <KpiCard
          featured
          label="Faturamento do Time · Implantado | Mês"
          value={formatCurrency(summary.revenueTeams)}
          subtitle={`${formatPercent(monthlyGoalPct)} da meta de ${formatCurrency(monthlyGoalValue)}`}
          progress={monthlyGoalPct}
          onEditGoal={handleEditCollectiveGoal(monthlyGoalValue, "faturamento mensal", setMonthlyGoalOverride)}
        />
        <KpiCard
          featured
          label="Faturamento do Time · Implantado | Trimestre"
          value={formatCurrency(quarterlyAchieved)}
          subtitle={`${formatPercent(quarterlyGoalPct)} da meta de ${formatCurrency(quarterlyGoalValue)}`}
          progress={quarterlyGoalPct}
          onEditGoal={handleEditCollectiveGoal(
            quarterlyGoalValue,
            "faturamento trimestral",
            setQuarterlyGoalOverride,
          )}
        />
      </div>

      <div className="section">
        <h2 className="section-title">Ranking de Consultores por Meta</h2>
        <div className="metas-goal-tables">
          <GoalRankingTable
            title="Meta Mensal"
            demandLabel="Demanda/Mês"
            rows={monthlyRows}
            onEditDemand={handleEditDemand("monthly", "mensal")}
          />
          <GoalRankingTable
            title="Meta Trimestral"
            demandLabel="Demanda/Trimestre"
            rows={quarterlyRows}
            onEditDemand={handleEditDemand("quarterly", "trimestral")}
          />
        </div>
      </div>
    </div>
  );
}
