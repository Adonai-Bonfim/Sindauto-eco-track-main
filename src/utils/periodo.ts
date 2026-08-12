import type { Periodo, PeriodoPreset } from "@/types/pesagem";

/** Formata uma data no calendário local (evita o deslocamento de fuso do toISOString). */
function paraISOLocal(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function hojeISO(): string {
  return paraISOLocal(new Date());
}

function addDias(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + dias);
  return paraISOLocal(d);
}

export function periodoDoPreset(preset: PeriodoPreset, atual?: Periodo): Periodo {
  const fim = hojeISO();

  switch (preset) {
    case "todo":
      return { preset, inicio: "", fim: "" };
    case "hoje":
      return { preset, inicio: fim, fim };
    case "semana": {
      const d = new Date(`${fim}T12:00:00`);
      const diaSemana = d.getDay(); // 0 = domingo
      const inicio = addDias(fim, -diaSemana);
      return { preset, inicio, fim };
    }
    case "mes": {
      const inicio = `${fim.slice(0, 7)}-01`;
      return { preset, inicio, fim };
    }
    case "ultimos30":
      return { preset, inicio: addDias(fim, -29), fim };
    case "personalizado":
      return {
        preset,
        inicio: atual?.inicio ?? addDias(fim, -29),
        fim: atual?.fim ?? fim,
      };
  }
}

export const PRESETS: { valor: PeriodoPreset; rotulo: string }[] = [
  { valor: "todo", rotulo: "Todo o histórico" },
  { valor: "hoje", rotulo: "Hoje" },
  { valor: "semana", rotulo: "Esta semana" },
  { valor: "mes", rotulo: "Este mês" },
  { valor: "ultimos30", rotulo: "Últimos 30 dias" },
  { valor: "personalizado", rotulo: "Personalizado" },
];
