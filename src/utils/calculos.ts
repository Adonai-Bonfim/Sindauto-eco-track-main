import type { Indicadores, Pesagem } from "@/types/pesagem";

export function totalPesagem(p: Pick<Pesagem, "reciclaveis" | "organicos" | "rejeitos">): number {
  return (p.reciclaveis ?? 0) + (p.organicos ?? 0) + (p.rejeitos ?? 0);
}

export function recuperadoPesagem(p: Pick<Pesagem, "reciclaveis" | "organicos">): number {
  return (p.reciclaveis ?? 0) + (p.organicos ?? 0);
}

/** Percentual de desvio do aterro. Retorna 0 quando o total é zero. */
export function taxaDesvio(recuperado: number, total: number): number {
  if (!total || total <= 0) return 0;
  return (recuperado / total) * 100;
}

export function desvioPesagem(p: Pick<Pesagem, "reciclaveis" | "organicos" | "rejeitos">): number {
  return taxaDesvio(recuperadoPesagem(p), totalPesagem(p));
}

export function calcularIndicadores(pesagens: Pesagem[]): Indicadores {
  const reciclaveis = pesagens.reduce((s, p) => s + Number(p.reciclaveis), 0);
  const organicos = pesagens.reduce((s, p) => s + Number(p.organicos), 0);
  const rejeitos = pesagens.reduce((s, p) => s + Number(p.rejeitos), 0);
  const total = reciclaveis + organicos + rejeitos;
  const recuperado = reciclaveis + organicos;
  const diasDistintos = new Set(pesagens.map((p) => p.data)).size;

  return {
    total,
    reciclaveis,
    organicos,
    rejeitos,
    recuperado,
    desvio: taxaDesvio(recuperado, total),
    registros: pesagens.length,
    mediaDiaria: diasDistintos > 0 ? total / diasDistintos : 0,
  };
}

/** Série diária ordenada por data, para gráficos de evolução. */
export function serieDiaria(pesagens: Pesagem[]) {
  const mapa = new Map<
    string,
    { data: string; reciclaveis: number; organicos: number; rejeitos: number }
  >();

  for (const p of pesagens) {
    const atual = mapa.get(p.data) ?? {
      data: p.data,
      reciclaveis: 0,
      organicos: 0,
      rejeitos: 0,
    };
    atual.reciclaveis += Number(p.reciclaveis);
    atual.organicos += Number(p.organicos);
    atual.rejeitos += Number(p.rejeitos);
    mapa.set(p.data, atual);
  }

  return Array.from(mapa.values()).sort((a, b) => a.data.localeCompare(b.data));
}

function paraDataLocal(iso: string): Date {
  return new Date(`${iso}T12:00:00`);
}

function paraISO(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/** Série consolidada por semana, iniciando na segunda-feira. */
export function serieSemanal(pesagens: Pesagem[]) {
  const mapa = new Map<
    string,
    { inicio: string; reciclaveis: number; organicos: number; rejeitos: number }
  >();

  for (const p of pesagens) {
    const data = paraDataLocal(p.data);
    const deslocamento = (data.getDay() + 6) % 7;
    data.setDate(data.getDate() - deslocamento);
    const inicio = paraISO(data);
    const atual = mapa.get(inicio) ?? {
      inicio,
      reciclaveis: 0,
      organicos: 0,
      rejeitos: 0,
    };
    atual.reciclaveis += Number(p.reciclaveis);
    atual.organicos += Number(p.organicos);
    atual.rejeitos += Number(p.rejeitos);
    mapa.set(inicio, atual);
  }

  return Array.from(mapa.values()).sort((a, b) => a.inicio.localeCompare(b.inicio));
}

/** Taxa de desvio consolidada por dia (ponderada pelo peso total). */
export function serieDesvioDiario(pesagens: Pesagem[]) {
  return serieDiaria(pesagens).map((item) => {
    const total = item.reciclaveis + item.organicos + item.rejeitos;
    return {
      data: item.data,
      desvio: taxaDesvio(item.reciclaveis + item.organicos, total),
    };
  });
}
