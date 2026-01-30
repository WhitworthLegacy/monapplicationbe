import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/adminAuth";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireStaff(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const stage = searchParams.get("stage");
  const search = searchParams.get("search");

  try {
    let query = supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });

    if (stage && stage !== "all") {
      query = query.eq("crm_stage", stage);
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,tracking_id.ilike.%${search}%,company.ilike.%${search}%`,
      );
    }

    const { data, error: queryError } = await query;

    if (queryError) throw queryError;

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error fetching clients:", err);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireStaff(request);
  if (error) return error;

  try {
    const body = await request.json();

    const { data, error: insertError } = await supabase
      .from("clients")
      .insert({
        full_name: body.full_name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        crm_stage: body.crm_stage || "prospect",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("Error creating client:", err);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 500 },
    );
  }
}
