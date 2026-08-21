import { useCallback, useEffect, useState } from "react";

import { atualizarMtr, criarMtr, excluirMtr, listarMtrs } from "@/services/mtrs";
import type { Mtr } from "@/types/mtr";
import type { MtrInput } from "@/types/mtr";

export function useMtrs() {
  const [mtrs, setMtrs] = useState<Mtr[]>([]);
  const recarregar = useCallback(() => setMtrs(listarMtrs()), []);

  useEffect(() => recarregar(), [recarregar]);

  return {
    mtrs,
    criar(input: MtrInput) {
      criarMtr(input);
      recarregar();
    },
    atualizar(id: string, input: MtrInput) {
      atualizarMtr(id, input);
      recarregar();
    },
    excluir(id: string) {
      excluirMtr(id);
      recarregar();
    },
  };
}
