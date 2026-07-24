import { createContext, useCallback, useContext, useState } from "react";

const STORAGE_KEY = "montseguro:team-crests";
const TeamCrestsContext = createContext(null);

function loadStoredCrests() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistCrests(crests) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(crests));
  } catch {
    // localStorage indisponivel (modo privado/quota) - segue sem persistir
  }
}

// Guarda os escudos anexados por time (localStorage, sem endpoint de API
// ainda) e os compartilha entre todas as telas via contexto - usado pelo
// Ranking de Times (upload) e pelo overlay de celebracao (fundo).
export function TeamCrestsProvider({ children }) {
  const [crests, setCrests] = useState(() => loadStoredCrests());

  const setCrest = useCallback((teamId, dataUrl) => {
    setCrests((prev) => {
      const next = { ...prev, [teamId]: dataUrl };
      persistCrests(next);
      return next;
    });
  }, []);

  const removeCrest = useCallback((teamId) => {
    setCrests((prev) => {
      const next = { ...prev };
      delete next[teamId];
      persistCrests(next);
      return next;
    });
  }, []);

  return (
    <TeamCrestsContext.Provider value={{ crests, setCrest, removeCrest }}>
      {children}
    </TeamCrestsContext.Provider>
  );
}

export function useTeamCrests() {
  const context = useContext(TeamCrestsContext);
  if (!context) {
    throw new Error("useTeamCrests deve ser usado dentro de <TeamCrestsProvider>");
  }
  return context;
}
