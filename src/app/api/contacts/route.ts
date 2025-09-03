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

    const { data: contacts, error } = await supabase
      .from("contacts")
      .select(`
        *,
        companies (
          id,
          name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(contacts || [])
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
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

    const { data: contact, error } = await supabase
      .from("contacts")
      .insert({ ...body, user_id: user.id })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}
