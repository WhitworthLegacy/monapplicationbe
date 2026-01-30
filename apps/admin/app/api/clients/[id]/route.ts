import { NextRequest, NextResponse } from "next/server";
import { requireStaff, requireAdmin } from "@/lib/auth/adminAuth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, supabase } = await requireStaff(request);
  if (error) return error;

  const { id } = await params;

  try {
    const { data, error: queryError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (queryError) throw queryError;

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error fetching client:", err);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, supabase } = await requireStaff(request);
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();

    const { data, error: updateError } = await supabase
      .from("clients")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error updating client:", err);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  try {
    const { error: deleteError } = await (await requireAdmin(request))
      .supabase!.from("clients")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting client:", err);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 },
    );
  }
}
