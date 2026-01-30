import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase/server";
import { getConfirmationEmailHTML, getConfirmationEmailText } from "@/lib/email-templates/confirmation";

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

    const supabase = await createServerClient();

    // 1. Save to contact_submissions
    const { data: contactData, error: dbError } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          company: company || null,
          message,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Contact submission error:", dbError);
    }

    // 2. Create CRM entry (auto-add to Prospect stage)
    const { data: crmData, error: crmError } = await supabase
      .from("clients")
      .insert([
        {
          full_name: name,
          email,
          phone: phone || null,
          company: company || null,
          crm_stage: 'prospect',
          source: 'website',
          notes: `Contact depuis le formulaire web:\n${message}`,
        },
      ])
      .select()
      .single();

    if (crmError) {
      console.error("CRM creation error:", crmError);
      // Continue même si CRM fail
    }

    // 3. Send notification email to company
    const { error: notificationError } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "contact@monapplication.be",
      to: process.env.TO_EMAIL || "contact@monapplication.be",
      subject: `🔔 Nouveau contact: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Nouveau message de contact</h2>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${phone ? `<p><strong>Téléphone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ""}
            ${company ? `<p><strong>Entreprise:</strong> ${company}</p>` : ""}
            <p><strong>Message:</strong></p>
            <p style="background: white; padding: 12px; border-radius: 4px;">${message}</p>
          </div>
          <p style="color: #64748b; font-size: 12px;">
            ${contactData ? `Contact ID: ${contactData.id}` : ""}
            ${crmData ? ` | CRM ID: ${crmData.id} (Ajouté en Prospect)` : ""}
          </p>
        </div>
      `,
    });

    if (notificationError) {
      console.error("Notification email error:", notificationError);
    }

    // 4. Send beautiful confirmation email to client
    const { data: confirmationData, error: confirmationError } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "contact@monapplication.be",
      to: email,
      subject: "Merci pour votre demande - MonApplication.be",
      html: getConfirmationEmailHTML({ name }),
      text: getConfirmationEmailText({ name }),
    });

    if (confirmationError) {
      console.error("Confirmation email error:", confirmationError);
      // Don't fail the request if confirmation email fails
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          contact: contactData,
          crm: crmData,
          confirmation_sent: !confirmationError,
        },
        message: "Votre demande a été envoyée. Vous allez recevoir un email de confirmation.",
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
