import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Periodo, PeriodoPreset } from "@/types/pesagem";
import { PRESETS, periodoDoPreset } from "@/utils/periodo";

interface Props {
  periodo: Periodo;
  onChange: (periodo: Periodo) => void;
}

export function FiltroPeriodo({ periodo, onChange }: Props) {
  const selecionarPreset = (preset: PeriodoPreset) => onChange(periodoDoPreset(preset, periodo));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.valor}
            type="button"
            onClick={() => selecionarPreset(p.valor)}
            aria-pressed={periodo.preset === p.valor}
            className={cn(
              "min-h-11 rounded-full border px-4 py-2 text-[0.8125rem] font-medium tracking-tight sm:min-h-9",
              "transition-all duration-300 ease-[var(--ease-premium)] active:scale-[0.97]",
              periodo.preset === p.valor
                ? "border-primary/70 bg-primary text-primary-foreground shadow-[var(--shadow-float)]"
                : "border-border bg-card/70 text-muted-foreground hover:-translate-y-0.5 hover:border-primary/30 hover:bg-accent hover:text-accent-foreground",
            )}
          >
            {p.rotulo}
          </button>
        ))}
      </div>

      {periodo.preset === "personalizado" && (
        <div className="grid gap-3 sm:grid-cols-2 sm:max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="periodo-inicio" className="text-xs">
              Data inicial
            </Label>
            <Input
              id="periodo-inicio"
              type="date"
              value={periodo.inicio}
              onChange={(e) => onChange({ ...periodo, inicio: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="periodo-fim" className="text-xs">
              Data final
            </Label>
            <Input
              id="periodo-fim"
              type="date"
              value={periodo.fim}
              onChange={(e) => onChange({ ...periodo, fim: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
