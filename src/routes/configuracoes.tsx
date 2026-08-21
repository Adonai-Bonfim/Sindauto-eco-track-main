import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações | Sindauto Lixo Zero" },
      {
        name: "description",
        content: "Informações gerais da instituição e do sistema Sindauto Lixo Zero.",
      },
      { property: "og:title", content: "Configurações | Sindauto Lixo Zero" },
      {
        property: "og:description",
        content: "Informações do sistema de gestão de resíduos.",
      },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  return (
    <>
      <PageHeader titulo="Configurações" descricao="Informações gerais do sistema." />

      <section className="surface-card max-w-2xl p-6">
        <h2 className="text-base font-semibold">Instituição</h2>
        <dl className="mt-4 space-y-3 text-sm">
          {[
            ["Nome", "Sindauto Bahia"],
            ["Sistema", "Sindauto Lixo Zero"],
            ["Subtítulo", "Gestão e Monitoramento de Resíduos"],
            ["Unidade de medida", "Quilogramas (kg)"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
