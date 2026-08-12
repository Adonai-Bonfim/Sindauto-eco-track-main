import { Eye, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Pesagem } from "@/types/pesagem";
import { desvioPesagem, totalPesagem } from "@/utils/calculos";
import { formatarData, formatarHorario, formatarKg, formatarPercentual } from "@/utils/formato";

interface Props {
  pesagens: Pesagem[];
  onVisualizar: (pesagem: Pesagem) => void;
  onEditar: (pesagem: Pesagem) => void;
  onExcluir: (pesagem: Pesagem) => void;
}

export function TabelaPesagens({ pesagens, onVisualizar, onEditar, onExcluir }: Props) {
  return (
    <div>
      <p className="px-4 pt-3 text-xs text-muted-foreground sm:hidden">
        Deslize a tabela para o lado para ver todas as colunas.
      </p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead className="text-right">Recicláveis</TableHead>
              <TableHead className="text-right">Orgânicos</TableHead>
              <TableHead className="text-right">Rejeitos</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Desvio</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pesagens.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {formatarData(p.data)}
                </TableCell>
                <TableCell className="whitespace-nowrap tabular-nums">
                  {formatarHorario(p.created_at)}
                </TableCell>
                <TableCell className="max-w-48 truncate" title={p.responsavel}>
                  {p.responsavel}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatarKg(p.reciclaveis)}
                </TableCell>
                <TableCell className="text-right tabular-nums">{formatarKg(p.organicos)}</TableCell>
                <TableCell className="text-right tabular-nums">{formatarKg(p.rejeitos)}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatarKg(totalPesagem(p))}
                </TableCell>
                <TableCell className="text-right tabular-nums text-primary">
                  {formatarPercentual(desvioPesagem(p))}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-0.5 sm:gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 sm:h-9 sm:w-9"
                      aria-label="Visualizar"
                      onClick={() => onVisualizar(p)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 sm:h-9 sm:w-9"
                      aria-label="Editar"
                      onClick={() => onEditar(p)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 sm:h-9 sm:w-9"
                      aria-label="Excluir"
                      onClick={() => onExcluir(p)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
