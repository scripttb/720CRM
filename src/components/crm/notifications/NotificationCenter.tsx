"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  Bell, 
  Check, 
  X, 
  Calendar, 
  Target, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Info,
  Trash2
} from 'lucide-react';
import { AngolaDateDisplay } from '@/components/angola/AngolaDateTimePicker';
import { toast } from 'sonner';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  relatedEntity?: {
    type: 'company' | 'contact' | 'opportunity' | 'activity';
    id: number;
    name: string;
  };
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'warning',
    title: 'Oportunidade prestes a vencer',
    message: 'A oportunidade "Sistema CRM - Sonangol" tem data de fecho para amanhã',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    relatedEntity: {
      type: 'opportunity',
      id: 1,
      name: 'Sistema CRM - Sonangol'
    }
  },
  {
    id: 2,
    type: 'success',
    title: 'Fatura paga',
    message: 'A fatura FT A2024/000002 foi paga integralmente',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 3,
    type: 'info',
    title: 'Nova atividade agendada',
    message: 'Reunião com BFA agendada para 15/02/2024 às 14:00',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
    relatedEntity: {
      type: 'activity',
      id: 1,
      name: 'Reunião com BFA'
    }
  },
  {
    id: 4,
    type: 'warning',
    title: 'Atividade em atraso',
    message: 'A tarefa "Preparar proposta" está em atraso há 2 dias',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true,
    relatedEntity: {
      type: 'activity',
      id: 2,
      name: 'Preparar proposta'
    }
  },
  {
    id: 5,
    type: 'info',
    title: 'Novo contacto adicionado',
    message: 'Carlos Mendes foi adicionado como contacto da Unitel',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: true,
    relatedEntity: {
      type: 'contact',
      id: 3,
      name: 'Carlos Mendes'
    }
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'error':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getEntityIcon = (entityType?: string) => {
    switch (entityType) {
      case 'company':
        return <Users className="h-3 w-3" />;
      case 'contact':
        return <Users className="h-3 w-3" />;
      case 'opportunity':
        return <Target className="h-3 w-3" />;
      case 'activity':
        return <Calendar className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    toast.success('Todas as notificações marcadas como lidas');
  };

  const deleteNotification = (notificationId: number) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
    toast.success('Notificação eliminada');
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="mr-1 h-3 w-3" />
              Marcar todas como lidas
            </Button>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="mx-auto h-8 w-8 mb-2" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div 
                    className={`p-4 hover:bg-muted/50 cursor-pointer ${
                      !notification.read ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                    }`}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                          
                          {notification.relatedEntity && (
                            <div className="flex items-center gap-1">
                              {getEntityIcon(notification.relatedEntity.type)}
                              <span className="text-xs text-muted-foreground">
                                {notification.relatedEntity.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              Ver todas as notificações
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}