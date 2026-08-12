import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useExcluirPesagem } from "@/hooks/usePesagens";
import type { Pesagem } from "@/types/pesagem";
import { formatarData } from "@/utils/formato";

interface Props {
  pesagem: Pesagem | null;
  onFechar: () => void;
}

export function ExcluirPesagemDialog({ pesagem, onFechar }: Props) {
  const excluir = useExcluirPesagem();

  function confirmar() {
    if (!pesagem) return;
    excluir.mutate(pesagem.id, {
      onSuccess: () => toast.success("Pesagem excluída."),
      onError: (error) => {
        console.error("Erro ao excluir pesagem:", error);
        toast.error(
          error instanceof Error
            ? `Não foi possível excluir: ${error.message}`
            : "Não foi possível excluir a pesagem.",
        );
      },
    });
    onFechar();
  }

  return (
    <AlertDialog open={!!pesagem} onOpenChange={(aberto) => !aberto && onFechar()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir pesagem?</AlertDialogTitle>
          <AlertDialogDescription>
            O registro de {pesagem ? formatarData(pesagem.data) : ""} será removido permanentemente.
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={confirmar}>Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
