import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Pesagem } from "@/types/pesagem";
import { desvioPesagem, totalPesagem } from "@/utils/calculos";
import { formatarData, formatarHorario, formatarKg, formatarPercentual } from "@/utils/formato";

interface Props {
  pesagem: Pesagem | null;
  onFechar: () => void;
}

function linhasResumo(pesagem: Pesagem): [string, string][] {
  return [
    ["Horário do registro", formatarHorario(pesagem.created_at)],
    ["Responsável", pesagem.responsavel],
    ["Recicláveis", formatarKg(pesagem.reciclaveis)],
    ["Orgânicos", formatarKg(pesagem.organicos)],
    ["Rejeitos", formatarKg(pesagem.rejeitos)],
    ["Total", formatarKg(totalPesagem(pesagem))],
    ["Desvio do aterro", formatarPercentual(desvioPesagem(pesagem))],
  ];
}

export function DetalhesPesagemDialog({ pesagem, onFechar }: Props) {
  return (
    <Dialog open={!!pesagem} onOpenChange={(aberto) => !aberto && onFechar()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pesagem de {pesagem ? formatarData(pesagem.data) : ""}</DialogTitle>
        </DialogHeader>
        {pesagem && (
          <dl className="space-y-3 text-sm">
            {linhasResumo(pesagem).map(([rotulo, valor]) => (
              <div key={rotulo} className="flex justify-between border-b border-border pb-2">
                <dt className="text-muted-foreground">{rotulo}</dt>
                <dd className="font-medium tabular-nums">{valor}</dd>
              </div>
            ))}
            <div>
              <dt className="text-muted-foreground">Observações</dt>
              <dd className="mt-1">{pesagem.observacoes || "—"}</dd>
            </div>
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}
