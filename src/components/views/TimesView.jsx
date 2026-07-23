import { useMemo } from "react";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { Podium } from "../common/Podium.jsx";
import { formatCurrency } from "../../utils/format.js";
import "./shared.css";
import "./TimesView.css";

// Aba "Ranking de Times": podio dos 3 times + grid com as metricas de
// cada um (Implantado, Analise, Em Pagamento, Previsao Total do Mes).
export function TimesView() {
  const { teams } = useDashboardData();

  const ranked = useMemo(
    () => [...teams].sort((a, b) => b.previsaoTotalMes - a.previsaoTotalMes),
    [teams],
  );

  const podiumItems = ranked.map((team) => ({
    id: team.id,
    name: team.name,
    avatarUrl: null,
    value: team.previsaoTotalMes,
  }));

  return (
    <div className="view">
      <div className="section">
        <h2 className="section-title">Pódio de Times</h2>
        <Podium items={podiumItems} />
      </div>

      <div className="section">
        <h2 className="section-title">Ranking de Times · Métricas do Mês</h2>
        <div className="teams-grid">
          {ranked.map((team, index) => (
            <div className="team-card" key={team.id}>
              <div className="team-card__header">
                <span className="team-card__position">{index + 1}º</span>
                <div className="team-card__logo">{team.logoInitials}</div>
                <span className="team-card__name">{team.name}</span>
              </div>
              <dl className="team-card__metrics">
                <div className="team-card__metric">
                  <dt>Implantado</dt>
                  <dd>{formatCurrency(team.implantado)}</dd>
                </div>
                <div className="team-card__metric">
                  <dt>Análise</dt>
                  <dd>{formatCurrency(team.analise)}</dd>
                </div>
                <div className="team-card__metric">
                  <dt>Em Pagamento</dt>
                  <dd>{formatCurrency(team.emPagamento)}</dd>
                </div>
                <div className="team-card__metric team-card__metric--total">
                  <dt>Previsão Total · Mês</dt>
                  <dd>{formatCurrency(team.previsaoTotalMes)}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
