import { useMemo, useState } from "react";

import { usePesagens } from "@/hooks/usePesagens";
import type { IntervaloDatas, Pesagem, Periodo } from "@/types/pesagem";
import { formatarData } from "@/utils/formato";
import { periodoDoPreset } from "@/utils/periodo";

const POR_PAGINA = 10;

function correspondeBusca(pesagem: Pesagem, termo: string): boolean {
  if (!termo) return true;
  if (formatarData(pesagem.data).includes(termo)) return true;
  return (pesagem.observacoes ?? "").toLowerCase().includes(termo);
}

function ordenarPorData(pesagens: Pesagem[], decrescente: boolean): Pesagem[] {
  return [...pesagens].sort((a, b) =>
    decrescente ? b.data.localeCompare(a.data) : a.data.localeCompare(b.data),
  );
}

/** Concentra filtro, busca, ordenação e paginação do histórico fora da camada visual. */
export function useHistoricoPesagens() {
  const [periodo, setPeriodoState] = useState(() => periodoDoPreset("todo"));
  const [busca, setBuscaState] = useState("");
  const [ordemDesc, setOrdemDesc] = useState(true);
  const [pagina, setPagina] = useState(1);

  const intervalo: IntervaloDatas | undefined =
    periodo.preset === "todo" ? undefined : { inicio: periodo.inicio, fim: periodo.fim };
  const { data, isLoading } = usePesagens(intervalo);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return ordenarPorData(
      (data ?? []).filter((p) => correspondeBusca(p, termo)),
      ordemDesc,
    );
  }, [data, busca, ordemDesc]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtradas.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  function setPeriodo(novo: Periodo) {
    setPeriodoState(novo);
    setPagina(1);
  }

  function setBusca(termo: string) {
    setBuscaState(termo);
    setPagina(1);
  }

  return {
    periodo,
    setPeriodo,
    busca,
    setBusca,
    ordemDesc,
    alternarOrdem: () => setOrdemDesc((v) => !v),
    isLoading,
    visiveis,
    totalFiltradas: filtradas.length,
    paginaAtual,
    totalPaginas,
    irParaPagina: setPagina,
    exibePaginacao: filtradas.length > POR_PAGINA,
  };
}
