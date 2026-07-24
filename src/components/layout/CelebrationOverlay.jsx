import { useEffect, useRef, useState } from "react";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { useConsultantPhotos } from "../../context/ConsultantPhotosContext.jsx";
import { useTeamCrests } from "../../context/TeamCrestsContext.jsx";
import { formatCurrency, getInitials } from "../../utils/format.js";
import "./CelebrationOverlay.css";

const VISIBLE_MS = 4200;
const FADE_MS = 500;

const STAGE_META = {
  signed: { label: "Contrato Assinado", icon: "✍️" },
  deployed: { label: "Contrato Implantado", icon: "🚀" },
};

// Take-over em tela cheia disparado por eventos ao vivo de assinatura/
// implantacao (ver DashboardDataContext -> state.celebration). Mostra a foto
// do consultor, o valor, o tipo de contrato e o escudo do time como fundo.
export function CelebrationOverlay() {
  const { celebration, consultants, teams } = useDashboardData();
  const { photos } = useConsultantPhotos();
  const { crests } = useTeamCrests();
  const [current, setCurrent] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!celebration) return undefined;
    clearTimeout(timeoutRef.current);
    setCurrent(celebration);
    timeoutRef.current = setTimeout(() => setCurrent(null), VISIBLE_MS + FADE_MS);
    return () => clearTimeout(timeoutRef.current);
  }, [celebration]);

  if (!current) return null;

  const consultant = consultants.find((c) => c.id === current.consultantId);
  const team = teams.find((t) => t.id === current.teamId);
  const crestUrl = crests[current.teamId] ?? team?.crestUrl;
  const photoUrl = photos[current.consultantId];
  const stage = STAGE_META[current.stage] ?? STAGE_META.signed;

  return (
    <div
      className="celebration-overlay"
      key={current.timestamp}
      style={{ "--team-color": team?.color ?? "var(--accent)" }}
    >
      <div
        className={`celebration-overlay__backdrop${
          crestUrl ? "" : " celebration-overlay__backdrop--fallback"
        }`}
        style={crestUrl ? { backgroundImage: `url(${crestUrl})` } : undefined}
      />
      <div className="celebration-overlay__scrim" />
      <div className="celebration-overlay__content">
        <div className="celebration-overlay__photo">
          {photoUrl ? (
            <img src={photoUrl} alt={consultant?.name ?? ""} />
          ) : (
            <span>{getInitials(consultant?.name ?? "")}</span>
          )}
        </div>
        <span className="celebration-overlay__stage">
          {stage.icon} {stage.label}
        </span>
        <h2 className="celebration-overlay__name">{consultant?.name ?? "Consultor"}</h2>
        <div className="celebration-overlay__value">{formatCurrency(current.amount)}</div>
        {team && <span className="celebration-overlay__team">{team.name}</span>}
      </div>
    </div>
  );
}
