import { useId, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Periodo, PeriodoPreset } from "@/types/pesagem";
import { PRESETS, periodoDoPreset } from "@/utils/periodo";

interface Props {
  periodo: Periodo;
  onChange: (periodo: Periodo) => void;
  compacto?: boolean;
}

export function FiltroPeriodo({ periodo, onChange, compacto = false }: Props) {
  if (compacto) return <FiltroPeriodoCompacto periodo={periodo} onChange={onChange} />;
  return <FiltroPeriodoCompleto periodo={periodo} onChange={onChange} />;
}

function FiltroPeriodoCompleto({ periodo, onChange }: Props) {
  const selecionarPreset = (preset: PeriodoPreset) => onChange(periodoDoPreset(preset, periodo));

  const botaoPreset = (p: (typeof PRESETS)[number]) => (
    <button
      key={p.valor}
      type="button"
      onClick={() => selecionarPreset(p.valor)}
      aria-pressed={periodo.preset === p.valor}
      className={cn(
        "min-h-11 rounded-md border px-3 py-2 text-[0.8125rem] font-medium tracking-tight sm:min-h-9 sm:px-3",
        "transition-all duration-300 ease-[var(--ease-premium)] active:scale-[0.97]",
        periodo.preset === p.valor
          ? "border-primary/70 bg-primary text-primary-foreground shadow-[var(--shadow-float)]"
          : "border-border bg-card/70 text-muted-foreground hover:border-primary/30 hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {p.rotulo}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="periodo-presets flex flex-wrap gap-2">
        {PRESETS.slice(0, -2).map(botaoPreset)}
        <div className="flex shrink-0 gap-2">{PRESETS.slice(-2).map(botaoPreset)}</div>
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

const atalhos: { valor: PeriodoPreset; rotulo: string }[] = [
  { valor: "hoje", rotulo: "Hoje" },
  { valor: "ultimos7", rotulo: "7 dias" },
  { valor: "ultimos30", rotulo: "30 dias" },
  { valor: "ultimos60", rotulo: "60 dias" },
  { valor: "todo", rotulo: "Todo o histórico" },
];

function FiltroPeriodoCompacto({ periodo, onChange }: Props) {
  const id = useId();
  const [aberto, setAberto] = useState(false);
  const [inicio, setInicio] = useState(periodo.inicio);
  const [fim, setFim] = useState(periodo.fim);
  const formatarData = (data: string) => data.split("-").reverse().join("/");
  const valido = Boolean(inicio && fim && inicio <= fim);

  return (
    <div className="periodo-compacto flex min-w-0 flex-wrap items-center gap-3">
      <Popover
        open={aberto}
        onOpenChange={(open) => {
          if (open) {
            setInicio(periodo.inicio);
            setFim(periodo.fim);
          }
          setAberto(open);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 gap-3 bg-card px-3 text-xs"
            aria-label="Selecionar intervalo de datas"
          >
            <CalendarDays className="h-4 w-4" />
            <span className="hidden md:inline">
              {periodo.inicio && periodo.fim
                ? `${formatarData(periodo.inicio)} – ${formatarData(periodo.fim)}`
                : "Todo o histórico"}
            </span>
            <span className="md:hidden">
              {periodo.preset === "personalizado"
                ? `${formatarData(periodo.inicio)} – ${formatarData(periodo.fim)}`
                : [...atalhos, ...PRESETS].find((item) => item.valor === periodo.preset)?.rotulo}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="mobile-period-popover w-80 max-w-[calc(100vw-2rem)] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto"
        >
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!valido) return;
              onChange({ preset: "personalizado", inicio, fim });
              setAberto(false);
            }}
          >
            <p className="text-sm font-semibold">Período de filtragem</p>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Atalhos de período">
              {["hoje", "semana", "mes", "todo"]
                .map((valor) => PRESETS.find((item) => item.valor === valor)!)
                .map((item) => (
                  <Button
                    key={item.valor}
                    type="button"
                    variant={periodo.preset === item.valor ? "default" : "outline"}
                    aria-pressed={periodo.preset === item.valor}
                    onClick={() => {
                      onChange(periodoDoPreset(item.valor, periodo));
                      setAberto(false);
                    }}
                  >
                    {item.rotulo}
                  </Button>
                ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-inicio`}>Data inicial</Label>
              <Input
                id={`${id}-inicio`}
                type="date"
                required
                value={inicio}
                max={fim || undefined}
                onChange={(event) => setInicio(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${id}-fim`}>Data final</Label>
              <Input
                id={`${id}-fim`}
                type="date"
                required
                value={fim}
                min={inicio || undefined}
                onChange={(event) => setFim(event.target.value)}
              />
            </div>
            <Button type="submit" disabled={!valido} className="w-full">
              Aplicar período
            </Button>
          </form>
        </PopoverContent>
      </Popover>
      <div
        role="group"
        aria-label="Atalhos de período"
        className="hidden shrink-0 rounded-md border bg-card shadow-sm md:inline-flex"
      >
        {atalhos.map((atalho) => (
          <button
            key={atalho.valor}
            type="button"
            aria-pressed={periodo.preset === atalho.valor}
            onClick={() => onChange(periodoDoPreset(atalho.valor, periodo))}
            className={cn(
              "h-10 whitespace-nowrap border-r px-3 text-xs transition-colors first:rounded-l-md last:rounded-r-md last:border-r-0",
              periodo.preset === atalho.valor
                ? "bg-primary font-medium text-primary-foreground"
                : "text-foreground hover:bg-accent",
            )}
          >
            {atalho.rotulo}
          </button>
        ))}
      </div>
    </div>
  );
}
