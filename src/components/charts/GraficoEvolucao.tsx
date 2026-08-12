import {
  Area,
  AreaChart,
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
import { serieDiaria } from "@/utils/calculos";
import { formatarDataCurta, formatarKg } from "@/utils/formato";

export function GraficoEvolucao({ pesagens }: { pesagens: Pesagem[] }) {
  const dados = serieDiaria(pesagens);

  if (dados.length === 0) {
    return <EstadoVazio />;
  }

  return (
    <div className={ALTURA_GRAFICO}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={dados} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            {CATEGORIAS_COM_ROTULO.map(({ token }) => (
              <linearGradient key={token} id={`grad-${token}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`var(--${token})`} stopOpacity={0.28} />
                <stop offset="100%" stopColor={`var(--${token})`} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
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
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            contentStyle={ESTILO_TOOLTIP}
            labelFormatter={(v: string) => formatarDataCurta(v)}
            formatter={(v: number, n: string) => [formatarKg(v), n]}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          {CATEGORIAS_COM_ROTULO.map(({ categoria, rotulo, token }) => (
            <Area
              key={categoria}
              type="monotone"
              dataKey={categoria}
              name={rotulo}
              stroke={`var(--${token})`}
              fill={`url(#grad-${token})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
