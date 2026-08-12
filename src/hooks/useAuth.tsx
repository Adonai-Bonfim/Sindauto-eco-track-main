import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { obterTokenApi, removerTokenApi, requisicaoApi, salvarTokenApi } from "@/services/api";

interface AuthContextValue {
  autenticado: boolean;
  carregando: boolean;
  entrar: (usuario: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const CHAVE_LOGIN_LOCAL = "sindauto-login-local";
const MODO_LOCAL = import.meta.env["VITE_DATA_SOURCE"] === "local";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    if (MODO_LOCAL) {
      setAutenticado(localStorage.getItem(CHAVE_LOGIN_LOCAL) === "ativo");
      setCarregando(false);
      return () => {
        ativo = false;
      };
    }

    if (!obterTokenApi()) {
      setCarregando(false);
      return () => {
        ativo = false;
      };
    }

    requisicaoApi("/auth/me")
      .then(() => ativo && setAutenticado(true))
      .catch(() => removerTokenApi())
      .finally(() => ativo && setCarregando(false));

    return () => {
      ativo = false;
    };
  }, []);

  const valor = useMemo<AuthContextValue>(
    () => ({
      autenticado,
      carregando,
      entrar: async (usuario, senha) => {
        const usuarioNormalizado = usuario.trim().toLowerCase();

        if (MODO_LOCAL) {
          if (usuarioNormalizado !== "admin" || senha !== "admin@123") {
            throw new Error("Usuário ou senha inválidos.");
          }
          localStorage.setItem(CHAVE_LOGIN_LOCAL, "ativo");
          setAutenticado(true);
          return;
        }

        const resposta = await requisicaoApi<{ token: string }>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ usuario: usuarioNormalizado, senha }),
        });
        salvarTokenApi(resposta.token);
        setAutenticado(true);
      },
      sair: async () => {
        if (MODO_LOCAL) {
          localStorage.removeItem(CHAVE_LOGIN_LOCAL);
        } else {
          await requisicaoApi<void>("/auth/logout", { method: "POST" }).catch(() => undefined);
          removerTokenApi();
        }
        setAutenticado(false);
      },
    }),
    [autenticado, carregando],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return contexto;
}
