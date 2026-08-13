export function formatarKg(valor: number): string {
  const numero = Number.isFinite(valor) ? valor : 0;
  return `${numero.toLocaleString("pt-BR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} kg`;
}

export function formatarPercentual(valor: number, casas = 1): string {
  const seguro = Number.isFinite(valor) ? valor : 0;
  return `${seguro.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })}%`;
}

/** Converte "YYYY-MM-DD" para "DD/MM/AAAA" sem problemas de fuso. */
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  if (!ano || !mes || !dia) return iso;
  return `${dia}/${mes}/${ano}`;
}

/** Rótulo curto "DD/MM" para eixos de gráficos. */
export function formatarDataCurta(iso: string): string {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

export function formatarHorario(dataHora: string): string {
  const data = new Date(dataHora);
  if (Number.isNaN(data.getTime())) return "—";
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

/** Aceita "2,5" ou "2.5" e devolve número (NaN se inválido). */
export function parseNumero(valor: string): number {
  if (valor.trim() === "") return 0;
  return Number(valor.replace(/\s/g, "").replace(",", "."));
}
