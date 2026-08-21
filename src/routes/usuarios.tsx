import { createFileRoute } from "@tanstack/react-router";
import { Plus, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useUsuarios } from "@/hooks/useUsuarios";
import type { PerfilUsuario } from "@/types/auth";

export const Route = createFileRoute("/usuarios")({
  head: () => ({ meta: [{ title: "Usuários | Sindauto Lixo Zero" }] }),
  component: Usuarios,
});

function Usuarios() {
  const { usuario: usuarioAtual, admin } = useAuth();
  const controle = useUsuarios(admin);
  const [exibindoForm, setExibindoForm] = useState(false);
  const [nome, setNome] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState<PerfilUsuario>("operador");

  if (!admin) return null;

  function limpar() {
    setNome("");
    setLogin("");
    setSenha("");
    setPerfil("operador");
    setExibindoForm(false);
  }

  async function cadastrar(evento: React.FormEvent) {
    evento.preventDefault();
    try {
      await controle.criar({ nome, usuario: login.trim().toLowerCase(), senha, perfil });
      toast.success("Usuário criado com sucesso.");
      limpar();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar o usuário.");
    }
  }

  async function alterar(id: string, input: { perfil?: PerfilUsuario; ativo?: boolean }) {
    try {
      await controle.atualizar(id, input);
      toast.success("Usuário atualizado.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar o usuário.");
    }
  }

  return (
    <>
      <PageHeader
        titulo="Usuários"
        descricao="Gerencie acessos administrativos e operacionais."
        acoes={
          <Button onClick={() => setExibindoForm((atual) => !atual)}>
            <Plus className="h-4 w-4" /> Novo usuário
          </Button>
        }
      />

      {exibindoForm && (
        <section className="surface-card mb-6 p-6 sm:p-8">
          <h2 className="mb-5 font-semibold">Cadastrar usuário</h2>
          <form onSubmit={cadastrar} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nome-usuario">Nome</Label>
              <Input
                id="nome-usuario"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-usuario">Usuário</Label>
              <Input
                id="login-usuario"
                required
                autoCapitalize="none"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha-usuario">Senha inicial</Label>
              <Input
                id="senha-usuario"
                type="password"
                required
                autoComplete="new-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Perfil</Label>
              <Select value={perfil} onValueChange={(valor: PerfilUsuario) => setPerfil(valor)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operador">Operador</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 sm:col-span-2">
              <Button disabled={controle.isSaving}>
                {controle.isSaving ? "Salvando..." : "Criar usuário"}
              </Button>
              <Button type="button" variant="outline" onClick={limpar}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      )}

      <section className="surface-card overflow-hidden">
        {controle.isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Troca de senha</TableHead>
                  <TableHead className="text-right">Ativo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {controle.usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-accent p-2 text-accent-foreground">
                          {usuario.perfil === "admin" ? (
                            <ShieldCheck className="h-4 w-4" />
                          ) : (
                            <UserRound className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{usuario.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {usuario.usuario || usuario.login}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={usuario.perfil}
                        disabled={controle.isSaving || usuario.id === usuarioAtual?.id}
                        onValueChange={(valor: PerfilUsuario) =>
                          void alterar(usuario.id, { perfil: valor })
                        }
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operador">Operador</SelectItem>
                          <SelectItem value="admin">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {usuario.mustChangePassword ? (
                        <Badge variant="outline">Pendente</Badge>
                      ) : (
                        <Badge variant="secondary">Concluída</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Switch
                          checked={usuario.ativo}
                          disabled={controle.isSaving || usuario.id === usuarioAtual?.id}
                          onCheckedChange={(ativo) => void alterar(usuario.id, { ativo })}
                          aria-label={`${usuario.ativo ? "Desativar" : "Ativar"} ${usuario.nome}`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </>
  );
}
