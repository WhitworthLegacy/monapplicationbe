interface LastChanceParams {
  name: string;
}

export function getLastChanceHTML({ name }: LastChanceParams): string {
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
            <td style="background: linear-gradient(135deg, #b8860b 0%, #d4a72c 100%); padding: 48px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
                Votre appel découverte gratuit expire bientôt
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Bonjour ${name},
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Il y a quelques jours, vous avez fait votre diagnostic admin. Vous savez maintenant combien l'admin vous coûte en temps et en argent.
              </p>

              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Mais rien n'a changé depuis. Vous continuez à :
              </p>

              <ul style="margin: 0 0 24px 0; padding: 0 0 0 20px; color: #dc2626; font-size: 15px; line-height: 2;">
                <li>Répondre aux mails le soir</li>
                <li>Oublier de relancer des clients</li>
                <li>Perdre du temps sur des tâches répétitives</li>
              </ul>

              <div style="background: #fffbeb; border: 2px solid #b8860b; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: #0f172a;">
                  15 minutes peuvent tout changer
                </p>
                <p style="margin: 0; font-size: 14px; color: #64748b;">
                  Gratuit. Sans engagement. On regarde ensemble votre situation.
                </p>
              </div>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="https://monapplication.be/diagnostic" style="display: inline-block; background: linear-gradient(135deg, #b8860b 0%, #d4a72c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 18px; font-weight: 600; box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);">
                      Réserver mon appel maintenant
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 16px; color: #64748b;">
                À bientôt j'espère,<br>
                <strong style="color: #0f172a;">L'équipe MonApplication.be</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Ceci est le dernier email de notre séquence. Vous ne recevrez plus de messages automatiques.<br>
                <a href="mailto:contact@monapplication.be" style="color: #64748b; text-decoration: underline;">Contactez-nous</a>
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

export function getLastChanceText({ name }: LastChanceParams): string {
  return `
Votre appel découverte gratuit expire bientôt

Bonjour ${name},

Il y a quelques jours, vous avez fait votre diagnostic admin. Vous savez combien l'admin vous coûte.

Mais rien n'a changé. Vous continuez à répondre aux mails le soir, oublier de relancer, perdre du temps.

15 minutes peuvent tout changer. Gratuit. Sans engagement.

Réservez maintenant : https://monapplication.be/diagnostic

Ceci est le dernier email de notre séquence.

L'équipe MonApplication.be
  `.trim();
}
