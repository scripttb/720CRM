import { createClient } from "@/lib/supabase/server"
import { createClient as createBrowserClient } from "@/lib/supabase/client"

// Server-side API functions
export async function getCompanies() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("companies").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createCompany(company: any) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("companies")
    .insert({ ...company, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getContacts() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("contacts")
    .select(`
      *,
      companies:company_id (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function createContact(contact: any) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("contacts")
    .insert({ ...contact, user_id: user.id })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getOpportunities() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("opportunities")
    .select(`
      *,
      companies:company_id (
        id,
        name
      ),
      contacts:contact_id (
        id,
        first_name,
        last_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getDashboardStats() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  // Get counts for dashboard
  const [companiesResult, contactsResult, opportunitiesResult, activitiesResult] = await Promise.all([
    supabase.from("companies").select("id", { count: "exact", head: true }),
    supabase.from("contacts").select("id", { count: "exact", head: true }),
    supabase.from("opportunities").select("id", { count: "exact", head: true }),
    supabase.from("activities").select("id").eq("status", "pending"),
  ])

  // Calculate revenue from opportunities
  const { data: revenueData } = await supabase.from("opportunities").select("value").eq("status", "won")

  const totalRevenue = revenueData?.reduce((sum, opp) => sum + (opp.value || 0), 0) || 0

  return {
    totalCompanies: companiesResult.count || 0,
    totalContacts: contactsResult.count || 0,
    totalOpportunities: opportunitiesResult.count || 0,
    pendingActivities: activitiesResult.data?.length || 0,
    totalRevenue,
    conversionRate: 0.15, // This would need more complex calculation
  }
}

// Client-side API functions
export function useSupabaseClient() {
  return createBrowserClient()
}
