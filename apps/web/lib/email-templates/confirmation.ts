/**
 * Email template for client confirmation after contact form submission
 */

interface ConfirmationEmailParams {
  name: string;
  calendlyLink?: string;
}

export function getConfirmationEmailHTML({ name, calendlyLink }: ConfirmationEmailParams): string {
  const calLink = calendlyLink || 'https://monapplication.be/diagnostic';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Merci pour votre demande - MonApplication.be</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(15, 23, 42, 0.1);">

          <!-- Hero Section with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 48px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; line-height: 1.2;">
                Merci ${name} ! 🎉
              </h1>
              <p style="margin: 16px 0 0 0; font-size: 18px; color: #e2e8f0; line-height: 1.6;">
                Nous avons bien reçu votre demande
              </p>
            </td>
          </tr>

          <!-- Content Section -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Bonjour <strong>${name}</strong>,
              </p>

              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Merci d'avoir contacté <strong style="color: #1e3a8a;">MonApplication.be</strong>. Votre demande a été transmise à notre équipe et nous reviendrons vers vous dans les plus brefs délais.
              </p>

              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                En attendant, pourquoi ne pas planifier une <strong>visio découverte de 15 minutes</strong> avec un de nos experts ? C'est gratuit et sans engagement !
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${calLink}" style="display: inline-block; background: linear-gradient(135deg, #b8860b 0%, #d4a72c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);">
                      📅 Réserver ma visio gratuite
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Benefits List -->
              <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin: 32px 0;">
                <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #0f172a;">
                  Pourquoi planifier une visio découverte ?
                </h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #0f172a; line-height: 1.8;">
                  <li style="margin-bottom: 8px;">Comprendre vos besoins spécifiques</li>
                  <li style="margin-bottom: 8px;">Découvrir nos solutions adaptées</li>
                  <li style="margin-bottom: 8px;">Obtenir un devis personnalisé</li>
                  <li style="margin-bottom: 0;">Poser toutes vos questions</li>
                </ul>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 16px; color: #64748b; line-height: 1.6;">
                À très bientôt,<br>
                <strong style="color: #0f172a;">L'équipe MonApplication.be</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
                <strong>MonApplication.be</strong><br>
                Votre secrétaire digitale à partir de 5 000€/an
              </p>
              <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">
                📧 <a href="mailto:contact@monapplication.be" style="color: #1e3a8a; text-decoration: none;">contact@monapplication.be</a><br>
                📞 <a href="tel:+32460242427" style="color: #1e3a8a; text-decoration: none;">+32 460 24 24 27</a>
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Vous recevez cet email car vous avez contacté MonApplication.be<br>
                <a href="https://monapplication.be/confidentialite" style="color: #64748b; text-decoration: underline;">Politique de confidentialité</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getConfirmationEmailText({ name }: ConfirmationEmailParams): string {
  return `
Merci ${name} !

Nous avons bien reçu votre demande.

Bonjour ${name},

Merci d'avoir contacté MonApplication.be. Votre demande a été transmise à notre équipe et nous reviendrons vers vous dans les plus brefs délais.

En attendant, planifiez une visio découverte de 15 minutes avec un de nos experts (gratuit et sans engagement) :
https://calendly.com/monapplication

Pourquoi planifier une visio découverte ?
- Comprendre vos besoins spécifiques
- Découvrir nos solutions adaptées
- Obtenir un devis personnalisé
- Poser toutes vos questions

À très bientôt,
L'équipe MonApplication.be

---
MonApplication.be
Votre secrétaire digitale à partir de 5 000€/an

📧 contact@monapplication.be
📞 +32 460 24 24 27

Vous recevez cet email car vous avez contacté MonApplication.be
  `.trim();
}
