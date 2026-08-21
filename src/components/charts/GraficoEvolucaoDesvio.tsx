import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EstadoVazio } from "@/components/charts/EstadoVazio";
import { ALTURA_GRAFICO, ESTILO_TOOLTIP } from "@/components/charts/estilos";
import type { Pesagem } from "@/types/pesagem";
import { serieDesvioDiario } from "@/utils/calculos";
import { formatarDataCurta, formatarPercentual } from "@/utils/formato";

export function GraficoEvolucaoDesvio({ pesagens, meta }: { pesagens: Pesagem[]; meta: number }) {
  const dados = serieDesvioDiario(pesagens);
  if (dados.length === 0) return <EstadoVazio />;

  return (
    <div className={ALTURA_GRAFICO}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dados} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="data"
            tickFormatter={formatarDataCurta}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            contentStyle={ESTILO_TOOLTIP}
            labelFormatter={(v: string) => formatarDataCurta(v)}
            formatter={(v: number) => [formatarPercentual(v), "Desvio"]}
          />
          <ReferenceLine
            y={meta}
            stroke="var(--organico)"
            strokeDasharray="5 5"
            label={{ value: `Meta ${meta}%`, fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <Line
            type="monotone"
            dataKey="desvio"
            name="Desvio"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={{ r: 2, fill: "var(--primary)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
