import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-dvh w-full bg-background">
        {/* Ambient light: adds depth without competing with content. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 opacity-70 [background:radial-gradient(60rem_40rem_at_78%_-12%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_65%),radial-gradient(48rem_32rem_at_-8%_8%,color-mix(in_oklab,var(--reciclavel)_9%,transparent),transparent_60%)]"
        />
        <AppSidebar />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <header className="glass-panel sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 sm:px-6">
            <SidebarTrigger className="transition-transform duration-300 ease-[var(--ease-premium)] hover:scale-105" />
            <div className="h-5 w-px shrink-0 bg-border" />
            <span className="truncate text-sm font-medium tracking-tight text-muted-foreground">
              Sindauto Bahia <span className="text-border">·</span> Gestão e Monitoramento de
              Resíduos
            </span>
          </header>
          <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function PageHeader({
  titulo,
  descricao,
  acoes,
  eyebrow,
}: {
  titulo: string;
  descricao?: string;
  acoes?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <header className="mb-10 flex animate-fade flex-col items-stretch gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6">
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
