import { useState } from "react";

import {
  algumPesoInvalido,
  paraNumeros,
  paraPesagemInput,
  type ValoresFormulario,
} from "@/components/pesagem/valoresFormulario";
import { PesoInput } from "@/components/pesagem/PesoInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIAS_RESIDUO, CLASSE_TEXTO_CATEGORIA, ROTULO_CATEGORIA } from "@/constants/residuos";
import type { PesagemInput } from "@/types/pesagem";
import { taxaDesvio } from "@/utils/calculos";
import { formatarKg, formatarPercentual } from "@/utils/formato";
import { hojeISO } from "@/utils/periodo";
import { OBSERVACOES_MAX, RESPONSAVEL_MAX, validarPesagem } from "@/validators/pesagem";

interface Props {
  valores: ValoresFormulario;
  onChange: (valores: ValoresFormulario) => void;
  onSubmit: (input: PesagemInput) => void;
  enviando?: boolean;
  rotuloBotao?: string;
  compacto?: boolean;
}

export function PesagemForm({
  valores,
  onChange,
  onSubmit,
  enviando = false,
  rotuloBotao = "Registrar Pesagem",
  compacto = false,
}: Props) {
  const [erro, setErro] = useState<string | null>(null);

  const numeros = paraNumeros(valores);
  const total = algumPesoInvalido(numeros)
    ? 0
    : numeros.reciclaveis + numeros.organicos + numeros.rejeitos;
  const desvio = taxaDesvio(numeros.reciclaveis + numeros.organicos, total);

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    const resultado = validarPesagem(paraPesagemInput(valores));
    if (!resultado.ok) return setErro(resultado.erro);
    setErro(null);
    onSubmit(resultado.valor);
  }

  return (
    <form onSubmit={submeter} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="data" className="text-sm">
          Data
        </Label>
        <Input
          id="data"
          type="date"
          value={valores.data}
          max={hojeISO()}
          onChange={(e) => onChange({ ...valores, data: e.target.value })}
          className="h-12 text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsavel" className="text-sm">
          Responsável pela pesagem
        </Label>
        <Input
          id="responsavel"
          value={valores.responsavel}
          maxLength={RESPONSAVEL_MAX}
          autoComplete="name"
          onChange={(e) => onChange({ ...valores, responsavel: e.target.value })}
          className="h-12 text-base"
          placeholder="Nome do responsável"
        />
      </div>

      <div className={compacto ? "grid gap-4 sm:grid-cols-3" : "grid gap-5 sm:grid-cols-3"}>
        {CATEGORIAS_RESIDUO.map((categoria) => (
          <div key={categoria} className="space-y-2">
            <Label
              htmlFor={categoria}
              className={`text-sm font-medium ${CLASSE_TEXTO_CATEGORIA[categoria]}`}
            >
              {ROTULO_CATEGORIA[categoria]} (kg)
            </Label>
            <PesoInput
              id={categoria}
              value={valores[categoria]}
              onChange={(valor) => onChange({ ...valores, [categoria]: valor })}
              className="h-14 text-lg"
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacoes" className="text-sm">
          Observações <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Textarea
          id="observacoes"
          rows={3}
          maxLength={OBSERVACOES_MAX}
          placeholder="Ex.: Grande quantidade de papel proveniente de material administrativo."
          value={valores.observacoes}
          onChange={(e) => onChange({ ...valores, observacoes: e.target.value })}
        />
      </div>

      <div className="rounded-xl border border-border bg-muted/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">Total registrado</span>
          <span className="text-xl font-semibold tabular-nums">{formatarKg(total)}</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Desvio do aterro: {formatarPercentual(desvio)}
        </p>
      </div>

      {erro && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {erro}
        </p>
      )}

      <Button type="submit" size="lg" disabled={enviando} className="h-12 w-full sm:w-auto">
        {enviando ? "Salvando..." : rotuloBotao}
      </Button>
    </form>
  );
}
