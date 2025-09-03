import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@/types/crm';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
      setError(null);

      // Try mock authentication first (since database might not be set up)
      const mockUser = mockUsers.find(u => u.email === email && u.password === password);
      if (mockUser) {
        const user: User = {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
          avatar: mockUser.avatar
        };
        setUser(user);
        localStorage.setItem('crm_user', JSON.stringify(user));
        return;
      }

      // Try Supabase authentication first, fallback to mock if it fails
      try {
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
      // Try Supabase authentication as fallback
      try {
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
  };

  const mockLogin = (email: string, password: string): boolean => {
    // Mock users for demonstration
    const mockUsers = [
      {
        email: 'demo@crm.com',
        password: 'password',
        user: {
          id: 1,
          email: 'demo@crm.com',
          first_name: 'António',
          last_name: 'Silva',
          role: 'sales_manager' as const,
          phone: '+244-923-123-456',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          is_active: true,
          last_login: new Date().toISOString(),
          create_time: new Date().toISOString(),
          modify_time: new Date().toISOString(),
        }
      },
      {
        email: 'admin@crm.com',
        password: 'password',
        user: {
          id: 2,
          email: 'admin@crm.com',
          first_name: 'Maria',
          last_name: 'Santos',
          role: 'admin' as const,
          phone: '+244-923-456-789',
          avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          is_active: true,
          last_login: new Date().toISOString(),
          create_time: new Date().toISOString(),
          modify_time: new Date().toISOString(),
        }
      },
      {
        email: 'vendedor@crm.com',
        password: 'password',
        user: {
          id: 3,
          email: 'vendedor@crm.com',
          first_name: 'João',
          last_name: 'Pereira',
          role: 'sales_rep' as const,
          phone: '+244-923-789-123',
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          is_active: true,
          last_login: new Date().toISOString(),
          create_time: new Date().toISOString(),
          modify_time: new Date().toISOString(),
        }
      }
    ];

    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (mockUser) {
      setUser(mockUser.user);
      localStorage.setItem('crm_user', JSON.stringify(mockUser.user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    if (isSupabaseConfigured()) {
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
