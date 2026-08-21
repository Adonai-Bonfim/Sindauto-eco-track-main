import { useEffect, useState } from "react";

const CHAVE_META = "sindauto-meta-desvio";
const EVENTO_META = "sindauto:meta-desvio-alterada";
export const META_DESVIO_PADRAO = 90;

function normalizarMeta(valor: unknown): number {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return META_DESVIO_PADRAO;
  return Math.min(Math.max(Math.round(numero), 1), 100);
}

function lerMeta(): number {
  if (typeof localStorage === "undefined") return META_DESVIO_PADRAO;
  return normalizarMeta(localStorage.getItem(CHAVE_META) ?? META_DESVIO_PADRAO);
}

export function useMetaDesvio() {
  const [meta, setMeta] = useState(META_DESVIO_PADRAO);

  useEffect(() => {
    setMeta(lerMeta());

    const atualizar = () => setMeta(lerMeta());
    window.addEventListener("storage", atualizar);
    window.addEventListener(EVENTO_META, atualizar);
    return () => {
      window.removeEventListener("storage", atualizar);
      window.removeEventListener(EVENTO_META, atualizar);
    };
  }, []);

  function salvarMeta(valor: number) {
    const novaMeta = normalizarMeta(valor);
    localStorage.setItem(CHAVE_META, String(novaMeta));
    setMeta(novaMeta);
    window.dispatchEvent(new Event(EVENTO_META));
  }

  return { meta, salvarMeta };
}
