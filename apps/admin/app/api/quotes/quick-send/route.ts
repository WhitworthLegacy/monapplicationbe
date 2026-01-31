import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number; // in cents
}

interface QuickQuoteRequest {
  client_id: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  client_phone?: string;
  items: QuoteItem[];
  notes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: QuickQuoteRequest = await request.json();

    // Validation
    if (!body.client_email || !body.client_name) {
      return NextResponse.json(
        { error: 'Client email and name required' },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item required' },
        { status: 400 }
      );
    }

    // Initialize Resend (lazy loading to avoid build errors)
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Calculate totals
    const subtotal = body.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const tax = Math.round(subtotal * 0.21);
    const total = subtotal + tax;

    // Format items for email
    const itemsHtml = body.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; text-align: left;">${item.description}</td>
          <td style="padding: 12px; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; text-align: right;">${(item.unit_price / 100).toFixed(2)} €</td>
          <td style="padding: 12px; text-align: right; font-weight: 600;">
            ${((item.quantity * item.unit_price) / 100).toFixed(2)} €
          </td>
        </tr>
      `
      )
      .join('');

    // Send quote email via Resend
    const emailResult = await resend.emails.send({
        from: 'MonApplication <contact@monapplication.be>',
        to: [body.client_email],
        subject: `Votre devis de MonApplication`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f1f5f9;">
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

    <!-- Header with gradient and logo -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 40px 30px; text-align: center;">
      <div style="width: 60px; height: 60px; margin: 0 auto 20px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="6" r="2" fill="#b8860b"/>
          <circle cx="12" cy="6" r="2" fill="#b8860b"/>
          <circle cx="18" cy="6" r="2" fill="#b8860b"/>
          <circle cx="6" cy="12" r="2" fill="#1e3a8a"/>
          <circle cx="12" cy="12" r="2" fill="#1e3a8a"/>
          <circle cx="18" cy="12" r="2" fill="#1e3a8a"/>
          <circle cx="6" cy="18" r="2" fill="#0f172a"/>
          <circle cx="12" cy="18" r="2" fill="#0f172a"/>
          <circle cx="18" cy="18" r="2" fill="#0f172a"/>
        </svg>
      </div>
      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
        Votre Devis
      </h1>
      <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
        MonApplication
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
        Bonjour <strong>${body.client_name}</strong>,
      </p>

      <p style="margin: 0 0 32px 0; font-size: 15px; color: #64748b; line-height: 1.6;">
        Nous avons le plaisir de vous envoyer votre devis. Vous trouverez ci-dessous le détail de votre demande.
      </p>

      <!-- Quote Items Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <thead>
          <tr style="background: linear-gradient(to right, #f1f5f9, #e2e8f0);">
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #0f172a; font-size: 14px;">Description</th>
            <th style="padding: 12px; text-align: center; font-weight: 600; color: #0f172a; font-size: 14px;">Qté</th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #0f172a; font-size: 14px;">Prix unit.</th>
            <th style="padding: 12px; text-align: right; font-weight: 600; color: #0f172a; font-size: 14px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="background: linear-gradient(to right, #f1f5f9, #e2e8f0); border-radius: 12px; padding: 20px; margin-bottom: 32px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #64748b; font-size: 14px;">Sous-total HT:</span>
          <span style="color: #0f172a; font-weight: 600; font-size: 14px;">${(subtotal / 100).toFixed(2)} €</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #cbd5e1;">
          <span style="color: #64748b; font-size: 14px;">TVA (21%):</span>
          <span style="color: #0f172a; font-weight: 600; font-size: 14px;">${(tax / 100).toFixed(2)} €</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #0f172a; font-weight: 700; font-size: 18px;">Total TTC:</span>
          <span style="color: #1e3a8a; font-weight: 700; font-size: 18px;">${(total / 100).toFixed(2)} €</span>
        </div>
      </div>

      ${
        body.notes
          ? `
      <!-- Notes -->
      <div style="background: #fef3c7; border-left: 4px solid #b8860b; padding: 16px; border-radius: 8px; margin-bottom: 32px;">
        <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
          <strong>Note:</strong> ${body.notes}
        </p>
      </div>
      `
          : ''
      }


      <p style="margin: 0 0 16px 0; font-size: 14px; color: #64748b; line-height: 1.6;">
        Ce devis est valable pendant 30 jours. Pour toute question, n'hésitez pas à nous contacter.
      </p>

      <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">
        Cordialement,<br>
        <strong style="color: #0f172a;">L'équipe MonApplication</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0; text-align: center;">
      <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b;">
        📧 contact@monapplication.be<br>
        🌐 <a href="https://monapplication.be" style="color: #1e3a8a; text-decoration: none;">monapplication.be</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
        © ${new Date().getFullYear()} MonApplication. Tous droits réservés.
      </p>
    </div>

  </div>
</body>
</html>
        `,
      });

    if (emailResult.error) {
      console.error('Email sending failed:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        emailId: emailResult.data?.id,
        message: 'Devis envoyé avec succès par email',
      },
    });
  } catch (error) {
    console.error('Quote quick-send error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create quote',
      },
      { status: 500 }
    );
  }
}
