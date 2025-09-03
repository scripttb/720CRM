// Hook personalizado para gestão de atividades
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';
import { Activity } from '@/types/crm';
import { toast } from 'sonner';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all',
    assigned_user_id: 'all',
    company_id: 'all'
  });

  // Fetch activities with filters
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (filters.type !== 'all') {
        params.type = filters.type;
      }
      
      if (filters.status !== 'all') {
        params.status = filters.status;
      }
      
      if (filters.priority !== 'all') {
        params.priority = filters.priority;
      }
      
      if (filters.assigned_user_id !== 'all') {
        params.assigned_user_id = filters.assigned_user_id;
      }
      
      if (filters.company_id !== 'all') {
        params.company_id = filters.company_id;
      }
      
      const data = await api.get<Activity[]>('/activities', params);
      setActivities(data);
    } catch (error) {
      toast.error('Erro ao carregar atividades');
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchActivities();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchActivities]);

  // Create activity
  const createActivity = useCallback(async (activityData: Partial<Activity>) => {
    try {
      const newActivity = await api.post<Activity>('/activities', {
        ...activityData,
        assigned_user_id: activityData.assigned_user_id || 1,
        created_by_user_id: 1
      });
      setActivities(prev => [newActivity, ...prev]);
      toast.success('Atividade criada com sucesso');
      return newActivity;
    } catch (error) {
      toast.error('Erro ao criar atividade');
      throw error;
    }
  }, []);

  // Update activity
  const updateActivity = useCallback(async (id: number, activityData: Partial<Activity>) => {
    try {
      const updatedActivity = await api.put<Activity>(`/activities?id=${id}`, activityData);
      setActivities(prev => prev.map(a => a.id === id ? updatedActivity : a));
      toast.success('Atividade atualizada com sucesso');
      return updatedActivity;
    } catch (error) {
      toast.error('Erro ao atualizar atividade');
      throw error;
    }
  }, []);

  // Delete activity
  const deleteActivity = useCallback(async (id: number) => {
    try {
      await api.delete(`/activities?id=${id}`);
      setActivities(prev => prev.filter(a => a.id !== id));
      toast.success('Atividade eliminada com sucesso');
    } catch (error) {
      toast.error('Erro ao eliminar atividade');
      throw error;
    }
  }, []);

  // Mark as completed
  const markAsCompleted = useCallback(async (id: number) => {
    try {
      const updatedActivity = await api.put<Activity>(`/activities?id=${id}`, {
        status: 'completed',
        completed_date: new Date().toISOString()
      });
      setActivities(prev => prev.map(a => a.id === id ? updatedActivity : a));
      toast.success('Atividade marcada como concluída');
      return updatedActivity;
    } catch (error) {
      toast.error('Erro ao marcar atividade como concluída');
      throw error;
    }
  }, []);

  // Get upcoming activities
  const getUpcomingActivities = useCallback(() => {
    const now = new Date();
    return activities
      .filter(a => a.due_date && new Date(a.due_date) > now && a.status === 'pending')
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());
  }, [activities]);

  // Get overdue activities
  const getOverdueActivities = useCallback(() => {
    const now = new Date();
    return activities
      .filter(a => a.due_date && new Date(a.due_date) < now && a.status === 'pending')
      .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());
  }, [activities]);

  // Get statistics
  const getStatistics = useCallback(() => {
    const total = activities.length;
    const pending = activities.filter(a => a.status === 'pending').length;
    const completed = activities.filter(a => a.status === 'completed').length;
    const overdue = getOverdueActivities().length;
    const upcoming = getUpcomingActivities().length;
    
    const typeDistribution = activities.reduce((acc, a) => {
      acc[a.type] = (acc[a.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityDistribution = activities.reduce((acc, a) => {
      acc[a.priority] = (acc[a.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      pending,
      completed,
      overdue,
      upcoming,
      completionRate: (completed / (total || 1)) * 100,
      typeDistribution,
      priorityDistribution
    };
  }, [activities, getOverdueActivities, getUpcomingActivities]);

  return {
    // Data
    activities,
    loading,
    searchQuery,
    filters,
    
    // Actions
    setSearchQuery,
    setFilters,
    createActivity,
    updateActivity,
    deleteActivity,
    markAsCompleted,
    refreshData: fetchActivities,
    
    // Utils
    getUpcomingActivities,
    getOverdueActivities,
    getStatistics
  };
}