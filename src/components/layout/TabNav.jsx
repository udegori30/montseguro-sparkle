import "./TabNav.css";

// Regiao 2 (parte 1): abas horizontais, a ativa destacada na cor de tema com
// glow pulsante (tabActivePulse).
export function TabNav({ tabs, activeId, onSelect }) {
  return (
    <nav className="tabs-bar" aria-label="Navegação entre visões do dashboard">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab-btn${tab.id === activeId ? " active" : ""}`}
          onClick={() => onSelect(tab.id)}
          aria-current={tab.id === activeId}
        >
          <span className="tab-btn__icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span className="tab-btn__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
