import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { EstadoVazio } from "@/components/charts/EstadoVazio";
import { ALTURA_GRAFICO, ESTILO_TOOLTIP } from "@/components/charts/estilos";
import { CATEGORIAS_COM_ROTULO } from "@/constants/residuos";
import type { Indicadores } from "@/types/pesagem";
import { formatarKg } from "@/utils/formato";

export function GraficoComposicao({ indicadores }: { indicadores: Indicadores }) {
  const dados = CATEGORIAS_COM_ROTULO.map(({ categoria, rotulo, token }) => ({
    nome: rotulo,
    valor: indicadores[categoria],
    cor: `var(--${token})`,
  })).filter((d) => d.valor > 0);

  if (dados.length === 0) return <EstadoVazio />;

  return (
    <div className={ALTURA_GRAFICO}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dados}
            dataKey="valor"
            nameKey="nome"
            innerRadius={68}
            outerRadius={104}
            paddingAngle={2}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {dados.map((d) => (
              <Cell key={d.nome} fill={d.cor} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={ESTILO_TOOLTIP}
            formatter={(v: number, n: string) => [formatarKg(v), n]}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
