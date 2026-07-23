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
import { KpiCard } from "../common/KpiCard.jsx";
import { formatCurrency, formatNumber, formatPercent } from "../../utils/format.js";
import { getTabById } from "../../theme/tabThemes.js";
import "./shared.css";
import "./MetasView.css";

const { accent } = getTabById("metas");

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="metas-tooltip">
      <strong>{label}</strong>
      <span>{formatPercent(point.goalPct)} da meta coletiva</span>
      <span>{formatCurrency(point.revenue)} faturados no dia</span>
    </div>
  );
}

// Aba "Evolução de Metas": reaproveita os KPIs da visao mensal e adiciona
// um grafico de area com o progresso da meta coletiva ao longo do tempo.
export function MetasView() {
  const { summary, goalsEvolution } = useDashboardData();

  return (
    <div className="view">
      <div className="kpi-row">
        <KpiCard
          label="Faturamento dos Times · Implantado"
          value={formatCurrency(summary.revenueTeams)}
          subtitle={`${formatPercent(summary.revenueGoalPct)} da meta`}
          progress={summary.revenueGoalPct}
        />
        <KpiCard label="Análise · Mês" value={formatCurrency(summary.analysisMonth)} />
        <KpiCard label="Aguardando Pagamento · Mês" value={formatCurrency(summary.awaitingPayment)} />
        <KpiCard label="Leads em Aberto" value={formatNumber(summary.openLeads)} />
      </div>

      <div className="section">
        <h2 className="section-title">Evolução da Meta Coletiva (14 dias)</h2>
        <div className="metas-chart">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={goalsEvolution} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
    </div>
  );
}
