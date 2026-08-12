import { useState } from "react";
import { toast } from "sonner";

import { PesagemForm } from "@/components/pesagem/PesagemForm";
import { paraValores, type ValoresFormulario } from "@/components/pesagem/valoresFormulario";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAtualizarPesagem } from "@/hooks/usePesagens";
import type { Pesagem } from "@/types/pesagem";

interface Props {
  pesagem: Pesagem | null;
  onFechar: () => void;
}

export function EditarPesagemDialog({ pesagem, onFechar }: Props) {
  return (
    <Dialog open={!!pesagem} onOpenChange={(aberto) => !aberto && onFechar()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar pesagem</DialogTitle>
        </DialogHeader>
        {pesagem && <FormularioEdicao key={pesagem.id} pesagem={pesagem} onConcluir={onFechar} />}
      </DialogContent>
    </Dialog>
  );
}

function FormularioEdicao({ pesagem, onConcluir }: { pesagem: Pesagem; onConcluir: () => void }) {
  const [valores, setValores] = useState<ValoresFormulario>(() => paraValores(pesagem));
  const atualizar = useAtualizarPesagem();

  return (
    <PesagemForm
      compacto
      rotuloBotao="Salvar alterações"
      valores={valores}
      onChange={setValores}
      enviando={atualizar.isPending}
      onSubmit={(input) =>
        atualizar.mutate(
          { id: pesagem.id, input },
          {
            onSuccess: () => {
              toast.success("Pesagem atualizada com sucesso.");
              onConcluir();
            },
            onError: () => toast.error("Não foi possível atualizar a pesagem."),
          },
        )
      }
    />
  );
}
