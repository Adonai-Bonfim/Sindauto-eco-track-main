import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { PainelAlertas } from "@/components/alertas/PainelAlertas";
import { PageHeader } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetaDesvio } from "@/hooks/useMetaDesvio";
import { usePesagens } from "@/hooks/usePesagens";
import { calcularAlertas, intervalosMensaisParaAlertas } from "@/utils/alertas";
import { calcularIndicadores } from "@/utils/calculos";
import { formatarData } from "@/utils/formato";

export const Route = createFileRoute("/alertas")({
  head: () => ({ meta: [{ title: "Alertas | Sindauto Lixo Zero" }] }),
  component: Alertas,
});

function Alertas() {
  const intervalos = useMemo(() => intervalosMensaisParaAlertas(), []);
  const { meta } = useMetaDesvio();
  const atual = usePesagens(intervalos.atual);
  const anterior = usePesagens(intervalos.anterior);

  const alertas = useMemo(
    () =>
      calcularAlertas({
        atual: calcularIndicadores(atual.data ?? []),
        anterior: calcularIndicadores(anterior.data ?? []),
        meta,
      }),
    [anterior.data, atual.data, meta],
  );

  return (
    <>
      <PageHeader
        titulo="Alertas"
        descricao="Acompanhamento local de rejeitos e da meta de desvio, sem notificações externas."
      />

      <div className="surface-card mb-6 p-5 text-sm text-muted-foreground">
        Período analisado: {formatarData(intervalos.atual.inicio ?? "")} a{" "}
        {formatarData(intervalos.atual.fim ?? "")}. A comparação usa o mesmo intervalo de dias do
        mês anterior.
      </div>

      {atual.isLoading || anterior.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : (
        <PainelAlertas alertas={alertas} />
      )}
    </>
  );
}
