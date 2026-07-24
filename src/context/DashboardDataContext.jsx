import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { api } from "../api/client.js";
import { useLiveEvents } from "../hooks/useLiveEvents.js";

const DashboardDataContext = createContext(null);

const initialState = {
  status: "loading", // 'loading' | 'ready' | 'error'
  error: null,
  consultants: [],
  teams: [],
  goalsEvolution: [],
  summary: null,
  kpis: null,
  lastEventAt: null,
  // Ultimo contrato assinado/implantado, consumido pelo CelebrationOverlay
  // para disparar o take-over em tela cheia.
  celebration: null,
};

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function recomputeLeader(consultants) {
  return consultants.reduce(
    (leader, c) => (c.monthRevenue > (leader?.monthRevenue ?? -Infinity) ? c : leader),
    null,
  )?.name ?? "—";
}

function reducer(state, action) {
  switch (action.type) {
    case "INIT_SUCCESS":
      return { ...state, status: "ready", error: null, ...action.payload };

    case "INIT_ERROR":
      return { ...state, status: "error", error: action.error };

    case "EVENT_CONTRACT": {
      const { consultantId, amount } = action.payload;
      const isDeployed = action.stage === "deployed";
      const consultants = state.consultants.map((c) => {
        if (c.id !== consultantId) return c;
        return isDeployed
          ? {
              ...c,
              monthRevenue: c.monthRevenue + amount,
              todayDeployments: {
                qty: c.todayDeployments.qty + 1,
                value: c.todayDeployments.value + amount,
              },
            }
          : {
              ...c,
              monthSigned: c.monthSigned + amount,
              todaySubscriptions: {
                qty: c.todaySubscriptions.qty + 1,
                value: c.todaySubscriptions.value + amount,
              },
            };
      });
      const consultant = consultants.find((c) => c.id === consultantId);

      let { teams, summary, kpis } = state;
      if (isDeployed) {
        teams = state.teams.map((team) =>
          consultant && team.id === consultant.teamId
            ? {
                ...team,
                implantado: team.implantado + amount,
                previsaoTotalMes: team.previsaoTotalMes + amount,
              }
            : team,
        );
        const revenueTeams = state.summary.revenueTeams + amount;
        summary = {
          ...state.summary,
          revenueTeams,
          revenueGoalPct: Number(((revenueTeams / state.summary.revenueGoalValue) * 100).toFixed(1)),
        };
        kpis = {
          ...state.kpis,
          teamRevenue: revenueTeams,
          collectiveGoalPct: summary.revenueGoalPct,
          deploymentsToday: {
            qty: state.kpis.deploymentsToday.qty + 1,
            value: state.kpis.deploymentsToday.value + amount,
          },
          currentLeader: recomputeLeader(consultants),
        };
      } else {
        kpis = {
          ...state.kpis,
          subscriptionsToday: {
            qty: state.kpis.subscriptionsToday.qty + 1,
            value: state.kpis.subscriptionsToday.value + amount,
          },
        };
      }

      return {
        ...state,
        consultants,
        teams,
        summary,
        kpis,
        lastEventAt: action.timestamp,
        celebration: consultant
          ? {
              consultantId,
              teamId: consultant.teamId,
              amount,
              stage: action.stage,
              timestamp: action.timestamp,
            }
          : state.celebration,
      };
    }

    case "EVENT_LEAD_TEMPERATURE_CHANGE": {
      const { consultantId, from, to } = action.payload;
      if (from === to) return state;
      const fromKey = `leads${capitalize(from)}`;
      const toKey = `leads${capitalize(to)}`;
      const consultants = state.consultants.map((c) => {
        if (c.id !== consultantId) return c;
        if (!(fromKey in c) || !(toKey in c)) return c;
        return {
          ...c,
          [fromKey]: Math.max(0, c[fromKey] - 1),
          [toKey]: c[toKey] + 1,
        };
      });
      const hotLeads = consultants.reduce((sum, c) => sum + c.leadsHot, 0);
      return {
        ...state,
        consultants,
        kpis: { ...state.kpis, hotLeads },
        lastEventAt: action.timestamp,
      };
    }

    case "EVENT_RANKING_UPDATE":
      return { ...state, lastEventAt: action.timestamp };

    default:
      return state;
  }
}

export function DashboardDataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const loadInitialData = useCallback(async () => {
    try {
      const [consultants, teams, goalsEvolution, summary, kpis] = await Promise.all([
        api.getConsultants(),
        api.getTeams(),
        api.getGoalsEvolution(),
        api.getSummary(),
        api.getKpis(),
      ]);
      dispatch({
        type: "INIT_SUCCESS",
        payload: { consultants, teams, goalsEvolution, summary, kpis },
      });
    } catch (error) {
      dispatch({ type: "INIT_ERROR", error: error.message ?? "Erro ao carregar dados" });
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleEvent = useCallback((event) => {
    if (!event || !event.type) return;
    switch (event.type) {
      case "contract_signed":
        dispatch({
          type: "EVENT_CONTRACT",
          payload: event.payload,
          stage: "signed",
          timestamp: event.timestamp,
        });
        break;
      case "contract_deployed":
        dispatch({
          type: "EVENT_CONTRACT",
          payload: event.payload,
          stage: "deployed",
          timestamp: event.timestamp,
        });
        break;
      case "lead_temperature_change":
        dispatch({
          type: "EVENT_LEAD_TEMPERATURE_CHANGE",
          payload: event.payload,
          timestamp: event.timestamp,
        });
        break;
      case "ranking_update":
        dispatch({ type: "EVENT_RANKING_UPDATE", timestamp: event.timestamp });
        break;
      default:
        break;
    }
  }, []);

  // So escuta o canal em tempo real depois que a carga inicial terminou.
  useLiveEvents(handleEvent, { enabled: state.status === "ready" });

  const value = useMemo(() => ({ ...state, reload: loadInitialData }), [state, loadInitialData]);

  return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardData deve ser usado dentro de <DashboardDataProvider>");
  }
  return context;
}
