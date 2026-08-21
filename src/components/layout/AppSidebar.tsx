import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  BellRing,
  ScrollText,
  Settings,
  Target,
  Users,
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

const itensGerais = [
  { titulo: "Dashboard", url: "/", icone: LayoutDashboard },
  { titulo: "Registrar Pesagem", url: "/registrar", icone: ClipboardList },
  { titulo: "Histórico", url: "/historico", icone: BarChart3 },
  { titulo: "Relatórios", url: "/relatorios", icone: FileText },
  { titulo: "Metas", url: "/metas", icone: Target },
  { titulo: "Alertas", url: "/alertas", icone: BellRing },
  { titulo: "Controle de MTR", url: "/mtr", icone: ScrollText },
] as const;

const itensAdministrativos = [
  { titulo: "Configurações", url: "/configuracoes", icone: Settings },
  { titulo: "Usuários", url: "/usuarios", icone: Users },
] as const;

export function AppSidebar() {
  const { state, setOpen, setOpenMobile } = useSidebar();
  const recolhida = state === "collapsed";
  const caminho = useRouterState({ select: (r) => r.location.pathname });
  const { sair, usuario, admin } = useAuth();
  const itens = admin ? [...itensGerais, ...itensAdministrativos] : itensGerais;

  function recolherMenu() {
    setOpen(false);
    setOpenMobile(false);
  }

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
                    <Link to={item.url} className="flex items-center gap-3" onClick={recolherMenu}>
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
        {!recolhida && usuario && (
          <div className="mb-2 min-w-0 px-2">
            <p className="truncate text-sm font-medium">{usuario.nome}</p>
            <p className="text-xs capitalize text-muted-foreground">{usuario.perfil}</p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sair"
              onClick={() => {
                recolherMenu();
                void sair();
              }}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
