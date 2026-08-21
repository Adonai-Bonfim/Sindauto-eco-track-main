import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { atualizarUsuario, criarUsuario, listarUsuarios } from "@/services/usuarios";
import type { AtualizarUsuarioInput, CriarUsuarioInput } from "@/types/usuario";

const CHAVE = ["usuarios"] as const;

export function useUsuarios(enabled = true) {
  const queryClient = useQueryClient();
  const consulta = useQuery({ queryKey: CHAVE, queryFn: listarUsuarios, enabled });
  const criar = useMutation({
    mutationFn: criarUsuario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });
  const atualizar = useMutation({
    mutationFn: ({ id, input }: { id: string; input: AtualizarUsuarioInput }) =>
      atualizarUsuario(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CHAVE }),
  });

  return {
    usuarios: consulta.data ?? [],
    isLoading: consulta.isLoading,
    isSaving: criar.isPending || atualizar.isPending,
    criar: (input: CriarUsuarioInput) => criar.mutateAsync(input),
    atualizar: (id: string, input: AtualizarUsuarioInput) => atualizar.mutateAsync({ id, input }),
  };
}
