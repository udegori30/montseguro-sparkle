import { DailyMetricView } from "./DailyMetricView.jsx";

// Aba "Implantações · Hoje".
export function ImplantacoesView() {
  return (
    <DailyMetricView
      metricKey="todayDeployments"
      metricLabel="implantações"
      kpiLabels={{ qty: "Implantações Hoje", value: "Valor Implantado Hoje" }}
      rankingTitle="Rank Diário · Implantações"
    />
  );
}
