import type { Mtr, MtrInput } from "@/types/mtr";

const CHAVE_LOCAL = "sindauto-mtrs";

export function listarMtrs(): Mtr[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const valor = JSON.parse(localStorage.getItem(CHAVE_LOCAL) ?? "[]") as unknown;
    return Array.isArray(valor) ? (valor as Mtr[]) : [];
  } catch {
    return [];
  }
}

function salvar(mtrs: Mtr[]) {
  localStorage.setItem(CHAVE_LOCAL, JSON.stringify(mtrs));
}

function gerarId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `mtr-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function criarMtr(input: MtrInput): Mtr {
  const agora = new Date().toISOString();
  const novo: Mtr = {
    ...input,
    id: gerarId(),
    createdAt: agora,
    updatedAt: agora,
  };
  salvar([novo, ...listarMtrs()]);
  return novo;
}

export function atualizarMtr(id: string, input: MtrInput): Mtr {
  const mtrs = listarMtrs();
  const indice = mtrs.findIndex((mtr) => mtr.id === id);
  if (indice < 0) throw new Error("MTR não encontrado.");
  const atualizado: Mtr = {
    ...mtrs[indice]!,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  mtrs[indice] = atualizado;
  salvar(mtrs);
  return atualizado;
}

export function excluirMtr(id: string) {
  salvar(listarMtrs().filter((mtr) => mtr.id !== id));
}
