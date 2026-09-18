import { FileSpreadsheet, FileText, Recycle, Scale, Trash2, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { GraficoEvolucao } from "@/components/charts/GraficoEvolucao";
import { GraficoComposicao } from "@/components/charts/GraficoComposicao";
import { GraficoBarrasSemanais } from "@/components/charts/GraficoBarrasSemanais";
import { GraficoComparacaoPeriodo } from "@/components/charts/GraficoComparacaoPeriodo";
import { GraficoMetaDesvio } from "@/components/charts/GraficoMetaDesvio";
import { GraficoEvolucaoDesvio } from "@/components/charts/GraficoEvolucaoDesvio";
import type { Indicadores, Pesagem } from "@/types/pesagem";
import { formatarKg, formatarPercentual } from "@/utils/formato";
import { hojeISO } from "@/utils/periodo";

interface Props {
  inicio: string;
  fim: string;
  setInicio: (value: string) => void;
  setFim: (value: string) => void;
  indicadores: Indicadores;
  anterior: Indicadores | undefined;
  pesagens: Pesagem[];
  meta: number;
  carregando: boolean;
  erro: boolean;
  carregandoAnterior: boolean;
  erroAnterior: boolean;
  exportando: "pdf" | "excel" | null;
  exportar: (tipo: "pdf" | "excel") => Promise<unknown>;
  tentarNovamente: () => void;
}

export function RelatorioDesktop(p: Props) {
  return (
    <div className="reports-desktop">
      <PageHeader
        titulo="Relatórios"
        descricao="Consolide os dados de geração de resíduos para o período desejado."
      />
      <div className="reports-filters surface-card">
        <div className="space-y-1.5">
          <Label htmlFor="inicio">Data inicial</Label>
          <Input
            id="inicio"
            type="date"
            max={hojeISO()}
            value={p.inicio}
            onChange={(e) => p.setInicio(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fim">Data final</Label>
          <Input
            id="fim"
            type="date"
            max={hojeISO()}
            value={p.fim}
            onChange={(e) => p.setFim(e.target.value)}
          />
        </div>
        <div className="reports-exports flex gap-2">
          <Button
            variant="outline"
            disabled={p.exportando !== null || p.carregando || p.erro}
            onClick={() => void p.exportar("pdf")}
          >
            <FileText className="h-4 w-4" />
            {p.exportando === "pdf" ? "Gerando..." : "PDF"}
          </Button>
          <Button
            variant="outline"
            disabled={p.exportando !== null || p.carregando || p.erro}
            onClick={() => void p.exportar("excel")}
          >
            <FileSpreadsheet className="h-4 w-4" />
            {p.exportando === "excel" ? "Gerando..." : "Excel"}
          </Button>
        </div>
      </div>
      {p.erro ? (
        <div role="alert" className="surface-card space-y-3 p-6">
          <p>Não foi possível carregar os dados do relatório.</p>
          <Button variant="outline" onClick={p.tentarNovamente}>
            Tentar novamente
          </Button>
        </div>
      ) : p.carregando ? (
        <div role="status" aria-label="Carregando relatório" className="grid grid-cols-2 gap-4">
          <Skeleton className="col-span-2 h-28" />
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      ) : (
        <>
          {!p.pesagens.length && (
            <p role="status" className="rounded-lg border p-4 text-sm text-muted-foreground">
              Não há pesagens no período selecionado.
            </p>
          )}
          <div className="reports-stats grid gap-4">
            <StatCard
              titulo="Total de resíduos"
              valor={formatarKg(p.indicadores.total)}
              icone={Scale}
            />
            <StatCard
              titulo="Total recuperado"
              valor={formatarKg(p.indicadores.recuperado)}
              icone={Recycle}
              tom="reciclavel"
            />
            <StatCard
              titulo="Enviado ao aterro"
              valor={formatarKg(p.indicadores.rejeitos)}
              icone={Trash2}
              tom="organico"
            />
            <StatCard
              titulo="Desvio do aterro"
              valor={formatarPercentual(p.indicadores.desvio)}
              icone={TrendingUp}
              tom="destaque"
            />
          </div>
          <dl className="reports-supplement surface-card grid grid-cols-2 gap-4 p-4">
            <div>
              <dt className="text-xs text-muted-foreground">Pesagens realizadas</dt>
              <dd className="font-semibold tabular-nums">{p.indicadores.registros}</dd>
            </div>
            <div className="border-l pl-4">
              <dt className="text-xs text-muted-foreground">Média diária de geração</dt>
              <dd className="break-words font-semibold tabular-nums">
                {formatarKg(p.indicadores.mediaDiaria)}
              </dd>
            </div>
          </dl>
          <div className="reports-primary-grid grid gap-4">
            <section className="surface-card min-w-0 p-5">
              <h2 className="mb-4 font-semibold">Evolução da geração de resíduos</h2>
              <GraficoEvolucao pesagens={p.pesagens} />
            </section>
            <section className="surface-card min-w-0 p-5">
              <h2 className="mb-4 font-semibold">Composição no período</h2>
              <GraficoComposicao indicadores={p.indicadores} />
            </section>
          </div>
          <div className="reports-secondary-grid grid gap-4">
            <section className="surface-card min-w-0 p-5">
              <h2 className="mb-4 font-semibold">Resíduos por semana</h2>
              <GraficoBarrasSemanais pesagens={p.pesagens} />
            </section>
            <section className="surface-card min-w-0 p-5">
              <h2 className="mb-4 font-semibold">Comparativo com período anterior</h2>
              {p.erroAnterior ? (
                <p role="alert" className="py-8 text-sm text-muted-foreground">
                  Não foi possível carregar o período anterior. O comparativo está indisponível.
                </p>
              ) : p.carregandoAnterior ? (
                <Skeleton aria-label="Carregando período anterior" className="h-64" />
              ) : (
                <GraficoComparacaoPeriodo
                  atual={p.indicadores}
                  {...(p.anterior ? { anterior: p.anterior } : {})}
                />
              )}
            </section>
          </div>
          <section className="reports-goal surface-card p-5">
            <h2 className="font-semibold">Meta de desvio do aterro</h2>
            <p className="mb-4 text-xs text-muted-foreground">Acompanhamento da meta no período.</p>
            <GraficoMetaDesvio realizado={p.indicadores.desvio} meta={p.meta} />
          </section>
          <section className="surface-card min-w-0 p-5">
            <h2 className="mb-4 font-semibold">Evolução da taxa de desvio</h2>
            <GraficoEvolucaoDesvio pesagens={p.pesagens} meta={p.meta} />
          </section>
        </>
      )}
    </div>
  );
}
