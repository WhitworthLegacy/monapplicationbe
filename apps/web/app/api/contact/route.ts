import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    // 1. Save to Supabase
    const supabase = await createServerClient();
    const { data: contactData, error: dbError } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          message,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Supabase error:", dbError);
      // Continue même si DB fail - au moins envoyer l'email
    }

    // 2. Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "contact@monapplication.be",
      to: process.env.TO_EMAIL || "contact@monapplication.be",
      subject: `Nouveau contact: ${name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ""}
        ${company ? `<p><strong>Entreprise:</strong> ${company}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">
          ${contactData ? `ID: ${contactData.id}` : "Non sauvegardé en DB"}
        </p>
      `,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          email: emailData,
          contact: contactData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
