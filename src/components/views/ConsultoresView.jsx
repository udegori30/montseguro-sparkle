import { useMemo, useState } from "react";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { Avatar } from "../common/Avatar.jsx";
import { formatCurrency, formatNumber } from "../../utils/format.js";
import "./shared.css";
import "./ConsultoresView.css";

const SORT_OPTIONS = [
  { key: "faturamento", label: "Faturamento", getValue: (c) => c.monthRevenue },
  { key: "quentes", label: "Quentes", getValue: (c) => c.leadsHot },
  { key: "fechando", label: "Fechando", getValue: (c) => c.closingValue },
  { key: "pipeline", label: "Pipeline", getValue: (c) => c.pipelineValue },
];

// Aba "Consultores": termometro individual, com busca por nome, ordenacao
// por metrica e grid de cards com temperatura de leads.
export function ConsultoresView() {
  const { consultants } = useDashboardData();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("faturamento");

  const sortOption = SORT_OPTIONS.find((opt) => opt.key === sortKey) ?? SORT_OPTIONS[0];

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return consultants
      .filter((c) => c.name.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => sortOption.getValue(b) - sortOption.getValue(a));
  }, [consultants, query, sortOption]);

  return (
    <div className="view">
      <div className="section">
        <h2 className="section-title">Termômetro dos Consultores</h2>

        <div className="consultores-toolbar">
          <input
            type="search"
            className="consultores-search"
            placeholder="Buscar consultor pelo nome…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="consultores-sort">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={`consultores-sort__btn${opt.key === sortKey ? " consultores-sort__btn--active" : ""}`}
                onClick={() => setSortKey(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="consultores-grid">
          {filtered.map((consultant) => {
            const totalLeads = consultant.leadsHot + consultant.leadsWarm + consultant.leadsCold;
            const heatPct =
              totalLeads > 0
                ? ((consultant.leadsHot + consultant.leadsWarm * 0.5) / totalLeads) * 100
                : 0;

            return (
              <div className="consultor-card" key={consultant.id}>
                <div className="consultor-card__header">
                  <Avatar name={consultant.name} src={consultant.avatarUrl} size="md" />
                  <div>
                    <div className="consultor-card__name">{consultant.name}</div>
                    <div className="consultor-card__revenue">
                      {formatCurrency(consultant.monthRevenue)}
                    </div>
                  </div>
                </div>

                <div className="consultor-card__chips">
                  <span className="chip chip--hot">🔥 {formatNumber(consultant.leadsHot)}</span>
                  <span className="chip chip--warm">☀ {formatNumber(consultant.leadsWarm)}</span>
                  <span className="chip chip--cold">❄ {formatNumber(consultant.leadsCold)}</span>
                </div>

                <div className="thermometer-track">
                  <div className="thermometer-indicator" style={{ left: `${heatPct}%` }} />
                </div>

                <div className="consultor-card__footer">
                  <div>
                    <span>Pipeline</span>
                    <strong>{formatCurrency(consultant.pipelineValue)}</strong>
                  </div>
                  <div>
                    <span>Fechando</span>
                    <strong>{formatCurrency(consultant.closingValue)}</strong>
                  </div>
                  <div>
                    <span>Fechados</span>
                    <strong>{formatCurrency(consultant.closedValue)}</strong>
                  </div>
                  <div>
                    <span>Parados</span>
                    <strong>{formatCurrency(consultant.stalledValue)}</strong>
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
