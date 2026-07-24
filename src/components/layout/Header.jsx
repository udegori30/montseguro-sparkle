import { useClock } from "../../hooks/useClock.js";
import { formatClock, formatDateShort } from "../../utils/format.js";
import { APP_NAME, APP_TITLE_PREFIX } from "../../config/appConfig.js";
import { TabNav } from "./TabNav.jsx";
import "./Header.css";

function handleExit() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
    return;
  }
  window.close();
}

// Regiao 1 do layout: titulo do app, as abas de navegacao (na mesma linha,
// para economizar altura) e as acoes de pausar e sair.
export function Header({ isPaused, onTogglePause, tabs, activeTabId, onSelectTab }) {
  const now = useClock();

  return (
    <header className="header glass-panel">
      <div className="header__left">
        <h1 className="header__title">
          {APP_TITLE_PREFIX} <span className="header__title-accent">{APP_NAME}</span>
        </h1>
      </div>

      <TabNav tabs={tabs} activeId={activeTabId} onSelect={onSelectTab} />

      <div className="header__right">
        <span className="header__date-chip">{formatDateShort(now)}</span>
        <span className="header__clock num">{formatClock(now)}</span>
        <button type="button" className="ctrl-btn" onClick={onTogglePause}>
          {isPaused ? "▶ Retomar" : "⏸ Pausar"}
        </button>
        <button
          type="button"
          className="ctrl-btn ctrl-btn--exit"
          onClick={handleExit}
          title="Sair"
        >
          ⏻ Sair
        </button>
      </div>
    </header>
  );
}
