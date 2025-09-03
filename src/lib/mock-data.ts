import type { Company, Contact, Opportunity, Activity } from "@/types/crm"
import type { Proforma } from "@/types/billing"
import type { DashboardStats } from "@/types/crm"

export const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Empresa Exemplo Lda",
    nif: "123456789",
    email: "contato@exemplo.ao",
    phone: "+244 923 456 789",
    address: "Rua da Independência, 123, Luanda",
    industry: "Tecnologia",
    website: "https://exemplo.ao",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Petróleo Angola SA",
    nif: "987654321",
    email: "info@petroleo.ao",
    phone: "+244 912 345 678",
    address: "Marginal de Luanda, Torre A, Luanda",
    industry: "Petróleo e Gás",
    website: "https://petroleo.ao",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockContacts: Contact[] = [
  {
    id: "1",
    company_id: "1",
    name: "João Silva",
    email: "joao@exemplo.ao",
    phone: "+244 923 111 222",
    position: "Director Geral",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    company_id: "2",
    name: "Maria Santos",
    email: "maria@petroleo.ao",
    phone: "+244 912 333 444",
    position: "Gestora de Projectos",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    company_id: "1",
    contact_id: "1",
    title: "Sistema CRM Personalizado",
    description: "Desenvolvimento de sistema CRM para gestão de clientes",
    value: 50000,
    currency: "AOA",
    stage: "proposal",
    probability: 75,
    expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockActivities: Activity[] = [
  {
    id: "1",
    company_id: "1",
    contact_id: "1",
    opportunity_id: "1",
    type: "call",
    subject: "Reunião de apresentação",
    description: "Apresentação da proposta do sistema CRM",
    due_date: new Date().toISOString(),
    completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockProformas: Proforma[] = [
  {
    id: "1",
    number: "PF2024001",
    company_id: "1",
    contact_id: "1",
    issue_date: new Date().toISOString(),
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    subtotal: 42372.88,
    tax_amount: 7627.12,
    total: 50000,
    currency: "AOA",
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function getMockDashboardStats(): DashboardStats {
  const wonOpportunities = 15
  const lostOpportunities = 8
  const totalOpportunities = mockOpportunities.length + wonOpportunities + lostOpportunities
  const totalRevenue = 2500000 // 2.5M AOA

  return {
    totalCompanies: 45,
    totalContacts: 128,
    totalOpportunities,
    totalRevenue,
    openOpportunities: mockOpportunities.length,
    wonOpportunities,
    lostOpportunities,
    activitiesThisWeek: 23,
    conversionRate: (wonOpportunities / totalOpportunities) * 100,
    averageDealSize: totalRevenue / wonOpportunities,
  }
}

export const mockStats = {
  totalCompanies: mockCompanies.length,
  totalContacts: mockContacts.length,
  totalOpportunities: mockOpportunities.length,
  totalActivities: mockActivities.length,
  totalRevenue: mockOpportunities.reduce((sum, opp) => sum + opp.value, 0),
  conversionRate: 65,
}
