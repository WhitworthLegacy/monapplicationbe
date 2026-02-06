interface BookingReminderParams {
  name: string;
  date: string;
  time: string;
  meetLink: string;
}

export function getBookingReminderHTML({ name, date, time, meetLink }: BookingReminderParams): string {
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
                Demain : votre appel découverte
              </h1>
              <p style="margin: 16px 0 0 0; font-size: 16px; color: #e2e8f0;">
                On se retrouve à ${time}
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Bonjour ${name},
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Un petit rappel : nous avons rendez-vous <strong>demain ${date}</strong> à <strong style="color: #b8860b;">${time}</strong> pour votre appel découverte.
              </p>

              <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #166534;">
                  Ce qu'on va voir ensemble :
                </p>
                <ul style="margin: 0; padding: 0 0 0 16px; color: #0f172a; font-size: 14px; line-height: 2;">
                  <li>Vos défis admin au quotidien</li>
                  <li>Comment notre secrétaire digitale peut vous aider</li>
                  <li>Démo rapide de l'outil</li>
                  <li>Vos questions, nos réponses</li>
                </ul>
              </div>

              ${meetLink ? `
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${meetLink}" style="display: inline-block; background: linear-gradient(135deg, #b8860b 0%, #d4a72c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600;">
                      Rejoindre le Google Meet
                    </a>
                  </td>
                </tr>
              </table>
              ` : ""}

              <p style="margin: 24px 0 0 0; font-size: 16px; color: #64748b;">
                À demain !<br>
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

export function getBookingReminderText({ name, date, time, meetLink }: BookingReminderParams): string {
  return `
Demain : votre appel découverte

Bonjour ${name},

Rappel : nous avons rendez-vous demain ${date} à ${time}.

Ce qu'on va voir ensemble :
- Vos défis admin au quotidien
- Comment notre secrétaire digitale peut vous aider
- Démo rapide de l'outil
- Vos questions, nos réponses

${meetLink ? `Lien Google Meet : ${meetLink}` : ""}

À demain !
L'équipe MonApplication.be
  `.trim();
}
