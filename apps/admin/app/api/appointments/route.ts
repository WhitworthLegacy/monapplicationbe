import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/adminAuth";

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireStaff(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const clientId = searchParams.get("client_id");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  try {
    let query = supabase
      .from("appointments")
      .select("*, client:clients(full_name, email)")
      .order("scheduled_at", { ascending: true });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (clientId) {
      query = query.eq("client_id", clientId);
    }

    if (from) {
      query = query.gte("scheduled_at", from);
    }

    if (to) {
      query = query.lte("scheduled_at", to);
    }

    const { data, error: queryError } = await query;

    if (queryError) throw queryError;

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
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
      .from("appointments")
      .insert({
        client_id: body.client_id,
        scheduled_at: body.scheduled_at,
        title: body.title,
        description: body.description,
        type: body.type,
        duration: body.duration || 30,
        location: body.location,
        status: body.status || "scheduled",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("Error creating appointment:", err);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}
