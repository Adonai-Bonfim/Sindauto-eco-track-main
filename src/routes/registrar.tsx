import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/AppLayout";
import { PesagemForm } from "@/components/pesagem/PesagemForm";
import { valoresIniciais } from "@/components/pesagem/valoresFormulario";
import { useCriarPesagem } from "@/hooks/usePesagens";
import { useAuth } from "@/hooks/useAuth";
import { MODO_REGISTRO } from "@/constants/registro";

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
  const { usuario } = useAuth();
  const [valores, setValores] = useState(() => valoresIniciais(usuario?.nome ?? ""));
  const criar = useCriarPesagem();
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        className="registration-header"
        titulo="Registrar Pesagem"
        acoes={
          <span className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-primary">
            <span className="hidden md:inline">Modo de registro: </span>
            {MODO_REGISTRO.rotulo}
          </span>
        }
        descricao="Digite apenas números; os valores serão exibidos com três casas decimais (ex.: 2,855 kg)."
      />

      <div className="w-full min-w-0">
        <PesagemForm
          registro
          valores={valores}
          onChange={setValores}
          enviando={criar.isPending}
          onSubmit={(input) =>
            criar.mutate(input, {
              onSuccess: () => {
                toast.success("Pesagem registrada com sucesso.");
                setValores(valoresIniciais(usuario?.nome ?? ""));
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
