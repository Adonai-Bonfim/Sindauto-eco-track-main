import type { Alerta } from "@/types/alerta";
import type { Indicadores, IntervaloDatas } from "@/types/pesagem";
import { formatarPercentual } from "@/utils/formato";

const MINIMO_COMPARACAO = 5;
const MINIMO_META = 3;
const AUMENTO_REJEITOS_ATENCAO = 10;
const AUMENTO_REJEITOS_CRITICO = 20;
const DIFERENCA_META_CRITICA = 5;

function paraISOLocal(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

/** Mesmo intervalo de dias no mês anterior, limitado ao último dia disponível. */
export function intervalosMensaisParaAlertas(hoje = new Date()): {
  atual: IntervaloDatas;
  anterior: IntervaloDatas;
} {
  const inicioAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 12);
  const inicioAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1, 12);
  const ultimoDiaAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0, 12).getDate();
  const fimAnterior = new Date(
    inicioAnterior.getFullYear(),
    inicioAnterior.getMonth(),
    Math.min(hoje.getDate(), ultimoDiaAnterior),
    12,
  );

  return {
    atual: { inicio: paraISOLocal(inicioAtual), fim: paraISOLocal(hoje) },
    anterior: { inicio: paraISOLocal(inicioAnterior), fim: paraISOLocal(fimAnterior) },
  };
}

export function calcularAlertas({
  atual,
  anterior,
  meta,
}: {
  atual: Indicadores;
  anterior: Indicadores;
  meta: number;
}): Alerta[] {
  const alertas: Alerta[] = [];

  if (
    atual.registros >= MINIMO_COMPARACAO &&
    anterior.registros >= MINIMO_COMPARACAO &&
    anterior.rejeitos > 0
  ) {
    const variacao = ((atual.rejeitos - anterior.rejeitos) / anterior.rejeitos) * 100;
    if (variacao >= AUMENTO_REJEITOS_ATENCAO) {
      alertas.push({
        id: "aumento_rejeitos",
        tipo: "aumento_rejeitos",
        prioridade: variacao > AUMENTO_REJEITOS_CRITICO ? "critico" : "atencao",
        titulo: "Aumento de rejeitos",
        mensagem: `Os rejeitos aumentaram ${formatarPercentual(variacao)} em relação ao mesmo intervalo do mês anterior.`,
        destino: "/relatorios",
        rotuloAcao: "Ver relatórios",
      });
    }
  }

  if (atual.registros >= MINIMO_META && atual.total > 0 && atual.desvio < meta) {
    const diferenca = meta - atual.desvio;
    alertas.push({
      id: "meta_abaixo",
      tipo: "meta_abaixo",
      prioridade: diferenca > DIFERENCA_META_CRITICA ? "critico" : "atencao",
      titulo: "Meta abaixo do esperado",
      mensagem: `A taxa de desvio está ${formatarPercentual(diferenca)} abaixo da meta de ${formatarPercentual(meta)}.`,
      destino: "/metas",
      rotuloAcao: "Ver meta",
    });
  }

  return alertas;
}
