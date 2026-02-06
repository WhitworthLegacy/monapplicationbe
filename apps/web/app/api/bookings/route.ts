import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase/server";
import { createCalendarBooking } from "@/lib/google-calendar";
import { getBookingConfirmationHTML, getBookingConfirmationText } from "@/lib/email-templates/booking-confirmation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      booking_date,
      booking_time,
      // Funnel data
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
    } = body;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabase = await createServerClient();

    // Validation
    if (!name || !email || !phone || !booking_date || !booking_time) {
      return NextResponse.json(
        { error: "Name, email, phone, date and time are required" },
        { status: 400 }
      );
    }

    // 1. Create CRM entry
    const { data: crmData, error: crmError } = await supabase
      .from("clients")
      .insert([
        {
          full_name: name,
          email,
          phone,
          company: company || null,
          crm_stage: "qualified",
          source: "diagnostic",
          notes: `Diagnostic funnel:\n- Secteur: ${sector}\n- Métier: ${metier}\n- Heures admin: ${admin_hours}\n- Secrétaire: ${has_secretary ? "Oui" : "Non"}\n- Douleurs: ${pain_points?.join(", ")}\n- Outils: ${current_tools?.join(", ")}\n- Clients/mois: ${clients_per_month}${pain_story ? `\n- Témoignage: ${pain_story}` : ""}`,
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
          name,
          email,
          phone,
          company: company || null,
          sector,
          metier,
          admin_hours,
          has_secretary,
          pain_points: pain_points || [],
          pain_story: pain_story || null,
          current_tools: current_tools || [],
          clients_per_month,
          hours_lost_year: hours_lost_year || 0,
          money_lost_year: money_lost_year || 0,
          completed_step: 8,
          has_booked: true,
          email_sequence: "booked",
          emails_sent: 1, // confirmation email counts
          last_email_at: new Date().toISOString(),
          client_id: crmData?.id || null,
        },
      ])
      .select()
      .single();

    if (leadError) {
      console.error("Funnel lead save error:", leadError);
    }

    // 3. Create Google Calendar event
    let meetLink = "";
    let eventId = "";

    try {
      const booking = await createCalendarBooking({
        name,
        email,
        phone,
        company,
        date: booking_date,
        time: booking_time,
        description: `Diagnostic:\n- Secteur: ${sector} / ${metier}\n- Heures admin: ${admin_hours}/sem\n- Secrétaire: ${has_secretary ? "Oui" : "Non"}\n- Douleurs: ${pain_points?.join(", ")}\n- Clients/mois: ${clients_per_month}`,
      });
      meetLink = booking.meetLink;
      eventId = booking.eventId;
    } catch (calError) {
      console.error("Google Calendar error:", calError);
      // Continue even if calendar fails
    }

    // 4. Save booking
    const { error: bookingError } = await supabase.from("bookings").insert([
      {
        funnel_lead_id: leadData?.id || null,
        name,
        email,
        phone,
        company: company || null,
        booking_date,
        booking_time,
        google_event_id: eventId || null,
        google_meet_link: meetLink || null,
        status: "confirmed",
      },
    ]);

    if (bookingError) {
      console.error("Booking save error:", bookingError);
    }

    // 5. Send confirmation email to prospect
    const dateObj = new Date(`${booking_date}T${booking_time}:00`);
    const dateFormatted = dateObj.toLocaleDateString("fr-BE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || "contact@monapplication.be",
        to: email,
        subject: "Votre appel découverte est confirmé ✅",
        html: getBookingConfirmationHTML({
          name,
          date: dateFormatted,
          time: booking_time,
          meetLink,
        }),
        text: getBookingConfirmationText({
          name,
          date: dateFormatted,
          time: booking_time,
          meetLink,
        }),
      });
    } catch (emailError) {
      console.error("Confirmation email error:", emailError);
    }

    // 6. Send internal notification
    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || "contact@monapplication.be",
        to: process.env.TO_EMAIL || "contact@monapplication.be",
        subject: `📅 Nouvel appel découverte: ${name} (${metier})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f172a;">Nouvel appel découverte réservé</h2>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Nom:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Téléphone:</strong> <a href="tel:${phone}">${phone}</a></p>
              ${company ? `<p><strong>Entreprise:</strong> ${company}</p>` : ""}
              <p><strong>Date:</strong> ${dateFormatted} à ${booking_time}</p>
              ${meetLink ? `<p><strong>Google Meet:</strong> <a href="${meetLink}">${meetLink}</a></p>` : ""}
            </div>
            <h3 style="color: #0f172a;">Diagnostic</h3>
            <div style="background: #f1f5f9; padding: 20px; border-radius: 8px;">
              <p><strong>Secteur:</strong> ${sector} / ${metier}</p>
              <p><strong>Heures admin:</strong> ${admin_hours}/semaine</p>
              <p><strong>Secrétaire:</strong> ${has_secretary ? "Oui (~30,000€/an)" : "Non (fait tout seul)"}</p>
              <p><strong>Douleurs:</strong> ${pain_points?.join(", ")}</p>
              <p><strong>Outils actuels:</strong> ${current_tools?.join(", ")}</p>
              <p><strong>Clients/mois:</strong> ${clients_per_month}</p>
              ${pain_story ? `<p><strong>Témoignage:</strong> "${pain_story}"</p>` : ""}
              <p><strong>Coût estimé:</strong> ${hours_lost_year}h/an perdues, ${money_lost_year?.toLocaleString("fr-BE")}€/an</p>
            </div>
          </div>
        `,
      });
    } catch (notifError) {
      console.error("Notification email error:", notifError);
    }

    return NextResponse.json({
      success: true,
      data: {
        lead_id: leadData?.id,
        meet_link: meetLink,
        event_id: eventId,
      },
    });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
