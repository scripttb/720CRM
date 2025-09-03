"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
    href: '/dashboard/companies/new',
    icon: Building2,
  },
  {
    name: 'Novo Contacto',
    href: '/dashboard/contacts/new',
    icon: Users,
  },
  {
    name: 'Nova Oportunidade',
    href: '/dashboard/opportunities/new',
    icon: Target,
  },
  {
    name: 'Nova Actividade',
    href: '/dashboard/activities/new',
    icon: Calendar,
  },
  {
    name: 'Nova Fatura',
    href: '/dashboard/billing/invoices/new',
    icon: Receipt,
  },
];

export function CRMSidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col border-r bg-background",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Sistema CRM</span>
          </div>
        )}
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
                  <Link key={action.name} href={action.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 h-8"
                    >
                      <Plus className="h-3 w-3" />
                      {action.name}
                    </Button>
                  </Link>
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
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      collapsed ? "px-2" : "px-3",
                      isActive && "bg-secondary"
                    )}
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
    </div>
  );
}
