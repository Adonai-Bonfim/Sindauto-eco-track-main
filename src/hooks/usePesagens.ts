import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  atualizarPesagem,
  criarPesagem,
  excluirPesagem,
  listarPesagens,
} from "@/services/pesagens";
import type { IntervaloDatas, PesagemInput } from "@/types/pesagem";

const CHAVE = ["pesagens"] as const;

/** Dados mudam pouco: evita refetch imediato ao alternar entre páginas. */
const STALE_TIME_MS = 30_000;
const MODO_LOCAL = import.meta.env["VITE_DATA_SOURCE"] === "local";

export function usePesagens(intervalo?: IntervaloDatas) {
  return useQuery({
    queryKey: [...CHAVE, intervalo?.inicio ?? null, intervalo?.fim ?? null],
    queryFn: () => listarPesagens(intervalo),
    staleTime: MODO_LOCAL ? 0 : STALE_TIME_MS,
    refetchOnMount: MODO_LOCAL ? "always" : true,
  });
}

export function useCriarPesagem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PesagemInput) => criarPesagem(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useAtualizarPesagem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PesagemInput }) => atualizarPesagem(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE }),
  });
}

export function useExcluirPesagem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => excluirPesagem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CHAVE }),
  });
}
