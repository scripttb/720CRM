// Cliente API para Supabase
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { getMockDashboardStats } from '@/lib/mock-data'
import { mockData } from '../data/mock-data';

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    if (!isSupabaseConfigured()) {
      // Return mock data when Supabase is not configured
      if (endpoint === '/dashboard/stats') {
        return getMockDashboardStats() as T
      }
      return [] as T
    }

    // Check if we're in fallback mode (no database tables)
    if (endpoint.includes('companies') || endpoint.includes('contacts') || 
        endpoint.includes('opportunities') || endpoint.includes('activities')) {
      return getMockData(endpoint) as T;
    }

    // Handle different endpoints with Supabase
    switch (endpoint) {
      case '/companies':
        const { data: companies, error: companiesError } = await supabase
          .from('companies')
          .select('*')
          .order('created_at', { ascending: false })
        if (companiesError) throw companiesError
        return companies as T

      case '/contacts':
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select(`
            *,
            companies (
              id,
              name
            )
          `)
          .order('created_at', { ascending: false })
        if (contactsError) throw contactsError
        return contacts as T

      case '/opportunities':
        const { data: opportunities, error: opportunitiesError } = await supabase
          .from('opportunities')
          .select(`
            *,
            companies (
              id,
              name
            ),
            contacts (
              id,
              first_name,
              last_name
            )
          `)
          .order('created_at', { ascending: false })
        if (opportunitiesError) throw opportunitiesError
        return opportunities as T

      case '/dashboard/stats':
        return getMockDashboardStats() as T

      default:
        return [] as T
    }
  } catch (error) {
    console.warn('API request failed, using mock data:', error);
    return getMockData(endpoint) as T;
  }
}

function getMockData(endpoint: string): any {
  switch (true) {
    case endpoint.includes('companies'):
      return mockData.companies;
    case endpoint.includes('contacts'):
      return mockData.contacts;
    case endpoint.includes('opportunities'):
      return mockData.opportunities;
    case endpoint.includes('activities'):
      return mockData.activities;
    case endpoint.includes('users'):
      return mockData.users;
    default:
      return [];
  }
}

// HTTP 方法的便捷函数
export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, string>) => {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint
    return apiRequest<T>(url, { method: "GET" })
  },

  post: <T = any>(endpoint: string, data?: any) =>
    handleMutation<T>(endpoint, 'POST', data),

  put: <T = any>(endpoint: string, data?: any) =>
    handleMutation<T>(endpoint, 'PUT', data),

  delete: <T = any>(endpoint: string) => handleMutation<T>(endpoint, 'DELETE'),
}

async function handleMutation<T>(endpoint: string, method: string, data?: any): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase não está configurado')
  }

  try {
    const table = endpoint.split('/')[1]
    
    switch (method) {
      case 'POST':
        const { data: insertData, error: insertError } = await supabase
          .from(table)
          .insert(data)
          .select()
          .single()
        if (insertError) throw insertError
        return insertData as T

      case 'PUT':
        const id = new URLSearchParams(endpoint.split('?')[1] || '').get('id')
        const { data: updateData, error: updateError } = await supabase
          .from(table)
          .update(data)
          .eq('id', id)
          .select()
          .single()
        if (updateError) throw updateError
        return updateData as T

      case 'DELETE':
        const deleteId = new URLSearchParams(endpoint.split('?')[1] || '').get('id')
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', deleteId)
        if (deleteError) throw deleteError
        return { id: deleteId } as T

      default:
        throw new Error(`Método ${method} não suportado`)
    }
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error)
    throw error
  }
}

// 导出 ApiError 以便组件中进行错误处理
export { ApiError }
export type { ApiResponse }