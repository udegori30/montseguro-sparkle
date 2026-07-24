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

// Regiao 3 do layout: faixa horizontal rolante de KPIs, com uma capa fixa
// "AO VIVO" a esquerda. O conteudo e duplicado para permitir um loop de
// rolagem continuo via CSS (tickerScroll); pausa ao passar o mouse.
export function KpiTicker({ kpis }) {
  if (!kpis) return null;
  const items = buildItems(kpis);

  return (
    <div className="ticker">
      <div className="ticker__cap">
        <span className="live-dot" aria-hidden="true" />
        <span>LIVE</span>
      </div>
      <div className="ticker__viewport">
        <div className="ticker-track">
          {items.concat(items).map((item, index) => (
            <span className="ticker__item" key={`${item.label}-${index}`}>
              <span className="ticker__label">{item.label}</span>
              <span className="ticker__value num">{item.value}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
