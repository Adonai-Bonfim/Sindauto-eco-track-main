import { requisicaoApi } from "@/services/api";
import type { AtualizarUsuarioInput, CriarUsuarioInput, UsuarioGerenciado } from "@/types/usuario";

export async function listarUsuarios(): Promise<UsuarioGerenciado[]> {
  const resposta = await requisicaoApi<UsuarioGerenciado[] | { usuarios: UsuarioGerenciado[] }>(
    "/usuarios",
  );
  return Array.isArray(resposta) ? resposta : resposta.usuarios;
}

export function criarUsuario(input: CriarUsuarioInput): Promise<UsuarioGerenciado> {
  return requisicaoApi<UsuarioGerenciado>("/usuarios", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function atualizarUsuario(
  id: string,
  input: AtualizarUsuarioInput,
): Promise<UsuarioGerenciado> {
  return requisicaoApi<UsuarioGerenciado>(`/usuarios/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
