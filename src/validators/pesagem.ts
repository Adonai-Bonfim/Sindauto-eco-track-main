import { CATEGORIAS_RESIDUO, ROTULO_CATEGORIA, type CategoriaResiduo } from "@/constants/residuos";
import type { PesagemInput } from "@/types/pesagem";
import { hojeISO } from "@/utils/periodo";

/** Limite razoável por categoria em uma única pesagem diária. */
export const PESO_MAXIMO_KG = 100_000;
export const CASAS_DECIMAIS = 3;
export const OBSERVACOES_MAX = 500;
export const RESPONSAVEL_MAX = 120;

const REGEX_DATA = /^\d{4}-\d{2}-\d{2}$/;

/** Limita o payload a 3 casas, sem reduzir a precisão informada na interface. */
export function arredondarPeso(valor: number): number {
  const fator = 10 ** CASAS_DECIMAIS;
  return Math.round(valor * fator) / fator;
}

export type ResultadoValidacao = { ok: true; valor: PesagemInput } | { ok: false; erro: string };

function validarData(data: string): string | null {
  if (!REGEX_DATA.test(data)) return "Informe uma data válida.";
  if (data > hojeISO()) return "A data não pode ser futura.";
  return null;
}

function validarPeso(categoria: CategoriaResiduo, valor: unknown): string | null {
  const rotulo = ROTULO_CATEGORIA[categoria];
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    return `${rotulo}: informe um número válido.`;
  }
  if (valor < 0) return `${rotulo}: o peso não pode ser negativo.`;
  if (valor > PESO_MAXIMO_KG) {
    return `${rotulo}: valor acima do limite de ${PESO_MAXIMO_KG} kg.`;
  }
  return null;
}

function normalizarObservacoes(observacoes: string | null | undefined): string | null {
  const texto = observacoes?.trim();
  return texto ? texto.slice(0, OBSERVACOES_MAX) : null;
}

/**
 * Única fonte de verdade para as regras de integridade de uma pesagem.
 * Usada tanto pelo formulário (feedback imediato) quanto pela camada de
 * acesso a dados (barreira final antes de gravar).
 */
export function validarPesagem(input: PesagemInput): ResultadoValidacao {
  const erroData = validarData(input.data);
  if (erroData) return { ok: false, erro: erroData };

  const responsavel = input.responsavel.trim();
  if (responsavel.length < 2) return { ok: false, erro: "Informe o nome do responsável." };
  if (responsavel.length > RESPONSAVEL_MAX) {
    return { ok: false, erro: `O responsável deve ter no máximo ${RESPONSAVEL_MAX} caracteres.` };
  }

  const pesos = {} as Record<CategoriaResiduo, number>;

  for (const categoria of CATEGORIAS_RESIDUO) {
    const bruto = input[categoria];
    const erro = validarPeso(categoria, bruto);
    if (erro) return { ok: false, erro };
    pesos[categoria] = arredondarPeso(bruto);
  }

  const total = pesos.reciclaveis + pesos.organicos + pesos.rejeitos;
  if (total <= 0) return { ok: false, erro: "Informe ao menos um valor de resíduo." };

  return {
    ok: true,
    valor: {
      data: input.data,
      responsavel,
      ...pesos,
      observacoes: normalizarObservacoes(input.observacoes),
    },
  };
}
