import { formatCurrency, formatNumber, formatPercent } from "../../utils/format.js";
import "./KpiTicker.css";

function buildItems(kpis) {
  return [
    {
      label: "Assinaturas do dia",
      value: `${formatNumber(kpis.subscriptionsToday.qty)} · ${formatCurrency(kpis.subscriptionsToday.value)}`,
    },
    {
      label: "Implantações do dia",
      value: `${formatNumber(kpis.deploymentsToday.qty)} · ${formatCurrency(kpis.deploymentsToday.value)}`,
    },
    { label: "Leads em aberto", value: formatNumber(kpis.openLeads) },
    { label: "Leads quentes", value: formatNumber(kpis.hotLeads) },
    { label: "Faturamento do time", value: formatCurrency(kpis.teamRevenue) },
    { label: "Meta coletiva", value: formatPercent(kpis.collectiveGoalPct) },
    { label: "Líder atual", value: kpis.currentLeader },
  ];
}

// Regiao 3 do layout: faixa horizontal rolante de KPIs.
// O conteudo e duplicado para permitir um loop de rolagem continuo via CSS.
export function KpiTicker({ kpis }) {
  if (!kpis) return null;
  const items = buildItems(kpis);

  return (
    <div className="kpi-ticker">
      <div className="kpi-ticker__track">
        <div className="kpi-ticker__content">
          {items.concat(items).map((item, index) => (
            <span className="kpi-ticker__item" key={`${item.label}-${index}`}>
              <span className="kpi-ticker__label">{item.label}</span>
              <span className="kpi-ticker__value">{item.value}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
