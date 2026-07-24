import "./KpiCard.css";

// Bloco reutilizavel do KpiStrip: eyebrow, valor grande (Space Grotesk), subtitulo
// opcional e, quando `progress` e informado, uma barra de meta. `featured` liga
// a aura pulsante + o valor com gradiente animado (usado no 1o card de cada view).
export function KpiCard({ label, value, subtitle, progress, onEditGoal, featured = false }) {
  return (
    <div className={`kpi-card${featured ? " featured" : ""}`}>
      <div className="kpi-card__header">
        <span className="eyebrow">{label}</span>
        {onEditGoal && (
          <button
            type="button"
            className="kpi-card__edit"
            onClick={onEditGoal}
            aria-label="Editar demanda"
            title="Editar demanda"
          >
            ✎
          </button>
        )}
      </div>
      <div className={`kpi-value${featured ? " shimmer-text" : ""}`}>{value}</div>
      {subtitle && <div className="kpi-card__subtitle">{subtitle}</div>}
      {typeof progress === "number" && (
        <div className="kpi-card__progress-track">
          <div
            className="kpi-card__progress-fill"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
