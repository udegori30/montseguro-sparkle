// Configuracao central das 7 abas do wallboard.
// Cada aba define o rotulo do nav, o subtitulo do header e a cor de acento
// propagada via CSS custom property `--accent` (ver DashboardLayout).
export const TABS = [
  {
    id: "geral",
    label: "Geral · Mensal",
    subtitle: "Rank Geral (Mensal)",
    accent: "#8b5cf6",
    icon: "🏆",
  },
  {
    id: "assinaturas",
    label: "Assinaturas · Hoje",
    subtitle: "Rank Diário (Assinaturas)",
    accent: "#22c55e",
    icon: "✍️",
  },
  {
    id: "implantacoes",
    label: "Implantações · Hoje",
    subtitle: "Rank Diário (Implantados)",
    accent: "#f59e0b",
    icon: "🚀",
  },
  {
    id: "times",
    label: "Ranking de Times",
    subtitle: "Dashboard",
    accent: "#a855f7",
    icon: "👥",
  },
  {
    id: "funil",
    label: "Funil de Vendas",
    subtitle: "Funil de Vendas Geral",
    accent: "#f43f5e",
    icon: "🧭",
  },
  {
    id: "consultores",
    label: "Consultores",
    subtitle: "Análise de Consultores",
    accent: "#3b82f6",
    icon: "🌡️",
  },
  {
    id: "metas",
    label: "Evolução de Metas",
    subtitle: "Dashboard",
    accent: "#eab308",
    icon: "🎯",
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
