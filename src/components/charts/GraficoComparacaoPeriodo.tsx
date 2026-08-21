import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ALTURA_GRAFICO, ESTILO_TOOLTIP } from "@/components/charts/estilos";
import type { Indicadores } from "@/types/pesagem";
import { formatarKg } from "@/utils/formato";

interface Props {
  atual: Indicadores;
  anterior?: Indicadores;
}

export function GraficoComparacaoPeriodo({ atual, anterior }: Props) {
  if (!anterior) {
    return (
      <div className={`${ALTURA_GRAFICO} grid place-items-center`}>
        <p className="max-w-xs text-center text-sm text-muted-foreground">
          Selecione um período com datas definidas para comparar com o intervalo anterior.
        </p>
      </div>
    );
  }

  const dados = [
    { nome: "Total", atual: atual.total, anterior: anterior.total },
    { nome: "Recuperados", atual: atual.recuperado, anterior: anterior.recuperado },
    { nome: "Rejeitos", atual: atual.rejeitos, anterior: anterior.rejeitos },
  ];

  return (
    <div className={ALTURA_GRAFICO}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="nome"
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            contentStyle={ESTILO_TOOLTIP}
            formatter={(v: number, n: string) => [formatarKg(v), n]}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar
            dataKey="anterior"
            name="Período anterior"
            fill="var(--comparativo-anterior)"
            radius={[5, 5, 0, 0]}
          />
          <Bar
            dataKey="atual"
            name="Período atual"
            fill="var(--comparativo-atual)"
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
