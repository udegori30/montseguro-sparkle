import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { formatCurrency, formatPercent } from "../../utils/format.js";
import "./PreviousSummariesModal.css";

// Overlay acionado pelo botao "Resumos anteriores" do Header. Reaproveita a
// serie historica de metas como resumo diario (data, faturamento, % da meta).
export function PreviousSummariesModal({ onClose }) {
  const { goalsEvolution } = useDashboardData();
  const days = [...goalsEvolution].reverse();

  return (
    <div className="summaries-modal__backdrop" onClick={onClose}>
      <div className="summaries-modal" onClick={(event) => event.stopPropagation()}>
        <header className="summaries-modal__header">
          <h2>Resumos anteriores</h2>
          <button type="button" className="summaries-modal__close" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </header>
        <div className="summaries-modal__list">
          {days.map((day) => (
            <div className="summaries-modal__row" key={day.date}>
              <span className="summaries-modal__date">{day.date}</span>
              <span className="summaries-modal__revenue">{formatCurrency(day.revenue)}</span>
              <span className="summaries-modal__goal">{formatPercent(day.goalPct)} da demanda</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
