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

export function StatCard({
  titulo,
  valor,
  descricao,
  icone: Icone,
  tom = "neutro",
}: StatCardProps) {
  return (
    <div className="stat-card surface-card min-w-0 p-5 xl:p-6">
      <div className="flex items-center gap-4">
        <span className={cn("grid h-12 w-12 shrink-0 place-items-center rounded-xl", tons[tom])}>
          <Icone className="h-6 w-6" />
        </span>
        <p className="min-w-0 text-sm font-medium">{titulo}</p>
      </div>
      <p className="mt-4 break-words text-[clamp(1.5rem,2.1vw,2.25rem)] font-bold leading-tight tracking-tight tabular-nums">
        {valor}
      </p>
      {descricao && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{descricao}</p>
      )}
    </div>
  );
}
