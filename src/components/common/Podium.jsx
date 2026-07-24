import { useConsultantPhotoUpload } from "../../context/ConsultantPhotosContext.jsx";
import { formatCurrency, formatNumber, getInitials } from "../../utils/format.js";
import "./Podium.css";

// Ordem visual: 2o a esquerda, 1o ao centro (maior), 3o a direita. `items`
// deve vir ja ordenado (1o, 2o, 3o).
const VISUAL_ORDER = [2, 1, 3];
const MEDAL_BY_POSITION = { 1: "gold", 2: "silver", 3: "bronze" };
const ROLE_BY_POSITION = { 1: "Líder", 2: "Vice-líder", 3: "3º lugar" };
const DELAY_BY_POSITION = { 2: "0ms", 1: "50ms", 3: "120ms" };

// Um card do podio e seu proprio componente (nao um trecho de .map inline)
// porque precisa chamar o hook de foto do consultor — hooks nao podem viver
// dentro de um callback de array.
function PodiumCard({ item, position, valueFormatter, metricLabel, secondaryLabel }) {
  const { photoUrl, inputRef, openPicker, handleFileChange } = useConsultantPhotoUpload(
    item.id,
    item.avatarUrl,
  );
  const isLeader = position === 1;
  const medal = MEDAL_BY_POSITION[position];

  return (
    <div
      className={`podium-card podium-card--${position} podium-card--${medal}${
        item.celebrating ? " celebrating" : ""
      }`}
      style={{ animationDelay: DELAY_BY_POSITION[position] }}
      aria-label={`${position}º lugar: ${item.name}`}
    >
      <div className="podium-media">
        {photoUrl ? (
          <img className="podium-bg-img" src={photoUrl} alt="" />
        ) : (
          <div className="podium-bg-placeholder" aria-hidden="true">
            {getInitials(item.name)}
          </div>
        )}
        <div className="podium-scrim" />
        {isLeader && <div className="podium-spotlight" aria-hidden="true" />}
        <span className="podium-badge">{position}</span>
        {isLeader && <div className="podium-champ-ribbon">👑 LÍDER</div>}
        <button
          type="button"
          className="podium-photo-btn"
          onClick={openPicker}
          title="Adicionar foto"
          aria-label="Adicionar foto"
        >
          📷
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="avatar__file-input"
          onChange={handleFileChange}
        />
      </div>

      <div className="podium-content">
        <span className={`podium-role podium-role--${medal}`}>{ROLE_BY_POSITION[position]}</span>
        <div className={`podium-name${isLeader ? " podium-name--gold" : ""}`}>{item.name}</div>
        <div className="podium-stats">
          <div className="podium-stat-row">
            <span>{metricLabel}</span>
            <strong>{valueFormatter(item.value)}</strong>
          </div>
          {item.contracts != null && (
            <div className="podium-stat-row">
              <span>{secondaryLabel}</span>
              <strong>{formatNumber(item.contracts)}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// TOP 3 em formato de podio: 2o a esquerda, 1o ao centro (maior, com coroa
// "LIDER" + holofote), 3o a direita.
export function Podium({
  items,
  valueFormatter = formatCurrency,
  metricLabel = "Vendas",
  secondaryLabel = "Contratos Fechados",
  resetLabel,
}) {
  const byPosition = { 1: items[0], 2: items[1], 3: items[2] };

  return (
    <div className="podium-wrap">
      <div className="podium-header">
        <span className="section-eyebrow">🏆 Top 3</span>
        {resetLabel && <span className="podium-reset">{resetLabel}</span>}
      </div>
      <div className="podium-stage">
        {VISUAL_ORDER.map((position) => {
          const item = byPosition[position];
          if (!item) {
            return <div key={position} className="podium-card podium-card--empty" />;
          }
          return (
            <PodiumCard
              key={item.id}
              item={item}
              position={position}
              valueFormatter={valueFormatter}
              metricLabel={metricLabel}
              secondaryLabel={secondaryLabel}
            />
          );
        })}
      </div>
    </div>
  );
}
