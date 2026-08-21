import { requisicaoApi } from "@/services/api";
import type { Mtr, MtrInput } from "@/types/mtr";

const CHAVE_LOCAL = "sindauto-mtrs";
const MODO_LOCAL = import.meta.env["VITE_DATA_SOURCE"] === "local";

function listarLocais(): Mtr[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const valor = JSON.parse(localStorage.getItem(CHAVE_LOCAL) ?? "[]") as unknown;
    return Array.isArray(valor) ? (valor as Mtr[]) : [];
  } catch {
    return [];
  }
}

function salvarLocais(mtrs: Mtr[]) {
  localStorage.setItem(CHAVE_LOCAL, JSON.stringify(mtrs));
}

function gerarId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return globalThis.crypto.randomUUID();
  return `mtr-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function listarMtrs(): Promise<Mtr[]> {
  if (MODO_LOCAL) return listarLocais();
  const resposta = await requisicaoApi<Mtr[] | { mtrs: Mtr[] }>("/mtrs");
  return Array.isArray(resposta) ? resposta : resposta.mtrs;
}

export async function criarMtr(input: MtrInput): Promise<Mtr> {
  if (!MODO_LOCAL) {
    return requisicaoApi<Mtr>("/mtrs", { method: "POST", body: JSON.stringify(input) });
  }
  const agora = new Date().toISOString();
  const novo: Mtr = { ...input, id: gerarId(), createdAt: agora, updatedAt: agora };
  salvarLocais([novo, ...listarLocais()]);
  return novo;
}

export async function atualizarMtr(id: string, input: MtrInput): Promise<Mtr> {
  if (!MODO_LOCAL) {
    return requisicaoApi<Mtr>(`/mtrs/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(input),
    });
  }
  const mtrs = listarLocais();
  const indice = mtrs.findIndex((mtr) => mtr.id === id);
  if (indice < 0) throw new Error("MTR não encontrado.");
  const atualizado: Mtr = {
    ...mtrs[indice]!,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  mtrs[indice] = atualizado;
  salvarLocais(mtrs);
  return atualizado;
}

export async function excluirMtr(id: string): Promise<void> {
  if (!MODO_LOCAL) {
    return requisicaoApi<void>(`/mtrs/${encodeURIComponent(id)}`, { method: "DELETE" });
  }
  salvarLocais(listarLocais().filter((mtr) => mtr.id !== id));
}
