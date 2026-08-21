import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { requisicaoApi } from "@/services/api";

export const META_DESVIO_PADRAO = 90;
const CHAVE_QUERY = ["configuracoes", "meta-desvio"] as const;
const CHAVE_LOCAL = "sindauto-meta-desvio";
const MODO_LOCAL = import.meta.env["VITE_DATA_SOURCE"] === "local";

interface MetaDesvioResponse {
  meta: number;
  updatedAt?: string;
  updatedBy?: { id: string; nome: string } | null;
}

function normalizarMeta(valor: unknown): number {
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 1 || numero > 100) return META_DESVIO_PADRAO;
  return numero;
}

async function consultarMeta(): Promise<MetaDesvioResponse> {
  if (MODO_LOCAL) {
    return {
      meta: normalizarMeta(localStorage.getItem(CHAVE_LOCAL) ?? META_DESVIO_PADRAO),
    };
  }
  return requisicaoApi<MetaDesvioResponse>("/configuracoes/meta-desvio");
}

async function atualizarMeta(meta: number): Promise<MetaDesvioResponse> {
  if (MODO_LOCAL) {
    localStorage.setItem(CHAVE_LOCAL, String(meta));
    return { meta };
  }
  return requisicaoApi<MetaDesvioResponse>("/configuracoes/meta-desvio", {
    method: "PUT",
    body: JSON.stringify({ meta }),
  });
}

export function useMetaDesvio() {
  const queryClient = useQueryClient();
  const consulta = useQuery({ queryKey: CHAVE_QUERY, queryFn: consultarMeta });
  const atualizacao = useMutation({
    mutationFn: atualizarMeta,
    onSuccess: (resposta) => queryClient.setQueryData(CHAVE_QUERY, resposta),
  });

  return {
    meta: consulta.data?.meta ?? META_DESVIO_PADRAO,
    isLoading: consulta.isLoading,
    isSaving: atualizacao.isPending,
    updatedAt: consulta.data?.updatedAt,
    updatedBy: consulta.data?.updatedBy,
    salvarMeta: atualizacao.mutateAsync,
  };
}
