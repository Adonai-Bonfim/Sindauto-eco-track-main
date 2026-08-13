import { forwardRef } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatarMascaraPeso, mascaraDeTextoColado } from "@/utils/mascaraPeso";

interface PesoInputProps extends Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "type"
> {
  /** Texto já mascarado (ex.: "12,500"). */
  value: string;
  /** Recebe sempre o texto mascarado normalizado. */
  onChange: (valor: string) => void;
}

/**
 * Campo de peso com máscara brasileira de milésimos: o usuário digita apenas
 * dígitos e a vírgula é posicionada automaticamente. A unidade "kg" é
 * apresentada como sufixo visual e nunca faz parte do valor.
 */
export const PesoInput = forwardRef<HTMLInputElement, PesoInputProps>(function PesoInput(
  { value, onChange, className, ...props },
  ref,
) {
  return (
    <div className="relative">
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="0,000"
        value={value}
        onChange={(e) => onChange(formatarMascaraPeso(e.target.value))}
        onPaste={(e) => {
          e.preventDefault();
          onChange(mascaraDeTextoColado(e.clipboardData.getData("text")));
        }}
        onKeyDown={(e) => {
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !/\d/.test(e.key)) {
            e.preventDefault();
          }
          props.onKeyDown?.(e);
        }}
        className={cn("pr-12 text-right tabular-nums", className)}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-medium text-muted-foreground"
      >
        kg
      </span>
    </div>
  );
});
