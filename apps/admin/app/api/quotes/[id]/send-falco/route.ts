import { NextRequest, NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth/adminAuth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, supabase } = await requireStaff(request);
  if (error) return error;

  const { id } = await params;

  try {
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*, client:clients(*), items:quote_items(*)")
      .eq("id", id)
      .single();

    if (quoteError) throw quoteError;

    const falcoWebhookUrl = process.env.FALCO_WEBHOOK_URL;
    if (!falcoWebhookUrl) {
      return NextResponse.json(
        { error: "FALCO webhook URL not configured" },
        { status: 500 },
      );
    }

    const falcoPayload = {
      quote_id: quote.id,
      quote_number: quote.quote_number,
      client: {
        name: quote.client.full_name,
        email: quote.client.email,
        phone: quote.client.phone,
        company: quote.client.company,
      },
      title: quote.title,
      description: quote.description,
      items: quote.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price,
      })),
      subtotal: quote.subtotal,
      tax_rate: quote.tax_rate,
      tax_amount: quote.tax_amount,
      discount_rate: quote.discount_rate,
      discount_amount: quote.discount_amount,
      amount: quote.amount,
      valid_until: quote.valid_until,
      created_at: quote.created_at,
    };

    const response = await fetch(falcoWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FALCO_API_KEY}`,
      },
      body: JSON.stringify(falcoPayload),
    });

    if (!response.ok) {
      throw new Error(`FALCO API error: ${response.statusText}`);
    }

    const falcoData = await response.json();

    await supabase
      .from("quotes")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        falco_id: falcoData.id,
      })
      .eq("id", id);

    return NextResponse.json({
      success: true,
      message: "Quote sent to FALCO successfully",
      falco_response: falcoData,
    });
  } catch (err) {
    console.error("Error sending quote to FALCO:", err);
    return NextResponse.json(
      { error: "Failed to send quote to FALCO" },
      { status: 500 },
    );
  }
}
