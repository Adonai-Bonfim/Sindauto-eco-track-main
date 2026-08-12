import { formatarKg, formatarPercentual } from "@/utils/formato";

interface Props {
  desvio: number;
  recuperado: number;
  total: number;
}

export function IndicadorDesvio({ desvio, recuperado, total }: Props) {
  const pct = Math.min(Math.max(desvio, 0), 100);

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div
        className="relative grid h-44 w-44 place-items-center rounded-full"
        style={{
          background: `conic-gradient(var(--primary) ${pct * 3.6}deg, var(--muted) 0deg)`,
        }}
      >
        <div className="grid h-32 w-32 place-items-center rounded-full bg-card">
          <div className="text-center">
            <p className="text-3xl font-semibold tabular-nums text-primary">
              {formatarPercentual(desvio)}
            </p>
            <p className="text-xs text-muted-foreground">desviado</p>
          </div>
        </div>
      </div>
      <p className="max-w-xs text-center text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{formatarPercentual(desvio)}</span> dos
        resíduos foram desviados do aterro — {formatarKg(recuperado)} de {formatarKg(total)}.
      </p>
    </div>
  );
}
