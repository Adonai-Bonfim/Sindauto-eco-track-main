export interface Pesagem {
  id: string;
  data: string; // YYYY-MM-DD
  reciclaveis: number;
  organicos: number;
  rejeitos: number;
  responsavel: string;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PesagemInput {
  data: string;
  reciclaveis: number;
  organicos: number;
  rejeitos: number;
  responsavel: string;
  observacoes?: string | null;
}

export interface Indicadores {
  total: number;
  reciclaveis: number;
  organicos: number;
  rejeitos: number;
  recuperado: number;
  desvio: number;
  registros: number;
  mediaDiaria: number;
}

export type PeriodoPreset =
  | "todo"
  | "hoje"
  | "semana"
  | "mes"
  | "ultimos30"
  | "personalizado";

/** Intervalo de consulta em datas ISO "YYYY-MM-DD". */
export interface IntervaloDatas {
  inicio?: string;
  fim?: string;
}

export interface Periodo {
  preset: PeriodoPreset;
  inicio: string; // YYYY-MM-DD
  fim: string; // YYYY-MM-DD
}
