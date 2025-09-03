import type { NextRequest } from "next/server"
import { withErrorHandling, successResponse, isEnvConfigured } from "@/lib/api-utils"
import { postgrestClient } from "@/lib/postgrest"
import type { DashboardStats } from "@/types/crm"
import { getMockDashboardStats } from "@/lib/mock-data"

export const GET = withErrorHandling(async (request: NextRequest) => {
  if (!isEnvConfigured()) {
    console.log("[v0] Database not configured, returning mock dashboard stats")
    return successResponse(getMockDashboardStats())
  }

  try {
    // Get total companies
    const { count: totalCompanies } = await postgrestClient
      .from("companies")
      .select("*", { count: "exact", head: true })

    // Get total contacts
    const { count: totalContacts } = await postgrestClient.from("contacts").select("*", { count: "exact", head: true })

    // Get total opportunities
    const { count: totalOpportunities } = await postgrestClient
      .from("opportunities")
      .select("*", { count: "exact", head: true })

    // Get open opportunities
    const { count: openOpportunities } = await postgrestClient
      .from("opportunities")
      .select("*", { count: "exact", head: true })
      .eq("status", "open")

    // Get won opportunities
    const { count: wonOpportunities } = await postgrestClient
      .from("opportunities")
      .select("*", { count: "exact", head: true })
      .eq("status", "won")

    // Get lost opportunities
    const { count: lostOpportunities } = await postgrestClient
      .from("opportunities")
      .select("*", { count: "exact", head: true })
      .eq("status", "lost")

    // Get total revenue from won opportunities
    const { data: revenueData } = await postgrestClient.from("opportunities").select("value").eq("status", "won")

    const totalRevenue = revenueData?.reduce((sum, opp) => sum + (opp.value || 0), 0) || 0

    // Get activities this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const { count: activitiesThisWeek } = await postgrestClient
      .from("activities")
      .select("*", { count: "exact", head: true })
      .gte("create_time", oneWeekAgo.toISOString())

    // Calculate conversion rate
    const conversionRate =
      totalOpportunities && totalOpportunities > 0 ? ((wonOpportunities || 0) / totalOpportunities) * 100 : 0

    // Calculate average deal size
    const averageDealSize = wonOpportunities && wonOpportunities > 0 ? totalRevenue / wonOpportunities : 0

    const stats: DashboardStats = {
      totalCompanies: totalCompanies || 0,
      totalContacts: totalContacts || 0,
      totalOpportunities: totalOpportunities || 0,
      totalRevenue,
      openOpportunities: openOpportunities || 0,
      wonOpportunities: wonOpportunities || 0,
      lostOpportunities: lostOpportunities || 0,
      activitiesThisWeek: activitiesThisWeek || 0,
      conversionRate,
      averageDealSize,
    }

    return successResponse(stats)
  } catch (error) {
    console.log("[v0] Database operations failed, returning mock dashboard stats as fallback")
    return successResponse(getMockDashboardStats())
  }
})
