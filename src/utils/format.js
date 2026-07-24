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

const dateShortFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
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

export function formatDateShort(date = new Date()) {
  return dateShortFormatter.format(date);
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

// Dias restantes ate o fim do mes/trimestre corrente - usado no contador
// "Reset em N dias" do Podium.
export function daysUntilEndOfMonth(date = new Date()) {
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return Math.max(0, Math.ceil((end - date) / 86400000));
}

export function daysUntilEndOfQuarter(date = new Date()) {
  const quarterEndMonth = Math.floor(date.getMonth() / 3) * 3 + 3;
  const end = new Date(date.getFullYear(), quarterEndMonth, 0);
  return Math.max(0, Math.ceil((end - date) / 86400000));
}

export function formatResetLabel(days) {
  if (days <= 0) return "Reset hoje";
  return `Reset em ${days} dia${days === 1 ? "" : "s"}`;
}

export function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
