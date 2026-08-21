import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { atualizarMtr, criarMtr, excluirMtr, listarMtrs } from "@/services/mtrs";
import type { MtrInput } from "@/types/mtr";

const CHAVE = ["mtrs"] as const;

export function useMtrs() {
  const queryClient = useQueryClient();
  const consulta = useQuery({ queryKey: CHAVE, queryFn: listarMtrs });
  const criar = useMutation({
    mutationFn: criarMtr,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });
  const atualizar = useMutation({
    mutationFn: ({ id, input }: { id: string; input: MtrInput }) => atualizarMtr(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });
  const excluir = useMutation({
    mutationFn: excluirMtr,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });

  return {
    mtrs: consulta.data ?? [],
    isLoading: consulta.isLoading,
    isSaving: criar.isPending || atualizar.isPending,
    criar: criar.mutateAsync,
    atualizar: (id: string, input: MtrInput) => atualizar.mutateAsync({ id, input }),
    excluir: excluir.mutateAsync,
  };
}
