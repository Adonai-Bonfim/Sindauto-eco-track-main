import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AnexoMtr, Mtr, MtrInput, SituacaoMtr } from "@/types/mtr";
import type { Pesagem } from "@/types/pesagem";
import { totalPesagem } from "@/utils/calculos";
import { formatarData, formatarKg } from "@/utils/formato";
import { hojeISO } from "@/utils/periodo";

const LIMITE_ANEXO = 1_500_000;

const vazio = (): MtrInput => ({
  numero: "",
  situacao: "emitido",
  dataEmissao: hojeISO(),
  dataColeta: "",
  transportador: "",
  destinador: "",
  pesagemIds: [],
  reciclaveis: 0,
  organicos: 0,
  rejeitos: 0,
  pesoDeclarado: null,
  pesoRecebido: null,
  descricaoOficial: "",
  codigoClassificacao: "",
  tecnologiaDestinacao: "",
  numeroCdf: "",
  pdfMtr: null,
  pdfCdf: null,
  observacoes: "",
});

function paraInput(mtr?: Mtr | null): MtrInput {
  if (!mtr) return vazio();
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...input } = mtr;
  return input;
}

async function lerAnexo(arquivo: File): Promise<AnexoMtr> {
  if (arquivo.type !== "application/pdf") throw new Error("Selecione um arquivo PDF.");
  if (arquivo.size > LIMITE_ANEXO) throw new Error("O PDF deve ter no máximo 1,5 MB.");
  const dados = await new Promise<string>((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result));
    leitor.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    leitor.readAsDataURL(arquivo);
  });
  return { nome: arquivo.name, tipo: arquivo.type, dados };
}

interface Props {
  pesagens: Pesagem[];
  editando?: Mtr | null;
  onSalvar: (input: MtrInput) => void;
  onCancelar?: () => void;
}

export function MtrForm({ pesagens, editando, onSalvar, onCancelar }: Props) {
  const [valores, setValores] = useState<MtrInput>(() => paraInput(editando));
  const selecionadas = useMemo(
    () => pesagens.filter((p) => valores.pesagemIds.includes(p.id)),
    [pesagens, valores.pesagemIds],
  );
  const totalInterno = selecionadas.reduce((soma, p) => soma + totalPesagem(p), 0);

  function alternarPesagem(pesagem: Pesagem, marcada: boolean) {
    const ids = marcada
      ? [...valores.pesagemIds, pesagem.id]
      : valores.pesagemIds.filter((id) => id !== pesagem.id);
    const vinculadas = pesagens.filter((p) => ids.includes(p.id));
    setValores({
      ...valores,
      pesagemIds: ids,
      reciclaveis: vinculadas.reduce((s, p) => s + Number(p.reciclaveis), 0),
      organicos: vinculadas.reduce((s, p) => s + Number(p.organicos), 0),
      rejeitos: vinculadas.reduce((s, p) => s + Number(p.rejeitos), 0),
    });
  }

  async function anexar(chave: "pdfMtr" | "pdfCdf", arquivo?: File) {
    if (!arquivo) return;
    try {
      setValores({ ...valores, [chave]: await lerAnexo(arquivo) });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Arquivo inválido.");
    }
  }

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    if (!valores.numero.trim()) return toast.error("Informe o número do MTR.");
    if (!valores.transportador.trim()) return toast.error("Informe o transportador.");
    if (!valores.destinador.trim()) return toast.error("Informe o destinador.");
    onSalvar({ ...valores, numero: valores.numero.trim() });
  }

  return (
    <form onSubmit={submeter} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="numero-mtr">Número do MTR</Label>
          <Input
            id="numero-mtr"
            value={valores.numero}
            onChange={(e) => setValores({ ...valores, numero: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Situação</Label>
          <Select
            value={valores.situacao}
            onValueChange={(situacao: SituacaoMtr) => setValores({ ...valores, situacao })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emitido">Emitido</SelectItem>
              <SelectItem value="em_transporte">Em transporte</SelectItem>
              <SelectItem value="recebido">Recebido</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="emissao-mtr">Data de emissão</Label>
          <Input
            id="emissao-mtr"
            type="date"
            value={valores.dataEmissao}
            onChange={(e) => setValores({ ...valores, dataEmissao: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coleta-mtr">Data da coleta</Label>
          <Input
            id="coleta-mtr"
            type="date"
            value={valores.dataColeta}
            onChange={(e) => setValores({ ...valores, dataColeta: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="transportador-mtr">Transportador</Label>
          <Input
            id="transportador-mtr"
            value={valores.transportador}
            onChange={(e) => setValores({ ...valores, transportador: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destinador-mtr">Destinador</Label>
          <Input
            id="destinador-mtr"
            value={valores.destinador}
            onChange={(e) => setValores({ ...valores, destinador: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Pesagens vinculadas</Label>
          <p className="text-xs text-muted-foreground">
            As pesagens originais não serão alteradas.
          </p>
        </div>
        <div className="max-h-52 space-y-2 overflow-y-auto rounded-xl border border-border p-3">
          {pesagens.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma pesagem disponível.</p>
          ) : (
            pesagens.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg p-2 hover:bg-muted/60"
              >
                <span className="flex items-center gap-3">
                  <Checkbox
                    checked={valores.pesagemIds.includes(p.id)}
                    onCheckedChange={(v) => alternarPesagem(p, v === true)}
                  />
                  <span className="text-sm">
                    {formatarData(p.data)} · {p.responsavel}
                  </span>
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {formatarKg(totalPesagem(p))}
                </span>
              </label>
            ))
          )}
        </div>
        <div className="grid gap-2 rounded-xl bg-muted/50 p-4 text-sm sm:grid-cols-4">
          <span>
            Total: <strong>{formatarKg(totalInterno)}</strong>
          </span>
          <span>
            Recicláveis: <strong>{formatarKg(valores.reciclaveis)}</strong>
          </span>
          <span>
            Orgânicos: <strong>{formatarKg(valores.organicos)}</strong>
          </span>
          <span>
            Rejeitos: <strong>{formatarKg(valores.rejeitos)}</strong>
          </span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="peso-declarado">Peso declarado (kg)</Label>
          <Input
            id="peso-declarado"
            type="number"
            min="0"
            step="0.001"
            value={valores.pesoDeclarado ?? ""}
            onChange={(e) =>
              setValores({
                ...valores,
                pesoDeclarado: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="peso-recebido">Peso recebido (kg)</Label>
          <Input
            id="peso-recebido"
            type="number"
            min="0"
            step="0.001"
            value={valores.pesoRecebido ?? ""}
            onChange={(e) =>
              setValores({
                ...valores,
                pesoRecebido: e.target.value ? Number(e.target.value) : null,
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numero-cdf">Número do CDF</Label>
          <Input
            id="numero-cdf"
            value={valores.numeroCdf}
            onChange={(e) => setValores({ ...valores, numeroCdf: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descricao-mtr">Descrição oficial no MTR</Label>
          <Input
            id="descricao-mtr"
            value={valores.descricaoOficial}
            onChange={(e) => setValores({ ...valores, descricaoOficial: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="codigo-mtr">Código/classificação</Label>
          <Input
            id="codigo-mtr"
            value={valores.codigoClassificacao}
            onChange={(e) => setValores({ ...valores, codigoClassificacao: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tecnologia-mtr">Tecnologia de destinação</Label>
          <Input
            id="tecnologia-mtr"
            value={valores.tecnologiaDestinacao}
            onChange={(e) => setValores({ ...valores, tecnologiaDestinacao: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="pdf-mtr">PDF do MTR (máx. 1,5 MB)</Label>
          <Input
            id="pdf-mtr"
            type="file"
            accept="application/pdf"
            onChange={(e) => void anexar("pdfMtr", e.target.files?.[0])}
          />
          <p className="text-xs text-muted-foreground">
            {valores.pdfMtr?.nome ?? "Nenhum arquivo anexado"}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pdf-cdf">PDF do CDF (máx. 1,5 MB)</Label>
          <Input
            id="pdf-cdf"
            type="file"
            accept="application/pdf"
            onChange={(e) => void anexar("pdfCdf", e.target.files?.[0])}
          />
          <p className="text-xs text-muted-foreground">
            {valores.pdfCdf?.nome ?? "Nenhum arquivo anexado"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes-mtr">Observações</Label>
        <Textarea
          id="observacoes-mtr"
          rows={3}
          value={valores.observacoes}
          onChange={(e) => setValores({ ...valores, observacoes: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit">{editando ? "Salvar alterações" : "Registrar MTR"}</Button>
        {onCancelar && (
          <Button type="button" variant="outline" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
