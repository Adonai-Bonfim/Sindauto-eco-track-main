import type { Indicadores } from "@/types/pesagem";
import { formatarKg, formatarPercentual } from "@/utils/formato";

export interface LinhaResumo {
  rotulo: string;
  valor: string;
}

/** Linhas do resumo consolidado exibido nos relatórios. */
export function linhasResumoPeriodo(indicadores: Indicadores): LinhaResumo[] {
  return [
    { rotulo: "Total de resíduos", valor: formatarKg(indicadores.total) },
    { rotulo: "Total reciclado", valor: formatarKg(indicadores.reciclaveis) },
    { rotulo: "Total de orgânicos", valor: formatarKg(indicadores.organicos) },
    { rotulo: "Total de rejeitos", valor: formatarKg(indicadores.rejeitos) },
    { rotulo: "Taxa média de desvio do aterro", valor: formatarPercentual(indicadores.desvio) },
    { rotulo: "Média diária de geração", valor: formatarKg(indicadores.mediaDiaria) },
    { rotulo: "Pesagens realizadas", valor: String(indicadores.registros) },
  ];
}
