import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createServerClient } from '@/lib/supabase/server';

interface QuoteItem {
  description: string;
  quantity: number;
  unit_price: number; // in cents
}

interface QuickQuoteRequest {
  quote_id: string; // ID of the draft quote in database
  quote_number: string; // Quote number from database
  client_id: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  client_phone?: string;
  title?: string;
  description?: string;
  items: QuoteItem[];
  notes?: string;
  tax_rate?: number;
  pdf_base64?: string; // PDF file as base64 string
}

export async function POST(request: NextRequest) {
  try {
    const body: QuickQuoteRequest = await request.json();

    // Validation
    if (!body.quote_id || !body.quote_number) {
      return NextResponse.json(
        { error: 'Quote ID and number required' },
        { status: 400 }
      );
    }

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

    if (!body.pdf_base64) {
      return NextResponse.json(
        { error: 'PDF attachment required' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = await createServerClient();

    // Update quote status to 'sent' and set sent_at
    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('id', body.quote_id);

    if (updateError) {
      console.error('Error updating quote status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update quote status' },
        { status: 500 }
      );
    }

    // Initialize Resend (lazy loading to avoid build errors)
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Calculate totals
    const taxRate = body.tax_rate || 21;
    const subtotal = body.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    const tax = Math.round(subtotal * (taxRate / 100));
    const total = subtotal + tax;

    // Calculate 25% deposit
    const deposit = Math.round(total * 0.25);

    // Get first name for personalized greeting
    const firstName = body.client_name.split(' ')[0];

    // Generate PDF filename with quote number
    const pdfFilename = `${body.quote_number}.pdf`;

    // Send quote email via Resend with PDF attachment
    const emailResult = await resend.emails.send({
        from: 'MonApplication <contact@monapplication.be>',
        to: [body.client_email],
        subject: `${body.quote_number} - ${body.title || 'Votre devis MonApplication'}`,
        attachments: [
          {
            filename: pdfFilename,
            content: body.pdf_base64,
          },
        ],
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
      <!--[if mso]>
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="background: white; border-radius: 12px;">
      <tr><td style="padding: 12px;">
      <![endif]-->
      <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 20px; background: white; border-radius: 12px; border-collapse: separate;">
        <tr>
          <td style="padding: 10px;">
            <table cellpadding="0" cellspacing="3" border="0">
              <tr>
                <td style="width: 12px; height: 12px; background-color: #0f172a; border-radius: 2px;"></td>
                <td style="width: 12px; height: 12px; background-color: #1e3a8a; border-radius: 2px;"></td>
                <td style="width: 12px; height: 12px; background-color: #b8860b; border-radius: 2px;"></td>
              </tr>
              <tr>
                <td style="width: 12px; height: 12px; background-color: #1e3a8a; border-radius: 2px;"></td>
                <td style="width: 12px; height: 12px; background-color: #b8860b; border-radius: 2px;"></td>
                <td style="width: 12px; height: 12px; background-color: #0f172a; border-radius: 2px;"></td>
              </tr>
              <tr>
                <td style="width: 12px; height: 12px; background-color: #b8860b; border-radius: 2px;"></td>
                <td style="width: 12px; height: 12px; background-color: #0f172a; border-radius: 2px;"></td>
                <td style="width: 12px; height: 12px; background-color: #1e3a8a; border-radius: 2px;"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
      <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
        ${body.quote_number}
      </h1>
      <p style="margin: 8px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
        MonApplication
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="margin: 0 0 24px 0; font-size: 18px; color: #0f172a; line-height: 1.6;">
        Bonjour <strong>${firstName}</strong>,
      </p>

      <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.8;">
        Merci pour votre intérêt envers nos services ! 🙏
      </p>

      <p style="margin: 0 0 24px 0; font-size: 16px; color: #64748b; line-height: 1.8;">
        Veuillez trouver <strong style="color: #0f172a;">votre devis ci-joint en PDF</strong>.
      </p>

      <!-- Summary Box -->
      <div style="background: linear-gradient(135deg, #fff9ed 0%, #fef3c7 100%); border: 2px solid #b8860b; border-radius: 12px; padding: 24px; margin: 32px 0;">
        <div style="text-align: center; margin-bottom: 16px;">
          <span style="font-size: 14px; color: #92400e; text-transform: uppercase; letter-spacing: 1px;">Montant total TVAC</span>
          <div style="font-size: 32px; font-weight: 700; color: #b8860b; margin-top: 4px;">
            ${(total / 100).toFixed(2)} €
          </div>
        </div>
        <div style="border-top: 1px solid #d4a72c; padding-top: 16px; text-align: center;">
          <span style="font-size: 14px; color: #92400e;">Acompte de 25% pour démarrer :</span>
          <div style="font-size: 24px; font-weight: 700; color: #0f172a; margin-top: 4px;">
            ${(deposit / 100).toFixed(2)} €
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #166534;">📋 Pour démarrer votre projet :</h3>
        <ol style="margin: 0; padding-left: 20px; color: #15803d; line-height: 1.8;">
          <li>Renvoyez le devis signé par email</li>
          <li>Payez l'acompte de <strong>${(deposit / 100).toFixed(2)} €</strong> (25%)</li>
          <li>Nous démarrons immédiatement !</li>
        </ol>
      </div>

      <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.6; background: #f1f5f9; padding: 16px; border-radius: 8px;">
        💡 <strong>Bon à savoir :</strong> Une facture pour le solde total vous sera envoyée à la livraison de votre projet.
      </p>

      <p style="margin: 0 0 16px 0; font-size: 14px; color: #64748b; line-height: 1.6;">
        Ce devis est valable pendant <strong>30 jours</strong>. Pour toute question, n'hésitez pas à nous contacter !
      </p>

      <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">
        À très vite,<br>
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
      // Revert quote status to draft if email fails
      await supabase
        .from('quotes')
        .update({ status: 'draft', sent_at: null })
        .eq('id', body.quote_id);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        quoteId: body.quote_id,
        quoteNumber: body.quote_number,
        emailId: emailResult.data?.id,
        message: 'Devis envoyé avec succès par email',
      },
    });
  } catch (error) {
    console.error('Quote quick-send error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to send quote',
      },
      { status: 500 }
    );
  }
}
