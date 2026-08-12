import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  titulo: string;
  valor: string;
  descricao?: string;
  icone: LucideIcon;
  tom?: "neutro" | "reciclavel" | "organico" | "rejeito" | "destaque";
}

const tons: Record<NonNullable<StatCardProps["tom"]>, string> = {
  neutro: "bg-secondary text-secondary-foreground",
  reciclavel: "bg-reciclavel/12 text-reciclavel",
  organico: "bg-organico/12 text-organico",
  rejeito: "bg-rejeito/12 text-rejeito",
  destaque: "bg-primary/12 text-primary",
};

const barras: Record<NonNullable<StatCardProps["tom"]>, string> = {
  neutro: "from-muted-foreground/40",
  reciclavel: "from-reciclavel",
  organico: "from-organico",
  rejeito: "from-rejeito",
  destaque: "from-primary",
};

export function StatCard({
  titulo,
  valor,
  descricao,
  icone: Icone,
  tom = "neutro",
}: StatCardProps) {
  return (
    <div className="surface-card surface-lift group overflow-hidden p-6">
      {/* Accent hairline revealed on hover. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-500 ease-[var(--ease-premium)] group-hover:opacity-100",
          barras[tom],
        )}
      />
      <div className="flex items-start justify-between gap-4">
        <p className="min-w-0 text-[0.8125rem] font-medium tracking-tight text-muted-foreground">
          {titulo}
        </p>
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-500 ease-[var(--ease-premium)] group-hover:-rotate-6 group-hover:scale-105",
            tons[tom],
          )}
        >
          <Icone className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-6 text-[1.75rem] font-bold leading-none tracking-[-0.03em] tabular-nums">
        {valor}
      </p>
      {descricao && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{descricao}</p>
      )}
    </div>
  );
}
