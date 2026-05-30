export type Consultant = {
  rank: number;
  name: string;
  meta: number;
  delivered: number;
  contracts: number;
  leads: number;
  conv: number;
  remaining: number;
  percent: number;
  level?: string;
};

export const mayResults: Consultant[] = [
  { rank: 1, name: "BRUNO VERÍSSIMO SAÚDE", meta: 20000, delivered: 24256.6, contracts: 9, leads: 77, conv: 12, remaining: -4256.6, percent: 121, level: "Júnior" },
  { rank: 2, name: "ISABELLA CRISTINA BRAGA", meta: 25000, delivered: 20687.13, contracts: 9, leads: 48, conv: 19, remaining: 4312.87, percent: 83, level: "Pleno" },
  { rank: 3, name: "PAULA VIEGAS SAÚDE", meta: 25000, delivered: 20063.37, contracts: 10, leads: 107, conv: 9, remaining: 4936.63, percent: 80, level: "Júnior" },
  { rank: 4, name: "EFFERSON MACEDO FORO", meta: 15000, delivered: 12260.86, contracts: 5, leads: 97, conv: 5, remaining: 2739.14, percent: 82 },
  { rank: 5, name: "VITOR FERREIRA SAÚDE", meta: 20000, delivered: 14982.46, contracts: 4, leads: 108, conv: 4, remaining: 5017.54, percent: 75 },
  { rank: 6, name: "LEONARDO", meta: 7000, delivered: 5232.77, contracts: 2, leads: 79, conv: 3, remaining: 1767.23, percent: 75 },
  { rank: 7, name: "LAVINIA RODRIGUES", meta: 20000, delivered: 13381.52, contracts: 5, leads: 81, conv: 6, remaining: 6618.48, percent: 67 },
  { rank: 8, name: "MAURICIO DUARTE", meta: 15000, delivered: 10048.57, contracts: 5, leads: 111, conv: 5, remaining: 4951.43, percent: 67 },
  { rank: 9, name: "MARCUS VINICIUS P. SILVA", meta: 25000, delivered: 16542.19, contracts: 9, leads: 103, conv: 9, remaining: 8457.81, percent: 66 },
  { rank: 10, name: "DAVI MATOS", meta: 20000, delivered: 12804.94, contracts: 6, leads: 138, conv: 4, remaining: 7195.06, percent: 64 },
  { rank: 11, name: "Vitória Monteiro", meta: 30000, delivered: 16591.54, contracts: 4, leads: 56, conv: 7, remaining: 13408.46, percent: 55 },
  { rank: 12, name: "ELIZA", meta: 7000, delivered: 2808.39, contracts: 1, leads: 121, conv: 1, remaining: 4191.61, percent: 40 },
  { rank: 13, name: "KAUAN", meta: 7000, delivered: 2079.0, contracts: 1, leads: 65, conv: 2, remaining: 4921.0, percent: 30 },
  { rank: 14, name: "BRANDON MARTIM OLIVEIRA", meta: 20000, delivered: 5893.84, contracts: 3, leads: 96, conv: 3, remaining: 14106.16, percent: 29 },
  { rank: 15, name: "CARLOS EDUARDO", meta: 10000, delivered: 1738.92, contracts: 1, leads: 99, conv: 1, remaining: 8261.08, percent: 17 },
  { rank: 16, name: "ALICIA", meta: 7000, delivered: 1211.62, contracts: 1, leads: 137, conv: 1, remaining: 5788.38, percent: 17 },
  { rank: 17, name: "CARLOS ARAUJO SAUDE", meta: 20000, delivered: 1788.53, contracts: 1, leads: 134, conv: 1, remaining: 18211.47, percent: 9 },
  { rank: 18, name: "GABRIEL N.", meta: 10000, delivered: 0, contracts: 0, leads: 88, conv: 0, remaining: 10000, percent: 0 },
  { rank: 19, name: "JOÃO GUERREIRO", meta: 7000, delivered: 0, contracts: 0, leads: 49, conv: 0, remaining: 7000, percent: 0 },
];

export type Team = "Leões" | "Tubarões" | "Bells Club";
export type Goal = {
  rank: number;
  name: string;
  level: "Pleno" | "Júnior" | "Trainee";
  team: Team;
  goalMonth: number;
  goalContracts: string;
  goalSigned: number;
};

export const juneGoals: Goal[] = [
  { rank: 1, name: "MARCUS", level: "Júnior", team: "Leões", goalMonth: 20000, goalContracts: "10 > 15", goalSigned: 26000 },
  { rank: 2, name: "ISABELLA", level: "Pleno", team: "Bells Club", goalMonth: 20000, goalContracts: "10 > 15", goalSigned: 26000 },
  { rank: 3, name: "PAULA", level: "Júnior", team: "Tubarões", goalMonth: 20000, goalContracts: "10 > 15", goalSigned: 26000 },
  { rank: 4, name: "LAVÍNIA", level: "Júnior", team: "Leões", goalMonth: 20000, goalContracts: "10 > 15", goalSigned: 26000 },
  { rank: 5, name: "DAVI", level: "Júnior", team: "Tubarões", goalMonth: 20000, goalContracts: "10 > 15", goalSigned: 26000 },
  { rank: 6, name: "BRUNO", level: "Júnior", team: "Leões", goalMonth: 20000, goalContracts: "10 > 15", goalSigned: 26000 },
  { rank: 7, name: "VITOR", level: "Júnior", team: "Tubarões", goalMonth: 20000, goalContracts: "10 > 15", goalSigned: 26000 },
  { rank: 8, name: "CARLOS", level: "Júnior", team: "Tubarões", goalMonth: 20000, goalContracts: "10 > 15", goalSigned: 26000 },
  { rank: 9, name: "MAURICIO", level: "Júnior", team: "Leões", goalMonth: 20000, goalContracts: "10 > 15", goalSigned: 26000 },
  { rank: 10, name: "CARLOS EDU.", level: "Trainee", team: "Leões", goalMonth: 20000, goalContracts: "10 > 15", goalSigned: 26000 },
  { rank: 11, name: "BRANDON", level: "Júnior", team: "Bells Club", goalMonth: 18000, goalContracts: "9 > 12", goalSigned: 23400 },
  { rank: 12, name: "EFFERSON", level: "Júnior", team: "Bells Club", goalMonth: 18000, goalContracts: "9 > 12", goalSigned: 23400 },
  { rank: 13, name: "ELIZA", level: "Trainee", team: "Bells Club", goalMonth: 10000, goalContracts: "6 > 8", goalSigned: 13000 },
  { rank: 14, name: "GABRIEL", level: "Trainee", team: "Bells Club", goalMonth: 10000, goalContracts: "6 > 8", goalSigned: 13000 },
  { rank: 15, name: "JOÃO GUERREIRO", level: "Trainee", team: "Tubarões", goalMonth: 10000, goalContracts: "6 > 8", goalSigned: 13000 },
  { rank: 16, name: "KAUAN", level: "Trainee", team: "Leões", goalMonth: 10000, goalContracts: "6 > 8", goalSigned: 13000 },
  { rank: 17, name: "LEONARDO", level: "Trainee", team: "Tubarões", goalMonth: 10000, goalContracts: "6 > 8", goalSigned: 13000 },
  { rank: 18, name: "ALÍCIA", level: "Trainee", team: "Bells Club", goalMonth: 10000, goalContracts: "6 > 8", goalSigned: 13000 },
];

export const fmtBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

export const fmtBRLcompact = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });