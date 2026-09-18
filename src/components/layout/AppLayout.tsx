import type { CSSProperties, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  const { usuario } = useAuth();
  return (
    <SidebarProvider style={{ "--sidebar-width": "14rem" } as CSSProperties}>
      <div className="app-workspace relative flex min-h-dvh w-full bg-background">
        <AppSidebar />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <header className="workspace-header sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur sm:px-7">
            <Link to="/" className="mobile-brand hidden" aria-label="Sindauto Lixo Zero — início">
              <img src="/logo-sindauto.png" alt="" className="h-9 w-9 rounded-lg" />
              <span>
                Sindauto <span className="text-primary">Lixo Zero</span>
              </span>
            </Link>
            <SidebarTrigger className="hidden transition-transform duration-300 ease-[var(--ease-premium)] hover:scale-105 md:inline-flex" />
            <div className="hidden h-5 w-px shrink-0 bg-border md:block" />
            <span className="hidden truncate text-sm font-medium tracking-tight text-muted-foreground md:inline">
              Sindauto Bahia <span className="text-border">·</span> Gestão e Monitoramento de
              Resíduos
            </span>
            <div className="ml-auto flex shrink-0 items-center gap-3">
              <Link
                to="/alertas"
                aria-label="Ver alertas"
                className="mobile-alert-link rounded-lg p-2 text-muted-foreground hover:bg-accent"
              >
                <Bell className="h-5 w-5" />
              </Link>
              {usuario && (
                <div
                  className="mobile-user flex items-center gap-2 border-l pl-3"
                  aria-label={`${usuario.nome}, ${usuario.perfil}`}
                  title={usuario.nome}
                >
                  <span
                    aria-hidden
                    className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-xs font-semibold text-muted-foreground"
                  >
                    {usuario.nome
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((nome) => nome[0])
                      .join("")}
                  </span>
                  <div className="hidden max-w-40 sm:block">
                    <p className="truncate text-xs font-semibold">{usuario.nome}</p>
                    <p className="text-[11px] capitalize text-muted-foreground">{usuario.perfil}</p>
                  </div>
                </div>
              )}
            </div>
          </header>
          <main className="workspace-main min-w-0 flex-1 px-4 py-6 sm:px-7">
            <div className="w-full min-w-0">{children}</div>
          </main>
        </div>
        <MobileNavigation />
      </div>
    </SidebarProvider>
  );
}

export function PageHeader({
  titulo,
  descricao,
  acoes,
  eyebrow,
  className = "",
}: {
  titulo: string;
  descricao?: string;
  acoes?: ReactNode;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <header
      className={`mb-6 flex animate-fade flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between ${className}`}
    >
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-balance text-foreground">{titulo}</h1>
        {descricao && (
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-[0.9375rem]">
            {descricao}
          </p>
        )}
      </div>
      {acoes}
    </header>
  );
}
