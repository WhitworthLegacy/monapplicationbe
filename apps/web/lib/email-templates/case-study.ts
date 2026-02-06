interface CaseStudyParams {
  name: string;
  metier: string;
}

export function getCaseStudyHTML({ name, metier }: CaseStudyParams): string {
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
              <h1 style="margin: 0; font-size: 26px; font-weight: 700; color: #ffffff;">
                Comment un ${metier || "entrepreneur"} a gagné 15h/semaine
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Bonjour ${name},
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Voici l'histoire d'un professionnel qui était dans la même situation que vous.
              </p>

              <div style="background: #fef2f2; border-radius: 12px; padding: 20px; margin: 16px 0;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #dc2626;">AVANT</p>
                <ul style="margin: 0; padding: 0 0 0 16px; color: #991b1b; font-size: 14px; line-height: 1.8;">
                  <li>Passait ses soirées à répondre aux mails et faire des devis</li>
                  <li>Oubliait de rappeler des clients → perte de contrats</li>
                  <li>Gérait tout sur Excel et des post-it</li>
                  <li>No-shows réguliers faute de rappels automatiques</li>
                </ul>
              </div>

              <div style="background: #f0fdf4; border-radius: 12px; padding: 20px; margin: 16px 0;">
                <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #166534;">APRÈS</p>
                <ul style="margin: 0; padding: 0 0 0 16px; color: #166534; font-size: 14px; line-height: 1.8;">
                  <li>Les clients réservent seuls en ligne 24h/24</li>
                  <li>Devis envoyés en 2 clics depuis le téléphone</li>
                  <li>Rappels WhatsApp automatiques → -80% de no-shows</li>
                  <li>Suivi CRM centralisé → 0 client oublié</li>
                </ul>
              </div>

              <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
                <p style="margin: 0; font-size: 24px; font-weight: 700; color: #b8860b;">+15h/semaine récupérées</p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #92400e;">1ère version livrée en 30 jours</p>
              </div>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="https://monapplication.be/diagnostic" style="display: inline-block; background: linear-gradient(135deg, #b8860b 0%, #d4a72c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600;">
                      Je veux les mêmes résultats
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 16px; color: #64748b;">
                L'équipe MonApplication.be
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                MonApplication.be<br>
                <a href="mailto:contact@monapplication.be" style="color: #64748b; text-decoration: underline;">Se désabonner</a>
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

export function getCaseStudyText({ name, metier }: CaseStudyParams): string {
  return `
Comment un ${metier || "entrepreneur"} a gagné 15h/semaine

Bonjour ${name},

Voici l'histoire d'un professionnel dans la même situation que vous.

AVANT:
- Soirées à faire des devis et répondre aux mails
- Oublis de rappels → perte de contrats
- Gestion Excel et post-it
- No-shows réguliers

APRÈS:
- Réservation en ligne 24h/24
- Devis en 2 clics depuis le téléphone
- Rappels WhatsApp automatiques (-80% no-shows)
- CRM centralisé, 0 client oublié

Résultat : +15h/semaine récupérées. 1ère version en 30 jours.

Réservez votre appel : https://monapplication.be/diagnostic

L'équipe MonApplication.be
  `.trim();
}
