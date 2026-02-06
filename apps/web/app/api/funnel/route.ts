import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase/server";
import { getFunnelRecapHTML, getFunnelRecapText } from "@/lib/email-templates/funnel-recap";

/**
 * POST /api/funnel
 * Saves funnel data for prospects who completed the diagnostic but didn't book.
 * This is called if someone skips the booking step.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      sector,
      metier,
      admin_hours,
      has_secretary,
      pain_points,
      pain_story,
      current_tools,
      clients_per_month,
      hours_lost_year,
      money_lost_year,
      completed_step,
    } = body;

    const supabase = await createServerClient();

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 1. Create CRM entry
    const { data: crmData, error: crmError } = await supabase
      .from("clients")
      .insert([
        {
          full_name: name || email,
          email,
          phone: phone || null,
          company: company || null,
          crm_stage: "prospect",
          source: "diagnostic",
          notes: `Diagnostic (non complété):\n- Secteur: ${sector}\n- Étape atteinte: ${completed_step}/8`,
        },
      ])
      .select()
      .single();

    if (crmError) {
      console.error("CRM creation error:", crmError);
    }

    // 2. Save funnel lead
    const { data: leadData, error: leadError } = await supabase
      .from("funnel_leads")
      .insert([
        {
          name: name || null,
          email,
          phone: phone || null,
          company: company || null,
          sector: sector || null,
          metier: metier || null,
          admin_hours: admin_hours || null,
          has_secretary,
          pain_points: pain_points || [],
          pain_story: pain_story || null,
          current_tools: current_tools || [],
          clients_per_month: clients_per_month || null,
          hours_lost_year: hours_lost_year || 0,
          money_lost_year: money_lost_year || 0,
          completed_step: completed_step || 0,
          has_booked: false,
          email_sequence: "not_booked",
          emails_sent: 1,
          last_email_at: new Date().toISOString(),
          client_id: crmData?.id || null,
        },
      ])
      .select()
      .single();

    if (leadError) {
      console.error("Funnel lead save error:", leadError);
    }

    // 3. Send recap email (first email of Sequence A)
    if (email) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || "contact@monapplication.be",
          to: email,
          subject: `Votre diagnostic admin est prêt, ${name || ""}`.trim(),
          html: getFunnelRecapHTML({
            name: name || "",
            hoursLostYear: hours_lost_year || 0,
            moneyLostYear: money_lost_year || 0,
            painPoints: pain_points || [],
            metier: metier || sector || "",
          }),
          text: getFunnelRecapText({
            name: name || "",
            hoursLostYear: hours_lost_year || 0,
            moneyLostYear: money_lost_year || 0,
            painPoints: pain_points || [],
            metier: metier || sector || "",
          }),
        });
      } catch (emailError) {
        console.error("Recap email error:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      data: { lead_id: leadData?.id },
    });
  } catch (error) {
    console.error("Funnel API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
