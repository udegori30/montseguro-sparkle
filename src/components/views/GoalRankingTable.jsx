import { formatCurrency, formatPercent } from "../../utils/format.js";
import "./GoalRankingTable.css";

// Tabela de ranking de consultores por meta (maior % de atingimento primeiro).
// `demandLabel` troca entre "Demanda/Mês" e "Demanda/Trimestre" conforme o
// periodo; a demanda de cada linha e editavel via o botao de lapis.
export function GoalRankingTable({ title, demandLabel, rows, onEditDemand }) {
  return (
    <div className="goal-table-wrap">
      <h3 className="goal-table__title">{title}</h3>
      <div className="goal-table__scroll">
        <table className="goal-table">
          <thead>
            <tr>
              <th>Prestador</th>
              <th>{demandLabel}</th>
              <th>Alcançado</th>
              <th>Percentual de Atingimento</th>
              <th>Restante</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <td className="goal-table__name">
                  <span className="goal-table__rank">{index + 1}</span>
                  {row.name}
                </td>
                <td>
                  <span className="goal-table__demand">
                    {formatCurrency(row.demand)}
                    <button
                      type="button"
                      className="goal-table__edit-btn"
                      onClick={() => onEditDemand(row.id, row.demand)}
                      title="Editar meta"
                      aria-label="Editar meta"
                    >
                      ✎
                    </button>
                  </span>
                </td>
                <td>{formatCurrency(row.achieved)}</td>
                <td className={row.pct >= 100 ? "goal-table__pct--done" : ""}>
                  {formatPercent(row.pct, 1)}
                </td>
                <td>{formatCurrency(row.remaining)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
