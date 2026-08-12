import { createFileRoute } from "@tanstack/react-router";

import { PageHeader } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações | Sindauto Lixo Zero" },
      {
        name: "description",
        content:
          "Informações da instituição e próximos recursos previstos para o sistema Sindauto Lixo Zero.",
      },
      { property: "og:title", content: "Configurações | Sindauto Lixo Zero" },
      {
        property: "og:description",
        content: "Preferências e roadmap do sistema de gestão de resíduos.",
      },
    ],
  }),
  component: Configuracoes,
});

const PROXIMOS = [
  "Login de usuários e registro de responsáveis pela pesagem",
  "Múltiplas unidades e empresas",
  "Categorias específicas de recicláveis (papel, plástico, vidro, metal, eletrônicos, óleo, madeira)",
  "Cálculo de CO₂ evitado e metas mensais",
  "Comparação entre meses e certificação Lixo Zero",
  "Exportação automática de relatórios em PDF e Excel",
  "Anexo de comprovantes e fotos, controle de coleta por cooperativas",
];

function Configuracoes() {
  return (
    <>
      <PageHeader
        titulo="Configurações"
        descricao="Informações gerais do sistema e recursos planejados."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card p-6">
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

        <section className="surface-card p-6">
          <h2 className="text-base font-semibold">Próximos recursos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A arquitetura já está preparada para estas evoluções.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {PROXIMOS.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
