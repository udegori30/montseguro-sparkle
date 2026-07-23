import "./TabNav.css";

// Regiao 2 (parte 1): 7 abas horizontais, a ativa destacada na cor de acento.
export function TabNav({ tabs, activeId, onSelect }) {
  return (
    <nav className="tab-nav" aria-label="Navegação entre visões do dashboard">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`tab-nav__item${tab.id === activeId ? " tab-nav__item--active" : ""}`}
          onClick={() => onSelect(tab.id)}
          aria-current={tab.id === activeId}
        >
          <span className="tab-nav__icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span className="tab-nav__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
