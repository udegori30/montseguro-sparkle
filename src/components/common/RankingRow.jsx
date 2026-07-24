import { Avatar } from "./Avatar.jsx";
import { formatCurrency } from "../../utils/format.js";
import "./RankingRow.css";

const TEMPERATURE_DOT_CLASS = {
  quente: "status-dot--hot",
  morno: "status-dot--warm",
  frio: "status-dot--cold",
};

// Linha de ranking: posicao, delta de posicoes vs. o tick anterior, avatar,
// nome, meta secundaria (com bolinha de temperatura do lead) e valor.
// `change` vem de useRankingChanges: { changeClass, magnitude } | undefined.
export function RankingRow({
  id,
  position,
  name,
  avatarUrl,
  value,
  secondaryMeta,
  temperature,
  change,
  valueFormatter = formatCurrency,
}) {
  const changeClass = change?.changeClass;
  // "data-updated" e um flash so no valor (rank-pct); as demais reacoes
  // destacam a linha inteira.
  const rowChangeClass = changeClass && changeClass !== "data-updated" ? changeClass : null;
  const isTop3 = position <= 3;

  let deltaSymbol = "—";
  let deltaClass = "flat";
  if (changeClass === "rank-up" && change.magnitude > 0) {
    deltaSymbol = `▲${change.magnitude}`;
    deltaClass = "up";
  } else if (changeClass === "rank-down" && change.magnitude > 0) {
    deltaSymbol = `▼${change.magnitude}`;
    deltaClass = "down";
  }

  return (
    <div
      className={`rank-row${isTop3 ? ` top${position}` : ""}${rowChangeClass ? ` ${rowChangeClass}` : ""}`}
      aria-label={`${position}º lugar: ${name}`}
    >
      <span className="rank-num num">{position}</span>
      <span className={`rank-delta ${deltaClass}`} title="Variação de posição">
        {deltaSymbol}
      </span>
      <span className={`leader-photo-wrap${position === 1 ? " leader-fire" : ""}`}>
        <span className="rank-photo">
          <Avatar consultantId={id} name={name} src={avatarUrl} size="sm" />
        </span>
      </span>
      <div className="rank-info">
        <span className="rank-name">{name}</span>
        {secondaryMeta && (
          <span className="rank-sub">
            {temperature && (
              <span
                className={`status-dot ${TEMPERATURE_DOT_CLASS[temperature] ?? ""}`}
                aria-hidden="true"
              />
            )}
            {secondaryMeta}
          </span>
        )}
      </div>
      <span className="rank-metric">
        <span className={`rank-pct num${changeClass === "data-updated" ? " data-updated" : ""}`}>
          {valueFormatter(value)}
        </span>
      </span>
    </div>
  );
}
