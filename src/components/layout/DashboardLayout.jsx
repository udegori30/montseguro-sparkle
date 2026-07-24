import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TABS, TAB_IDS, DEFAULT_TAB_ID, getTabById } from "../../theme/tabThemes.js";
import { useCarousel } from "../../hooks/useCarousel.js";
import { useDashboardData } from "../../context/DashboardDataContext.jsx";
import { Header } from "./Header.jsx";
import { CarouselProgressBar } from "./CarouselProgressBar.jsx";
import { CelebrationOverlay } from "./CelebrationOverlay.jsx";
import { GeralView } from "../views/GeralView.jsx";
import { AssinaturasView } from "../views/AssinaturasView.jsx";
import { ImplantacoesView } from "../views/ImplantacoesView.jsx";
import { TimesView } from "../views/TimesView.jsx";
import { MetasView } from "../views/MetasView.jsx";
import { PrevisaoView } from "../views/PrevisaoView.jsx";
import "./DashboardLayout.css";

const CAROUSEL_INTERVAL_MS = Number(import.meta.env.VITE_CAROUSEL_INTERVAL_MS) || 20000;

const VIEW_COMPONENTS = {
  geral: GeralView,
  assinaturas: AssinaturasView,
  implantacoes: ImplantacoesView,
  times: TimesView,
  metas: MetasView,
  previsao: PrevisaoView,
};

// Compoe as 4 regioes fixas da tela e liga o carrossel de abas a rota atual
// (`/:tabId`), para que navegar manualmente e o avanco automatico usem o
// mesmo mecanismo de troca de aba.
export function DashboardLayout() {
  const { tabId } = useParams();
  const navigate = useNavigate();
  const activeTab = getTabById(tabId ?? DEFAULT_TAB_ID);
  const data = useDashboardData();
  const [isChromePinned, setChromePinned] = useState(false);
  const [isChromeHovering, setChromeHovering] = useState(false);
  const isChromeVisible = isChromePinned || isChromeHovering;

  const handleAdvance = useCallback(
    (nextId) => navigate(`/${nextId}`, { replace: true }),
    [navigate],
  );

  const { progress, isPaused, togglePause } = useCarousel({
    tabIds: TAB_IDS,
    activeId: activeTab.id,
    intervalMs: CAROUSEL_INTERVAL_MS,
    onAdvance: handleAdvance,
  });

  const handleSelectTab = useCallback((id) => navigate(`/${id}`), [navigate]);

  const ActiveView = VIEW_COMPONENTS[activeTab.id] ?? GeralView;
  const style = useMemo(
    () => ({
      "--accent": activeTab.accent,
      "--theme-color": activeTab.accent,
      "--theme-color-rgb": activeTab.accentRgb,
    }),
    [activeTab.accent, activeTab.accentRgb],
  );

  return (
    <div className="dashboard" style={style}>
      <div
        className={`chrome-zone${isChromeVisible ? " chrome-zone--visible" : ""}`}
        onMouseEnter={() => setChromeHovering(true)}
        onMouseLeave={() => setChromeHovering(false)}
      >
        <button
          type="button"
          className="chrome-handle"
          onClick={() => setChromePinned((prev) => !prev)}
          aria-label={isChromePinned ? "Ocultar cabeçalho" : "Manter cabeçalho visível"}
          title={isChromePinned ? "Ocultar cabeçalho" : "Manter cabeçalho visível"}
        >
          {isChromeVisible ? "▴" : "▾"}
        </button>
        <div className="chrome-content">
          <div className="chrome-inner">
            <Header
              isPaused={isPaused}
              onTogglePause={togglePause}
              tabs={TABS}
              activeTabId={activeTab.id}
              onSelectTab={handleSelectTab}
            />
            <CarouselProgressBar progress={progress} />
          </div>
        </div>
      </div>

      <main className="dashboard__content">
        {data.status === "error" && (
          <div className="dashboard-status dashboard-status--error">
            <p>Não foi possível carregar os dados.</p>
            <button type="button" onClick={data.reload}>
              Tentar novamente
            </button>
          </div>
        )}
        {data.status === "loading" && (
          <div className="dashboard-status">Carregando dados…</div>
        )}
        {data.status === "ready" && (
          <div className="dashboard-view-enter" key={activeTab.id}>
            <ActiveView />
          </div>
        )}
      </main>

      <CelebrationOverlay />
    </div>
  );
}
