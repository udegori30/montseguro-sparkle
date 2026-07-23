import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { api } from "../api/client.js";
import { useLiveEvents } from "../hooks/useLiveEvents.js";

const DashboardDataContext = createContext(null);

const initialState = {
  status: "loading", // 'loading' | 'ready' | 'error'
  error: null,
  consultants: [],
  teams: [],
  funnel: null,
  goalsEvolution: [],
  summary: null,
  kpis: null,
  lastEventAt: null,
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

    case "EVENT_SALE": {
      const { consultantId, amount } = action.payload;
      const consultants = state.consultants.map((c) =>
        c.id === consultantId
          ? {
              ...c,
              monthRevenue: c.monthRevenue + amount,
              todaySubscriptions: {
                qty: c.todaySubscriptions.qty + 1,
                value: c.todaySubscriptions.value + amount,
              },
            }
          : c,
      );
      const consultant = consultants.find((c) => c.id === consultantId);
      const teams = state.teams.map((team) =>
        consultant && team.id === consultant.teamId
          ? {
              ...team,
              implantado: team.implantado + amount,
              previsaoTotalMes: team.previsaoTotalMes + amount,
            }
          : team,
      );
      const revenueTeams = state.summary.revenueTeams + amount;
      const summary = {
        ...state.summary,
        revenueTeams,
        revenueGoalPct: Number(((revenueTeams / state.summary.revenueGoalValue) * 100).toFixed(1)),
      };
      const kpis = {
        ...state.kpis,
        teamRevenue: revenueTeams,
        collectiveGoalPct: summary.revenueGoalPct,
        subscriptionsToday: {
          qty: state.kpis.subscriptionsToday.qty + 1,
          value: state.kpis.subscriptionsToday.value + amount,
        },
        currentLeader: recomputeLeader(consultants),
      };
      return { ...state, consultants, teams, summary, kpis, lastEventAt: action.timestamp };
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
      const [consultants, teams, funnel, goalsEvolution, summary, kpis] = await Promise.all([
        api.getConsultants(),
        api.getTeams(),
        api.getFunnel(),
        api.getGoalsEvolution(),
        api.getSummary(),
        api.getKpis(),
      ]);
      dispatch({
        type: "INIT_SUCCESS",
        payload: { consultants, teams, funnel, goalsEvolution, summary, kpis },
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
      case "sale":
        dispatch({ type: "EVENT_SALE", payload: event.payload, timestamp: event.timestamp });
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
