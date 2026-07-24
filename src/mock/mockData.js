// Gerador de dados ficticios usado enquanto a API real (VITE_API_URL) nao
// esta disponivel. Mantem o mesmo formato de objeto que os endpoints reais
// devem devolver, para que trocar de mock -> API real seja apenas uma troca
// de fonte em src/api/client.js, sem tocar em nenhuma view.

const FIRST_NAMES = [
  "Ana",
  "Bruno",
  "Carla",
  "Diego",
  "Elisa",
  "Fabio",
  "Gabriela",
  "Hugo",
  "Isabela",
  "Joao",
  "Karina",
  "Lucas",
  "Marina",
  "Nicolas",
  "Olivia",
  "Pedro",
  "Rafaela",
  "Thiago",
];

const LAST_NAMES = [
  "Almeida",
  "Barros",
  "Costa",
  "Duarte",
  "Esteves",
  "Ferreira",
  "Gomes",
  "Henriques",
  "Iglesias",
  "Junqueira",
  "Lima",
  "Martins",
  "Nogueira",
  "Oliveira",
  "Pereira",
  "Quintela",
  "Ramos",
  "Souza",
];

// Identidade visual fixa de cada time (nome, cor de marca e escudo padrao).
// `color` tinge borda/valores do card em TimesView, independente da cor de
// acento da aba ativa. `crestUrl` fica null ate o usuario anexar um escudo.
const TEAM_IDENTITIES = [
  { id: "team-1", name: "Leões", color: "#f59e0b", crestUrl: null },
  { id: "team-2", name: "Tubarões", color: "#ef4444", crestUrl: null },
  { id: "team-3", name: "Fanáticos", color: "#22d3ee", crestUrl: null },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max, digits = 0) {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(digits));
}

function pick(list, index) {
  return list[index % list.length];
}

function buildConsultant(index) {
  const name = `${pick(FIRST_NAMES, index)} ${pick(LAST_NAMES, index * 3 + 1)}`;
  const monthRevenue = randomInt(18000, 145000);
  const leadsHot = randomInt(1, 14);
  const leadsWarm = randomInt(2, 18);
  const leadsCold = randomInt(1, 22);
  const activeLeads = leadsHot + leadsWarm + leadsCold;
  const monthContracts = randomInt(2, 9);

  return {
    id: `consultant-${index + 1}`,
    name,
    avatarUrl: null,
    teamId: `team-${(index % 3) + 1}`,
    monthRevenue,
    monthRevenueYesterday: monthRevenue - randomInt(-6000, 6000),
    todaySubscriptions: { qty: randomInt(0, 6), value: randomInt(0, 22000) },
    todaySubscriptionsYesterday: { qty: randomInt(0, 6), value: randomInt(0, 22000) },
    todayDeployments: { qty: randomInt(0, 4), value: randomInt(0, 18000) },
    todayDeploymentsYesterday: { qty: randomInt(0, 4), value: randomInt(0, 18000) },
    activeLeads,
    leadsHot,
    leadsWarm,
    leadsCold,
    analysisMonth: randomInt(2000, 40000),
    awaitingPayment: randomInt(1000, 25000),
    // Metas/realizado usados no ranking por meta da aba Evolucao de Metas.
    monthlyGoal: randomInt(90000, 160000),
    monthContracts,
    quarterRevenue: Math.max(0, monthRevenue * 3 + randomInt(-30000, 30000)),
    quarterlyGoal: randomInt(270000, 480000),
    quarterContracts: Math.max(monthContracts, monthContracts * 3 + randomInt(-4, 6)),
    // Valor assinado do mes (etapa anterior ao implantado) e sua meta,
    // usados no ranking da aba Previsao · Mes.
    monthSigned: monthRevenue + randomInt(5000, 40000),
    signedGoal: randomInt(90000, 160000),
  };
}

function buildTeam(identity, consultants) {
  const teamConsultants = consultants.filter((c) => c.teamId === identity.id);
  const implantado = teamConsultants.reduce((sum, c) => sum + c.monthRevenue, 0);
  const analise = teamConsultants.reduce((sum, c) => sum + c.analysisMonth, 0);
  const emPagamento = teamConsultants.reduce((sum, c) => sum + c.awaitingPayment, 0);
  // Qtd de contratos por estagio - exibida junto do valor em cada quadrante
  // do card do Ranking de Times.
  const analiseContratos = randomInt(1, 8);
  const emPagamentoContratos = randomInt(1, 6);
  const implantadoContratos = randomInt(1, 6);
  return {
    id: identity.id,
    name: identity.name,
    color: identity.color,
    crestUrl: identity.crestUrl,
    logoInitials: identity.name.slice(0, 2).toUpperCase(),
    // Metricas usadas no calculo geral de faturamento/meta (Geral, Metas, ticker).
    implantado,
    analise,
    emPagamento,
    previsaoTotalMes: implantado + analise + emPagamento,
    // Metricas exibidas no card do Ranking de Times.
    analiseContratos,
    emPagamentoContratos,
    implantadoContratos,
    previsaoTotalContratos: analiseContratos + emPagamentoContratos + implantadoContratos,
  };
}

// Sem uma aba de funil dedicada, so precisamos do total de leads em aberto
// e da taxa de conversao para os KPIs de Geral/Metas e para o ticker.
function buildLeadMetrics() {
  const totalLeads = randomInt(1400, 2200);
  const conversionPct = randomFloat(8, 18, 1);
  const closedCount = Math.round((totalLeads * conversionPct) / 100);
  return {
    openLeads: totalLeads - closedCount,
    conversionPct,
  };
}

function buildGoalsEvolution() {
  const days = 14;
  const today = new Date(2026, 6, 23);
  let goalPct = 38;
  const points = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    goalPct = Math.min(100, Math.max(0, goalPct + randomFloat(-1.5, 6, 1)));
    points.push({
      date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      goalPct: Number(goalPct.toFixed(1)),
      revenue: randomInt(20000, 60000),
      contractsSigned: randomInt(15, 45),
      contractsSignedValue: randomInt(15000, 45000),
      contractsDeployed: randomInt(10, 35),
      contractsDeployedValue: randomInt(10000, 35000),
    });
  }
  return points;
}

export function createMockDataset() {
  const consultants = FIRST_NAMES.map((_, index) => buildConsultant(index));
  const teams = TEAM_IDENTITIES.map((identity) => buildTeam(identity, consultants));
  const leadMetrics = buildLeadMetrics();
  const goalsEvolution = buildGoalsEvolution();

  const revenueTeams = teams.reduce((sum, t) => sum + t.implantado, 0);
  const revenueGoalValue = 1600000;
  // Sem meta coletiva trimestral definida a parte - usa 3x a meta mensal
  // como ponto de partida (mesma proporcao usada nas metas por consultor).
  const revenueGoalValueQuarterly = revenueGoalValue * 3;
  const totalMonthContracts = consultants.reduce((sum, c) => sum + c.monthContracts, 0);
  const summary = {
    revenueTeams,
    revenueGoalValue,
    revenueGoalValueQuarterly,
    revenueGoalPct: Number(((revenueTeams / revenueGoalValue) * 100).toFixed(1)),
    analysisMonth: teams.reduce((sum, t) => sum + t.analise, 0),
    awaitingPayment: teams.reduce((sum, t) => sum + t.emPagamento, 0),
    openLeads: leadMetrics.openLeads,
    ticketMedio: totalMonthContracts > 0 ? revenueTeams / totalMonthContracts : 0,
    conversionPct: leadMetrics.conversionPct,
  };

  const kpis = {
    subscriptionsToday: consultants.reduce(
      (acc, c) => ({
        qty: acc.qty + c.todaySubscriptions.qty,
        value: acc.value + c.todaySubscriptions.value,
      }),
      { qty: 0, value: 0 },
    ),
    deploymentsToday: consultants.reduce(
      (acc, c) => ({
        qty: acc.qty + c.todayDeployments.qty,
        value: acc.value + c.todayDeployments.value,
      }),
      { qty: 0, value: 0 },
    ),
    openLeads: summary.openLeads,
    hotLeads: consultants.reduce((sum, c) => sum + c.leadsHot, 0),
    teamRevenue: revenueTeams,
    collectiveGoalPct: summary.revenueGoalPct,
    currentLeader: [...consultants].sort((a, b) => b.monthRevenue - a.monthRevenue)[0]?.name ?? "—",
  };

  return { consultants, teams, goalsEvolution, summary, kpis };
}

// --- Emissor de eventos simulados (substitui o EventSource real em modo mock) ---
// Mantem o mesmo formato de mensagem que o canal SSE real deve enviar:
// { type: 'sale' | 'lead_temperature_change' | 'ranking_update', payload, timestamp }
export function createMockEventSource() {
  let closed = false;
  const listeners = new Set();
  const source = {
    set onmessage(fn) {
      if (fn) listeners.add(fn);
    },
    addEventListener(_type, fn) {
      listeners.add(fn);
    },
    close() {
      closed = true;
      listeners.clear();
      clearInterval(intervalId);
    },
  };

  function emit(event) {
    if (closed) return;
    const message = { data: JSON.stringify(event) };
    listeners.forEach((fn) => fn(message));
  }

  const intervalId = setInterval(() => {
    const roll = Math.random();
    const consultantId = `consultant-${randomInt(1, FIRST_NAMES.length)}`;

    if (roll < 0.55) {
      emit({
        type: "sale",
        payload: { consultantId, amount: randomInt(800, 12000) },
        timestamp: new Date().toISOString(),
      });
    } else if (roll < 0.8) {
      const temperatures = ["quente", "morno", "frio"];
      emit({
        type: "lead_temperature_change",
        payload: {
          consultantId,
          from: pick(temperatures, randomInt(0, 2)),
          to: pick(temperatures, randomInt(0, 2)),
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      emit({ type: "ranking_update", payload: {}, timestamp: new Date().toISOString() });
    }
  }, 4000);

  return source;
}
