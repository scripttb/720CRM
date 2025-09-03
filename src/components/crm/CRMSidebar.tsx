import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/components/ui/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard,
  Building2,
  Users,
  Target,
  Calendar,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Receipt
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: 'Painel Principal',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Empresas',
    href: '/dashboard/companies',
    icon: Building2,
  },
  {
    name: 'Contactos',
    href: '/dashboard/contacts',
    icon: Users,
  },
  {
    name: 'Oportunidades',
    href: '/dashboard/opportunities',
    icon: Target,
  },
  {
    name: 'Actividades',
    href: '/dashboard/activities',
    icon: Calendar,
  },
  {
    name: 'Comunicações',
    href: '/dashboard/communications',
    icon: MessageSquare,
  },
  {
    name: 'Faturação',
    href: '/dashboard/billing',
    icon: Receipt,
  },
  {
    name: 'Documentos',
    href: '/dashboard/documents',
    icon: FileText,
  },
  {
    name: 'Relatórios',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    name: 'Configurações',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

const quickActions = [
  {
    name: 'Nova Empresa',
    action: 'company',
    icon: Building2,
  },
  {
    name: 'Novo Contacto',
    action: 'contact',
    icon: Users,
  },
  {
    name: 'Nova Oportunidade',
    action: 'opportunity',
    icon: Target,
  },
  {
    name: 'Nova Actividade',
    action: 'activity',
    icon: Calendar,
  },
  {
    name: 'Nova Fatura',
    action: 'invoice',
    icon: Receipt,
  },
];

interface CRMSidebarProps extends SidebarProps {
  onQuickAction?: (action: string) => void;
}

export function CRMSidebar({ className, onQuickAction }: CRMSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Sistema CRM</span>
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Quick Actions */}
          {!collapsed && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Acções Rápidas
              </h3>
              <div className="space-y-1">
                {quickActions.map((action) => (
                  <Button
                    key={action.name}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 h-8"
                    onClick={() => {
                      onQuickAction?.(action.action);
                      if (isMobile) setMobileOpen(false);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    {action.name}
                  </Button>
                ))}
              </div>
              <Separator className="my-4" />
            </div>
          )}

          {/* Navigation */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                              (pathname.startsWith(item.href + '/') && item.href !== '/dashboard');
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      collapsed ? "px-2" : "px-3",
                      isActive && "bg-secondary"
                    )}
                    onClick={() => {
                      if (isMobile) setMobileOpen(false);
                    }}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </ScrollArea>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <LayoutDashboard className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <div className={cn(
      "flex flex-col border-r bg-background",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      <SidebarContent />
    </div>
  );
}
