import { useMemo } from "react";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { Avatar } from "../common/Avatar.jsx";
import { formatCurrency } from "../../utils/format.js";
import "./shared.css";
import "./GoalRankingTable.css";
import "./PrevisaoView.css";

// Aba "Previsao | Mes": ranking de consultores por previsao do mes
// (assinado + implantado), com a meta de cada estagio exibida abaixo do valor.
export function PrevisaoView() {
  const { consultants } = useDashboardData();

  const rows = useMemo(
    () =>
      [...consultants]
        .map((consultant) => ({
          id: consultant.id,
          name: consultant.name,
          signed: consultant.monthSigned,
          signedGoal: consultant.signedGoal,
          deployed: consultant.monthRevenue,
          deployedGoal: consultant.monthlyGoal,
        }))
        .sort((a, b) => b.signed + b.deployed - (a.signed + a.deployed)),
    [consultants],
  );

  return (
    <div className="view">
      <div className="section">
        <h2 className="section-title">Ranking de Consultores por Previsão</h2>
        <div className="goal-table-wrap previsao-table-wrap">
          <h3 className="goal-table__title">Previsão · Mês</h3>
          <div className="goal-table__scroll">
            <table className="goal-table">
              <thead>
                <tr>
                  <th>Prestador</th>
                  <th>Assinado</th>
                  <th>Implantado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td className="goal-table__name">
                      <span className="goal-table__rank">{index + 1}</span>
                      <Avatar consultantId={row.id} name={row.name} size="sm" />
                      {row.name}
                    </td>
                    <td className="previsao-table__cell">
                      <strong className="previsao-table__value">{formatCurrency(row.signed)}</strong>
                      <span className="previsao-table__goal">Meta: {formatCurrency(row.signedGoal)}</span>
                    </td>
                    <td className="previsao-table__cell">
                      <strong className="previsao-table__value">{formatCurrency(row.deployed)}</strong>
                      <span className="previsao-table__goal">Meta: {formatCurrency(row.deployedGoal)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
