export type TipoAlerta = "aumento_rejeitos" | "meta_abaixo";
export type PrioridadeAlerta = "atencao" | "critico";

export interface Alerta {
  id: TipoAlerta;
  tipo: TipoAlerta;
  prioridade: PrioridadeAlerta;
  titulo: string;
  mensagem: string;
  destino: "/relatorios" | "/metas";
  rotuloAcao: string;
}
