import { createFileRoute } from "@tanstack/react-router";
import { Target } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";
import { useMetaDesvio } from "@/hooks/useMetaDesvio";

export const Route = createFileRoute("/metas")({
  head: () => ({ meta: [{ title: "Metas | Sindauto Lixo Zero" }] }),
  component: Metas,
});

function Metas() {
  const { admin } = useAuth();
  const { meta, salvarMeta, isLoading, isSaving } = useMetaDesvio();
  const [valor, setValor] = useState(meta);

  useEffect(() => setValor(meta), [meta]);

  async function salvar() {
    try {
      await salvarMeta(valor);
      toast.success("Meta de desvio atualizada.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar a meta.");
    }
  }

  return (
    <>
      <PageHeader
        titulo="Metas"
        descricao="Defina o percentual de resíduos que deve ser desviado do aterro."
      />

      <section className="surface-card max-w-2xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-accent p-3 text-accent-foreground">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-semibold">Meta de desvio do aterro</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Essa meta será aplicada automaticamente aos gráficos do dashboard e dos relatórios.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="meta-desvio">Percentual da meta</Label>
            <div className="flex items-center gap-3">
              <Input
                id="meta-desvio"
                type="number"
                min={1}
                max={100}
                value={valor}
                disabled={!admin || isLoading}
                onChange={(e) => setValor(Math.min(Math.max(Number(e.target.value), 1), 100))}
                className="w-28 text-lg font-semibold tabular-nums"
              />
              <span className="text-lg font-semibold">%</span>
            </div>
          </div>

          <Slider
            value={[valor]}
            min={1}
            max={100}
            step={1}
            disabled={!admin || isLoading}
            onValueChange={([novo]) => setValor(novo ?? valor)}
            aria-label="Meta de desvio do aterro"
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1%</span>
            <span>50%</span>
            <span>100%</span>
          </div>

          {admin ? (
            <Button onClick={() => void salvar()} disabled={isLoading || isSaving}>
              {isSaving ? "Salvando..." : "Salvar meta"}
            </Button>
          ) : (
            <p className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
              Acesso somente para consulta. Apenas administradores podem alterar a meta.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
