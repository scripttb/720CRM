// Hook personalizado para gestão de oportunidades
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';
import { Opportunity, PipelineStage } from '@/types/crm';
import { toast } from 'sonner';

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    stage_id: 'all',
    assigned_user_id: 'all',
    company_id: 'all'
  });

  // Fetch opportunities with filters
  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (filters.status !== 'all') {
        params.status = filters.status;
      }
      
      if (filters.stage_id !== 'all') {
        params.stage_id = filters.stage_id;
      }
      
      if (filters.assigned_user_id !== 'all') {
        params.assigned_user_id = filters.assigned_user_id;
      }
      
      if (filters.company_id !== 'all') {
        params.company_id = filters.company_id;
      }
      
      const data = await api.get<Opportunity[]>('/opportunities', params);
      setOpportunities(data);
    } catch (error) {
      toast.error('Erro ao carregar oportunidades');
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  // Fetch pipeline stages
  const fetchPipelineStages = useCallback(async () => {
    try {
      const data = await api.get<PipelineStage[]>('/pipeline-stages');
      setPipelineStages(data);
    } catch (error) {
      console.error('Error fetching pipeline stages:', error);
    }
  }, []);

  useEffect(() => {
    fetchPipelineStages();
  }, [fetchPipelineStages]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchOpportunities();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchOpportunities]);

  // Create opportunity
  const createOpportunity = useCallback(async (opportunityData: Partial<Opportunity>) => {
    try {
      const newOpportunity = await api.post<Opportunity>('/opportunities', opportunityData);
      setOpportunities(prev => [newOpportunity, ...prev]);
      toast.success('Oportunidade criada com sucesso');
      return newOpportunity;
    } catch (error) {
      toast.error('Erro ao criar oportunidade');
      throw error;
    }
  }, []);

  // Update opportunity
  const updateOpportunity = useCallback(async (id: number, opportunityData: Partial<Opportunity>) => {
    try {
      const updatedOpportunity = await api.put<Opportunity>(`/opportunities?id=${id}`, opportunityData);
      setOpportunities(prev => prev.map(o => o.id === id ? updatedOpportunity : o));
      toast.success('Oportunidade atualizada com sucesso');
      return updatedOpportunity;
    } catch (error) {
      toast.error('Erro ao atualizar oportunidade');
      throw error;
    }
  }, []);

  // Delete opportunity
  const deleteOpportunity = useCallback(async (id: number) => {
    try {
      await api.delete(`/opportunities?id=${id}`);
      setOpportunities(prev => prev.filter(o => o.id !== id));
      toast.success('Oportunidade eliminada com sucesso');
    } catch (error) {
      toast.error('Erro ao eliminar oportunidade');
      throw error;
    }
  }, []);

  // Move opportunity to stage
  const moveToStage = useCallback(async (id: number, stageId: number) => {
    try {
      const stage = pipelineStages.find(s => s.id === stageId);
      const updatedOpportunity = await api.put<Opportunity>(`/opportunities?id=${id}`, {
        pipeline_stage_id: stageId,
        probability: stage?.probability || 0
      });
      setOpportunities(prev => prev.map(o => o.id === id ? updatedOpportunity : o));
      toast.success(`Oportunidade movida para ${stage?.name}`);
      return updatedOpportunity;
    } catch (error) {
      toast.error('Erro ao mover oportunidade');
      throw error;
    }
  }, [pipelineStages]);

  // Get opportunities by stage
  const getOpportunitiesByStage = useCallback((stageId: number) => {
    return opportunities.filter(o => o.pipeline_stage_id === stageId);
  }, [opportunities]);

  // Get statistics
  const getStatistics = useCallback(() => {
    const totalValue = opportunities.reduce((sum, o) => sum + (o.value || 0), 0);
    const openOpportunities = opportunities.filter(o => o.status === 'open');
    const wonOpportunities = opportunities.filter(o => o.status === 'won');
    const lostOpportunities = opportunities.filter(o => o.status === 'lost');
    
    const averageValue = totalValue / (opportunities.length || 1);
    const conversionRate = (wonOpportunities.length / (opportunities.length || 1)) * 100;
    
    const stageDistribution = pipelineStages.map(stage => ({
      stage: stage.name,
      count: opportunities.filter(o => o.pipeline_stage_id === stage.id).length,
      value: opportunities
        .filter(o => o.pipeline_stage_id === stage.id)
        .reduce((sum, o) => sum + (o.value || 0), 0)
    }));

    return {
      total: opportunities.length,
      totalValue,
      averageValue,
      conversionRate,
      open: openOpportunities.length,
      won: wonOpportunities.length,
      lost: lostOpportunities.length,
      stageDistribution
    };
  }, [opportunities, pipelineStages]);

  return {
    // Data
    opportunities,
    pipelineStages,
    loading,
    searchQuery,
    filters,
    
    // Actions
    setSearchQuery,
    setFilters,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    moveToStage,
    refreshData: fetchOpportunities,
    
    // Utils
    getOpportunitiesByStage,
    getStatistics
  };
}