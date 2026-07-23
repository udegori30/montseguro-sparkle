// Utilitarios de formatacao pt-BR compartilhados por todas as views.
const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const currencyFormatterDecimals = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("pt-BR");

const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateLongFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatCurrency(value, { decimals = false } = {}) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return decimals
    ? currencyFormatterDecimals.format(safeValue)
    : currencyFormatter.format(safeValue);
}

export function formatNumber(value) {
  return numberFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatPercent(value, digits = 0) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const formatter =
    digits === 0
      ? numberFormatter
      : new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        });
  return `${formatter.format(safeValue)}%`;
}

// Numero decimal simples (sem simbolo de moeda), ex.: "167,87".
export function formatDecimal(value) {
  return decimalFormatter.format(Number.isFinite(value) ? value : 0);
}

export function formatDateLong(date = new Date()) {
  const text = dateLongFormatter.format(date);
  // Intl gera "quinta-feira, 23 de julho de 2026"; deixamos a primeira letra maiuscula.
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatClock(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Retorna a direcao/simbolo/classe CSS para um badge de variacao vs. ontem.
export function getTrend(delta) {
  if (!Number.isFinite(delta) || delta === 0) {
    return { direction: "flat", symbol: "—", className: "trend-flat" };
  }
  if (delta > 0) {
    return { direction: "up", symbol: "▲", className: "trend-up" };
  }
  return { direction: "down", symbol: "▼", className: "trend-down" };
}

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
