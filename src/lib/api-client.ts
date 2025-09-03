// Cliente API melhorado com fallback robusto para mock data
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { 
  mockCompanies, 
  mockContacts, 
  mockOpportunities, 
  mockActivities, 
  mockUsers,
  getMockDashboardStats,
  mockPipelineStages
} from '@/lib/mock-data'
import type { Company, Contact, Opportunity, Activity, User, PipelineStage } from '@/types/crm'

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Função para simular delay de rede
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300))

// Cache simples para melhorar performance
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

async function apiRequest<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  await simulateNetworkDelay()
  
  try {
    // Check cache first for GET requests
    if (!options?.method || options.method === 'GET') {
      const cached = getCachedData(endpoint);
      if (cached) {
        return cached as T;
      }
    }
    
    // Always use mock data for demonstration
    const result = getMockData(endpoint, options) as T;
    
    // Cache GET requests
    if (!options?.method || options.method === 'GET') {
      setCachedData(endpoint, result);
    }
    
    return result;
  } catch (error) {
    console.warn('API request failed, using mock data:', error)
    return getMockData(endpoint, options) as T
  }
}

function getMockData(endpoint: string, options?: RequestInit): any {
  const method = options?.method || 'GET'
  const body = options?.body ? JSON.parse(options.body as string) : null
  
  // Parse endpoint and parameters
  const [path, queryString] = endpoint.split('?')
  const params = new URLSearchParams(queryString || '')
  
  switch (true) {
    case path.includes('/companies'):
      return handleCompaniesEndpoint(method, body, params)
    case path.includes('/contacts'):
      return handleContactsEndpoint(method, body, params)
    case path.includes('/opportunities'):
      return handleOpportunitiesEndpoint(method, body, params)
    case path.includes('/activities'):
      return handleActivitiesEndpoint(method, body, params)
    case path.includes('/pipeline-stages'):
      return handlePipelineStagesEndpoint(method, body, params)
    case path.includes('/users'):
      return handleUsersEndpoint(method, body, params)
    case path.includes('/dashboard/stats'):
      return getMockDashboardStats()
    default:
      return []
  }
}

// Handlers para cada endpoint
function handleCompaniesEndpoint(method: string, body: any, params: URLSearchParams) {
  switch (method) {
    case 'GET':
      let companies = [...mockCompanies]
      const search = params.get('search')
      const industry = params.get('industry')
      const size = params.get('size')
      const province = params.get('province')
      
      if (search) {
        companies = companies.filter(c => 
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.industry?.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      if (industry && industry !== 'all') {
        companies = companies.filter(c => c.industry === industry)
      }
      
      if (size && size !== 'all') {
        companies = companies.filter(c => c.size === size)
      }
      
      if (province && province !== 'all') {
        companies = companies.filter(c => (c as any).province === province)
      }
      
      return companies
    case 'POST':
      const newCompany: Company = {
        id: Math.max(...mockCompanies.map(c => c.id)) + 1,
        ...body,
        create_time: new Date().toISOString(),
        modify_time: new Date().toISOString(),
      }
      mockCompanies.unshift(newCompany)
      
      // Clear cache
      cache.clear()
      
      return newCompany
    case 'PUT':
      const companyId = parseInt(params.get('id') || '0')
      const companyIndex = mockCompanies.findIndex(c => c.id === companyId)
      if (companyIndex !== -1) {
        mockCompanies[companyIndex] = {
          ...mockCompanies[companyIndex],
          ...body,
          modify_time: new Date().toISOString(),
        }
        
        // Clear cache
        cache.clear()
        
        return mockCompanies[companyIndex]
      }
      throw new Error('Company not found')
    case 'DELETE':
      const deleteCompanyId = parseInt(params.get('id') || '0')
      const deleteIndex = mockCompanies.findIndex(c => c.id === deleteCompanyId)
      if (deleteIndex !== -1) {
        mockCompanies.splice(deleteIndex, 1)
        
        // Clear cache
        cache.clear()
        
        return { success: true }
      }
      throw new Error('Company not found')
    default:
      return []
  }
}

function handleContactsEndpoint(method: string, body: any, params: URLSearchParams) {
  switch (method) {
    case 'GET':
      let contacts = [...mockContacts]
      const search = params.get('search')
      const companyId = params.get('company_id')
      
      if (search) {
        contacts = contacts.filter(c => 
          c.first_name.toLowerCase().includes(search.toLowerCase()) ||
          c.last_name.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase()) ||
          c.job_title?.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      if (companyId && companyId !== 'all') {
        contacts = contacts.filter(c => c.company_id === parseInt(companyId))
      }
      
      return contacts
    case 'POST':
      const newContact: Contact = {
        id: Math.max(...mockContacts.map(c => c.id)) + 1,
        ...body,
        create_time: new Date().toISOString(),
        modify_time: new Date().toISOString(),
      }
      mockContacts.unshift(newContact)
      
      // Clear cache
      cache.clear()
      
      return newContact
    case 'PUT':
      const contactId = parseInt(params.get('id') || '0')
      const contactIndex = mockContacts.findIndex(c => c.id === contactId)
      if (contactIndex !== -1) {
        mockContacts[contactIndex] = {
          ...mockContacts[contactIndex],
          ...body,
          modify_time: new Date().toISOString(),
        }
        
        // Clear cache
        cache.clear()
        
        return mockContacts[contactIndex]
      }
      throw new Error('Contact not found')
    case 'DELETE':
      const deleteContactId = parseInt(params.get('id') || '0')
      const deleteIndex = mockContacts.findIndex(c => c.id === deleteContactId)
      if (deleteIndex !== -1) {
        mockContacts.splice(deleteIndex, 1)
        
        // Clear cache
        cache.clear()
        
        return { success: true }
      }
      throw new Error('Contact not found')
    default:
      return []
  }
}

function handleOpportunitiesEndpoint(method: string, body: any, params: URLSearchParams) {
  switch (method) {
    case 'GET':
      let opportunities = [...mockOpportunities]
      const search = params.get('search')
      const status = params.get('status')
      const stageId = params.get('stage_id')
      
      if (search) {
        opportunities = opportunities.filter(o => 
          o.name.toLowerCase().includes(search.toLowerCase()) ||
          o.description?.toLowerCase().includes(search.toLowerCase()) ||
          o.source?.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      if (status && status !== 'all') {
        opportunities = opportunities.filter(o => o.status === status)
      }
      
      if (stageId && stageId !== 'all') {
        opportunities = opportunities.filter(o => o.pipeline_stage_id === parseInt(stageId))
      }
      
      return opportunities
    case 'POST':
      const newOpportunity: Opportunity = {
        id: Math.max(...mockOpportunities.map(o => o.id)) + 1,
        ...body,
        create_time: new Date().toISOString(),
        modify_time: new Date().toISOString(),
      }
      mockOpportunities.unshift(newOpportunity)
      
      // Clear cache
      cache.clear()
      
      return newOpportunity
    case 'PUT':
      const opportunityId = parseInt(params.get('id') || '0')
      const opportunityIndex = mockOpportunities.findIndex(o => o.id === opportunityId)
      if (opportunityIndex !== -1) {
        mockOpportunities[opportunityIndex] = {
          ...mockOpportunities[opportunityIndex],
          ...body,
          modify_time: new Date().toISOString(),
        }
        
        // Clear cache
        cache.clear()
        
        return mockOpportunities[opportunityIndex]
      }
      throw new Error('Opportunity not found')
    case 'DELETE':
      const deleteOpportunityId = parseInt(params.get('id') || '0')
      const deleteIndex = mockOpportunities.findIndex(o => o.id === deleteOpportunityId)
      if (deleteIndex !== -1) {
        mockOpportunities.splice(deleteIndex, 1)
        
        // Clear cache
        cache.clear()
        
        return { success: true }
      }
      throw new Error('Opportunity not found')
    default:
      return []
  }
}

function handleActivitiesEndpoint(method: string, body: any, params: URLSearchParams) {
  switch (method) {
    case 'GET':
      let activities = [...mockActivities]
      const type = params.get('type')
      const status = params.get('status')
      const assignedUserId = params.get('assigned_user_id')
      
      if (type && type !== 'all') {
        activities = activities.filter(a => a.type === type)
      }
      
      if (status && status !== 'all') {
        activities = activities.filter(a => a.status === status)
      }
      
      if (assignedUserId && assignedUserId !== 'all') {
        activities = activities.filter(a => a.assigned_user_id === parseInt(assignedUserId))
      }
      
      // Sort by due date
      activities.sort((a, b) => {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });
      
      return activities
    case 'POST':
      const newActivity: Activity = {
        id: Math.max(...mockActivities.map(a => a.id)) + 1,
        ...body,
        create_time: new Date().toISOString(),
        modify_time: new Date().toISOString(),
      }
      mockActivities.unshift(newActivity)
      
      // Clear cache
      cache.clear()
      
      return newActivity
    case 'PUT':
      const activityId = parseInt(params.get('id') || '0')
      const activityIndex = mockActivities.findIndex(a => a.id === activityId)
      if (activityIndex !== -1) {
        mockActivities[activityIndex] = {
          ...mockActivities[activityIndex],
          ...body,
          modify_time: new Date().toISOString(),
        }
        
        // Clear cache
        cache.clear()
        
        return mockActivities[activityIndex]
      }
      throw new Error('Activity not found')
    case 'DELETE':
      const deleteActivityId = parseInt(params.get('id') || '0')
      const deleteIndex = mockActivities.findIndex(a => a.id === deleteActivityId)
      if (deleteIndex !== -1) {
        mockActivities.splice(deleteIndex, 1)
        
        // Clear cache
        cache.clear()
        
        return { success: true }
      }
      throw new Error('Activity not found')
    default:
      return []
  }
}

function handlePipelineStagesEndpoint(method: string, body: any, params: URLSearchParams) {
  switch (method) {
    case 'GET':
      return mockPipelineStages.sort((a, b) => a.stage_order - b.stage_order)
    default:
      return mockPipelineStages
  }
}

function handleUsersEndpoint(method: string, body: any, params: URLSearchParams) {
  switch (method) {
    case 'GET':
      return mockUsers.filter(u => u.is_active)
    default:
      return mockUsers
  }
}

// HTTP methods
export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, string>) => {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint
    return apiRequest<T>(url, { method: "GET" })
  },

  post: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  put: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
}

// Clear cache function
export const clearApiCache = () => {
  cache.clear();
};

export { ApiError }