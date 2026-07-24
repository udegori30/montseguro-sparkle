import { DailyMetricView } from "./DailyMetricView.jsx";

// Aba "Implantações · Hoje".
export function ImplantacoesView() {
  return (
    <DailyMetricView
      metricKey="todayDeployments"
      metricLabel="implantações"
      kpiLabels={{ qty: "Contratos Implantados", value: "Valor Implantado Hoje" }}
    />
  );
}
