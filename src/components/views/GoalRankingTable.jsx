import { Avatar } from "../common/Avatar.jsx";
import { formatCurrency, formatPercent } from "../../utils/format.js";
import "./GoalRankingTable.css";

// Faixas de atingimento da demanda: <50% baixo, 50-79% medio, 80-99% alto,
// >=100% concluido. Usada para colorir tanto o valor alcancado quanto o %.
function getTierClass(pct) {
  if (pct >= 100) return "goal-table__tier--done";
  if (pct >= 80) return "goal-table__tier--high";
  if (pct >= 50) return "goal-table__tier--mid";
  return "goal-table__tier--low";
}

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
              <th>%</th>
              <th>Restante</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const tierClass = getTierClass(row.pct);
              return (
                <tr key={row.id}>
                  <td className="goal-table__name">
                    <span className="goal-table__rank">{index + 1}</span>
                    <Avatar consultantId={row.id} name={row.name} size="sm" />
                    {row.name}
                  </td>
                  <td>
                    <span className="goal-table__demand">
                      {formatCurrency(row.demand)}
                      <button
                        type="button"
                        className="goal-table__edit-btn"
                        onClick={() => onEditDemand(row.id, row.demand)}
                        title="Editar demanda"
                        aria-label="Editar demanda"
                      >
                        ✎
                      </button>
                    </span>
                  </td>
                  <td className={tierClass}>{formatCurrency(row.achieved)}</td>
                  <td className={tierClass}>{formatPercent(row.pct, 1)}</td>
                  <td>{formatCurrency(row.remaining)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
