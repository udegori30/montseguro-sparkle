import { RankingRow } from "./RankingRow.jsx";
import "./RankingList.css";

// Painel com o ranking completo: header ("Ranking Completo" + "N ativos")
// e grade de 2 colunas de RankingRow. `changes` (de useRankingChanges)
// informa reacoes ao vivo por consultor: { changeClass, magnitude }.
export function RankingList({ items, valueFormatter, meta, changes }) {
  return (
    <div className="ranking-wrap">
      <div className="ranking-header">
        <span className="section-eyebrow">Ranking Completo</span>
        {meta && <span className="section-meta">{meta}</span>}
      </div>
      <div className="ranking-grid glass-panel">
        {items.map((item, index) => (
          <RankingRow
            key={item.id}
            position={index + 1}
            valueFormatter={valueFormatter}
            change={changes?.get(item.id)}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}
