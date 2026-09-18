import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownUp, Search, ClipboardList, Scale, Recycle, Percent } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatarKg, formatarPercentual } from "@/utils/formato";
import { podeEditarAgora } from "@/utils/permissoesPesagem";

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
import { useAuth } from "@/hooks/useAuth";
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
  const { admin } = useAuth();
  const mobile = useIsMobile();

  const [visualizando, setVisualizando] = useState<Pesagem | null>(null);
  const [editando, setEditando] = useState<Pesagem | null>(null);
  const [excluindo, setExcluindo] = useState<Pesagem | null>(null);
  const [agora, setAgora] = useState(() => Date.now());

  const proximoBloqueio = useMemo(
    () =>
      historico.visiveis
        .filter((pesagem) => pesagem.podeEditar && pesagem.editavelAte)
        .map((pesagem) => Date.parse(pesagem.editavelAte!))
        .filter((limite) => Number.isFinite(limite) && limite > agora)
        .sort((a, b) => a - b)[0],
    [agora, historico.visiveis],
  );

  useEffect(() => {
    if (admin || !proximoBloqueio) return;
    const temporizador = window.setTimeout(
      () => {
        setAgora(Date.now());
        setEditando(null);
      },
      Math.max(0, proximoBloqueio - Date.now() + 50),
    );
    return () => window.clearTimeout(temporizador);
  }, [admin, proximoBloqueio]);

  return (
    <div className="history-page">
      <PageHeader
        titulo="Histórico de Pesagens"
        descricao="Todos os registros de pesagem realizados no período."
      />

      <div className="history-filters surface-card mb-6 space-y-5 p-5">
        <FiltroPeriodo
          periodo={historico.periodo}
          onChange={historico.setPeriodo}
          compacto={mobile}
        />
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <div className="relative min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Pesquisar por data ou observação"
              placeholder="Pesquisar por data ou observação"
              value={historico.busca}
              onChange={(e) => historico.setBusca(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={historico.alternarOrdem}
            className="shrink-0"
            aria-label={
              historico.ordemDesc
                ? "Ordenação: mais recentes. Mostrar mais antigas"
                : "Ordenação: mais antigas. Mostrar mais recentes"
            }
          >
            <ArrowDownUp className="h-4 w-4" />
            <span className="hidden sm:inline">
              {historico.ordemDesc ? "Mais recentes" : "Mais antigas"}
            </span>
          </Button>
        </div>
      </div>

      <div className="history-overview mb-4">
        {historico.isLoading ? (
          <div className="history-stats-loading grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          !historico.isError && (
            <div className="history-stats dashboard-stats grid grid-cols-2 gap-3">
              <StatCard
                titulo="Registros encontrados"
                valor={String(historico.indicadores.registros)}
                icone={ClipboardList}
              />
              <StatCard
                titulo="Total registrado"
                valor={formatarKg(historico.indicadores.total)}
                icone={Scale}
              />
              <StatCard
                titulo="Recuperados"
                valor={formatarKg(historico.indicadores.recuperado)}
                icone={Recycle}
                tom="reciclavel"
              />
              <StatCard
                titulo="Desvio do aterro"
                valor={formatarPercentual(historico.indicadores.desvio)}
                icone={Percent}
                tom="destaque"
              />
            </div>
          )
        )}
        <h2 className="mt-4 font-semibold md:hidden">
          Registros {historico.ordemDesc ? "recentes" : "mais antigos"}
        </h2>
      </div>
      <div className="history-results surface-card overflow-hidden">
        {historico.isError ? (
          <div role="alert" className="space-y-3 p-4">
            <p className="text-sm">Não foi possível carregar as pesagens.</p>
            <Button variant="outline" onClick={() => void historico.refetch()}>
              Tentar novamente
            </Button>
          </div>
        ) : historico.isLoading ? (
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
            cartoesMobile
            pesagens={historico.visiveis}
            agora={agora}
            podeEditarTudo={admin}
            onVisualizar={setVisualizando}
            onEditar={(pesagem) => {
              if (!admin && !podeEditarAgora(pesagem, Date.now())) return;
              setEditando(pesagem);
            }}
            {...(admin ? { onExcluir: setExcluindo } : {})}
          />
        )}
      </div>

      {historico.exibePaginacao && (
        <div className="history-pagination mt-4 flex items-center justify-between gap-3">
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
      {admin && <ExcluirPesagemDialog pesagem={excluindo} onFechar={() => setExcluindo(null)} />}
    </div>
  );
}
