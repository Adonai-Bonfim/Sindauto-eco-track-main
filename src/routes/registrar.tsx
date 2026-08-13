import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/AppLayout";
import { PesagemForm } from "@/components/pesagem/PesagemForm";
import { valoresIniciais } from "@/components/pesagem/valoresFormulario";
import { useCriarPesagem } from "@/hooks/usePesagens";

export const Route = createFileRoute("/registrar")({
  head: () => ({
    meta: [
      { title: "Registrar Pesagem | Sindauto Lixo Zero" },
      {
        name: "description",
        content:
          "Registre em poucos toques a pesagem diária de rejeitos, recicláveis e orgânicos do Sindauto Bahia.",
      },
      { property: "og:title", content: "Registrar Pesagem | Sindauto Lixo Zero" },
      {
        property: "og:description",
        content: "Formulário rápido para registrar a pesagem diária de resíduos.",
      },
    ],
  }),
  component: RegistrarPesagem,
});

function RegistrarPesagem() {
  const [valores, setValores] = useState(valoresIniciais);
  const criar = useCriarPesagem();
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        titulo="Registrar Pesagem"
        descricao="Digite apenas números; os valores serão exibidos com três casas decimais (ex.: 2,855 kg)."
      />

      <div className="surface-card mx-auto max-w-2xl p-6 sm:p-8">
        <PesagemForm
          valores={valores}
          onChange={setValores}
          enviando={criar.isPending}
          onSubmit={(input) =>
            criar.mutate(input, {
              onSuccess: () => {
                toast.success("Pesagem registrada com sucesso.");
                setValores(valoresIniciais());
                navigate({ to: "/historico" });
              },
              onError: (error) => {
                console.error("Erro ao registrar pesagem:", error);
                toast.error(
                  import.meta.env.DEV && error instanceof Error
                    ? `Não foi possível registrar: ${error.message}`
                    : "Não foi possível registrar a pesagem.",
                );
              },
            })
          }
        />
      </div>
    </>
  );
}
