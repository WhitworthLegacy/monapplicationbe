interface BookingFollowupParams {
  name: string;
}

export function getBookingFollowupHTML({ name }: BookingFollowupParams): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f1f5f9;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(15, 23, 42, 0.1);">

          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); padding: 48px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
                Merci pour notre échange !
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Bonjour ${name},
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Merci d'avoir pris le temps de discuter avec nous. Nous espérons que cet échange vous a donné une vision claire de ce qu'on peut faire pour vous.
              </p>

              <div style="background: #f0fdf4; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #166534;">
                  Les prochaines étapes :
                </h3>
                <ol style="margin: 0; padding: 0 0 0 20px; color: #0f172a; font-size: 14px; line-height: 2;">
                  <li>Nous préparons votre devis personnalisé</li>
                  <li>Vous le recevrez dans les 48h</li>
                  <li>Si vous êtes partant : on démarre sous 7 jours</li>
                  <li>1ère version opérationnelle en 30 jours</li>
                </ol>
              </div>

              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Si vous avez la moindre question entre-temps, n'hésitez pas à nous répondre directement à cet email ou à nous appeler.
              </p>

              <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; font-size: 14px; color: #64748b;">
                  <strong style="color: #0f172a;">Contact direct :</strong><br>
                  Email : <a href="mailto:contact@monapplication.be" style="color: #1e3a8a;">contact@monapplication.be</a><br>
                  Tél : <a href="tel:+32460242427" style="color: #1e3a8a;">+32 460 24 24 27</a>
                </p>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 16px; color: #64748b;">
                À très bientôt,<br>
                <strong style="color: #0f172a;">L'équipe MonApplication.be</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                MonApplication.be — Votre secrétaire digitale
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

export function getBookingFollowupText({ name }: BookingFollowupParams): string {
  return `
Merci pour notre échange, ${name} !

Merci d'avoir pris le temps de discuter avec nous.

Les prochaines étapes :
1. Nous préparons votre devis personnalisé
2. Vous le recevrez dans les 48h
3. Si vous êtes partant : on démarre sous 7 jours
4. 1ère version opérationnelle en 30 jours

N'hésitez pas à nous contacter :
Email : contact@monapplication.be
Tél : +32 460 24 24 27

À très bientôt,
L'équipe MonApplication.be
  `.trim();
}
