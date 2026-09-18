import { formatarKg, formatarPercentual } from "@/utils/formato";

interface Props {
  desvio: number;
  recuperado: number;
  total: number;
  meta?: number;
}

export function IndicadorDesvio({ desvio, recuperado, total, meta }: Props) {
  const pct = Math.min(Math.max(desvio, 0), 100);

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6">
        <div
          className="relative grid h-44 w-44 shrink-0 place-items-center rounded-full"
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
        {meta !== undefined && (
          <div className="border-l pl-6">
            <p className="text-sm text-muted-foreground">Meta</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{formatarPercentual(meta)}</p>
            <div
              className="mt-3 h-2 w-28 overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={`Desvio atual: ${formatarPercentual(desvio)}; meta: ${formatarPercentual(meta)}`}
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Desvio: {formatarPercentual(desvio)}
            </p>
          </div>
        )}
      </div>
      <p className="w-full rounded-xl bg-accent/60 p-4 text-center text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{formatarPercentual(desvio)}</span> dos
        resíduos foram desviados do aterro — {formatarKg(recuperado)} de {formatarKg(total)}.
      </p>
    </div>
  );
}
