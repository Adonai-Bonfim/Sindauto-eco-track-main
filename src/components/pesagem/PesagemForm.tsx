import { useState } from "react";
import { Building2, FileText, Leaf, List, Save, Scale } from "lucide-react";
import { MODO_REGISTRO } from "@/constants/registro";

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
  registro?: boolean;
}

export function PesagemForm({
  valores,
  onChange,
  onSubmit,
  enviando = false,
  rotuloBotao = "Registrar Pesagem",
  compacto = false,
  registro = false,
}: Props) {
  const [erro, setErro] = useState<string | null>(null);

  const numeros = paraNumeros(valores);
  const total = algumPesoInvalido(numeros)
    ? 0
    : numeros.reciclaveis + numeros.organicos + numeros.rejeitos;
  const desvio = taxaDesvio(numeros.reciclaveis + numeros.organicos, total);

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    const resultado = validarPesagem(paraPesagemInput(valores));
    if (!resultado.ok) return setErro(resultado.erro);
    setErro(null);
    onSubmit(resultado.valor);
  }

  return (
    <form
      onSubmit={submeter}
      className={
        registro
          ? "registration-form grid items-start gap-5 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]"
          : "space-y-6"
      }
    >
      <div
        className={
          registro ? "registration-fields surface-card min-w-0 space-y-6 p-5 sm:p-7" : "space-y-6"
        }
      >
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
            disabled
            maxLength={RESPONSAVEL_MAX}
            autoComplete="name"
            onChange={(e) => onChange({ ...valores, responsavel: e.target.value })}
            className="h-12 text-base"
            placeholder="Nome do responsável"
          />
          <p className="text-xs text-muted-foreground">
            O responsável é definido pelo usuário autenticado.
          </p>
        </div>

        {registro && (
          <div className="registration-categories-heading border-t pt-5">
            <h2 className="font-semibold">Categorias de resíduos</h2>
          </div>
        )}
        <div
          className={
            compacto
              ? "grid gap-4 sm:grid-cols-3"
              : "registration-categories grid gap-5 sm:grid-cols-3"
          }
        >
          {CATEGORIAS_RESIDUO.map((categoria) => (
            <div
              key={categoria}
              className={
                registro
                  ? `min-w-0 space-y-2 rounded-xl border p-3 ${categoria === "reciclaveis" ? "border-reciclavel/20 bg-reciclavel/5" : categoria === "organicos" ? "border-organico/20 bg-organico/5" : "border-rejeito/20 bg-rejeito/5"}`
                  : "space-y-2"
              }
            >
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
      </div>
      <div
        className={
          registro ? "registration-summary surface-card min-w-0 space-y-6 p-5 sm:p-7" : "space-y-6"
        }
      >
        <div className={registro ? "registration-summary-content space-y-6" : "contents"}>
          {registro && (
            <>
              <h2 className="flex items-center gap-3 font-semibold">
                <FileText aria-hidden className="h-5 w-5" />
                Resumo do registro
              </h2>
              <dl className="space-y-5 rounded-xl border bg-muted/40 p-4">
                <div className="flex gap-3">
                  <Building2 aria-hidden className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Unidade:</dt>
                    <dd className="mt-1 text-sm">Salvador</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <List aria-hidden className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <dt className="text-xs text-muted-foreground">Modo de registro</dt>
                    <dd className="mt-1 text-sm">{MODO_REGISTRO.rotulo}</dd>
                  </div>
                </div>
              </dl>
            </>
          )}
          <div
            className={
              registro
                ? "space-y-5 border-y py-5"
                : "rounded-xl border border-border bg-muted/50 p-4"
            }
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                {registro && <Scale aria-hidden className="h-5 w-5" />}Total registrado
              </span>
              <span className="break-all text-xl font-semibold tabular-nums">
                {formatarKg(total)}
              </span>
            </div>
            {registro ? (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                <span className="flex items-center gap-2 text-sm">
                  <Leaf aria-hidden className="h-5 w-5 text-primary" />
                  Desvio do aterro
                </span>
                <div className="text-right">
                  <p className="text-2xl font-semibold tabular-nums text-primary">
                    {formatarPercentual(desvio)}
                  </p>
                  <p className="text-xs text-muted-foreground">Recicláveis + Orgânicos</p>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Desvio do aterro: {formatarPercentual(desvio)}
              </p>
            )}
          </div>
        </div>
        {erro && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {erro}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={enviando}
          className={registro ? "h-12 w-full" : "h-12 w-full sm:w-auto"}
        >
          {registro && <Save aria-hidden className="h-5 w-5" />}
          {enviando ? "Salvando..." : rotuloBotao}
        </Button>
      </div>
    </form>
  );
}
