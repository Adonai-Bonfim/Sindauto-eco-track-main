import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar | Sindauto Lixo Zero" }] }),
  component: Login,
});

function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const { entrar, autenticado, carregando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!carregando && autenticado) navigate({ to: "/", replace: true });
  }, [autenticado, carregando, navigate]);

  async function submeter(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await entrar(usuario, senha);
      await navigate({ to: "/", replace: true });
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-10">
      <div className="surface-card w-full max-w-md p-7 sm:p-9">
        <div className="mb-8 flex items-center gap-3">
          <img
            src="/logo-sindauto.png"
            alt="Logo Sindauto"
            className="h-12 w-12 rounded-2xl object-cover shadow-sm"
          />
          <div>
            <h1 className="text-xl font-bold">Sindauto Lixo Zero</h1>
            <p className="text-sm text-muted-foreground">Acesso administrativo</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={submeter}>
          <div className="space-y-2">
            <Label htmlFor="usuario">Usuário</Label>
            <Input
              id="usuario"
              autoComplete="username"
              value={usuario}
              onChange={(evento) => setUsuario(evento.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              autoComplete="current-password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              required
            />
          </div>
          {erro && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {erro}
            </p>
          )}
          <Button className="h-12 w-full" disabled={enviando || carregando}>
            <LockKeyhole className="h-4 w-4" />
            {enviando ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </main>
  );
}
