import "./KpiCard.css";

// Bloco reutilizavel: label em maiusculas, valor grande em fonte mono,
// subtitulo opcional e, quando `progress` e informado, uma barra de meta.
export function KpiCard({ label, value, subtitle, progress, onEditGoal }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card__header">
        <span className="kpi-card__label">{label}</span>
        {onEditGoal && (
          <button
            type="button"
            className="kpi-card__edit"
            onClick={onEditGoal}
            aria-label="Editar meta"
            title="Editar meta"
          >
            ✎
          </button>
        )}
      </div>
      <div className="kpi-card__value">{value}</div>
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
