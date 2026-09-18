import type { Pesagem } from "@/types/pesagem";

export function podeEditarAgora(pesagem: Pesagem, agora: number): boolean {
  if (!pesagem.podeEditar) return false;
  if (!pesagem.editavelAte) return true;
  const limite = Date.parse(pesagem.editavelAte);
  return Number.isFinite(limite) && agora < limite;
}
