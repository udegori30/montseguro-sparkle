import { useState } from "react";

const STORAGE_KEY = "montseguro:consultant-goals";

function loadStoredGoals() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistGoals(goals) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  } catch {
    // localStorage indisponivel (modo privado/quota) - segue sem persistir
  }
}

// Mantem as metas mensal/trimestral editadas manualmente por consultor.
// Nao ha endpoint de API para isso ainda, entao os ajustes ficam salvos no
// navegador (localStorage) e sobrescrevem o valor padrao vindo do mock/API.
export function useEditableGoals() {
  const [overrides, setOverrides] = useState(() => loadStoredGoals());

  function getGoal(consultantId, period, fallback) {
    return overrides[consultantId]?.[period] ?? fallback;
  }

  function setGoal(consultantId, period, value) {
    setOverrides((prev) => {
      const next = { ...prev, [consultantId]: { ...prev[consultantId], [period]: value } };
      persistGoals(next);
      return next;
    });
  }

  return { getGoal, setGoal };
}
