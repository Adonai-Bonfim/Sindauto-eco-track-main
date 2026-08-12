export function EstadoVazio({
  mensagem = "Sem dados no período selecionado.",
}: {
  mensagem?: string;
}) {
  return (
    <div className="grid h-[clamp(15rem,45vw,18.75rem)] place-items-center rounded-lg border border-dashed border-border">
      <p className="text-sm text-muted-foreground">{mensagem}</p>
    </div>
  );
}
