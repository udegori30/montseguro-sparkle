import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { KpiCard } from "../common/KpiCard.jsx";
import { formatCurrency, formatNumber, formatPercent } from "../../utils/format.js";
import "./shared.css";
import "./FunilView.css";

// Aba "Funil de Vendas": KPIs gerais + visualizacao vertical das etapas,
// cada uma com barra proporcional ao seu peso no funil.
export function FunilView() {
  const { funnel } = useDashboardData();
  const maxPct = Math.max(...funnel.stages.map((stage) => stage.pctOfFunnel));

  return (
    <div className="view">
      <div className="kpi-row">
        <KpiCard label="Total de Leads" value={formatNumber(funnel.totalLeads)} />
        <KpiCard label="Valor do Pipeline" value={formatCurrency(funnel.pipelineValue)} />
        <KpiCard label="SQL" value={formatNumber(funnel.sql)} />
        <KpiCard label="Leads Frios" value={formatNumber(funnel.coldLeads)} />
      </div>

      <div className="section">
        <h2 className="section-title">Visualização do Funil Corporativo</h2>
        <div className="funnel">
          {funnel.stages.map((stage) => (
            <div className="funnel__stage" key={stage.name}>
              <div className="funnel__stage-header">
                <span className="funnel__stage-name">{stage.name}</span>
                <span className="funnel__stage-pct">{formatPercent(stage.pctOfFunnel)} do funil</span>
              </div>
              <div className="funnel__bar-track">
                <div
                  className="funnel__bar-fill"
                  style={{ width: `${(stage.pctOfFunnel / maxPct) * 100}%` }}
                />
              </div>
              <div className="funnel__stage-footer">
                <span>{formatCurrency(stage.value)}</span>
                <span>{stage.count} leads</span>
                <span>
                  {stage.daysInStage} {stage.daysInStage === 1 ? "dia" : "dias"} na etapa
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
