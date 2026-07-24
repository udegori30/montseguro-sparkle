import { DailyMetricView } from "./DailyMetricView.jsx";

// Aba "Assinaturas · Hoje".
export function AssinaturasView() {
  return (
    <DailyMetricView
      metricKey="todaySubscriptions"
      metricLabel="assinaturas"
      kpiLabels={{ qty: "Assinaturas Hoje", value: "Valor em Assinaturas" }}
    />
  );
}
