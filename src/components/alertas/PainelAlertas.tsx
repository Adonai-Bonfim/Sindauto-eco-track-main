import { Link } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Alerta } from "@/types/alerta";

export function PainelAlertas({ alertas }: { alertas: Alerta[] }) {
  if (alertas.length === 0) {
    return (
      <section className="surface-card p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 font-semibold">Nenhum alerta no momento</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Os resultados registrados estão dentro das regras de acompanhamento.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {alertas.map((alerta) => {
        const critico = alerta.prioridade === "critico";
        const Icone = critico ? AlertCircle : TriangleAlert;
        return (
          <section
            key={alerta.id}
            className={`surface-card border-l-4 p-5 sm:p-6 ${
              critico ? "border-l-destructive" : "border-l-amber-500"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <Icone
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    critico ? "text-destructive" : "text-amber-600"
                  }`}
                />
                <div>
                  <p className="eyebrow mb-1">{critico ? "Crítico" : "Atenção"}</p>
                  <h2 className="font-semibold">{alerta.titulo}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{alerta.mensagem}</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <Link to={alerta.destino}>{alerta.rotuloAcao}</Link>
              </Button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
