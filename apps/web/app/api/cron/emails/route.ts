import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase/server";
import { getCostComparisonHTML, getCostComparisonText } from "@/lib/email-templates/cost-comparison";
import { getCaseStudyHTML, getCaseStudyText } from "@/lib/email-templates/case-study";
import { getThreeMistakesHTML, getThreeMistakesText } from "@/lib/email-templates/three-mistakes";
import { getLastChanceHTML, getLastChanceText } from "@/lib/email-templates/last-chance";
import { getBookingReminderHTML, getBookingReminderText } from "@/lib/email-templates/booking-reminder";
import { getBookingFollowupHTML, getBookingFollowupText } from "@/lib/email-templates/booking-followup";

/**
 * GET /api/cron/emails
 * Runs hourly via Vercel Cron to send scheduled email sequences.
 * Secured with CRON_SECRET header.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const supabase = await createServerClient();
  const now = new Date();
  let emailsSent = 0;

  try {
    // ============================================
    // SEQUENCE A: Not booked (5 emails over 14 days)
    // Email 1 (J+0) is sent immediately by /api/funnel
    // Email 2 (J+2): cost-comparison
    // Email 3 (J+5): case-study
    // Email 4 (J+9): three-mistakes
    // Email 5 (J+14): last-chance
    // ============================================

    const { data: notBookedLeads } = await supabase
      .from("funnel_leads")
      .select("*")
      .eq("email_sequence", "not_booked")
      .eq("has_booked", false)
      .lt("emails_sent", 5)
      .not("email", "is", null);

    if (notBookedLeads) {
      for (const lead of notBookedLeads) {
        const createdAt = new Date(lead.created_at);
        const daysSince = Math.floor(
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        let shouldSend = false;
        let emailNum = 0;
        let subject = "";
        let html = "";
        let text = "";

        // Determine which email to send
        if (lead.emails_sent === 1 && daysSince >= 2) {
          emailNum = 2;
          subject = `Le vrai coût de votre admin en 2026`;
          html = getCostComparisonHTML({ name: lead.name || "" });
          text = getCostComparisonText({ name: lead.name || "" });
          shouldSend = true;
        } else if (lead.emails_sent === 2 && daysSince >= 5) {
          emailNum = 3;
          subject = `Comment un ${lead.metier || "entrepreneur"} a gagné 15h/semaine`;
          html = getCaseStudyHTML({ name: lead.name || "", metier: lead.metier || "" });
          text = getCaseStudyText({ name: lead.name || "", metier: lead.metier || "" });
          shouldSend = true;
        } else if (lead.emails_sent === 3 && daysSince >= 9) {
          emailNum = 4;
          subject = "3 erreurs qui vous coûtent des clients";
          html = getThreeMistakesHTML({ name: lead.name || "" });
          text = getThreeMistakesText({ name: lead.name || "" });
          shouldSend = true;
        } else if (lead.emails_sent === 4 && daysSince >= 14) {
          emailNum = 5;
          subject = "Votre appel découverte gratuit expire bientôt";
          html = getLastChanceHTML({ name: lead.name || "" });
          text = getLastChanceText({ name: lead.name || "" });
          shouldSend = true;
        }

        if (shouldSend && lead.email) {
          try {
            await resend.emails.send({
              from: process.env.FROM_EMAIL || "contact@monapplication.be",
              to: lead.email,
              subject,
              html,
              text,
            });

            await supabase
              .from("funnel_leads")
              .update({
                emails_sent: emailNum,
                last_email_at: now.toISOString(),
              })
              .eq("id", lead.id);

            emailsSent++;
          } catch (err) {
            console.error(`Failed to send email ${emailNum} to ${lead.email}:`, err);
          }
        }
      }
    }

    // ============================================
    // SEQUENCE B: Booked (3 emails)
    // Email 1 (immediate): sent by /api/bookings
    // Email 2 (J-1 before booking): reminder
    // Email 3 (J+1 after booking): followup
    // ============================================

    const { data: bookings } = await supabase
      .from("bookings")
      .select("*, funnel_leads!funnel_lead_id(*)")
      .eq("status", "confirmed");

    if (bookings) {
      for (const booking of bookings) {
        const lead = booking.funnel_leads;
        if (!lead || !booking.email) continue;

        const bookingDate = new Date(`${booking.booking_date}T${booking.booking_time}:00`);
        const hoursUntilBooking = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        const hoursAfterBooking = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60);

        const dateFormatted = bookingDate.toLocaleDateString("fr-BE", {
          weekday: "long",
          day: "numeric",
          month: "long",
        });

        // Send reminder 20-28h before booking (within cron window)
        if (
          lead.emails_sent === 1 &&
          hoursUntilBooking > 0 &&
          hoursUntilBooking <= 28
        ) {
          try {
            await resend.emails.send({
              from: process.env.FROM_EMAIL || "contact@monapplication.be",
              to: booking.email,
              subject: `Demain : votre appel découverte avec MonApplication.be`,
              html: getBookingReminderHTML({
                name: booking.name,
                date: dateFormatted,
                time: booking.booking_time,
                meetLink: booking.google_meet_link || "",
              }),
              text: getBookingReminderText({
                name: booking.name,
                date: dateFormatted,
                time: booking.booking_time,
                meetLink: booking.google_meet_link || "",
              }),
            });

            await supabase
              .from("funnel_leads")
              .update({ emails_sent: 2, last_email_at: now.toISOString() })
              .eq("id", lead.id);

            emailsSent++;
          } catch (err) {
            console.error(`Failed to send reminder to ${booking.email}:`, err);
          }
        }

        // Send followup 20-28h after booking
        if (
          lead.emails_sent === 2 &&
          hoursAfterBooking > 0 &&
          hoursAfterBooking <= 28
        ) {
          try {
            await resend.emails.send({
              from: process.env.FROM_EMAIL || "contact@monapplication.be",
              to: booking.email,
              subject: `Merci pour notre échange, ${booking.name}`,
              html: getBookingFollowupHTML({ name: booking.name }),
              text: getBookingFollowupText({ name: booking.name }),
            });

            await supabase
              .from("funnel_leads")
              .update({ emails_sent: 3, last_email_at: now.toISOString() })
              .eq("id", lead.id);

            // Mark booking as completed
            await supabase
              .from("bookings")
              .update({ status: "completed" })
              .eq("id", booking.id);

            emailsSent++;
          } catch (err) {
            console.error(`Failed to send followup to ${booking.email}:`, err);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      emails_sent: emailsSent,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Cron email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
