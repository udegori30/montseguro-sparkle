import { useMemo } from "react";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { Avatar } from "../common/Avatar.jsx";
import { formatCurrency } from "../../utils/format.js";
import "./shared.css";
import "./GoalRankingTable.css";
import "./PrevisaoView.css";

const BLOCK_SIZE = 9;

function PrevisaoBlock({ title, rows, startRank }) {
  return (
    <div className="goal-table-wrap previsao-table-wrap">
      <h3 className="goal-table__title">{title}</h3>
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
                  <span className="goal-table__rank">{startRank + index}</span>
                  <Avatar consultantId={row.id} name={row.name} size="sm" />
                  {row.name}
                </td>
                <td className="previsao-table__cell">
                  <strong className="previsao-table__value">{formatCurrency(row.signed)}</strong>
                  <span className="previsao-table__goal">Demanda: {formatCurrency(row.signedGoal)}</span>
                </td>
                <td className="previsao-table__cell">
                  <strong className="previsao-table__value">{formatCurrency(row.deployed)}</strong>
                  <span className="previsao-table__goal">Demanda: {formatCurrency(row.deployedGoal)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Aba "Previsao | Mes": ranking de consultores por previsao do mes
// (assinado + implantado), com a demanda de cada estagio exibida abaixo do
// valor. Dividido em 2 blocos de 9 consultores para caber lado a lado.
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

  const firstBlock = rows.slice(0, BLOCK_SIZE);
  const secondBlock = rows.slice(BLOCK_SIZE, BLOCK_SIZE * 2);

  return (
    <div className="view">
      <div className="section">
        <h2 className="section-title">Ranking de Consultores por Previsão</h2>
        <div className="previsao-blocks">
          <PrevisaoBlock title="Previsão · Mês (1-9)" rows={firstBlock} startRank={1} />
          <PrevisaoBlock
            title="Previsão · Mês (10-18)"
            rows={secondBlock}
            startRank={BLOCK_SIZE + 1}
          />
        </div>
      </div>
    </div>
  );
}
