import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Medal, Award, Sun, Moon } from "lucide-react";
import { PhotoUpload } from "@/components/montseguro/PhotoCard";
import { useCounter } from "@/components/montseguro/Counter";
import {
  mayResults,
  juneGoals,
  fmtBRL,
  fmtBRLcompact,
  type Consultant,
  type Goal,
  type Team,
} from "@/data/montseguro";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Montseguro Performance Hub · 2026" },
      { name: "description", content: "Dashboard de ranking comercial Montseguro — Maio e Junho 2026." },
      { property: "og:title", content: "Montseguro Performance Hub" },
      { property: "og:description", content: "Ranking comercial e metas — Maio/Junho 2026." },
    ],
  }),
  component: Index,
});

const NAVY = "var(--ms-bg)";
const NAVY_MID = "var(--ms-surface)";
const NAVY_LIGHT = "var(--ms-surface-2)";
const RED = "#E63946";
const GOLD = "#F4A261";
const TEAL = "#2EC4B6";
const VIOLET = "#7B5EA7";
const MUTED = "var(--ms-muted)";
const TEXT = "var(--ms-text)";
const GOLD_CROWN = "#FFD700";
const SILVER = "#C0C0C0";
const BRONZE = "#CD7F32";

const teamColor: Record<Team, string> = {
  "Leões": GOLD,
  "Tubarões": RED,
  "Bells Club": TEAL,
};

function Header({ theme, onToggleTheme }: { theme: "dark" | "light"; onToggleTheme: () => void }) {
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md"
      style={{ background: "var(--ms-header-bg)", borderBottom: `1px solid ${NAVY_LIGHT}` }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-5">
        <div className="flex items-baseline gap-6">
          <div className="ms-display text-[22px] font-extrabold tracking-wider">
            <span style={{ color: TEXT }}>MONT</span>
            <span style={{ color: RED }}>SEGURO</span>
          </div>
          <div
            className="ms-display text-[13px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: MUTED }}
          >
            Performance Hub · 2026
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="ms-display text-[13px] uppercase tracking-widest" style={{ color: MUTED }}>
            {today}
          </div>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Alternar tema"
            className="grid h-9 w-9 place-items-center rounded-full transition-all hover:scale-105"
            style={{
              background: "var(--ms-overlay)",
              border: `1px solid ${NAVY_LIGHT}`,
              color: TEXT,
            }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
      <div style={{ height: 4, background: RED }} />
    </header>
  );
}

function Watermark() {
  return (
    <div
      aria-hidden
      className="ms-display pointer-events-none absolute -bottom-10 right-0 select-none font-black uppercase leading-none"
      style={{
        fontSize: "14vw",
        color: TEXT,
        opacity: 0.025,
        letterSpacing: "-0.04em",
      }}
    >
      MONTSEGURO
    </div>
  );
}

function Particles() {
  const dots = Array.from({ length: 8 });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => (
        <span
          key={i}
          className="ms-particle"
          style={{
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            left: `${(i * 13 + 7) % 100}%`,
            top: `${(i * 23 + 11) % 100}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${7 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}

function Tabs({
  value,
  onChange,
}: {
  value: "maio" | "junho";
  onChange: (v: "maio" | "junho") => void;
}) {
  const opts: { id: "maio" | "junho"; label: string }[] = [
    { id: "maio", label: "Resultado Geral — Maio 2026" },
    { id: "junho", label: "Demandas — Junho 2026" },
  ];
  return (
    <div className="mx-auto mt-8 flex max-w-[1400px] gap-3 px-8">
      {opts.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className="ms-display rounded-full px-6 py-2.5 text-[13px] font-semibold uppercase tracking-wider transition-all"
            style={{
              background: active ? RED : "transparent",
              color: active ? "#fff" : MUTED,
              border: active ? "1px solid transparent" : `1px solid ${NAVY_LIGHT}`,
              boxShadow: active ? "0 0 24px rgba(230,57,70,0.35)" : "none",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SubTabs<T extends string>({
  value,
  onChange,
  opts,
}: {
  value: T;
  onChange: (v: T) => void;
  opts: { id: T; label: string }[];
}) {
  return (
    <div
      className="mb-10 flex flex-wrap gap-2 rounded-full p-1.5"
      style={{
        background: NAVY_MID,
        border: `1px solid ${NAVY_LIGHT}`,
        width: "fit-content",
      }}
    >
      {opts.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className="ms-display rounded-full px-5 py-2 text-[12px] font-semibold uppercase tracking-wider transition-all"
            style={{
              background: active ? RED : "transparent",
              color: active ? "#fff" : MUTED,
              boxShadow: active ? "0 0 18px rgba(230,57,70,0.30)" : "none",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  accent,
  isCurrency = true,
  customDisplay,
  delay = 0,
}: {
  label: string;
  value: number;
  hint: string;
  accent: string;
  isCurrency?: boolean;
  customDisplay?: string;
  delay?: number;
}) {
  const v = useCounter(value);
  const display =
    customDisplay ??
    (isCurrency ? fmtBRLcompact(v) : Math.round(v).toLocaleString("pt-BR"));
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl px-6 py-5"
      style={{
        background: NAVY_MID,
        border: `1px solid ${NAVY_LIGHT}`,
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <div
        className="ms-display text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: MUTED }}
      >
        {label}
      </div>
      <div className="ms-display mt-2 text-[28px] font-extrabold leading-tight" style={{ color: TEXT }}>
        {display}
      </div>
      <div className="mt-1 text-[12px]" style={{ color: MUTED }}>
        {hint}
      </div>
    </motion.div>
  );
}

function barColor(c: Consultant) {
  if (c.percent === 0) return "var(--ms-overlay-strong)";
  if (c.rank === 1) return GOLD_CROWN;
  if (c.rank === 2) return SILVER;
  if (c.rank === 3) return BRONZE;
  if (c.percent >= 80) return TEAL;
  if (c.percent >= 50) return VIOLET;
  return RED;
}

function PodiumCard({
  consultant,
  place,
}: {
  consultant: Consultant;
  place: 1 | 2 | 3;
}) {
  const isFirst = place === 1;
  const borderColor = place === 1 ? GOLD_CROWN : place === 2 ? SILVER : BRONZE;
  const glowAlpha = place === 1 ? 0.35 : 0.22;
  const dims = isFirst
    ? { w: 260, h: 380 }
    : { w: 220, h: 340 };
  const Icon = place === 1 ? Crown : place === 2 ? Medal : Award;
  const label = place === 1 ? "1º" : place === 2 ? "2º" : "3º";

  const baseStyle: React.CSSProperties = {
    width: dims.w,
    height: dims.h,
    background: NAVY_MID,
    border: `2px solid ${borderColor}`,
    borderRadius: 18,
    transform: isFirst ? "translateY(-20px)" : "none",
  };

  const cardInner = (
    <>
      {/* Photo zone (top 70%) */}
      <div className="relative h-[58%] w-full overflow-hidden" style={{ borderRadius: "16px 16px 0 0" }}>
        <PhotoUpload name={consultant.name} />
        {/* Badge */}
        <div
          className="ms-display absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-extrabold"
          style={{
            background: borderColor,
            color: "#0D1B2A",
          }}
        >
          <Icon size={13} />
          <span>{label}</span>
        </div>
      </div>
      {/* Info */}
      <div className="relative z-10 -mt-8 px-5 pb-4">
        <div className="ms-display text-[20px] font-extrabold uppercase leading-tight" style={{ color: TEXT }}>
          {consultant.name.split(" ").slice(0, 2).join(" ")}
        </div>
        <div className="mt-1 text-[12px]" style={{ color: MUTED }}>
          {consultant.level ?? "Consultor"}
        </div>
        <div className="mt-3 space-y-1.5 text-[12px]">
          <div className="flex items-center justify-between">
            <span style={{ color: MUTED }}>Demanda</span>
            <span className="ms-display font-semibold" style={{ color: TEXT }}>
              {fmtBRLcompact(consultant.meta)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: MUTED }}>Vendas</span>
            <span className="ms-display font-extrabold" style={{ color: borderColor }}>
              {fmtBRLcompact(consultant.delivered)}
            </span>
          </div>
        </div>
        <div className="mt-3">
          <div
            className="relative h-2 overflow-hidden rounded-full"
            style={{ background: "var(--ms-overlay)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, consultant.percent)}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: borderColor }}
            />
          </div>
          <div className="ms-display mt-1.5 text-right text-[13px] font-extrabold" style={{ color: borderColor }}>
            {consultant.percent}%
          </div>
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: isFirst ? -20 : 0 }}
      transition={{ duration: 0.5, delay: place === 1 ? 0.1 : place === 2 ? 0 : 0.2 }}
      whileHover={{ scale: 1.03 }}
      className="group relative overflow-hidden"
      style={baseStyle}
    >
      {isFirst ? (
        <motion.div
          className="absolute inset-0 rounded-[16px]"
          animate={{
            boxShadow: [
              `0 0 24px rgba(255,215,0,${glowAlpha * 0.6})`,
              `0 0 44px rgba(255,215,0,${glowAlpha})`,
              `0 0 24px rgba(255,215,0,${glowAlpha * 0.6})`,
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : (
        <div
          className="absolute inset-0 rounded-[16px]"
          style={{ boxShadow: `0 0 16px rgba(${place === 2 ? "192,192,192" : "205,127,50"},${glowAlpha})` }}
        />
      )}
      {cardInner}
    </motion.div>
  );
}

function Podium({ rows }: { rows: Consultant[] }) {
  const first = rows[0];
  const second = rows[1];
  const third = rows[2];
  return (
    <div className="mt-8 flex items-end justify-center gap-6">
      <PodiumCard consultant={second} place={2} />
      <PodiumCard consultant={first} place={1} />
      <PodiumCard consultant={third} place={3} />
    </div>
  );
}

function HorizontalBars({ rows }: { rows: Consultant[] }) {
  return (
    <div className="space-y-2.5">
      {rows.map((c, i) => {
        const color = barColor(c);
        return (
          <div key={c.rank} className="grid grid-cols-[44px_220px_1fr_60px] items-center gap-4">
            <div
              className="ms-display text-[14px] font-extrabold"
              style={{
                color: i === 0 ? GOLD_CROWN : i === 1 ? SILVER : i === 2 ? BRONZE : MUTED,
              }}
            >
              #{c.rank}
            </div>
            <div className="ms-display truncate text-[13px] font-semibold uppercase" style={{ color: TEXT }}>
              {c.name}
            </div>
            <div
              className="relative h-3 overflow-hidden rounded-full"
              style={{ background: "var(--ms-overlay)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, c.percent)}%` }}
                transition={{ type: "spring", stiffness: 60, damping: 15, delay: i * 0.05 }}
                className="h-full rounded-full"
                style={{
                  background: color,
                  boxShadow: c.percent > 0 ? `0 0 12px ${color}55` : "none",
                }}
              />
            </div>
            <div
              className="ms-display text-right text-[13px] font-extrabold"
              style={{ color: c.percent === 0 ? MUTED : color }}
            >
              {c.percent}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PercentBadge({ pct }: { pct: number }) {
  const [bg, fg] =
    pct === 0
      ? ["var(--ms-overlay)", MUTED]
      : pct >= 80
      ? ["rgba(46,196,182,0.12)", TEAL]
      : pct >= 50
      ? ["rgba(244,162,97,0.12)", GOLD]
      : ["rgba(230,57,70,0.12)", RED];
  return (
    <span
      className="ms-display inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-extrabold"
      style={{ background: bg, color: fg }}
    >
      {pct}%
    </span>
  );
}

function ResultsTable({ rows }: { rows: Consultant[] }) {
  const totals = rows.reduce(
    (a, r) => ({
      meta: a.meta + r.meta,
      delivered: a.delivered + r.delivered,
      contracts: a.contracts + r.contracts,
      leads: a.leads + r.leads,
      remaining: a.remaining + r.remaining,
    }),
    { meta: 0, delivered: 0, contracts: 0, leads: 0, remaining: 0 },
  );
  const totalPct = Math.round((totals.delivered / totals.meta) * 100);

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${NAVY_LIGHT}` }}>
      <table className="w-full min-w-[900px] border-collapse text-[13px]">
        <thead>
          <tr style={{ background: NAVY_MID }}>
            {["#", "Consultor", "Demanda", "Entregue", "Contratos", "Leads", "Conv.", "Restante", "%"].map((h) => (
              <th
                key={h}
                className="ms-display px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: MUTED }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const indicator =
              r.rank === 1 ? GOLD_CROWN : r.rank === 2 ? SILVER : r.rank === 3 ? BRONZE : null;
            return (
              <tr
                key={r.rank}
                className="transition-colors"
                style={{ background: i % 2 ? "var(--ms-row-alt)" : "var(--ms-row)" }}
              >
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {indicator && (
                      <span className="h-2 w-2 rounded-full" style={{ background: indicator }} />
                    )}
                    <span className="ms-display font-bold" style={{ color: TEXT }}>
                      {r.rank}
                    </span>
                  </div>
                </td>
                <td className="ms-display px-4 py-2.5 font-semibold uppercase" style={{ color: TEXT }}>
                  {r.name}
                </td>
                <td className="px-4 py-2.5" style={{ color: MUTED }}>{fmtBRL(r.meta)}</td>
                <td className="ms-display px-4 py-2.5 font-bold" style={{ color: TEXT }}>{fmtBRL(r.delivered)}</td>
                <td className="px-4 py-2.5" style={{ color: MUTED }}>{r.contracts}</td>
                <td className="px-4 py-2.5" style={{ color: MUTED }}>{r.leads}</td>
                <td className="px-4 py-2.5" style={{ color: MUTED }}>{r.conv}%</td>
                <td className="px-4 py-2.5" style={{ color: r.remaining < 0 ? RED : MUTED }}>
                  {fmtBRL(r.remaining)}
                </td>
                <td className="px-4 py-2.5"><PercentBadge pct={r.percent} /></td>
              </tr>
            );
          })}
          <tr style={{ background: NAVY_MID, borderTop: `2px solid ${NAVY_LIGHT}` }}>
            <td className="px-4 py-3" />
            <td className="ms-display px-4 py-3 font-extrabold uppercase" style={{ color: TEXT }}>
              Total
            </td>
            <td className="ms-display px-4 py-3 font-extrabold" style={{ color: TEXT }}>
              {fmtBRL(totals.meta)}
            </td>
            <td className="ms-display px-4 py-3 font-extrabold" style={{ color: TEXT }}>
              {fmtBRL(totals.delivered)}
            </td>
            <td className="ms-display px-4 py-3 font-extrabold" style={{ color: TEXT }}>
              {totals.contracts}
            </td>
            <td className="ms-display px-4 py-3 font-extrabold" style={{ color: TEXT }}>
              {totals.leads}
            </td>
            <td className="px-4 py-3" />
            <td className="ms-display px-4 py-3 font-extrabold" style={{ color: TEXT }}>
              {fmtBRL(totals.remaining)}
            </td>
            <td className="px-4 py-3"><PercentBadge pct={totalPct} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SectionTitle({ children, kicker }: { children: React.ReactNode; kicker?: string }) {
  return (
    <div className="mb-5">
      {kicker && (
        <div className="ms-display text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: RED }}>
          {kicker}
        </div>
      )}
      <div className="ms-display mt-1 text-[24px] font-extrabold uppercase tracking-tight" style={{ color: TEXT }}>
        {children}
      </div>
    </div>
  );
}

function MayTab() {
  const [sub, setSub] = useState<"podio" | "ranking" | "tabela">("podio");
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-[1400px] px-8 py-10"
    >
      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Demanda Total" value={303000} hint="Demanda acumulada" accent={RED} delay={0} />
        <KpiCard label="Demanda Entregue" value={182372} hint="60% da demanda" accent={TEAL} delay={0.08} />
        <KpiCard
          label="Contratos · Conv."
          value={76}
          hint="1.794 leads"
          accent={GOLD}
          isCurrency={false}
          customDisplay="76 / 4%"
          delay={0.16}
        />
        <KpiCard label="Ticket Médio" value={2400} hint="Média geral" accent={VIOLET} delay={0.24} />
      </div>

      <div className="mt-14">
        <SubTabs
          value={sub}
          onChange={setSub}
          opts={[
            { id: "podio", label: "Pódio de Performance" },
            { id: "ranking", label: "Ranking Completo" },
            { id: "tabela", label: "Tabela de Resultado Completo" },
          ]}
        />

        <AnimatePresence mode="wait">
          {sub === "podio" && (
            <motion.div
              key="podio"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Watermark />
              <SectionTitle kicker="Top 3 · Maio">Pódio de Performance</SectionTitle>
              <Podium rows={mayResults} />
            </motion.div>
          )}

          {sub === "ranking" && (
            <motion.section
              key="ranking"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl p-7"
              style={{ background: NAVY_MID, border: `1px solid ${NAVY_LIGHT}` }}
            >
              <SectionTitle kicker="Ranking completo">
                Performance Individual — Demanda Entregue vs. Prevista
              </SectionTitle>
              <HorizontalBars rows={mayResults} />
            </motion.section>
          )}

          {sub === "tabela" && (
            <motion.section
              key="tabela"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <SectionTitle kicker="Detalhamento">Tabela de Resultado Completo</SectionTitle>
              <ResultsTable rows={mayResults} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function LevelBadge({ level }: { level: Goal["level"] }) {
  const map: Record<Goal["level"], { bg: string; fg: string }> = {
    Pleno: { bg: "#0f3040", fg: TEAL },
    Júnior: { bg: "#1a2a1a", fg: "#7fc87f" },
    Trainee: { bg: "#2a2a10", fg: GOLD },
  };
  const s = map[level];
  return (
    <span
      className="ms-display inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase"
      style={{ background: s.bg, color: s.fg }}
    >
      {level}
    </span>
  );
}

function TeamBadge({ team }: { team: Team }) {
  const map: Record<Team, { bg: string; fg: string }> = {
    "Leões": { bg: "#2a1f08", fg: GOLD },
    "Tubarões": { bg: "#2a0f0f", fg: RED },
    "Bells Club": { bg: "#0f3040", fg: TEAL },
  };
  const s = map[team];
  return (
    <span
      className="ms-display inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase"
      style={{ background: s.bg, color: s.fg }}
    >
      {team}
    </span>
  );
}

function TeamCard({ team }: { team: Team }) {
  const members = juneGoals.filter((g) => g.team === team);
  const color = teamColor[team];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.015 }}
      className="rounded-2xl p-6"
      style={{
        background: NAVY_MID,
        border: `1px solid ${NAVY_LIGHT}`,
        borderTop: `4px solid ${color}`,
        boxShadow: `0 0 24px ${color}1f`,
      }}
    >
      <div className="flex items-baseline justify-between">
        <div className="ms-display text-[22px] font-extrabold uppercase tracking-wide" style={{ color }}>
          {team}
        </div>
        <div className="text-[12px]" style={{ color: MUTED }}>
          {members.length} prestadores
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {members.map((m) => (
          <li
            key={m.rank}
            className="flex items-center justify-between rounded-lg px-3 py-2"
            style={{ background: "var(--ms-overlay)" }}
          >
            <span className="ms-display text-[13px] font-semibold uppercase" style={{ color: TEXT }}>
              {m.name}
            </span>
            <LevelBadge level={m.level} />
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function GoalsBars({ rows }: { rows: Goal[] }) {
  const max = Math.max(...rows.map((r) => r.goalMonth));
  return (
    <div className="space-y-2.5">
      {rows.map((g, i) => {
        const color = teamColor[g.team];
        const pct = (g.goalMonth / max) * 100;
        return (
          <div key={g.rank} className="grid grid-cols-[44px_180px_1fr_110px] items-center gap-4">
            <div className="ms-display text-[13px] font-bold" style={{ color: MUTED }}>
              #{g.rank}
            </div>
            <div className="ms-display truncate text-[13px] font-semibold uppercase" style={{ color: TEXT }}>
              {g.name}
            </div>
            <div
              className="relative h-3 overflow-hidden rounded-full"
              style={{ background: "var(--ms-overlay)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ type: "spring", stiffness: 60, damping: 15, delay: i * 0.04 }}
                className="h-full rounded-full"
                style={{ background: color, boxShadow: `0 0 12px ${color}55` }}
              />
            </div>
            <div
              className="ms-display text-right text-[13px] font-extrabold"
              style={{ color }}
            >
              {fmtBRLcompact(g.goalMonth)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GoalsTable({ rows }: { rows: Goal[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${NAVY_LIGHT}` }}>
      <table className="w-full min-w-[900px] border-collapse text-[13px]">
        <thead>
          <tr style={{ background: NAVY_MID }}>
            {["#", "Prestador", "Nível", "Time", "Demanda (Mês)", "Demanda Contratos", "Demanda Assinados"].map((h) => (
              <th
                key={h}
                className="ms-display px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: MUTED }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((g, i) => (
            <tr
              key={g.rank}
              className="transition-colors"
              style={{ background: i % 2 ? "var(--ms-row-alt)" : "var(--ms-row)" }}
            >
              <td className="ms-display px-4 py-2.5 font-bold" style={{ color: TEXT }}>{g.rank}</td>
              <td className="ms-display px-4 py-2.5 font-semibold uppercase" style={{ color: TEXT }}>
                {g.name}
              </td>
              <td className="px-4 py-2.5"><LevelBadge level={g.level} /></td>
              <td className="px-4 py-2.5"><TeamBadge team={g.team} /></td>
              <td className="ms-display px-4 py-2.5 font-bold" style={{ color: TEXT }}>
                {fmtBRL(g.goalMonth)}
              </td>
              <td className="px-4 py-2.5" style={{ color: MUTED }}>{g.goalContracts}</td>
              <td className="ms-display px-4 py-2.5 font-bold" style={{ color: TEXT }}>
                {fmtBRL(g.goalSigned)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JuneTab() {
  const [sub, setSub] = useState<"squads" | "dist" | "tabela">("squads");
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-[1400px] px-8 py-10"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard label="Demanda Total Mês" value={296000} hint="18 prestadores" accent={TEAL} delay={0} />
        <KpiCard
          label="Demanda Contratos"
          value={150}
          hint="Range de entrega"
          accent={GOLD}
          isCurrency={false}
          customDisplay="150 › 170"
          delay={0.08}
        />
        <KpiCard label="Demanda Assinados" value={384800} hint="Total alvo" accent={RED} delay={0.16} />
      </div>

      <div className="mt-14">
        <SubTabs
          value={sub}
          onChange={setSub}
          opts={[
            { id: "squads", label: "Squads de Performance" },
            { id: "dist", label: "Distribuição de Demanda por Consultor" },
            { id: "tabela", label: "Tabela de Demandas de Junho" },
          ]}
        />

        <AnimatePresence mode="wait">
          {sub === "squads" && (
            <motion.div
              key="squads"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Watermark />
              <SectionTitle kicker="Times · Junho">Squads de Performance</SectionTitle>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <TeamCard team="Leões" />
                <TeamCard team="Tubarões" />
                <TeamCard team="Bells Club" />
              </div>
            </motion.div>
          )}

          {sub === "dist" && (
            <motion.section
              key="dist"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl p-7"
              style={{ background: NAVY_MID, border: `1px solid ${NAVY_LIGHT}` }}
            >
              <SectionTitle kicker="Demandas individuais">
                Distribuição de Demanda por Consultor
              </SectionTitle>
              <GoalsBars rows={juneGoals} />
            </motion.section>
          )}

          {sub === "tabela" && (
            <motion.section
              key="tabela"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <SectionTitle kicker="Detalhamento">Tabela de Demandas — Junho</SectionTitle>
              <GoalsTable rows={juneGoals} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Index() {
  const [tab, setTab] = useState<"maio" | "junho">("maio");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  return (
    <div className="ms-root ms-grain" data-theme={theme}>
      <Particles />
      <div className="relative z-10">
        <Header theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
        <Tabs value={tab} onChange={setTab} />
        <AnimatePresence mode="wait">
          {tab === "maio" ? <MayTab key="maio" /> : <JuneTab key="junho" />}
        </AnimatePresence>
        <footer className="border-t py-8 text-center text-[12px]" style={{ borderColor: NAVY_LIGHT, color: MUTED }}>
          MONTSEGURO · Performance Hub · 2026
        </footer>
      </div>
    </div>
  );
}
