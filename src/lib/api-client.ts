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

async function apiRequest<T = any>(endpoint: string, options?: RequestInit): Promise<T> {
  await simulateNetworkDelay()
  
  try {
    // Sempre usar mock data para demonstração
    return getMockData(endpoint, options) as T
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
      if (search) {
        companies = companies.filter(c => 
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.industry?.toLowerCase().includes(search.toLowerCase())
        )
      }
      return companies
    case 'POST':
      const newCompany: Company = {
        id: Math.max(...mockCompanies.map(c => c.id)) + 1,
        ...body,
        create_time: new Date().toISOString(),
        modify_time: new Date().toISOString(),
      }
      mockCompanies.push(newCompany)
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
        return mockCompanies[companyIndex]
      }
      throw new Error('Company not found')
    case 'DELETE':
      const deleteCompanyId = parseInt(params.get('id') || '0')
      const deleteIndex = mockCompanies.findIndex(c => c.id === deleteCompanyId)
      if (deleteIndex !== -1) {
        mockCompanies.splice(deleteIndex, 1)
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
          c.email?.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      if (companyId) {
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
      mockContacts.push(newContact)
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
        return mockContacts[contactIndex]
      }
      throw new Error('Contact not found')
    case 'DELETE':
      const deleteContactId = parseInt(params.get('id') || '0')
      const deleteIndex = mockContacts.findIndex(c => c.id === deleteContactId)
      if (deleteIndex !== -1) {
        mockContacts.splice(deleteIndex, 1)
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
      
      if (search) {
        opportunities = opportunities.filter(o => 
          o.name.toLowerCase().includes(search.toLowerCase()) ||
          o.description?.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      if (status) {
        opportunities = opportunities.filter(o => o.status === status)
      }
      
      return opportunities
    case 'POST':
      const newOpportunity: Opportunity = {
        id: Math.max(...mockOpportunities.map(o => o.id)) + 1,
        ...body,
        create_time: new Date().toISOString(),
        modify_time: new Date().toISOString(),
      }
      mockOpportunities.push(newOpportunity)
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
        return mockOpportunities[opportunityIndex]
      }
      throw new Error('Opportunity not found')
    case 'DELETE':
      const deleteOpportunityId = parseInt(params.get('id') || '0')
      const deleteIndex = mockOpportunities.findIndex(o => o.id === deleteOpportunityId)
      if (deleteIndex !== -1) {
        mockOpportunities.splice(deleteIndex, 1)
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
      
      if (type) {
        activities = activities.filter(a => a.type === type)
      }
      
      if (status) {
        activities = activities.filter(a => a.status === status)
      }
      
      return activities
    case 'POST':
      const newActivity: Activity = {
        id: Math.max(...mockActivities.map(a => a.id)) + 1,
        ...body,
        create_time: new Date().toISOString(),
        modify_time: new Date().toISOString(),
      }
      mockActivities.push(newActivity)
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
        return mockActivities[activityIndex]
      }
      throw new Error('Activity not found')
    case 'DELETE':
      const deleteActivityId = parseInt(params.get('id') || '0')
      const deleteIndex = mockActivities.findIndex(a => a.id === deleteActivityId)
      if (deleteIndex !== -1) {
        mockActivities.splice(deleteIndex, 1)
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
      return mockPipelineStages
    default:
      return mockPipelineStages
  }
}

function handleUsersEndpoint(method: string, body: any, params: URLSearchParams) {
  switch (method) {
    case 'GET':
      return mockUsers
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

export { ApiError }