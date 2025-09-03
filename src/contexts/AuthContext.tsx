import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@/types/crm';
import { mockUsers } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Try mock authentication first
      if (mockLogin(email, password)) {
        return true;
      }

      // Try Supabase authentication first, fallback to mock if it fails
      try {
        if (supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            // If Supabase auth fails, try mock login
            console.warn('Supabase auth failed, falling back to mock login:', error.message);
            return mockLogin(email, password);
          }

          if (data.user) {
            // Get user profile from profiles table
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            const user: User = {
              id: parseInt(data.user.id),
              email: data.user.email!,
              first_name: profile?.first_name || '',
              last_name: profile?.last_name || '',
              role: profile?.role || 'sales_rep',
              phone: profile?.phone || '',
              avatar_url: profile?.avatar_url || '',
              is_active: true,
              last_login: new Date().toISOString(),
              create_time: data.user.created_at,
              modify_time: new Date().toISOString(),
            };
            setUser(user);
            localStorage.setItem('crm_user', JSON.stringify(user));
            return true;
          }
        } else {
          // Supabase not configured, use mock login
          return mockLogin(email, password);
        }
      } catch (supabaseError) {
        console.warn('Supabase authentication failed, trying mock login');
        return mockLogin(email, password);
      }

      // Try Supabase authentication as fallback
      try {
        if (supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            const user: User = {
              id: data.user.id,
              email: data.user.email || '',
              firstName: data.user.user_metadata?.firstName || 'User',
              lastName: data.user.user_metadata?.lastName || '',
              role: data.user.user_metadata?.role || 'sales_rep',
              avatar: data.user.user_metadata?.avatar
            };
            setUser(user);
            localStorage.setItem('crm_user', JSON.stringify(user));
            return true;
          }
        }
      } catch (supabaseError) {
        console.warn('Supabase authentication failed:', supabaseError);
        throw new Error('Credenciais inválidas. Use: demo@crm.com / password');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no login';
      console.error('Login error:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const mockLogin = (email: string, password: string): boolean => {
    // Mock credentials for demonstration
    const mockCredentials = [
      {
        email: 'demo@crm.com',
        password: 'password',
        userId: 1
      },
      {
        email: 'admin@crm.com',
        password: 'password',
        userId: 2
      },
      {
        email: 'vendedor@crm.com',
        password: 'password',
        userId: 3
      }
    ];

    const mockCredential = mockCredentials.find(u => u.email === email && u.password === password);
    
    if (mockCredential) {
      const user = mockUsers.find(u => u.id === mockCredential.userId);
      if (user) {
        setUser(user);
        localStorage.setItem('crm_user', JSON.stringify(user));
      }
      return true;
    }
    
    return false;
  };

  const logout = () => {
    if (supabase) {
      supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('crm_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
