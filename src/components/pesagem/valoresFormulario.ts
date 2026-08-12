import { CATEGORIAS_RESIDUO, type CategoriaResiduo } from "@/constants/residuos";
import type { Pesagem, PesagemInput } from "@/types/pesagem";
import { numeroParaMascara, parsePesoMascarado } from "@/utils/mascaraPeso";
import { hojeISO } from "@/utils/periodo";

/** Estado bruto do formulário: campos numéricos permanecem como texto digitado. */
export type ValoresFormulario = Record<CategoriaResiduo, string> & {
  data: string;
  responsavel: string;
  observacoes: string;
};

export const valoresIniciais = (): ValoresFormulario => ({
  data: hojeISO(),
  responsavel: "Administrador",
  reciclaveis: "",
  organicos: "",
  rejeitos: "",
  observacoes: "",
});

export function paraValores(
  pesagem: Pick<
    Pesagem,
    "data" | "reciclaveis" | "organicos" | "rejeitos" | "responsavel" | "observacoes"
  >,
): ValoresFormulario {
  return {
    data: pesagem.data,
    responsavel: pesagem.responsavel,
    reciclaveis: numeroParaMascara(pesagem.reciclaveis),
    organicos: numeroParaMascara(pesagem.organicos),
    rejeitos: numeroParaMascara(pesagem.rejeitos),
    observacoes: pesagem.observacoes ?? "",
  };
}

export function paraNumeros(valores: ValoresFormulario): Record<CategoriaResiduo, number> {
  return {
    reciclaveis: parsePesoMascarado(valores.reciclaveis),
    organicos: parsePesoMascarado(valores.organicos),
    rejeitos: parsePesoMascarado(valores.rejeitos),
  };
}

export function paraPesagemInput(valores: ValoresFormulario): PesagemInput {
  return {
    data: valores.data,
    responsavel: valores.responsavel,
    ...paraNumeros(valores),
    observacoes: valores.observacoes,
  };
}

export function algumPesoInvalido(numeros: Record<CategoriaResiduo, number>): boolean {
  return CATEGORIAS_RESIDUO.some((c) => !Number.isFinite(numeros[c]) || numeros[c] < 0);
}
