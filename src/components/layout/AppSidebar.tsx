import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const itens = [
  { titulo: "Dashboard", url: "/", icone: LayoutDashboard },
  { titulo: "Registrar Pesagem", url: "/registrar", icone: ClipboardList },
  { titulo: "Histórico", url: "/historico", icone: BarChart3 },
  { titulo: "Relatórios", url: "/relatorios", icone: FileText },
  { titulo: "Configurações", url: "/configuracoes", icone: Settings },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const recolhida = state === "collapsed";
  const caminho = useRouterState({ select: (r) => r.location.pathname });
  const { sair } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src="/logo-sindauto.png"
            alt="Logo Sindauto"
            className="h-10 w-10 shrink-0 rounded-2xl object-cover shadow-[var(--shadow-float)] transition-transform duration-500 ease-[var(--ease-premium)] hover:scale-105"
          />
          {!recolhida && (
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-tight tracking-tight">
                Sindauto Lixo Zero
              </p>
              <p className="truncate text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
                Gestão de Resíduos
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itens.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={caminho === item.url} tooltip={item.titulo}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icone className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.titulo}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sair" onClick={() => void sair()}>
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
