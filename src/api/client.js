// Camada de acesso a dados. Isola o contrato REST + SSE esperado da API real
// para que, quando o backend existir, baste apontar VITE_API_URL e remover
// VITE_USE_MOCK — nenhuma view ou hook precisa mudar.
import { createMockDataset, createMockEventSource } from "../mock/mockData.js";

const API_URL = import.meta.env.VITE_API_URL ?? "";
const USE_MOCK = !API_URL || import.meta.env.VITE_USE_MOCK === "true";

function getToken() {
  return import.meta.env.VITE_JWT_TOKEN ?? "";
}

async function request(path) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Falha na API (${response.status}) em ${path}`);
  }
  return response.json();
}

let mockDatasetCache = null;
function getMockDataset() {
  // Mantem o mesmo dataset mockado durante a sessao (o useLiveEvents cuida
  // das variacoes incrementais), simulando estado persistido em servidor.
  if (!mockDatasetCache) mockDatasetCache = createMockDataset();
  return mockDatasetCache;
}

export const api = {
  // GET /consultants/
  async getConsultants() {
    if (USE_MOCK) return getMockDataset().consultants;
    return request("/consultants/");
  },
  // Agregacao usada pelas views Geral / Assinaturas / Implantacoes
  async getSummary() {
    if (USE_MOCK) return getMockDataset().summary;
    return request("/summary/");
  },
  // Agregacao usada pela view Ranking de Times
  async getTeams() {
    if (USE_MOCK) return getMockDataset().teams;
    return request("/teams/");
  },
  // Serie historica usada pela view Evolucao de Metas
  async getGoalsEvolution() {
    if (USE_MOCK) return getMockDataset().goalsEvolution;
    return request("/goals/evolution/");
  },
  // KPIs consolidados exibidos na faixa rolante do topo
  async getKpis() {
    if (USE_MOCK) return getMockDataset().kpis;
    return request("/kpis/");
  },
};

// GET /events/?token=<jwt> — canal SSE de atualizacoes incrementais.
// Em modo mock, devolve um emissor com a mesma interface (onmessage/close).
export function createEventSource() {
  if (USE_MOCK) return createMockEventSource();
  return new EventSource(`${API_URL}/events/?token=${encodeURIComponent(getToken())}`);
}

export const isMockMode = USE_MOCK;
