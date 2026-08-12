import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownUp, Search } from "lucide-react";

import { FiltroPeriodo } from "@/components/dashboard/FiltroPeriodo";
import { PageHeader } from "@/components/layout/AppLayout";
import { DetalhesPesagemDialog } from "@/components/pesagem/DetalhesPesagemDialog";
import { EditarPesagemDialog } from "@/components/pesagem/EditarPesagemDialog";
import { ExcluirPesagemDialog } from "@/components/pesagem/ExcluirPesagemDialog";
import { TabelaPesagens } from "@/components/pesagem/TabelaPesagens";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useHistoricoPesagens } from "@/hooks/useHistoricoPesagens";
import type { Pesagem } from "@/types/pesagem";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico de Pesagens | Sindauto Lixo Zero" },
      {
        name: "description",
        content:
          "Consulte, edite e exclua os registros de pesagem de resíduos com busca, filtro por período e ordenação por data.",
      },
      { property: "og:title", content: "Histórico de Pesagens | Sindauto Lixo Zero" },
      {
        property: "og:description",
        content: "Todos os registros de pesagem de resíduos do Sindauto Bahia.",
      },
    ],
  }),
  component: Historico,
});

function Historico() {
  const historico = useHistoricoPesagens();

  const [visualizando, setVisualizando] = useState<Pesagem | null>(null);
  const [editando, setEditando] = useState<Pesagem | null>(null);
  const [excluindo, setExcluindo] = useState<Pesagem | null>(null);

  return (
    <>
      <PageHeader
        titulo="Histórico"
        descricao="Todos os registros de pesagem realizados no período."
      />

      <div className="surface-card mb-6 space-y-5 p-5">
        <FiltroPeriodo periodo={historico.periodo} onChange={historico.setPeriodo} />
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por data ou observação"
              value={historico.busca}
              onChange={(e) => historico.setBusca(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" onClick={historico.alternarOrdem} className="shrink-0">
            <ArrowDownUp className="h-4 w-4" />
            <span className="hidden sm:inline">
              {historico.ordemDesc ? "Mais recentes" : "Mais antigas"}
            </span>
          </Button>
        </div>
      </div>

      <div className="surface-card overflow-hidden">
        {historico.isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : historico.visiveis.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            Nenhuma pesagem encontrada para os filtros selecionados.
          </p>
        ) : (
          <TabelaPesagens
            pesagens={historico.visiveis}
            onVisualizar={setVisualizando}
            onEditar={setEditando}
            onExcluir={setExcluindo}
          />
        )}
      </div>

      {historico.exibePaginacao && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Página {historico.paginaAtual} de {historico.totalPaginas} · {historico.totalFiltradas}{" "}
            registros
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={historico.paginaAtual === 1}
              onClick={() => historico.irParaPagina(historico.paginaAtual - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={historico.paginaAtual === historico.totalPaginas}
              onClick={() => historico.irParaPagina(historico.paginaAtual + 1)}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      <DetalhesPesagemDialog pesagem={visualizando} onFechar={() => setVisualizando(null)} />
      <EditarPesagemDialog pesagem={editando} onFechar={() => setEditando(null)} />
      <ExcluirPesagemDialog pesagem={excluindo} onFechar={() => setExcluindo(null)} />
    </>
  );
}
