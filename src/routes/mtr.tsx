import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, FileText, Pencil, Plus, Trash2, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { MtrForm } from "@/components/mtr/MtrForm";
import { PageHeader } from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMtrs } from "@/hooks/useMtrs";
import { useAuth } from "@/hooks/useAuth";
import { usePesagens } from "@/hooks/usePesagens";
import type { Mtr, SituacaoMtr } from "@/types/mtr";
import { formatarData, formatarKg } from "@/utils/formato";

export const Route = createFileRoute("/mtr")({
  head: () => ({ meta: [{ title: "Controle de MTR | Sindauto Lixo Zero" }] }),
  component: ControleMtr,
});

const ROTULOS: Record<SituacaoMtr, string> = {
  emitido: "Emitido",
  em_transporte: "Em transporte",
  recebido: "Recebido",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

function pesoInterno(mtr: Mtr) {
  return mtr.reciclaveis + mtr.organicos + mtr.rejeitos;
}

function ControleMtr() {
  const { admin } = useAuth();
  const { data: pesagens } = usePesagens(undefined, admin);
  const controle = useMtrs();
  const [exibindoForm, setExibindoForm] = useState(false);
  const [editando, setEditando] = useState<Mtr | null>(null);
  const [busca, setBusca] = useState("");

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return controle.mtrs.filter((mtr) =>
      [mtr.numero, mtr.transportador, mtr.destinador, mtr.numeroCdf]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(termo),
    );
  }, [busca, controle.mtrs]);

  const semCdf = controle.mtrs.filter(
    (mtr) => mtr.situacao !== "cancelado" && !mtr.numeroCdf,
  ).length;
  const emTransporte = controle.mtrs.filter((mtr) => mtr.situacao === "em_transporte").length;

  function fecharFormulario() {
    setExibindoForm(false);
    setEditando(null);
  }

  async function remover(mtr: Mtr) {
    if (!window.confirm(`Excluir o registro interno do MTR ${mtr.numero}?`)) return;
    try {
      await controle.excluir(mtr.id);
      toast.success("Registro de MTR excluído.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir o MTR.");
    }
  }

  return (
    <>
      <PageHeader
        titulo="Controle de MTR"
        descricao="Registro interno de manifestos emitidos no SINIR, sem integração automática."
        acoes={
          admin ? (
            <Button
              onClick={() => {
                setEditando(null);
                setExibindoForm(true);
              }}
            >
              <Plus className="h-4 w-4" /> Novo MTR
            </Button>
          ) : undefined
        }
      />

      <div className="mb-6 rounded-xl border border-amber-500/25 bg-amber-500/8 p-4 text-sm text-foreground">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p>
            Este módulo apenas organiza documentos já emitidos. Ele não emite, valida ou substitui o
            MTR oficial do SINIR e não determina a obrigatoriedade legal do manifesto.
          </p>
        </div>
      </div>

      <div className="stagger grid gap-4 sm:grid-cols-3">
        <Resumo titulo="Manifestos" valor={controle.mtrs.length} icone={FileText} />
        <Resumo titulo="Em transporte" valor={emTransporte} icone={Truck} />
        <Resumo titulo="CDF pendente" valor={semCdf} icone={AlertTriangle} alerta={semCdf > 0} />
      </div>

      {!admin && (
        <p className="mt-6 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
          Acesso somente para consulta. Apenas administradores podem alterar registros de MTR.
        </p>
      )}

      {admin && exibindoForm && (
        <section className="surface-card mt-6 p-6 sm:p-8">
          <h2 className="mb-6 font-semibold">
            {editando ? `Editar MTR ${editando.numero}` : "Registrar MTR"}
          </h2>
          <MtrForm
            key={editando?.id ?? "novo"}
            pesagens={pesagens ?? []}
            editando={editando}
            onCancelar={fecharFormulario}
            onSalvar={async (input) => {
              try {
                if (editando) await controle.atualizar(editando.id, input);
                else await controle.criar(input);
                toast.success(editando ? "MTR atualizado." : "MTR registrado.");
                fecharFormulario();
              } catch (error) {
                toast.error(
                  error instanceof Error ? error.message : "Não foi possível salvar o MTR.",
                );
              }
            }}
          />
        </section>
      )}

      <section className="surface-card mt-6 overflow-hidden">
        <div className="border-b border-border p-5">
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por número, transportador, destinador ou CDF"
            className="max-w-lg"
          />
        </div>
        {controle.isLoading ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Carregando MTRs...</p>
        ) : visiveis.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            Nenhum MTR encontrado. Use “Novo MTR” para iniciar o controle.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MTR</TableHead>
                  <TableHead>Emissão</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Transportador / Destinador</TableHead>
                  <TableHead>Peso interno</TableHead>
                  <TableHead>CDF</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visiveis.map((mtr) => (
                  <TableRow key={mtr.id}>
                    <TableCell className="font-medium">{mtr.numero}</TableCell>
                    <TableCell>{formatarData(mtr.dataEmissao)}</TableCell>
                    <TableCell>
                      <Badge variant={mtr.situacao === "cancelado" ? "destructive" : "secondary"}>
                        {ROTULOS[mtr.situacao]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-56">
                        <p className="truncate font-medium">{mtr.transportador}</p>
                        <p className="truncate text-xs text-muted-foreground">{mtr.destinador}</p>
                      </div>
                    </TableCell>
                    <TableCell className="tabular-nums">{formatarKg(pesoInterno(mtr))}</TableCell>
                    <TableCell>
                      {mtr.numeroCdf || (
                        <span className="text-xs text-muted-foreground">Pendente</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        {admin ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Editar MTR ${mtr.numero}`}
                              onClick={() => {
                                setEditando(mtr);
                                setExibindoForm(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Excluir MTR ${mtr.numero}`}
                              onClick={() => void remover(mtr)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">Consulta</span>
                        )}
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

function Resumo({
  titulo,
  valor,
  icone: Icone,
  alerta = false,
}: {
  titulo: string;
  valor: number;
  icone: typeof FileText;
  alerta?: boolean;
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{titulo}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{valor}</p>
        </div>
        <div
          className={`rounded-xl p-2.5 ${alerta ? "bg-amber-500/15 text-amber-600" : "bg-accent text-accent-foreground"}`}
        >
          <Icone className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
