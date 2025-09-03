import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  relatedEntity?: {
    type: 'company' | 'contact' | 'opportunity' | 'activity' | 'invoice';
    id: number;
    name: string;
  };
  autoDelete?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    autoMarkRead: false
  });

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('crm_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }

    const savedPrefs = localStorage.getItem('crm_notification_preferences');
    if (savedPrefs) {
      try {
        setPreferences(JSON.parse(savedPrefs));
      } catch (error) {
        console.error('Error loading notification preferences:', error);
      }
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('crm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('crm_notification_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50 notifications

    // Show toast if enabled
    if (preferences.pushNotifications) {
      switch (notification.type) {
        case 'success':
          toast.success(notification.title, { description: notification.message });
          break;
        case 'error':
          toast.error(notification.title, { description: notification.message });
          break;
        case 'warning':
          toast.warning(notification.title, { description: notification.message });
          break;
        default:
          toast.info(notification.title, { description: notification.message });
      }
    }

    // Auto-delete if specified
    if (notification.autoDelete) {
      setTimeout(() => {
        deleteNotification(newNotification.id);
      }, 5000);
    }

    return newNotification.id;
  }, [preferences.pushNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Notification triggers for business events
  const notifyOpportunityClosing = useCallback((opportunityName: string, daysLeft: number) => {
    addNotification({
      type: 'warning',
      title: 'Oportunidade prestes a vencer',
      message: `A oportunidade "${opportunityName}" tem data de fecho em ${daysLeft} dia(s)`,
      relatedEntity: {
        type: 'opportunity',
        id: 0,
        name: opportunityName
      },
      priority: 'high'
    });
  }, [addNotification]);

  const notifyInvoicePaid = useCallback((invoiceNumber: string, amount: number) => {
    addNotification({
      type: 'success',
      title: 'Fatura paga',
      message: `A fatura ${invoiceNumber} foi paga no valor de Kz ${amount.toLocaleString('pt-AO')}`,
      relatedEntity: {
        type: 'invoice',
        id: 0,
        name: invoiceNumber
      },
      priority: 'medium'
    });
  }, [addNotification]);

  const notifyActivityOverdue = useCallback((activityName: string, daysOverdue: number) => {
    addNotification({
      type: 'error',
      title: 'Atividade em atraso',
      message: `A atividade "${activityName}" está em atraso há ${daysOverdue} dia(s)`,
      relatedEntity: {
        type: 'activity',
        id: 0,
        name: activityName
      },
      priority: 'high'
    });
  }, [addNotification]);

  const notifyNewContact = useCallback((contactName: string, companyName: string) => {
    addNotification({
      type: 'info',
      title: 'Novo contacto adicionado',
      message: `${contactName} foi adicionado como contacto de ${companyName}`,
      relatedEntity: {
        type: 'contact',
        id: 0,
        name: contactName
      },
      priority: 'low',
      autoDelete: true
    });
  }, [addNotification]);

  return {
    notifications,
    preferences,
    setPreferences,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
    // Business event triggers
    notifyOpportunityClosing,
    notifyInvoicePaid,
    notifyActivityOverdue,
    notifyNewContact
  };
}