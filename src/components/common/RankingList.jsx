import { RankingRow } from "./RankingRow.jsx";
import "./RankingList.css";

// Grade de 2 colunas com RankingRow. `items` ja deve vir ordenado.
export function RankingList({ items, valueFormatter }) {
  return (
    <div className="ranking-list">
      {items.map((item, index) => (
        <RankingRow key={item.id} position={index + 1} valueFormatter={valueFormatter} {...item} />
      ))}
    </div>
  );
}
