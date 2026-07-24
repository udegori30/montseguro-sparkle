import { RankingRow } from "./RankingRow.jsx";
import "./RankingList.css";

// Painel com o ranking completo: header ("Ranking Completo" + "N ativos")
// e grade de 2 colunas de RankingRow. Comeca no 4o colocado - o top 3 ja
// aparece no Podium logo acima. `changes` (de useRankingChanges) informa
// reacoes ao vivo por consultor: { changeClass, magnitude }.
export function RankingList({ items, valueFormatter, meta, changes }) {
  const rest = items.slice(3);

  return (
    <div className="ranking-wrap">
      <div className="ranking-header">
        <span className="section-eyebrow">Ranking Completo</span>
        {meta && <span className="section-meta">{meta}</span>}
      </div>
      <div className="ranking-grid glass-panel">
        {rest.map((item, index) => (
          <RankingRow
            key={item.id}
            position={index + 4}
            valueFormatter={valueFormatter}
            change={changes?.get(item.id)}
            {...item}
          />
        ))}
      </div>
    </div>
  );
}
