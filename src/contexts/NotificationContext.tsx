import React, { createContext, useContext } from 'react';
import { useNotifications } from '@/hooks/use-notifications';

const NotificationContext = createContext<ReturnType<typeof useNotifications> | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const notifications = useNotifications();

  return (
    <NotificationContext.Provider value={notifications}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}