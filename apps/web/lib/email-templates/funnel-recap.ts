interface FunnelRecapParams {
  name: string;
  hoursLostYear: number;
  moneyLostYear: number;
  painPoints: string[];
  metier: string;
}

const PAIN_LABELS: Record<string, string> = {
  appels_manques: "Appels manqués",
  devis_retard: "Devis en retard",
  mails_soir: "Mails le soir",
  excel_papier: "Excel / papier partout",
  oublis_rappels: "Oublis de rappels",
  no_shows: "No-shows (RDV oubliés)",
  relances_impayes: "Relances d'impayés",
  pas_suivi: "Pas de suivi client",
};

export function getFunnelRecapHTML({ name, hoursLostYear, moneyLostYear, painPoints, metier }: FunnelRecapParams): string {
  const painList = painPoints
    .map((p) => `<li style="margin-bottom: 6px;">${PAIN_LABELS[p] || p} → <strong style="color: #16a34a;">Automatisé</strong></li>`)
    .join("\n");

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
                Votre diagnostic admin est prêt
              </h1>
              <p style="margin: 16px 0 0 0; font-size: 16px; color: #e2e8f0;">
                ${name ? `${name}, voici` : "Voici"} ce que l'admin vous coûte réellement
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 32px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="width: 50%; padding: 16px; background: #fef2f2; border-radius: 12px; text-align: center;">
                    <p style="margin: 0; font-size: 32px; font-weight: 700; color: #dc2626;">${hoursLostYear}h</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #991b1b;">perdues par an</p>
                  </td>
                  <td style="width: 8px;"></td>
                  <td style="width: 50%; padding: 16px; background: #fef2f2; border-radius: 12px; text-align: center;">
                    <p style="margin: 0; font-size: 32px; font-weight: 700; color: #dc2626;">${moneyLostYear.toLocaleString("fr-BE")}€</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #991b1b;">coût par an</p>
                  </td>
                </tr>
              </table>

              ${painPoints.length > 0 ? `
              <div style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #166534;">
                  Ce qu'on peut automatiser pour vous :
                </h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #0f172a; line-height: 1.8; font-size: 14px;">
                  ${painList}
                </ul>
              </div>
              ` : ""}

              <p style="margin: 0 0 24px 0; font-size: 16px; color: #0f172a; line-height: 1.6;">
                Notre secrétaire digitale résout ces problèmes en <strong>30 jours</strong>. Paiement unique, pas d'abonnement.
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="https://monapplication.be/diagnostic" style="display: inline-block; background: linear-gradient(135deg, #b8860b 0%, #d4a72c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(184, 134, 11, 0.3);">
                      Réserver un appel découverte gratuit
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 14px; color: #64748b;">
                15 minutes, gratuit, sans engagement. On regarde ensemble comment automatiser votre admin.
              </p>

              <p style="margin: 24px 0 0 0; font-size: 16px; color: #64748b; line-height: 1.6;">
                À bientôt,<br>
                <strong style="color: #0f172a;">L'équipe MonApplication.be</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f1f5f9; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                MonApplication.be — Votre secrétaire digitale<br>
                <a href="https://monapplication.be/confidentialite" style="color: #64748b; text-decoration: underline;">Politique de confidentialité</a> |
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

export function getFunnelRecapText({ name, hoursLostYear, moneyLostYear, painPoints, metier }: FunnelRecapParams): string {
  const painList = painPoints.map((p) => `- ${PAIN_LABELS[p] || p} → Automatisé`).join("\n");

  return `
Votre diagnostic admin est prêt

${name ? `${name}, voici` : "Voici"} ce que l'admin vous coûte réellement :

${hoursLostYear}h perdues par an
${moneyLostYear.toLocaleString("fr-BE")}€ de coût par an

${painPoints.length > 0 ? `Ce qu'on peut automatiser pour vous :\n${painList}` : ""}

Notre secrétaire digitale résout ces problèmes en 30 jours. Paiement unique, pas d'abonnement.

Réservez votre appel découverte gratuit : https://monapplication.be/diagnostic

15 minutes, gratuit, sans engagement.

L'équipe MonApplication.be
  `.trim();
}
