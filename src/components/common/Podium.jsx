import { Avatar } from "./Avatar.jsx";
import { formatCurrency } from "../../utils/format.js";
import "./Podium.css";

// TOP 3 em formato de podio: 2o a esquerda, 1o ao centro (maior, com coroa
// "LIDER"), 3o a direita. `items` deve vir ja ordenado (1o, 2o, 3o).
const VISUAL_ORDER = [2, 1, 3];

export function Podium({ items, valueFormatter = formatCurrency }) {
  const byPosition = { 1: items[0], 2: items[1], 3: items[2] };

  return (
    <div className="podium">
      {VISUAL_ORDER.map((position) => {
        const item = byPosition[position];
        if (!item) {
          return <div key={position} className="podium__slot podium__slot--empty" />;
        }
        const isLeader = position === 1;
        return (
          <div
            key={item.id}
            className={`podium__slot podium__slot--${position}${isLeader ? " podium__slot--leader" : ""}`}
          >
            {isLeader && <div className="podium__crown">👑 LÍDER</div>}
            <Avatar name={item.name} src={item.avatarUrl} size={isLeader ? "xl" : "lg"} />
            <div className="podium__name">{item.name}</div>
            <div className="podium__value">{valueFormatter(item.value)}</div>
            <div className={`podium__stand podium__stand--${position}`}>{position}º</div>
          </div>
        );
      })}
    </div>
  );
}
