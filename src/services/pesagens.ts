import { requisicaoApi } from "@/services/api";
import type { IntervaloDatas, Pesagem, PesagemInput } from "@/types/pesagem";
import { validarPesagem } from "@/validators/pesagem";

const CHAVE_LOCAL = "sindauto-pesagens";
const USA_API = import.meta.env["VITE_DATA_SOURCE"] !== "local";

function normalizar(row: Record<string, unknown>): Pesagem {
  return {
    id: String(row["id"]),
    data: String(row["data"]),
    reciclaveis: Number(row["reciclaveis"]),
    organicos: Number(row["organicos"]),
    rejeitos: Number(row["rejeitos"]),
    responsavel: String(row["responsavel"]),
    observacoes: (row["observacoes"] as string | null) ?? null,
    created_at: String(row["created_at"]),
    updated_at: String(row["updated_at"]),
  };
}

/** Barreira final de validação antes de qualquer gravação. */
function validarOuFalhar(input: PesagemInput): PesagemInput {
  const resultado = validarPesagem(input);
  if (!resultado.ok) throw new Error(resultado.erro);
  return resultado.valor;
}

function lerPesagensLocais(): Pesagem[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const valor = JSON.parse(localStorage.getItem(CHAVE_LOCAL) ?? "[]") as unknown;
    return Array.isArray(valor)
      ? valor.map((item) => normalizar(item as Record<string, unknown>))
      : [];
  } catch {
    return [];
  }
}

function salvarPesagensLocais(pesagens: Pesagem[]) {
  localStorage.setItem(CHAVE_LOCAL, JSON.stringify(pesagens));
}

function gerarIdLocal(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function listarPesagens(params?: IntervaloDatas): Promise<Pesagem[]> {
  if (USA_API) {
    const query = new URLSearchParams();
    if (params?.inicio) query.set("inicio", params.inicio);
    if (params?.fim) query.set("fim", params.fim);
    return requisicaoApi<Pesagem[]>(`/pesagens?${query}`);
  }

  if (!USA_API) {
    return lerPesagensLocais()
      .filter(
        (p) =>
          (!params?.inicio || p.data >= params.inicio) && (!params?.fim || p.data <= params.fim),
      )
      .sort((a, b) => b.data.localeCompare(a.data));
  }

  return [];
}

export async function criarPesagem(input: PesagemInput): Promise<Pesagem> {
  const validada = validarOuFalhar(input);
  if (USA_API) {
    return requisicaoApi<Pesagem>("/pesagens", {
      method: "POST",
      body: JSON.stringify(validada),
    });
  }

  if (!USA_API) {
    const agora = new Date().toISOString();
    const nova: Pesagem = {
      id: gerarIdLocal(),
      ...validada,
      observacoes: validada.observacoes ?? null,
      created_at: agora,
      updated_at: agora,
    };
    salvarPesagensLocais([nova, ...lerPesagensLocais()]);
    return nova;
  }

  throw new Error("Fonte de dados inválida.");
}

export async function atualizarPesagem(id: string, input: PesagemInput): Promise<Pesagem> {
  const validada = validarOuFalhar(input);
  if (USA_API) {
    return requisicaoApi<Pesagem>(`/pesagens/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(validada),
    });
  }

  if (!USA_API) {
    const pesagens = lerPesagensLocais();
    const indice = pesagens.findIndex((p) => p.id === id);
    if (indice < 0) throw new Error("Pesagem não encontrada.");
    const atualizada: Pesagem = {
      ...pesagens[indice]!,
      ...validada,
      observacoes: validada.observacoes ?? null,
      updated_at: new Date().toISOString(),
    };
    pesagens[indice] = atualizada;
    salvarPesagensLocais(pesagens);
    return atualizada;
  }

  throw new Error("Fonte de dados inválida.");
}

export async function excluirPesagem(id: string): Promise<void> {
  if (USA_API) {
    return requisicaoApi<void>(`/pesagens/${encodeURIComponent(id)}`, { method: "DELETE" });
  }

  if (!USA_API) {
    salvarPesagensLocais(lerPesagensLocais().filter((p) => p.id !== id));
    return;
  }

  throw new Error("Fonte de dados inválida.");
}
