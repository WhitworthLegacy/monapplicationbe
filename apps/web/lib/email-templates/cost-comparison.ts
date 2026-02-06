interface CostComparisonParams {
  name: string;
}

export function getCostComparisonHTML({ name }: CostComparisonParams): string {
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
                Le vrai coût de votre admin en 2026
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Bonjour ${name},
              </p>

              <p style="margin: 0 0 16px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Saviez-vous qu'une secrétaire en Belgique coûte en moyenne <strong style="color: #dc2626;">30 000€/an</strong> (salaire + charges + congés) ?
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <tr>
                  <td style="width: 48%; padding: 16px; background: #fef2f2; border-radius: 12px; vertical-align: top;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #dc2626;">Secrétaire classique</p>
                    <ul style="margin: 0; padding: 0 0 0 16px; color: #991b1b; font-size: 13px; line-height: 1.8;">
                      <li>~2 500€/mois</li>
                      <li>Charges sociales</li>
                      <li>Congés payés</li>
                      <li>Risque de démission</li>
                      <li>Erreurs humaines</li>
                      <li>8h/jour max</li>
                    </ul>
                  </td>
                  <td style="width: 4%;"></td>
                  <td style="width: 48%; padding: 16px; background: #f0fdf4; border-radius: 12px; vertical-align: top;">
                    <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #166534;">Secrétaire digitale</p>
                    <ul style="margin: 0; padding: 0 0 0 16px; color: #166534; font-size: 13px; line-height: 1.8;">
                      <li>Paiement unique</li>
                      <li>0€ charges</li>
                      <li>Jamais de congés</li>
                      <li>Jamais de démission</li>
                      <li>0 erreur d'oubli</li>
                      <li>24h/24, 7j/7</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                La question n'est pas "est-ce que je peux me le permettre ?" mais <strong>"est-ce que je peux me permettre de continuer sans ?"</strong>
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
                MonApplication.be — Votre secrétaire digitale<br>
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

export function getCostComparisonText({ name }: CostComparisonParams): string {
  return `
Le vrai coût de votre admin en 2026

Bonjour ${name},

Saviez-vous qu'une secrétaire en Belgique coûte en moyenne 30 000€/an ?

SECRÉTAIRE CLASSIQUE
- ~2 500€/mois
- Charges sociales
- Congés payés
- Risque de démission
- Erreurs humaines
- 8h/jour max

SECRÉTAIRE DIGITALE
- Paiement unique
- 0€ charges
- Jamais de congés
- 0 erreur d'oubli
- 24h/24, 7j/7

La question n'est pas "est-ce que je peux me le permettre ?" mais "est-ce que je peux me permettre de continuer sans ?"

Réservez votre appel découverte : https://monapplication.be/diagnostic

L'équipe MonApplication.be
  `.trim();
}
