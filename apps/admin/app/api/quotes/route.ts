import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/adminAuth";

export async function GET(request: NextRequest) {
  const { error, supabase } = await requireStaff(request);
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const clientId = searchParams.get("client_id");

  try {
    let query = supabase
      .from("quotes")
      .select("*, client:clients(full_name, email)")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (clientId) {
      query = query.eq("client_id", clientId);
    }

    const { data, error: queryError } = await query;

    if (queryError) throw queryError;

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Error fetching quotes:", err);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { error, supabase } = await requireStaff(request);
  if (error) return error;

  try {
    const body = await request.json();

    const items = body.items || [];
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.unit_price;
    }, 0);

    const taxRate = body.tax_rate || 21;
    const taxAmount = Math.round(subtotal * (taxRate / 100));
    const total = subtotal + taxAmount;

    const { data: quote, error: insertError } = await supabase
      .from("quotes")
      .insert({
        client_id: body.client_id,
        title: body.title,
        description: body.description,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        status: body.status || "draft",
        expires_at: body.valid_until || body.expires_at,
        notes: body.notes,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting quote:", insertError);
      throw insertError;
    }

    if (items.length > 0) {
      const itemsWithQuoteId = items.map((item: any, index: number) => ({
        quote_id: quote.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        position: index,
      }));

      const { error: itemsError } = await supabase
        .from("quote_items")
        .insert(itemsWithQuoteId);

      if (itemsError) {
        console.error("Error inserting quote items:", itemsError);
        throw itemsError;
      }
    }

    return NextResponse.json({ data: quote }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating quote:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create quote", details: err },
      { status: 500 },
    );
  }
}
