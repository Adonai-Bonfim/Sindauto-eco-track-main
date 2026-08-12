/**
 * Máscara de peso no padrão brasileiro (centavos → "1.234,56").
 * A máscara é apenas de apresentação: use `parsePesoMascarado` para obter
 * o número decimal antes de enviar ao banco.
 */

const MAX_DIGITOS = 12;

/** Mantém apenas dígitos, limitando o tamanho para evitar overflow numérico. */
function somenteDigitos(texto: string): string {
  return texto.replace(/\D/g, "").slice(0, MAX_DIGITOS);
}

/** Formata uma sequência de dígitos (centavos) como "1.234,56". */
export function formatarMascaraPeso(entrada: string): string {
  const digitos = somenteDigitos(entrada).replace(/^0+(?=\d{3})/, "");
  if (digitos === "") return "";
  const centavos = Number(digitos);
  if (!Number.isFinite(centavos)) return "";
  return (centavos / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Converte o texto exibido para número decimal (kg).
 * Retorna 0 para campo vazio e NaN para conteúdo sem nenhum dígito válido.
 */
export function parsePesoMascarado(texto: string): number {
  const digitos = somenteDigitos(texto);
  if (texto.trim() === "") return 0;
  if (digitos === "") return Number.NaN;
  const valor = Number(digitos) / 100;
  return Number.isFinite(valor) ? valor : Number.NaN;
}

/**
 * Normaliza um texto colado ("2kg", "2,50", "2.50", "R$ 2,50") para a máscara.
 * Quando há separador decimal explícito, respeita-o; caso contrário trata
 * os dígitos como centavos digitados sequencialmente.
 */
export function mascaraDeTextoColado(texto: string): string {
  const limpo = texto.replace(/[^\d.,]/g, "");
  if (somenteDigitos(limpo) === "") return "";
  const ultimoSeparador = Math.max(limpo.lastIndexOf(","), limpo.lastIndexOf("."));
  if (ultimoSeparador === -1) return formatarMascaraPeso(`${somenteDigitos(limpo)}00`);

  const inteiros = somenteDigitos(limpo.slice(0, ultimoSeparador));
  const decimais = somenteDigitos(limpo.slice(ultimoSeparador + 1))
    .padEnd(2, "0")
    .slice(0, 2);
  return formatarMascaraPeso(`${inteiros}${decimais}`);
}

/** Converte um número vindo do banco para o texto mascarado. */
export function numeroParaMascara(valor: number): string {
  if (!Number.isFinite(valor)) return "";
  return formatarMascaraPeso(String(Math.round(valor * 100)));
}
