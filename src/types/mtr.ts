export type SituacaoMtr = "emitido" | "em_transporte" | "recebido" | "concluido" | "cancelado";

export interface AnexoMtr {
  nome: string;
  tipo: string;
  dados: string;
}

export interface Mtr {
  id: string;
  numero: string;
  situacao: SituacaoMtr;
  dataEmissao: string;
  dataColeta: string;
  transportador: string;
  destinador: string;
  pesagemIds: string[];
  reciclaveis: number;
  organicos: number;
  rejeitos: number;
  pesoDeclarado: number | null;
  pesoRecebido: number | null;
  descricaoOficial: string;
  codigoClassificacao: string;
  tecnologiaDestinacao: string;
  numeroCdf: string;
  pdfMtr: AnexoMtr | null;
  pdfCdf: AnexoMtr | null;
  observacoes: string;
  createdAt: string;
  updatedAt: string;
}

export type MtrInput = Omit<Mtr, "id" | "createdAt" | "updatedAt">;
