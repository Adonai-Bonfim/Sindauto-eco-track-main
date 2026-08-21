import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { obterTokenApi, removerTokenApi, requisicaoApi, salvarTokenApi } from "@/services/api";
import type { AuthMeResponse, LoginResponse, UsuarioAutenticado } from "@/types/auth";

interface AuthContextValue {
  autenticado: boolean;
  carregando: boolean;
  usuario: UsuarioAutenticado | null;
  admin: boolean;
  entrar: (usuario: string, senha: string) => Promise<UsuarioAutenticado>;
  trocarSenha: (senhaAtual: string, novaSenha: string) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizarUsuario(usuario: UsuarioAutenticado): UsuarioAutenticado {
  const perfil = String(usuario?.perfil ?? "")
    .trim()
    .toLowerCase();
  if (perfil !== "admin" && perfil !== "operador") {
    throw new Error(
      "O backend não informou um perfil de acesso válido. Atualize o backend e entre novamente.",
    );
  }

  return { ...usuario, perfil };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    if (!obterTokenApi()) {
      setCarregando(false);
      return () => {
        ativo = false;
      };
    }

    requisicaoApi<AuthMeResponse>("/auth/me")
      .then((resposta) => {
        if (!ativo) return;
        setUsuario(normalizarUsuario(resposta.usuario));
        setAutenticado(true);
      })
      .catch(() => {
        removerTokenApi();
        setUsuario(null);
        setAutenticado(false);
      })
      .finally(() => ativo && setCarregando(false));

    return () => {
      ativo = false;
    };
  }, []);

  const valor = useMemo<AuthContextValue>(
    () => ({
      autenticado,
      carregando,
      usuario,
      admin: usuario?.perfil === "admin",
      entrar: async (usuario, senha) => {
        const usuarioNormalizado = usuario.trim().toLowerCase();

        const resposta = await requisicaoApi<LoginResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ usuario: usuarioNormalizado, senha }),
        });
        const usuarioAutenticado = normalizarUsuario(resposta.usuario);
        salvarTokenApi(resposta.token);
        setUsuario(usuarioAutenticado);
        setAutenticado(true);
        return usuarioAutenticado;
      },
      trocarSenha: async (senhaAtual, novaSenha) => {
        await requisicaoApi<void>("/auth/change-password", {
          method: "POST",
          body: JSON.stringify({ senhaAtual, novaSenha }),
        });
        setUsuario((atual) => (atual ? { ...atual, mustChangePassword: false } : atual));
      },
      sair: async () => {
        await requisicaoApi<void>("/auth/logout", { method: "POST" }).catch(() => undefined);
        removerTokenApi();
        setUsuario(null);
        setAutenticado(false);
      },
    }),
    [autenticado, carregando, usuario],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return contexto;
}
