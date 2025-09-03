// Hook personalizado para gestão de empresas
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';
import { Company } from '@/types/crm';
import { toast } from 'sonner';

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    industry: 'all',
    size: 'all',
    province: 'all'
  });

  // Fetch companies with filters
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (filters.industry !== 'all') {
        params.industry = filters.industry;
      }
      
      if (filters.size !== 'all') {
        params.size = filters.size;
      }
      
      if (filters.province !== 'all') {
        params.province = filters.province;
      }
      
      const data = await api.get<Company[]>('/companies', params);
      setCompanies(data);
    } catch (error) {
      toast.error('Erro ao carregar empresas');
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCompanies();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchCompanies]);

  // Create company
  const createCompany = useCallback(async (companyData: Partial<Company>) => {
    try {
      const newCompany = await api.post<Company>('/companies', companyData);
      setCompanies(prev => [newCompany, ...prev]);
      toast.success('Empresa criada com sucesso');
      return newCompany;
    } catch (error) {
      toast.error('Erro ao criar empresa');
      throw error;
    }
  }, []);

  // Update company
  const updateCompany = useCallback(async (id: number, companyData: Partial<Company>) => {
    try {
      const updatedCompany = await api.put<Company>(`/companies?id=${id}`, companyData);
      setCompanies(prev => prev.map(c => c.id === id ? updatedCompany : c));
      toast.success('Empresa atualizada com sucesso');
      return updatedCompany;
    } catch (error) {
      toast.error('Erro ao atualizar empresa');
      throw error;
    }
  }, []);

  // Delete company
  const deleteCompany = useCallback(async (id: number) => {
    try {
      await api.delete(`/companies?id=${id}`);
      setCompanies(prev => prev.filter(c => c.id !== id));
      toast.success('Empresa eliminada com sucesso');
    } catch (error) {
      toast.error('Erro ao eliminar empresa');
      throw error;
    }
  }, []);

  // Get company by ID
  const getCompanyById = useCallback((id: number) => {
    return companies.find(c => c.id === id);
  }, [companies]);

  // Get companies by industry
  const getCompaniesByIndustry = useCallback((industry: string) => {
    return companies.filter(c => c.industry === industry);
  }, [companies]);

  // Get companies statistics
  const getStatistics = useCallback(() => {
    const totalRevenue = companies.reduce((sum, c) => sum + (c.annual_revenue || 0), 0);
    const totalEmployees = companies.reduce((sum, c) => sum + (c.employee_count || 0), 0);
    const averageRevenue = totalRevenue / (companies.length || 1);
    
    const industriesCount = companies.reduce((acc, c) => {
      if (c.industry) {
        acc[c.industry] = (acc[c.industry] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const sizesCount = companies.reduce((acc, c) => {
      if (c.size) {
        acc[c.size] = (acc[c.size] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total: companies.length,
      totalRevenue,
      totalEmployees,
      averageRevenue,
      industriesCount,
      sizesCount
    };
  }, [companies]);

  return {
    // Data
    companies,
    loading,
    searchQuery,
    filters,
    
    // Actions
    setSearchQuery,
    setFilters,
    createCompany,
    updateCompany,
    deleteCompany,
    refreshData: fetchCompanies,
    
    // Utils
    getCompanyById,
    getCompaniesByIndustry,
    getStatistics
  };
}