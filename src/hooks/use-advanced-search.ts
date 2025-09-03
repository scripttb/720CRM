import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export interface SearchFilter {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'between' | 'in';
  value: any;
  label: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  description?: string;
  entity: 'companies' | 'contacts' | 'opportunities' | 'activities' | 'invoices';
  query: string;
  filters: SearchFilter[];
  createdAt: Date;
  lastUsed?: Date;
  useCount: number;
}

export interface SearchResult {
  id: number;
  type: 'company' | 'contact' | 'opportunity' | 'activity' | 'invoice';
  title: string;
  subtitle?: string;
  description?: string;
  url: string;
  relevance: number;
  matchedFields: string[];
}

export function useAdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    const saved = localStorage.getItem('crm_saved_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('crm_search_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Save searches to localStorage
  const saveSavedSearches = useCallback((searches: SavedSearch[]) => {
    setSavedSearches(searches);
    localStorage.setItem('crm_saved_searches', JSON.stringify(searches));
  }, []);

  // Save search history
  const saveSearchHistory = useCallback((history: string[]) => {
    setSearchHistory(history);
    localStorage.setItem('crm_search_history', JSON.stringify(history));
  }, []);

  // Add filter
  const addFilter = useCallback((filter: Omit<SearchFilter, 'id'>) => {
    const newFilter: SearchFilter = {
      ...filter,
      id: `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setActiveFilters(prev => [...prev, newFilter]);
  }, []);

  // Remove filter
  const removeFilter = useCallback((filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  // Perform search
  const performSearch = useCallback(async (
    query: string,
    entities: string[] = ['companies', 'contacts', 'opportunities', 'activities', 'invoices']
  ): Promise<SearchResult[]> => {
    if (!query.trim()) return [];

    setIsSearching(true);
    
    try {
      // Add to search history
      if (query.trim() && !searchHistory.includes(query.trim())) {
        const newHistory = [query.trim(), ...searchHistory.slice(0, 9)]; // Keep last 10
        saveSearchHistory(newHistory);
      }

      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Mock search results (in real implementation, this would call API)
      const mockResults: SearchResult[] = [];

      // Search companies
      if (entities.includes('companies')) {
        const companies = JSON.parse(localStorage.getItem('crm_companies') || '[]');
        companies.forEach((company: any) => {
          if (company.name.toLowerCase().includes(query.toLowerCase()) ||
              company.email?.toLowerCase().includes(query.toLowerCase()) ||
              company.industry?.toLowerCase().includes(query.toLowerCase())) {
            mockResults.push({
              id: company.id,
              type: 'company',
              title: company.name,
              subtitle: company.industry,
              description: company.description,
              url: `/dashboard/companies`,
              relevance: calculateRelevance(query, [company.name, company.industry, company.email]),
              matchedFields: getMatchedFields(query, company, ['name', 'industry', 'email'])
            });
          }
        });
      }

      // Search contacts
      if (entities.includes('contacts')) {
        const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
        contacts.forEach((contact: any) => {
          const fullName = `${contact.first_name} ${contact.last_name}`;
          if (fullName.toLowerCase().includes(query.toLowerCase()) ||
              contact.email?.toLowerCase().includes(query.toLowerCase()) ||
              contact.job_title?.toLowerCase().includes(query.toLowerCase())) {
            mockResults.push({
              id: contact.id,
              type: 'contact',
              title: fullName,
              subtitle: contact.job_title,
              description: contact.email,
              url: `/dashboard/contacts`,
              relevance: calculateRelevance(query, [fullName, contact.job_title, contact.email]),
              matchedFields: getMatchedFields(query, contact, ['first_name', 'last_name', 'job_title', 'email'])
            });
          }
        });
      }

      // Sort by relevance
      mockResults.sort((a, b) => b.relevance - a.relevance);

      setSearchResults(mockResults);
      return mockResults;
    } catch (error) {
      toast.error('Erro na pesquisa');
      console.error('Search error:', error);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [searchHistory, saveSearchHistory]);

  // Calculate search relevance
  const calculateRelevance = (query: string, fields: (string | undefined)[]): number => {
    let relevance = 0;
    const queryLower = query.toLowerCase();
    
    fields.forEach(field => {
      if (field) {
        const fieldLower = field.toLowerCase();
        if (fieldLower === queryLower) {
          relevance += 100; // Exact match
        } else if (fieldLower.startsWith(queryLower)) {
          relevance += 80; // Starts with
        } else if (fieldLower.includes(queryLower)) {
          relevance += 60; // Contains
        }
      }
    });
    
    return relevance;
  };

  // Get matched fields
  const getMatchedFields = (query: string, entity: any, fields: string[]): string[] => {
    const queryLower = query.toLowerCase();
    return fields.filter(field => {
      const value = entity[field];
      return value && value.toString().toLowerCase().includes(queryLower);
    });
  };

  // Save current search
  const saveCurrentSearch = useCallback((name: string, description?: string) => {
    if (!searchQuery.trim()) {
      toast.error('Nenhuma pesquisa para salvar');
      return;
    }

    const newSearch: SavedSearch = {
      id: `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      entity: 'companies', // Default, could be dynamic
      query: searchQuery,
      filters: activeFilters,
      createdAt: new Date(),
      useCount: 0
    };

    const newSavedSearches = [newSearch, ...savedSearches];
    saveSavedSearches(newSavedSearches);
    toast.success('Pesquisa salva com sucesso');
  }, [searchQuery, activeFilters, savedSearches, saveSavedSearches]);

  // Load saved search
  const loadSavedSearch = useCallback((searchId: string) => {
    const search = savedSearches.find(s => s.id === searchId);
    if (search) {
      setSearchQuery(search.query);
      setActiveFilters(search.filters);
      
      // Update use count and last used
      const updatedSearches = savedSearches.map(s => 
        s.id === searchId 
          ? { ...s, useCount: s.useCount + 1, lastUsed: new Date() }
          : s
      );
      saveSavedSearches(updatedSearches);
    }
  }, [savedSearches, saveSavedSearches]);

  // Delete saved search
  const deleteSavedSearch = useCallback((searchId: string) => {
    const newSavedSearches = savedSearches.filter(s => s.id !== searchId);
    saveSavedSearches(newSavedSearches);
    toast.success('Pesquisa eliminada');
  }, [savedSearches, saveSavedSearches]);

  // Get search suggestions
  const getSearchSuggestions = useCallback((query: string): string[] => {
    if (!query.trim()) return searchHistory.slice(0, 5);
    
    const suggestions = searchHistory.filter(h => 
      h.toLowerCase().includes(query.toLowerCase()) && h !== query
    );
    
    return suggestions.slice(0, 5);
  }, [searchHistory]);

  // Clear search history
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('crm_search_history');
    toast.success('Histórico de pesquisa limpo');
  }, []);

  // Get filter summary
  const getFilterSummary = useMemo(() => {
    if (activeFilters.length === 0) return '';
    
    const summary = activeFilters.map(f => f.label).join(', ');
    return `Filtros: ${summary}`;
  }, [activeFilters]);

  return {
    // Search state
    searchQuery,
    setSearchQuery,
    activeFilters,
    searchResults,
    isSearching,
    
    // Filter management
    addFilter,
    removeFilter,
    clearFilters,
    getFilterSummary,
    
    // Search operations
    performSearch,
    getSearchSuggestions,
    
    // Saved searches
    savedSearches,
    saveCurrentSearch,
    loadSavedSearch,
    deleteSavedSearch,
    
    // Search history
    searchHistory,
    clearSearchHistory
  };
}