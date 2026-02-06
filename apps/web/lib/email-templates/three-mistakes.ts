interface ThreeMistakesParams {
  name: string;
}

export function getThreeMistakesHTML({ name }: ThreeMistakesParams): string {
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
                3 erreurs qui vous coûtent des clients
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Bonjour ${name},
              </p>

              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                En travaillant avec des dizaines d'entrepreneurs, nous voyons toujours les mêmes 3 erreurs. Elles semblent anodines, mais elles coûtent cher.
              </p>

              <!-- Erreur 1 -->
              <div style="border-left: 4px solid #dc2626; padding: 16px 20px; margin: 16px 0; background: #fef2f2; border-radius: 0 12px 12px 0;">
                <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: #dc2626;">Erreur #1 : Répondre trop tard</p>
                <p style="margin: 0; font-size: 14px; color: #0f172a; line-height: 1.6;">
                  Un prospect attend maximum 30 minutes. Après, il appelle quelqu'un d'autre. Si vous êtes sur un chantier et que vous rappelez 2h plus tard, c'est trop tard.
                </p>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #166534; font-weight: 600;">
                  Solution : Réponse automatique instantanée sur WhatsApp, Messenger, Instagram.
                </p>
              </div>

              <!-- Erreur 2 -->
              <div style="border-left: 4px solid #dc2626; padding: 16px 20px; margin: 16px 0; background: #fef2f2; border-radius: 0 12px 12px 0;">
                <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: #dc2626;">Erreur #2 : Pas de rappel automatique</p>
                <p style="margin: 0; font-size: 14px; color: #0f172a; line-height: 1.6;">
                  Sans rappel, 20-30% des RDV sont oubliés. Un créneau vide = du temps perdu + du chiffre d'affaires envolé.
                </p>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #166534; font-weight: 600;">
                  Solution : Rappels WhatsApp automatiques 24h et 1h avant chaque RDV.
                </p>
              </div>

              <!-- Erreur 3 -->
              <div style="border-left: 4px solid #dc2626; padding: 16px 20px; margin: 16px 0; background: #fef2f2; border-radius: 0 12px 12px 0;">
                <p style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: #dc2626;">Erreur #3 : Devis envoyé trop tard</p>
                <p style="margin: 0; font-size: 14px; color: #0f172a; line-height: 1.6;">
                  Quand le devis arrive 3 jours après la demande, le client a déjà signé ailleurs. Les artisans les plus rapides gagnent les contrats.
                </p>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #166534; font-weight: 600;">
                  Solution : Templates prêts, calcul auto, envoi en 2 clics depuis votre téléphone.
                </p>
              </div>

              <p style="margin: 24px 0 16px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                <strong>Ces 3 problèmes se résolvent en automatisant.</strong> Et ça prend 30 jours.
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="https://monapplication.be/diagnostic" style="display: inline-block; background: linear-gradient(135deg, #b8860b 0%, #d4a72c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600;">
                      Réserver mon appel découverte
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

export function getThreeMistakesText({ name }: ThreeMistakesParams): string {
  return `
3 erreurs qui vous coûtent des clients

Bonjour ${name},

En travaillant avec des dizaines d'entrepreneurs, nous voyons toujours les mêmes 3 erreurs :

ERREUR #1 : Répondre trop tard
Un prospect attend max 30 minutes. Après, il appelle quelqu'un d'autre.
→ Solution : Réponse automatique instantanée sur WhatsApp/Messenger/Instagram.

ERREUR #2 : Pas de rappel automatique
Sans rappel, 20-30% des RDV sont oubliés.
→ Solution : Rappels WhatsApp 24h et 1h avant chaque RDV.

ERREUR #3 : Devis envoyé trop tard
Quand le devis arrive 3 jours après, le client a signé ailleurs.
→ Solution : Templates prêts, envoi en 2 clics depuis votre téléphone.

Ces 3 problèmes se résolvent en 30 jours.

Réservez votre appel : https://monapplication.be/diagnostic

L'équipe MonApplication.be
  `.trim();
}
