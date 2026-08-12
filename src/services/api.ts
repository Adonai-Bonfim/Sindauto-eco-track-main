const CHAVE_TOKEN = "sindauto-api-token";
const API_URL = (import.meta.env["VITE_API_URL"] || "/api").replace(/\/$/, "");

export function obterTokenApi(): string | null {
  return typeof localStorage === "undefined" ? null : localStorage.getItem(CHAVE_TOKEN);
}

export function salvarTokenApi(token: string) {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function removerTokenApi() {
  localStorage.removeItem(CHAVE_TOKEN);
}

export async function requisicaoApi<T>(caminho: string, init?: RequestInit): Promise<T> {
  const token = obterTokenApi();
  const resposta = await fetch(`${API_URL}${caminho}`, {
    ...init,
    headers: {
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => null)) as {
      erro?: string;
      message?: string;
    } | null;
    throw new Error(corpo?.erro ?? corpo?.message ?? `Erro na API (${resposta.status}).`);
  }
  if (resposta.status === 204) return undefined as T;

  const texto = await resposta.text();
  if (!texto.trim()) return undefined as T;

  try {
    return JSON.parse(texto) as T;
  } catch {
    throw new Error("A API retornou uma resposta inválida.");
  }
}
