import { CheckCircle2, Target } from "lucide-react";

import { formatarPercentual } from "@/utils/formato";

export function GraficoMetaDesvio({ realizado, meta }: { realizado: number; meta: number }) {
  const valor = Math.min(Math.max(realizado, 0), 100);
  const atingida = realizado >= meta;

  return (
    <div className="flex h-[clamp(15rem,45vw,18.75rem)] flex-col justify-center gap-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Resultado do período</p>
          <p className="mt-1 text-4xl font-semibold tabular-nums text-primary">
            {formatarPercentual(realizado)}
          </p>
        </div>
        <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
          {atingida ? <CheckCircle2 className="h-6 w-6" /> : <Target className="h-6 w-6" />}
        </div>
      </div>

      <div>
        <div className="relative mb-2 h-5 text-xs">
          <span
            className="absolute -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-0.5 font-medium text-background"
            style={{ left: `clamp(2.5rem, ${meta}%, calc(100% - 2.5rem))` }}
          >
            Meta {meta}%
          </span>
        </div>
        <div
          className="relative h-5 overflow-hidden rounded-full bg-muted"
          role="img"
          aria-label={`Realizado ${formatarPercentual(realizado)}; meta ${meta}%`}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${valor}%` }}
          />
          <div
            className="absolute inset-y-0 w-0.5 bg-foreground"
            style={{ left: `calc(${meta}% - 1px)` }}
          />
        </div>
        <div className="relative mt-2 h-5 text-xs text-muted-foreground">
          <span>0%</span>
          <span className="absolute right-0">100%</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {atingida
          ? `Meta superada em ${formatarPercentual(realizado - meta)}.`
          : `Faltam ${formatarPercentual(meta - realizado)} para atingir a meta.`}
      </p>
    </div>
  );
}
