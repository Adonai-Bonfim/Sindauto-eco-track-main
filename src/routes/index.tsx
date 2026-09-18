import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Leaf, Plus, Recycle, Scale, Trash2 } from "lucide-react";

import { GraficoComposicao } from "@/components/charts/GraficoComposicao";
import { GraficoBarrasSemanais } from "@/components/charts/GraficoBarrasSemanais";
import { GraficoComparacaoPeriodo } from "@/components/charts/GraficoComparacaoPeriodo";
import { GraficoEvolucao } from "@/components/charts/GraficoEvolucao";
import { GraficoEvolucaoDesvio } from "@/components/charts/GraficoEvolucaoDesvio";
import { GraficoMetaDesvio } from "@/components/charts/GraficoMetaDesvio";
import { IndicadorDesvio } from "@/components/charts/IndicadorDesvio";
import { FiltroPeriodo } from "@/components/dashboard/FiltroPeriodo";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePesagens } from "@/hooks/usePesagens";
import { useMetaDesvio } from "@/hooks/useMetaDesvio";
import { calcularIndicadores } from "@/utils/calculos";
import { formatarKg } from "@/utils/formato";
import { intervaloAnterior, periodoDoPreset } from "@/utils/periodo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Sindauto Lixo Zero" },
      {
        name: "description",
        content:
          "Painel de indicadores da pesagem diária de resíduos do Sindauto Bahia: total gerado, recicláveis, orgânicos, rejeitos e taxa de desvio do aterro.",
      },
      { property: "og:title", content: "Dashboard | Sindauto Lixo Zero" },
      {
        property: "og:description",
        content: "Gestão e monitoramento de resíduos do Sindauto Bahia.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { meta: metaDesvio } = useMetaDesvio();
  const [periodo, setPeriodo] = useState(() => periodoDoPreset("mes"));
  const { data: pesagens, isLoading } = usePesagens({
    inicio: periodo.inicio,
    fim: periodo.fim,
  });
  const anterior = useMemo(
    () => intervaloAnterior(periodo.inicio, periodo.fim),
    [periodo.inicio, periodo.fim],
  );
  const { data: pesagensAnteriores } = usePesagens(anterior);

  const indicadores = useMemo(() => calcularIndicadores(pesagens ?? []), [pesagens]);
  const indicadoresAnteriores = useMemo(
    () => (anterior ? calcularIndicadores(pesagensAnteriores ?? []) : undefined),
    [anterior, pesagensAnteriores],
  );

  return (
    <>
      <PageHeader
        className="dashboard-header"
        titulo="Dashboard"
        descricao="Visão geral da geração de resíduos"
        acoes={
          <div className="dashboard-actions flex min-w-0 flex-wrap items-center gap-3">
            <FiltroPeriodo periodo={periodo} onChange={setPeriodo} compacto />
            <Button
              asChild
              size="lg"
              className="shadow-[var(--shadow-float)] transition-all duration-300 ease-[var(--ease-premium)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Link to="/registrar">
                <Plus className="h-4 w-4" />
                Registrar pesagem
              </Link>
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="dashboard-stats grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="stagger dashboard-stats grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            titulo="Total de resíduos"
            valor={formatarKg(indicadores.total)}
            descricao={`${indicadores.registros} pesagem(ns) no período`}
            icone={Scale}
          />
          <StatCard
            titulo="Recicláveis"
            valor={formatarKg(indicadores.reciclaveis)}
            icone={Recycle}
            tom="reciclavel"
          />
          <StatCard
            titulo="Orgânicos"
            valor={formatarKg(indicadores.organicos)}
            icone={Leaf}
            tom="organico"
          />
          <StatCard
            titulo="Rejeitos"
            valor={formatarKg(indicadores.rejeitos)}
            descricao="Enviado ao aterro"
            icone={Trash2}
            tom="rejeito"
          />
        </div>
      )}

      <div className="dashboard-panels mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
        <section className="surface-card min-w-0 p-5 sm:p-6">
          <h2 className="font-semibold">Evolução da geração de resíduos</h2>
          <p className="mb-6 text-sm text-muted-foreground">Quantidade em kg por dia.</p>
          <GraficoEvolucao pesagens={pesagens ?? []} />
        </section>

        <section className="surface-card min-w-0 p-5 sm:p-6">
          <h2 className="font-semibold">Desvio do aterro</h2>
          <p className="mb-6 text-sm text-muted-foreground">Resíduos recuperados no período.</p>
          <IndicadorDesvio
            desvio={indicadores.desvio}
            recuperado={indicadores.recuperado}
            total={indicadores.total}
            meta={metaDesvio}
          />
        </section>

        <section className="surface-card min-w-0 p-5 sm:p-6">
          <p className="eyebrow mb-2">Volume semanal</p>
          <h2 className="font-semibold">Resíduos por semana</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Barras empilhadas por categoria, com semanas iniciando na segunda-feira.
          </p>
          <GraficoBarrasSemanais pesagens={pesagens ?? []} />
        </section>

        <section className="surface-card min-w-0 p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <span className="text-sm font-semibold text-primary">Visão geral · Composição</span>
            <Link
              to="/relatorios"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Ver relatório completo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <h2 className="font-semibold">Composição dos resíduos</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Proporção entre recicláveis, orgânicos e rejeitos.
          </p>
          <GraficoComposicao indicadores={indicadores} />
        </section>

        <section className="surface-card min-w-0 p-5 sm:p-6">
          <p className="eyebrow mb-2">Tendência</p>
          <h2 className="font-semibold">Evolução da taxa de desvio</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Percentual diário recuperado, com referência da meta de {metaDesvio}%.
          </p>
          <GraficoEvolucaoDesvio pesagens={pesagens ?? []} meta={metaDesvio} />
        </section>

        <section className="surface-card min-w-0 p-5 sm:p-6">
          <p className="eyebrow mb-2">Objetivo operacional</p>
          <h2 className="font-semibold">Meta versus realizado</h2>
          <p className="mb-6 text-sm text-muted-foreground">Meta de desvio do aterro no período.</p>
          <GraficoMetaDesvio realizado={indicadores.desvio} meta={metaDesvio} />
        </section>

        <section className="surface-card min-w-0 p-5 sm:p-6">
          <p className="eyebrow mb-2">Comparativo</p>
          <h2 className="font-semibold">Atual versus anterior</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Mesmo número de dias imediatamente anteriores ao período selecionado.
          </p>
          <GraficoComparacaoPeriodo atual={indicadores} anterior={indicadoresAnteriores} />
        </section>
      </div>
    </>
  );
}
