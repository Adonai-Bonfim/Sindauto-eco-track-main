import type { CSSProperties } from "react";

/** Estilo compartilhado pelos tooltips dos gráficos Recharts. */
export const ESTILO_TOOLTIP: CSSProperties = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "12px",
};

export const ALTURA_GRAFICO = "h-[clamp(15rem,45vw,18.75rem)] w-full";
