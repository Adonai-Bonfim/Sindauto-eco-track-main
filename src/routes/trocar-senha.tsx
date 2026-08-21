import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/trocar-senha")({
  head: () => ({ meta: [{ title: "Trocar senha | Sindauto Lixo Zero" }] }),
  component: TrocarSenha,
});

function TrocarSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const { trocarSenha, sair } = useAuth();
  const navigate = useNavigate();

  async function submeter(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);
    if (novaSenha !== confirmacao) return setErro("A confirmação da nova senha não confere.");
    setSalvando(true);
    try {
      await trocarSenha(senhaAtual, novaSenha);
      await navigate({ to: "/", replace: true });
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível alterar a senha.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-4 py-10">
      <div className="surface-card w-full max-w-md p-7 sm:p-9">
        <div className="mb-7 flex items-center gap-3">
          <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
            <KeyRound className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Defina uma nova senha</h1>
            <p className="text-sm text-muted-foreground">
              A senha temporária precisa ser substituída.
            </p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={submeter}>
          <div className="space-y-2">
            <Label htmlFor="senha-atual">Senha atual</Label>
            <Input
              id="senha-atual"
              type="password"
              autoComplete="current-password"
              required
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nova-senha">Nova senha</Label>
            <Input
              id="nova-senha"
              type="password"
              autoComplete="new-password"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmar-senha">Confirmar nova senha</Label>
            <Input
              id="confirmar-senha"
              type="password"
              autoComplete="new-password"
              required
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
            />
          </div>
          {erro && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {erro}
            </p>
          )}
          <Button className="h-12 w-full" disabled={salvando}>
            {salvando ? "Alterando..." : "Alterar senha"}
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={() => void sair()}>
            Sair
          </Button>
        </form>
      </div>
    </main>
  );
}
