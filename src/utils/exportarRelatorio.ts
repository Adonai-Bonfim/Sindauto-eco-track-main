import type { Indicadores, Pesagem } from "@/types/pesagem";
import { desvioPesagem, totalPesagem } from "@/utils/calculos";
import { formatarData, formatarHorario, formatarKg, formatarPercentual } from "@/utils/formato";

interface DadosRelatorio {
  inicio: string;
  fim: string;
  indicadores: Indicadores;
  pesagens: Pesagem[];
}

function nomeArquivo(inicio: string, fim: string, extensao: string) {
  return `relatorio-residuos-${inicio}-a-${fim}.${extensao}`;
}

function baixar(blob: Blob, nome: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export async function exportarRelatorioPdf(dados: DadosRelatorio) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  const { inicio, fim, indicadores, pesagens } = dados;
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setFillColor(25, 92, 51);
  doc.rect(0, 0, 297, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Sindauto Lixo Zero", 14, 12);
  doc.setFontSize(10);
  doc.text(`Relatório de resíduos - ${formatarData(inicio)} a ${formatarData(fim)}`, 14, 20);
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(10);
  doc.text(
    [
      `Total: ${formatarKg(indicadores.total)}`,
      `Recicláveis: ${formatarKg(indicadores.reciclaveis)}`,
      `Orgânicos: ${formatarKg(indicadores.organicos)}`,
    ],
    14,
    38,
  );
  doc.text(
    [
      `Rejeitos: ${formatarKg(indicadores.rejeitos)}`,
      `Desvio do aterro: ${formatarPercentual(indicadores.desvio)}`,
      `Pesagens: ${indicadores.registros}`,
    ],
    105,
    38,
  );
  autoTable(doc, {
    startY: 57,
    head: [
      [
        "Data",
        "Horário",
        "Responsável",
        "Recicláveis",
        "Orgânicos",
        "Rejeitos",
        "Total",
        "Desvio",
        "Observações",
      ],
    ],
    body: pesagens.map((p) => [
      formatarData(p.data),
      formatarHorario(p.created_at),
      p.responsavel,
      formatarKg(p.reciclaveis),
      formatarKg(p.organicos),
      formatarKg(p.rejeitos),
      formatarKg(totalPesagem(p)),
      formatarPercentual(desvioPesagem(p)),
      p.observacoes ?? "",
    ]),
    theme: "striped",
    headStyles: { fillColor: "#27864b", textColor: "#ffffff", fontStyle: "bold" },
    styles: { fontSize: 7.5, cellPadding: 2, overflow: "linebreak" },
    columnStyles: { 2: { cellWidth: 30 }, 8: { cellWidth: 48 } },
    didDrawPage: ({ pageNumber }) => {
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(`Página ${pageNumber}`, 278, 202);
    },
  });
  doc.save(nomeArquivo(inicio, fim, "pdf"));
}

export async function exportarRelatorioExcel(dadosRelatorio: DadosRelatorio) {
  const { default: writeXlsxFile } = await import("write-excel-file/browser");
  const { inicio, fim, indicadores, pesagens } = dadosRelatorio;
  const cabecalho = {
    fontWeight: "bold" as const,
    color: "#ffffff",
    backgroundColor: "#27864b",
    align: "center" as const,
  };
  const resumo = [
    [{ value: "Sindauto Lixo Zero - Relatório de Resíduos", span: 2, ...cabecalho }],
    [
      { value: "Período", fontWeight: "bold" as const },
      { value: `${formatarData(inicio)} a ${formatarData(fim)}` },
    ],
    [
      { value: "Total de resíduos (kg)", fontWeight: "bold" as const },
      { value: indicadores.total, type: Number, format: "#,##0.000" },
    ],
    [
      { value: "Recicláveis (kg)", fontWeight: "bold" as const },
      { value: indicadores.reciclaveis, type: Number, format: "#,##0.000" },
    ],
    [
      { value: "Orgânicos (kg)", fontWeight: "bold" as const },
      { value: indicadores.organicos, type: Number, format: "#,##0.000" },
    ],
    [
      { value: "Rejeitos (kg)", fontWeight: "bold" as const },
      { value: indicadores.rejeitos, type: Number, format: "#,##0.000" },
    ],
    [
      { value: "Taxa de desvio", fontWeight: "bold" as const },
      { value: indicadores.desvio / 100, type: Number, format: "0.0%" },
    ],
    [
      { value: "Média diária (kg)", fontWeight: "bold" as const },
      { value: indicadores.mediaDiaria, type: Number, format: "#,##0.000" },
    ],
    [
      { value: "Pesagens realizadas", fontWeight: "bold" as const },
      { value: indicadores.registros, type: Number, format: "0" },
    ],
  ];
  const nomesColunas = [
    "Data",
    "Horário",
    "Responsável",
    "Recicláveis (kg)",
    "Orgânicos (kg)",
    "Rejeitos (kg)",
    "Total (kg)",
    "Desvio",
    "Observações",
  ];
  const planilha = [
    nomesColunas.map((value) => ({ value, ...cabecalho })),
    ...pesagens.map((p) => [
      { value: formatarData(p.data) },
      { value: formatarHorario(p.created_at) },
      { value: p.responsavel },
      { value: p.reciclaveis, type: Number, format: "#,##0.000", color: "#27864b" },
      { value: p.organicos, type: Number, format: "#,##0.000", color: "#795334" },
      { value: p.rejeitos, type: Number, format: "#,##0.000", color: "#6b7280" },
      { value: totalPesagem(p), type: Number, format: "#,##0.000" },
      { value: desvioPesagem(p) / 100, type: Number, format: "0.0%" },
      { value: p.observacoes ?? "", wrap: true },
    ]),
  ];
  await writeXlsxFile([resumo, planilha], {
    sheets: ["Resumo", "Pesagens"],
    columns: [
      [{ width: 28 }, { width: 24 }],
      [
        { width: 13 },
        { width: 11 },
        { width: 24 },
        { width: 18 },
        { width: 16 },
        { width: 15 },
        { width: 14 },
        { width: 12 },
        { width: 48 },
      ],
    ],
    fileName: nomeArquivo(inicio, fim, "xlsx"),
  });
}
