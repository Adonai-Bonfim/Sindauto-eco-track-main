/** Contrato único das três categorias de resíduo usadas em todo o sistema. */
export const CATEGORIAS_RESIDUO = ["reciclaveis", "organicos", "rejeitos"] as const;

export type CategoriaResiduo = (typeof CATEGORIAS_RESIDUO)[number];

export const ROTULO_CATEGORIA: Record<CategoriaResiduo, string> = {
  reciclaveis: "Recicláveis",
  organicos: "Orgânicos",
  rejeitos: "Rejeitos",
};

/** Token de cor no design system (sufixo no singular, como em styles.css). */
export const TOKEN_CATEGORIA: Record<CategoriaResiduo, string> = {
  reciclaveis: "reciclavel",
  organicos: "organico",
  rejeitos: "rejeito",
};

export const CLASSE_TEXTO_CATEGORIA: Record<CategoriaResiduo, string> = {
  reciclaveis: "text-reciclavel",
  organicos: "text-organico",
  rejeitos: "text-rejeito",
};

export const CATEGORIAS_COM_ROTULO = CATEGORIAS_RESIDUO.map((categoria) => ({
  categoria,
  rotulo: ROTULO_CATEGORIA[categoria],
  token: TOKEN_CATEGORIA[categoria],
}));
