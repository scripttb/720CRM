import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [
      { count: totalCompanies },
      { count: totalContacts },
      { count: totalOpportunities },
      { data: opportunities },
    ] = await Promise.all([
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase.from("contacts").select("*", { count: "exact", head: true }),
      supabase.from("opportunities").select("*", { count: "exact", head: true }),
      supabase.from("opportunities").select("value, status"),
    ])

    const totalRevenue =
      opportunities?.reduce((sum, opp) => (opp.status === "won" ? sum + (opp.value || 0) : sum), 0) || 0

    const wonOpportunities = opportunities?.filter((opp) => opp.status === "won").length || 0
    const lostOpportunities = opportunities?.filter((opp) => opp.status === "lost").length || 0
    const openOpportunities = opportunities?.filter((opp) => opp.status !== "won" && opp.status !== "lost").length || 0

    const conversionRate = totalOpportunities ? (wonOpportunities / totalOpportunities) * 100 : 0
    const averageDealSize = wonOpportunities ? totalRevenue / wonOpportunities : 0

    // Get activities from this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const { count: activitiesThisWeek } = await supabase
      .from("activities")
      .select("*", { count: "exact", head: true })
      .gte("created_at", oneWeekAgo.toISOString())

    const stats = {
      totalCompanies: totalCompanies || 0,
      totalContacts: totalContacts || 0,
      totalOpportunities: totalOpportunities || 0,
      totalRevenue,
      openOpportunities,
      wonOpportunities,
      lostOpportunities,
      activitiesThisWeek: activitiesThisWeek || 0,
      conversionRate,
      averageDealSize,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
