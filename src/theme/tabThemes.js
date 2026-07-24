// Configuracao central das abas do wallboard.
// Cada aba define o rotulo do nav, o subtitulo do header e a cor de acento
// propagada via CSS custom property `--accent` (ver DashboardLayout).
export const TABS = [
  {
    id: "geral",
    label: "Geral · Mensal",
    subtitle: "Rank Geral (Mensal)",
    accent: "#8b5cf6",
    accentRgb: "139, 92, 246",
    icon: "🏆",
  },
  {
    id: "assinaturas",
    label: "Assinaturas · Hoje",
    subtitle: "Rank Diário (Assinaturas)",
    accent: "#22c55e",
    accentRgb: "34, 197, 94",
    icon: "✍️",
  },
  {
    id: "implantacoes",
    label: "Implantações · Hoje",
    subtitle: "Rank Diário (Implantados)",
    accent: "#f59e0b",
    accentRgb: "245, 158, 11",
    icon: "🚀",
  },
  {
    id: "times",
    label: "Ranking de Times",
    subtitle: "Dashboard",
    accent: "#a855f7",
    accentRgb: "168, 85, 247",
    icon: "👥",
  },
  {
    id: "metas",
    label: "Evolução de Demandas",
    subtitle: "Dashboard",
    accent: "#eab308",
    accentRgb: "234, 179, 8",
    icon: "🎯",
  },
  {
    id: "previsao",
    label: "Previsão · Mês",
    subtitle: "Dashboard",
    accent: "#06b6d4",
    accentRgb: "6, 182, 212",
    icon: "📈",
  },
];

export const DEFAULT_TAB_ID = TABS[0].id;

// Referencia estavel (mesma identidade entre renders) usada por useCarousel.
export const TAB_IDS = TABS.map((tab) => tab.id);

export function getTabById(id) {
  return TABS.find((tab) => tab.id === id) ?? TABS[0];
}

export function getTabIndex(id) {
  const index = TABS.findIndex((tab) => tab.id === id);
  return index === -1 ? 0 : index;
}
