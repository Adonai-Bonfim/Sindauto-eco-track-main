import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { RelatorioDesktop } from "@/components/dashboard/RelatorioDesktop";

import { usePesagens } from "@/hooks/usePesagens";
import { useMetaDesvio } from "@/hooks/useMetaDesvio";
import { calcularIndicadores } from "@/utils/calculos";
import { exportarRelatorioExcel, exportarRelatorioPdf } from "@/utils/exportarRelatorio";
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
  const { data, isFetching, isError, refetch } = usePesagens(intervalo);
  const anterior = useMemo(
    () => intervaloAnterior(intervalo.inicio, intervalo.fim),
    [intervalo.inicio, intervalo.fim],
  );
  const {
    data: dadosAnteriores,
    isFetching: carregandoAnterior,
    isError: erroAnterior,
  } = usePesagens(anterior);
  const indicadores = useMemo(() => calcularIndicadores(data ?? []), [data]);
  const indicadoresAnteriores = useMemo(
    () => (anterior ? calcularIndicadores(dadosAnteriores ?? []) : undefined),
    [anterior, dadosAnteriores],
  );

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
    <RelatorioDesktop
      inicio={inicio}
      fim={fim}
      setInicio={setInicio}
      setFim={setFim}
      indicadores={indicadores}
      anterior={indicadoresAnteriores}
      pesagens={data ?? []}
      meta={metaDesvio}
      carregando={isFetching}
      erro={isError}
      carregandoAnterior={Boolean(anterior) && carregandoAnterior}
      erroAnterior={Boolean(anterior) && erroAnterior}
      exportando={exportando}
      exportar={exportar}
      tentarNovamente={() => {
        void refetch();
      }}
    />
  );
}
