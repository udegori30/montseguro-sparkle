import { useRef, useState } from "react";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { formatCurrency, formatNumber } from "../../utils/format.js";
import "./shared.css";
import "./TimesView.css";

// Quadrantes exibidos no card de cada time: Analise/Em Pagamento/Implantado
// lado a lado, e Previsao Total abaixo, maior. Cada um mostra valor + qtd
// de contratos.
const QUADRANTS = [
  { key: "analise", contractsKey: "analiseContratos", label: "Análise" },
  { key: "emPagamento", contractsKey: "emPagamentoContratos", label: "Em Pagamento" },
  { key: "implantado", contractsKey: "implantadoContratos", label: "Implantado" },
];

const CREST_STORAGE_KEY = "montseguro:team-crests";

// Metadados de posicao no podio: cor do badge numerico e o selo de
// lider/vice-lider (o 3o colocado nao recebe selo, so o numero).
const RANK_META = {
  1: { badgeColor: "#eab308", pillLabel: "👑 LÍDER", pillClass: "team-card__pill--leader" },
  2: { badgeColor: "#94a3b8", pillLabel: "VICE-LÍDER", pillClass: "team-card__pill--vice" },
  3: { badgeColor: "#f97316", pillLabel: null, pillClass: "" },
};

// Ordem visual de podio: 2o a esquerda, 1o ao centro (maior), 3o a direita.
const VISUAL_ORDER = [2, 1, 3];

function loadStoredCrests() {
  try {
    const raw = window.localStorage.getItem(CREST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistCrests(crests) {
  try {
    window.localStorage.setItem(CREST_STORAGE_KEY, JSON.stringify(crests));
  } catch {
    // localStorage indisponivel (modo privado/quota) - segue sem persistir
  }
}

// Aba "Ranking de Times": podio dos 3 times com escudo anexavel, badge de
// posicao/lider e as metricas de contratos/atendimento de cada time.
export function TimesView() {
  const { teams } = useDashboardData();
  const [crests, setCrests] = useState(() => loadStoredCrests());
  const uploadTargetId = useRef(null);
  const fileInputRef = useRef(null);

  const ranked = [...teams].sort((a, b) => b.previsaoTotalMes - a.previsaoTotalMes);
  const byPosition = { 1: ranked[0], 2: ranked[1], 3: ranked[2] };

  function handlePickCrest(teamId) {
    uploadTargetId.current = teamId;
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    const teamId = uploadTargetId.current;
    event.target.value = "";
    if (!file || !teamId) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCrests((prev) => {
        const next = { ...prev, [teamId]: reader.result };
        persistCrests(next);
        return next;
      });
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveCrest(teamId, event) {
    event.stopPropagation();
    setCrests((prev) => {
      const next = { ...prev };
      delete next[teamId];
      persistCrests(next);
      return next;
    });
  }

  return (
    <div className="view">
      <div className="section">
        <h2 className="section-title">Ranking de Times</h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="times-file-input"
          onChange={handleFileChange}
        />

        <div className="times-podium">
          {VISUAL_ORDER.map((position) => {
            const team = byPosition[position];
            if (!team) {
              return <div key={position} className="team-card team-card--empty" />;
            }

            const rankMeta = RANK_META[position];
            const crestUrl = crests[team.id] ?? team.crestUrl;

            return (
              <div
                key={team.id}
                className={`team-card team-card--rank-${position}`}
                style={{ "--team-color": team.color }}
              >
                <div
                  className="team-card__media"
                  style={crestUrl ? { backgroundImage: `url(${crestUrl})` } : undefined}
                >
                  {!crestUrl && (
                    <span className="team-card__placeholder" aria-hidden="true">
                      🛡
                    </span>
                  )}

                  <span
                    className="team-card__rank-badge"
                    style={{ backgroundColor: rankMeta.badgeColor }}
                  >
                    {position}
                  </span>

                  {rankMeta.pillLabel && (
                    <span className={`team-card__pill ${rankMeta.pillClass}`}>
                      {rankMeta.pillLabel}
                    </span>
                  )}

                  <div className="team-card__actions">
                    <button
                      type="button"
                      className="team-card__action-btn"
                      onClick={() => handlePickCrest(team.id)}
                      title="Anexar escudo"
                      aria-label="Anexar escudo"
                    >
                      📎
                    </button>
                    {crests[team.id] && (
                      <button
                        type="button"
                        className="team-card__action-btn"
                        onClick={(event) => handleRemoveCrest(team.id, event)}
                        title="Remover escudo"
                        aria-label="Remover escudo"
                      >
                        🗑
                      </button>
                    )}
                  </div>

                  <h3 className="team-card__name">{team.name}</h3>
                </div>

                <div className="team-card__stats">
                  <div className="team-card__quadrant-row">
                    {QUADRANTS.map((quadrant) => (
                      <div className="team-card__quadrant" key={quadrant.key}>
                        <span className="team-card__quadrant-label">{quadrant.label}</span>
                        <strong className="team-card__quadrant-value">
                          {formatCurrency(team[quadrant.key])}
                        </strong>
                        <span className="team-card__quadrant-qty">
                          {formatNumber(team[quadrant.contractsKey])} contratos
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="team-card__quadrant team-card__quadrant--wide">
                    <span className="team-card__quadrant-label">Previsão Total</span>
                    <strong className="team-card__quadrant-value">
                      {formatCurrency(team.previsaoTotalMes)}
                    </strong>
                    <span className="team-card__quadrant-qty">
                      {formatNumber(team.previsaoTotalContratos)} contratos
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
