import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { useEditableGoals } from "../../hooks/useEditableGoals.js";
import { KpiCard } from "../common/KpiCard.jsx";
import { GoalRankingTable } from "./GoalRankingTable.jsx";
import { formatCurrency, formatNumber, formatPercent, getTrend } from "../../utils/format.js";
import { getTabById } from "../../theme/tabThemes.js";
import "./shared.css";
import "./MetasView.css";

const { accent } = getTabById("metas");

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const trend = point.dayOverDayPct == null ? null : getTrend(point.dayOverDayPct);
  return (
    <div className="metas-tooltip">
      <strong>{label}</strong>
      <span>{formatCurrency(point.revenue)} de resultado no dia</span>
      <span>
        {formatCurrency(point.contractsSignedValue)} · {formatNumber(point.contractsSigned)} contratos
        assinados
      </span>
      <span>
        {formatCurrency(point.contractsDeployedValue)} · {formatNumber(point.contractsDeployed)} contratos
        implantados
      </span>
      {trend && (
        <span className={trend.className}>
          {trend.symbol} {formatPercent(Math.abs(point.dayOverDayPct), 1)} vs. dia anterior
        </span>
      )}
    </div>
  );
}

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

// Aba "Evolução de Metas": reaproveita os KPIs da visao mensal, adiciona um
// grafico de area com o progresso da meta coletiva e o ranking de
// consultores por meta mensal/trimestral (com metas editaveis).
export function MetasView() {
  const { consultants, summary, goalsEvolution } = useDashboardData();
  const { getGoal, setGoal } = useEditableGoals();

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

  const chartData = useMemo(
    () =>
      goalsEvolution.map((point, index) => {
        const previous = goalsEvolution[index - 1];
        const dayOverDayPct =
          previous && previous.revenue > 0
            ? ((point.revenue - previous.revenue) / previous.revenue) * 100
            : null;
        return { ...point, dayOverDayPct };
      }),
    [goalsEvolution],
  );

  function handleEditDemand(period, periodLabel) {
    return (consultantId, currentValue) => {
      const input = window.prompt(`Nova meta ${periodLabel} (R$):`, String(currentValue));
      if (input === null) return;
      const parsed = Number(input.replace(/[^\d]/g, ""));
      if (Number.isFinite(parsed) && parsed > 0) setGoal(consultantId, period, parsed);
    };
  }

  return (
    <div className="view">
      <div className="kpi-strip">
        <KpiCard
          featured
          label="Faturamento dos Times · Implantado"
          value={formatCurrency(summary.revenueTeams)}
          subtitle={`${formatPercent(summary.revenueGoalPct)} da meta`}
          progress={summary.revenueGoalPct}
        />
        <KpiCard label="Análise · Mês" value={formatCurrency(summary.analysisMonth)} />
        <KpiCard label="Aguardando Pagamento · Mês" value={formatCurrency(summary.awaitingPayment)} />
        <KpiCard label="Ticket Médio" value={formatCurrency(summary.ticketMedio)} />
      </div>

      <div className="section">
        <h2 className="section-title">Evolução de Resultado (14 dias)</h2>
        <div className="metas-chart">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="metaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} unit="%" domain={[0, 100]} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="goalPct"
                stroke={accent}
                strokeWidth={2}
                fill="url(#metaGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
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
