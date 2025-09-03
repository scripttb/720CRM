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

    const { data: opportunities, error } = await supabase
      .from("opportunities")
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
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(opportunities || [])
  } catch (error) {
    console.error("Error fetching opportunities:", error)
    return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { data: opportunity, error } = await supabase
      .from("opportunities")
      .insert({ ...body, user_id: user.id })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(opportunity)
  } catch (error) {
    console.error("Error creating opportunity:", error)
    return NextResponse.json({ error: "Failed to create opportunity" }, { status: 500 })
  }
}
