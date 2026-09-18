import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, FileText, Home, MoreHorizontal, Plus } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function MobileNavigation() {
  const caminho = useRouterState({ select: (state) => state.location.pathname });
  const { setOpenMobile, openMobile } = useSidebar();
  const itens = [
    { to: "/", titulo: "Início", Icone: Home },
    { to: "/historico", titulo: "Histórico", Icone: BarChart3 },
    { to: "/registrar", titulo: "Registrar pesagem", Icone: Plus },
    { to: "/relatorios", titulo: "Relatórios", Icone: FileText },
  ] as const;
  return (
    <nav aria-label="Navegação principal no celular" className="mobile-navigation md:hidden">
      {itens.map(({ to, titulo, Icone }) => (
        <Link
          key={to}
          to={to}
          aria-label={titulo}
          aria-current={caminho === to ? "page" : undefined}
          onClick={() => setOpenMobile(false)}
          className={cn(
            "mobile-nav-item",
            caminho === to && "text-primary",
            to === "/registrar" && "mobile-nav-create",
          )}
        >
          <Icone aria-hidden className="h-6 w-6" />
          {to !== "/registrar" && <span>{titulo}</span>}
        </Link>
      ))}
      <button
        type="button"
        aria-label="Abrir mais opções"
        aria-expanded={openMobile}
        onClick={() => setOpenMobile(true)}
        className={cn(
          "mobile-nav-item",
          !itens.some((item) => item.to === caminho) && "text-primary",
        )}
      >
        <MoreHorizontal aria-hidden className="h-6 w-6" />
        <span>Mais</span>
      </button>
    </nav>
  );
}
