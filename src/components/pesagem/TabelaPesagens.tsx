import { CalendarDays, Eye, Leaf, MoreVertical, Pencil, Trash, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { podeEditarAgora } from "@/utils/permissoesPesagem";
import { CATEGORIAS_COM_ROTULO } from "@/constants/residuos";

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
  onEditar?: (pesagem: Pesagem) => void;
  onExcluir?: (pesagem: Pesagem) => void;
  agora?: number;
  podeEditarTudo?: boolean;
  cartoesMobile?: boolean;
}

export function TabelaPesagens({
  pesagens,
  onVisualizar,
  onEditar,
  onExcluir,
  agora = Date.now(),
  podeEditarTudo = false,
  cartoesMobile = false,
}: Props) {
  return (
    <div>
      {cartoesMobile && (
        <div className="space-y-3 md:hidden">
          {pesagens.map((p) => (
            <article key={p.id} className="surface-card min-w-0 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="flex min-w-0 flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
                  <CalendarDays aria-hidden className="h-4 w-4 shrink-0" />
                  {formatarData(p.data)} <span>· {formatarHorario(p.created_at)}</span>
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 shrink-0"
                      aria-label={`Ações da pesagem de ${formatarData(p.data)}`}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="max-w-[calc(100vw-2rem)]">
                    <DropdownMenuItem className="min-h-11" onSelect={() => onVisualizar(p)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    {onEditar && (podeEditarTudo || podeEditarAgora(p, agora)) && (
                      <DropdownMenuItem
                        className="min-h-11"
                        onSelect={() => {
                          if (podeEditarTudo || podeEditarAgora(p, Date.now())) onEditar(p);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {podeEditarTudo && onExcluir && (
                      <DropdownMenuItem
                        className="min-h-11 text-destructive"
                        onSelect={() => onExcluir(p)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="mt-1 flex items-start gap-2 break-words text-sm text-muted-foreground">
                <UserRound aria-hidden className="h-4 w-4 shrink-0" />
                {p.responsavel}
              </p>
              <div className="my-3 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="break-all text-xl font-bold tabular-nums">
                    {formatarKg(totalPesagem(p))}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-2 text-xs font-medium text-primary">
                  <Leaf aria-hidden className="h-4 w-4" />
                  Desvio {formatarPercentual(desvioPesagem(p))}
                </span>
              </div>
              <dl className="history-card-categories grid gap-3 border-t pt-3">
                {CATEGORIAS_COM_ROTULO.map(({ categoria, rotulo, token }) => (
                  <div
                    key={categoria}
                    className="min-w-0 rounded-lg border border-t-4 px-1 py-3 text-center"
                    style={{
                      borderColor: `color-mix(in oklab, var(--${token}) 35%, var(--border))`,
                      borderTopColor: `var(--${token})`,
                      backgroundColor: `color-mix(in oklab, var(--${token}) 8%, var(--card))`,
                    }}
                  >
                    <dt className="text-xs font-semibold" style={{ color: `var(--${token})` }}>
                      {rotulo}
                    </dt>
                    <dd className="mt-2 break-words text-sm font-bold tabular-nums">
                      {formatarKg(p[categoria])}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      )}
      <div className={cartoesMobile ? "hidden md:block" : undefined}>
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
                  <TableCell className="text-right tabular-nums">
                    {formatarKg(p.organicos)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatarKg(p.rejeitos)}
                  </TableCell>
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
                      {onEditar && (podeEditarTudo || podeEditarAgora(p, agora)) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 sm:h-9 sm:w-9"
                          aria-label="Editar"
                          onClick={() => onEditar(p)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {onExcluir && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 sm:h-9 sm:w-9"
                          aria-label="Excluir"
                          onClick={() => onExcluir(p)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
