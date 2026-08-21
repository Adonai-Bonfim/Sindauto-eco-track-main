import type { PerfilUsuario } from "@/types/auth";

export interface UsuarioGerenciado {
  id: string;
  nome: string;
  usuario: string;
  login?: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  mustChangePassword: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CriarUsuarioInput {
  nome: string;
  usuario: string;
  senha: string;
  perfil: PerfilUsuario;
}

export interface AtualizarUsuarioInput {
  nome?: string;
  perfil?: PerfilUsuario;
  ativo?: boolean;
}
