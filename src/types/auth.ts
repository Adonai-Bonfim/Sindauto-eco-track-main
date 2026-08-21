export type PerfilUsuario = "admin" | "operador";

export interface UsuarioAutenticado {
  id: string;
  nome: string;
  usuario: string;
  login?: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  mustChangePassword: boolean;
}

export interface LoginResponse {
  token: string;
  expiresAt?: string;
  usuario: UsuarioAutenticado;
}

export interface AuthMeResponse {
  usuario: UsuarioAutenticado;
}
