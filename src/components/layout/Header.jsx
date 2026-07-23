import { useClock } from "../../hooks/useClock.js";
import { formatClock, formatDateLong } from "../../utils/format.js";
import { APP_NAME, APP_TITLE_PREFIX } from "../../config/appConfig.js";
import "./Header.css";

function handleExit() {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
    return;
  }
  window.close();
}

// Regiao 1 do layout: badge AO VIVO, titulo/subtitulo por aba, data/relogio
// e as acoes de pausar, rever resumos e sair.
export function Header({ activeTab, isPaused, onTogglePause, onOpenSummaries }) {
  const now = useClock();

  return (
    <header className="header">
      <div className="header__left">
        <span className="header__live-badge">
          <span className="header__live-dot" aria-hidden="true" />
          AO VIVO
        </span>
        <div className="header__titles">
          <h1 className="header__title">
            {APP_TITLE_PREFIX} <span className="header__title-accent">{APP_NAME}</span>
          </h1>
          <p className="header__subtitle">{activeTab.subtitle}</p>
        </div>
      </div>

      <div className="header__right">
        <span className="header__date-chip">{formatDateLong(now)}</span>
        <span className="header__clock">{formatClock(now)}</span>
        <button type="button" className="header__button" onClick={onTogglePause}>
          {isPaused ? "▶ Retomar" : "⏸ Pausar"}
        </button>
        <button type="button" className="header__button" onClick={onOpenSummaries}>
          🗂 Resumos anteriores
        </button>
        <button
          type="button"
          className="header__button header__button--exit"
          onClick={handleExit}
          title="Sair"
        >
          ⏻ Sair
        </button>
      </div>
    </header>
  );
}
