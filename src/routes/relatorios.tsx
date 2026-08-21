import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";

import { GraficoComposicao } from "@/components/charts/GraficoComposicao";
import { GraficoBarrasSemanais } from "@/components/charts/GraficoBarrasSemanais";
import { GraficoComparacaoPeriodo } from "@/components/charts/GraficoComparacaoPeriodo";
import { GraficoEvolucao } from "@/components/charts/GraficoEvolucao";
import { GraficoEvolucaoDesvio } from "@/components/charts/GraficoEvolucaoDesvio";
import { GraficoMetaDesvio } from "@/components/charts/GraficoMetaDesvio";
import { PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePesagens } from "@/hooks/usePesagens";
import { useMetaDesvio } from "@/hooks/useMetaDesvio";
import { calcularIndicadores } from "@/utils/calculos";
import { exportarRelatorioExcel, exportarRelatorioPdf } from "@/utils/exportarRelatorio";
import { formatarData } from "@/utils/formato";
import { linhasResumoPeriodo } from "@/utils/relatorio";
import { hojeISO, intervaloAnterior } from "@/utils/periodo";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios | Sindauto Lixo Zero" },
      {
        name: "description",
        content:
          "Relatórios por período com totais de resíduos, taxa média de desvio do aterro e média diária de geração.",
      },
      { property: "og:title", content: "Relatórios | Sindauto Lixo Zero" },
      {
        property: "og:description",
        content: "Análise consolidada da geração de resíduos por período.",
      },
    ],
  }),
  component: Relatorios,
});

function primeiroDiaDoMes() {
  return `${hojeISO().slice(0, 7)}-01`;
}

function Relatorios() {
  const { meta: metaDesvio } = useMetaDesvio();
  const [inicio, setInicio] = useState(primeiroDiaDoMes);
  const [fim, setFim] = useState(hojeISO);
  const [exportando, setExportando] = useState<"pdf" | "excel" | null>(null);

  // Intervalo normalizado: datas invertidas retornariam lista vazia silenciosamente.
  const intervalo = useMemo(
    () => (inicio && fim && inicio > fim ? { inicio: fim, fim: inicio } : { inicio, fim }),
    [inicio, fim],
  );
  const { data } = usePesagens(intervalo);
  const anterior = useMemo(
    () => intervaloAnterior(intervalo.inicio, intervalo.fim),
    [intervalo.inicio, intervalo.fim],
  );
  const { data: dadosAnteriores } = usePesagens(anterior);
  const indicadores = useMemo(() => calcularIndicadores(data ?? []), [data]);
  const indicadoresAnteriores = useMemo(
    () => (anterior ? calcularIndicadores(dadosAnteriores ?? []) : undefined),
    [anterior, dadosAnteriores],
  );

  const linhas = linhasResumoPeriodo(indicadores);
  const dadosRelatorio = {
    inicio: intervalo.inicio,
    fim: intervalo.fim,
    indicadores,
    pesagens: data ?? [],
  };

  async function exportar(tipo: "pdf" | "excel") {
    if (!data?.length) return toast.error("Não há pesagens no período selecionado.");
    setExportando(tipo);
    try {
      if (tipo === "pdf") await exportarRelatorioPdf(dadosRelatorio);
      else await exportarRelatorioExcel(dadosRelatorio);
      toast.success(`Relatório ${tipo === "pdf" ? "PDF" : "Excel"} baixado com sucesso.`);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível gerar o relatório.");
    } finally {
      setExportando(null);
    }
  }

  return (
    <>
      <PageHeader
        titulo="Relatórios"
        descricao="Consolide os dados de geração de resíduos para o período desejado."
        acoes={
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={exportando !== null}
              onClick={() => void exportar("pdf")}
            >
              <FileText className="h-4 w-4" />
              {exportando === "pdf" ? "Gerando..." : "PDF"}
            </Button>
            <Button
              variant="outline"
              disabled={exportando !== null}
              onClick={() => void exportar("excel")}
            >
              <FileSpreadsheet className="h-4 w-4" />
              {exportando === "excel" ? "Gerando..." : "Excel"}
            </Button>
          </div>
        }
      />

      <div className="surface-card mb-6 grid gap-4 p-5 sm:max-w-lg sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="inicio" className="text-xs">
            Data inicial
          </Label>
          <Input
            id="inicio"
            type="date"
            max={hojeISO()}
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="fim" className="text-xs">
            Data final
          </Label>
          <Input
            id="fim"
            type="date"
            max={hojeISO()}
            value={fim}
            onChange={(e) => setFim(e.target.value)}
          />
        </div>
      </div>

      <section className="surface-card p-6">
        <h2 className="text-base font-semibold">
          Resumo de {formatarData(intervalo.inicio)} a {formatarData(intervalo.fim)}
        </h2>
        <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {linhas.map(({ rotulo, valor }) => (
            <div
              key={rotulo}
              className="flex items-baseline justify-between gap-4 border-b border-border pb-3"
            >
              <dt className="text-sm text-muted-foreground">{rotulo}</dt>
              <dd className="text-base font-semibold tabular-nums">{valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-6">
          <h2 className="mb-4 text-base font-semibold">Evolução no período</h2>
          <GraficoEvolucao pesagens={data ?? []} />
        </section>
        <section className="surface-card p-6">
          <h2 className="mb-4 text-base font-semibold">Composição no período</h2>
          <GraficoComposicao indicadores={indicadores} />
        </section>
      </div>

      <div className="stagger mt-6 grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-6">
          <h2 className="text-base font-semibold">Resíduos por semana</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Volume semanal empilhado por categoria.
          </p>
          <GraficoBarrasSemanais pesagens={data ?? []} />
        </section>

        <section className="surface-card p-6">
          <h2 className="text-base font-semibold">Atual versus anterior</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Comparação com o intervalo imediatamente anterior de mesma duração.
          </p>
          <GraficoComparacaoPeriodo atual={indicadores} anterior={indicadoresAnteriores} />
        </section>

        <section className="surface-card p-6">
          <h2 className="text-base font-semibold">Evolução da taxa de desvio</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Resultado diário e linha da meta definida em {metaDesvio}%.
          </p>
          <GraficoEvolucaoDesvio pesagens={data ?? []} meta={metaDesvio} />
        </section>

        <section className="surface-card p-6">
          <h2 className="text-base font-semibold">Meta versus realizado</h2>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            Acompanhamento da meta de desvio do aterro.
          </p>
          <GraficoMetaDesvio realizado={indicadores.desvio} meta={metaDesvio} />
        </section>
      </div>
    </>
  );
}
