import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/adminAuth";

export async function GET(request: NextRequest) {
  // TODO: Re-enable auth when login is ready
  // const { error, supabase } = await requireStaff(request);
  // if (error) return error;
  const { createServerClient } = await import("@/lib/supabase/server");
  const supabase = await createServerClient();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const clientId = searchParams.get("client_id");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  try {
    // 1. Fetch admin appointments
    let appointmentsQuery = supabase
      .from("appointments")
      .select("*, client:clients(full_name, email)")
      .order("scheduled_at", { ascending: true });

    if (status && status !== "all") {
      appointmentsQuery = appointmentsQuery.eq("status", status);
    }
    if (clientId) {
      appointmentsQuery = appointmentsQuery.eq("client_id", clientId);
    }
    if (from) {
      appointmentsQuery = appointmentsQuery.gte("scheduled_at", from);
    }
    if (to) {
      appointmentsQuery = appointmentsQuery.lte("scheduled_at", to);
    }

    // 2. Fetch funnel bookings
    let bookingsQuery = supabase
      .from("bookings")
      .select("*, funnel_lead:funnel_leads(sector, metier, pain_points, admin_hours)")
      .order("booking_date", { ascending: true });

    if (status && status !== "all") {
      bookingsQuery = bookingsQuery.eq("status", status);
    }

    const [appointmentsResult, bookingsResult] = await Promise.all([
      appointmentsQuery,
      bookingsQuery,
    ]);

    if (appointmentsResult.error) throw appointmentsResult.error;

    // 3. Normalize bookings into Appointment shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizedBookings = (bookingsResult.data || []).map((b: any) => ({
      id: b.id,
      client_id: null,
      client_name: b.name,
      client_email: b.email,
      client_phone: b.phone,
      client_company: b.company,
      title: `Appel découverte — ${b.name}${b.company ? ` (${b.company})` : ""}`,
      description: b.funnel_lead
        ? `Secteur: ${b.funnel_lead.sector || "?"} / ${b.funnel_lead.metier || "?"}\nHeures admin: ${b.funnel_lead.admin_hours || "?"}\nDouleurs: ${(b.funnel_lead.pain_points || []).join(", ")}`
        : "",
      appointment_type: "demo",
      scheduled_at: `${b.booking_date}T${b.booking_time}`,
      duration_minutes: b.duration_minutes || 30,
      status: b.status,
      is_remote: true,
      video_link: b.google_meet_link || null,
      video_platform: b.google_meet_link ? "meet" : null,
      notes: null,
      source: "funnel",
      created_at: b.created_at,
      updated_at: b.updated_at,
    }));

    // 4. Tag admin appointments
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const taggedAppointments = (appointmentsResult.data || []).map((a: any) => ({
      ...a,
      client_name: a.client?.full_name || null,
      client_email: a.client?.email || null,
      source: "admin",
    }));

    // 5. Merge and sort by date
    const merged = [...taggedAppointments, ...normalizedBookings].sort(
      (a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
    );

    return NextResponse.json({ data: merged });
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  // TODO: Re-enable auth when login is ready
  // const { error, supabase } = await requireStaff(request);
  // if (error) return error;
  const { createServerClient } = await import("@/lib/supabase/server");
  const supabase = await createServerClient();

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
