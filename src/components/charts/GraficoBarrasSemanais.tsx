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

import { EstadoVazio } from "@/components/charts/EstadoVazio";
import { ALTURA_GRAFICO, ESTILO_TOOLTIP } from "@/components/charts/estilos";
import { CATEGORIAS_COM_ROTULO } from "@/constants/residuos";
import type { Pesagem } from "@/types/pesagem";
import { serieSemanal } from "@/utils/calculos";
import { formatarDataCurta, formatarKg } from "@/utils/formato";

export function GraficoBarrasSemanais({ pesagens }: { pesagens: Pesagem[] }) {
  const dados = serieSemanal(pesagens);
  if (dados.length === 0) return <EstadoVazio />;

  return (
    <div className={ALTURA_GRAFICO}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="inicio"
            tickFormatter={formatarDataCurta}
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
            labelFormatter={(v: string) => `Semana de ${formatarDataCurta(v)}`}
            formatter={(v: number, n: string) => [formatarKg(v), n]}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {CATEGORIAS_COM_ROTULO.map(({ categoria, rotulo, token }, indice) => (
            <Bar
              key={categoria}
              dataKey={categoria}
              name={rotulo}
              stackId="residuos"
              fill={`var(--${token})`}
              radius={indice === CATEGORIAS_COM_ROTULO.length - 1 ? [5, 5, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
