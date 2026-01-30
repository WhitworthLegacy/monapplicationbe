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
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*, client:clients(full_name, email), items:quote_items(*)")
      .eq("id", id)
      .single();

    if (quoteError) throw quoteError;

    return NextResponse.json({ data: quote });
  } catch (err) {
    console.error("Error fetching quote:", err);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
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

    if (body.items) {
      const items = body.items;
      const subtotal = items.reduce((sum: number, item: any) => {
        return sum + item.quantity * item.unit_price;
      }, 0);

      const taxAmount = (subtotal * (body.tax_rate || 0)) / 100;
      const discountAmount = (subtotal * (body.discount_rate || 0)) / 100;
      body.amount = subtotal + taxAmount - discountAmount;
      body.subtotal = subtotal;
      body.tax_amount = taxAmount;
      body.discount_amount = discountAmount;

      await supabase.from("quote_items").delete().eq("quote_id", id);

      const itemsWithQuoteId = items.map((item: any) => ({
        ...item,
        quote_id: id,
      }));

      await supabase.from("quote_items").insert(itemsWithQuoteId);

      delete body.items;
    }

    const { data, error: updateError } = await supabase
      .from("quotes")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error updating quote:", err);
    return NextResponse.json(
      { error: "Failed to update quote" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, supabase } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  try {
    await supabase!.from("quote_items").delete().eq("quote_id", id);

    const { error: deleteError } = await supabase!
      .from("quotes")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting quote:", err);
    return NextResponse.json(
      { error: "Failed to delete quote" },
      { status: 500 },
    );
  }
}
