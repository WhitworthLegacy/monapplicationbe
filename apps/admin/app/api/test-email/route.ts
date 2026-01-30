import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, type } = body;
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!to) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    let emailContent;
    let subject;

    switch (type) {
      case "contact":
        subject = "Nouveau contact depuis monapplication.be";
        emailContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 40px 30px; border-radius: 16px 16px 0 0;">
                  <div style="display: inline-block; margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(3, 12px); gap: 6px;">
                      <div style="width: 12px; height: 12px; background: #0f172a; border-radius: 3px; border: 1px solid rgba(255,255,255,0.2);"></div>
                      <div style="width: 12px; height: 12px; background: #1e3a8a; border-radius: 3px; border: 1px solid rgba(255,255,255,0.2);"></div>
                      <div style="width: 12px; height: 12px; background: #b8860b; border-radius: 3px;"></div>
                      <div style="width: 12px; height: 12px; background: #1e3a8a; border-radius: 3px; border: 1px solid rgba(255,255,255,0.2);"></div>
                      <div style="width: 12px; height: 12px; background: #b8860b; border-radius: 3px;"></div>
                      <div style="width: 12px; height: 12px; background: #0f172a; border-radius: 3px; border: 1px solid rgba(255,255,255,0.2);"></div>
                      <div style="width: 12px; height: 12px; background: #b8860b; border-radius: 3px;"></div>
                      <div style="width: 12px; height: 12px; background: #0f172a; border-radius: 3px; border: 1px solid rgba(255,255,255,0.2);"></div>
                      <div style="width: 12px; height: 12px; background: #1e3a8a; border-radius: 3px; border: 1px solid rgba(255,255,255,0.2);"></div>
                    </div>
                  </div>
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Nouveau contact</h1>
                  <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 16px;">Message reçu depuis monapplication.be</p>
                </div>

                <!-- Body -->
                <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
                  <div style="margin-bottom: 30px;">
                    <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Informations du contact</h2>

                    <div style="margin-bottom: 20px; padding: 20px; background: #f1f5f9; border-radius: 12px; border-left: 4px solid #b8860b;">
                      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Nom complet</p>
                      <p style="margin: 0; color: #0f172a; font-size: 16px; font-weight: 600;">Jean Dupont (TEST)</p>
                    </div>

                    <div style="margin-bottom: 20px; padding: 20px; background: #f1f5f9; border-radius: 12px;">
                      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                      <p style="margin: 0; color: #0f172a; font-size: 16px;"><a href="mailto:jean@exemple.be" style="color: #1e3a8a; text-decoration: none;">jean@exemple.be</a></p>
                    </div>

                    <div style="margin-bottom: 20px; padding: 20px; background: #f1f5f9; border-radius: 12px;">
                      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Téléphone</p>
                      <p style="margin: 0; color: #0f172a; font-size: 16px;"><a href="tel:+32460000000" style="color: #1e3a8a; text-decoration: none;">+32 460 00 00 00</a></p>
                    </div>

                    <div style="margin-bottom: 20px; padding: 20px; background: #f1f5f9; border-radius: 12px;">
                      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Entreprise</p>
                      <p style="margin: 0; color: #0f172a; font-size: 16px;">Dupont Construction SPRL</p>
                    </div>

                    <div style="padding: 20px; background: #f1f5f9; border-radius: 12px;">
                      <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                      <p style="margin: 0; color: #0f172a; font-size: 16px; line-height: 1.6;">
                        Bonjour, je suis intéressé par votre solution de secrétariat digital. J'aimerais avoir plus d'informations sur les tarifs et les délais de mise en place. Merci!
                      </p>
                    </div>
                  </div>

                  <!-- CTA -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://admin.monapplication.be/admin/clients" style="display: inline-block; background: #b8860b; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);">
                      Voir dans l'admin →
                    </a>
                  </div>

                  <!-- Footer Info -->
                  <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #64748b; font-size: 13px; text-align: center;">
                      📧 Email de test envoyé depuis <strong>monapplication.be</strong><br>
                      Date: ${new Date().toLocaleString("fr-BE", { dateStyle: "full", timeStyle: "short" })}
                    </p>
                  </div>
                </div>

                <!-- Footer -->
                <div style="margin-top: 30px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                    © ${new Date().getFullYear()} monapplication.be - Votre secrétaire digitale
                  </p>
                  <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                    Une secrétaire coûte 24 000€/an - Notre système à partir de 5 000€
                  </p>
                </div>
              </div>
            </body>
          </html>
        `;
        break;

      case "quote":
        subject = "Nouveau devis envoyé - monapplication.be";
        emailContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 40px 30px; border-radius: 16px 16px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 32px;">📄 Votre Devis</h1>
                  <p style="color: rgba(255,255,255,0.8); margin: 15px 0 0 0; font-size: 18px;">Devis #DEVIS-2026-001</p>
                </div>

                <div style="background: white; padding: 40px 30px; border-radius: 0 0 16px 16px;">
                  <h2 style="color: #0f172a; margin: 0 0 20px 0;">Bonjour Jean,</h2>
                  <p style="color: #64748b; line-height: 1.6; margin: 0 0 20px 0;">
                    Merci de votre intérêt pour nos services. Vous trouverez ci-joint votre devis détaillé pour l'installation de notre système de secrétariat digital.
                  </p>

                  <div style="background: #f1f5f9; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #b8860b;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #64748b;">Montant HT:</td>
                        <td style="padding: 8px 0; text-align: right; color: #0f172a; font-weight: 600;">4 132,23 €</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #64748b;">TVA (21%):</td>
                        <td style="padding: 8px 0; text-align: right; color: #0f172a; font-weight: 600;">867,77 €</td>
                      </tr>
                      <tr style="border-top: 2px solid #e5e7eb;">
                        <td style="padding: 12px 0 0 0; color: #0f172a; font-size: 18px; font-weight: 700;">Total TTC:</td>
                        <td style="padding: 12px 0 0 0; text-align: right; color: #b8860b; font-size: 24px; font-weight: 700;">5 000,00 €</td>
                      </tr>
                    </table>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="#" style="display: inline-block; background: #b8860b; color: white; padding: 16px 40px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
                      Télécharger le PDF
                    </a>
                  </div>

                  <p style="color: #64748b; font-size: 14px; margin: 30px 0 0 0; padding-top: 25px; border-top: 1px solid #e5e7eb; text-align: center;">
                    Ce devis est valable 30 jours
                  </p>
                </div>
              </div>
            </body>
          </html>
        `;
        break;

      default:
        subject = "Email de test - monapplication.be";
        emailContent = "<h1>Test email</h1>";
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "contact@monapplication.be",
      to,
      subject,
      html: emailContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
