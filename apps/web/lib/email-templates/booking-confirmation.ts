interface BookingConfirmationParams {
  name: string;
  date: string;
  time: string;
  meetLink: string;
}

export function getBookingConfirmationHTML({ name, date, time, meetLink }: BookingConfirmationParams): string {
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
                C'est confirmé, ${name} !
              </h1>
              <p style="margin: 16px 0 0 0; font-size: 16px; color: #e2e8f0;">
                Votre appel découverte est réservé
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 32px;">
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #166534; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  Votre rendez-vous
                </p>
                <p style="margin: 0; font-size: 20px; font-weight: 700; color: #0f172a;">
                  ${date}
                </p>
                <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 700; color: #b8860b;">
                  ${time}
                </p>
                <p style="margin: 8px 0 0 0; font-size: 14px; color: #64748b;">
                  Durée : 15 minutes | Gratuit | Sans engagement
                </p>
              </div>

              ${meetLink ? `
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${meetLink}" style="display: inline-block; background: linear-gradient(135deg, #b8860b 0%, #d4a72c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);">
                      Rejoindre le Google Meet
                    </a>
                  </td>
                </tr>
              </table>
              ` : ""}

              <h3 style="margin: 32px 0 16px 0; font-size: 16px; font-weight: 600; color: #0f172a;">
                Comment se préparer ?
              </h3>
              <ul style="margin: 0; padding: 0 0 0 20px; color: #0f172a; line-height: 2;">
                <li>Pensez aux tâches admin qui vous prennent le plus de temps</li>
                <li>Notez vos outils actuels (même un carnet papier compte !)</li>
                <li>Préparez vos questions — on est là pour vous</li>
              </ul>

              <p style="margin: 32px 0 0 0; font-size: 16px; color: #64748b; line-height: 1.6;">
                À très bientôt,<br>
                <strong style="color: #0f172a;">L'équipe MonApplication.be</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                MonApplication.be — Votre secrétaire digitale<br>
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

export function getBookingConfirmationText({ name, date, time, meetLink }: BookingConfirmationParams): string {
  return `
C'est confirmé, ${name} !

Votre appel découverte est réservé.

Date : ${date}
Heure : ${time}
Durée : 15 minutes | Gratuit | Sans engagement

${meetLink ? `Lien Google Meet : ${meetLink}` : ""}

Comment se préparer ?
- Pensez aux tâches admin qui vous prennent le plus de temps
- Notez vos outils actuels
- Préparez vos questions

À très bientôt,
L'équipe MonApplication.be
  `.trim();
}
