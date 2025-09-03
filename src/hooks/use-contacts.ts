// Hook personalizado para gestão de contactos
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';
import { Contact, Company } from '@/types/crm';
import { toast } from 'sonner';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    company_id: 'all',
    department: 'all',
    is_primary: 'all'
  });

  // Fetch contacts with filters
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (filters.company_id !== 'all') {
        params.company_id = filters.company_id;
      }
      
      if (filters.department !== 'all') {
        params.department = filters.department;
      }
      
      if (filters.is_primary !== 'all') {
        params.is_primary = filters.is_primary;
      }
      
      const data = await api.get<Contact[]>('/contacts', params);
      setContacts(data);
    } catch (error) {
      toast.error('Erro ao carregar contactos');
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchContacts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchContacts]);

  // Create contact
  const createContact = useCallback(async (contactData: Partial<Contact>) => {
    try {
      const newContact = await api.post<Contact>('/contacts', contactData);
      setContacts(prev => [newContact, ...prev]);
      toast.success('Contacto criado com sucesso');
      return newContact;
    } catch (error) {
      toast.error('Erro ao criar contacto');
      throw error;
    }
  }, []);

  // Update contact
  const updateContact = useCallback(async (id: number, contactData: Partial<Contact>) => {
    try {
      const updatedContact = await api.put<Contact>(`/contacts?id=${id}`, contactData);
      setContacts(prev => prev.map(c => c.id === id ? updatedContact : c));
      toast.success('Contacto atualizado com sucesso');
      return updatedContact;
    } catch (error) {
      toast.error('Erro ao atualizar contacto');
      throw error;
    }
  }, []);

  // Delete contact
  const deleteContact = useCallback(async (id: number) => {
    try {
      await api.delete(`/contacts?id=${id}`);
      setContacts(prev => prev.filter(c => c.id !== id));
      toast.success('Contacto eliminado com sucesso');
    } catch (error) {
      toast.error('Erro ao eliminar contacto');
      throw error;
    }
  }, []);

  // Get contact by ID
  const getContactById = useCallback((id: number) => {
    return contacts.find(c => c.id === id);
  }, [contacts]);

  // Get contacts by company
  const getContactsByCompany = useCallback((companyId: number) => {
    return contacts.filter(c => c.company_id === companyId);
  }, [contacts]);

  // Get primary contacts
  const getPrimaryContacts = useCallback(() => {
    return contacts.filter(c => c.is_primary);
  }, [contacts]);

  // Get statistics
  const getStatistics = useCallback(() => {
    const totalContacts = contacts.length;
    const primaryContacts = contacts.filter(c => c.is_primary).length;
    const contactsWithEmail = contacts.filter(c => c.email).length;
    const contactsWithPhone = contacts.filter(c => c.phone || c.mobile).length;
    
    const departmentsCount = contacts.reduce((acc, c) => {
      if (c.department) {
        acc[c.department] = (acc[c.department] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalContacts,
      primary: primaryContacts,
      withEmail: contactsWithEmail,
      withPhone: contactsWithPhone,
      departmentsCount
    };
  }, [contacts]);

  return {
    // Data
    contacts,
    loading,
    searchQuery,
    filters,
    
    // Actions
    setSearchQuery,
    setFilters,
    createContact,
    updateContact,
    deleteContact,
    refreshData: fetchContacts,
    
    // Utils
    getContactById,
    getContactsByCompany,
    getPrimaryContacts,
    getStatistics
  };
}