import { Avatar } from "./Avatar.jsx";
import { getTrend, formatCurrency } from "../../utils/format.js";
import "./RankingRow.css";

// Linha de ranking: posicao, badge de variacao vs. ontem, avatar, nome,
// meta secundaria opcional e valor destacado a direita.
export function RankingRow({
  position,
  name,
  avatarUrl,
  value,
  secondaryMeta,
  trendDelta,
  valueFormatter = formatCurrency,
}) {
  const trend = getTrend(trendDelta);

  return (
    <div className="ranking-row">
      <span className="ranking-row__position">{position}</span>
      <span className={`ranking-row__trend ${trend.className}`} title="Variação vs. ontem">
        {trend.symbol}
      </span>
      <Avatar name={name} src={avatarUrl} size="sm" />
      <div className="ranking-row__info">
        <span className="ranking-row__name">{name}</span>
        {secondaryMeta && <span className="ranking-row__meta">{secondaryMeta}</span>}
      </div>
      <span className="ranking-row__value">{valueFormatter(value)}</span>
    </div>
  );
}
