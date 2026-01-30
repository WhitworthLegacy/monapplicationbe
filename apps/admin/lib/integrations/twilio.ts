import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

export async function sendSMS(to: string, message: string) {
  try {
    return await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
      body: message,
    });
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw error;
  }
}

export async function sendWhatsApp(to: string, message: string) {
  try {
    return await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${to}`,
      body: message,
    });
  } catch (error) {
    console.error("Failed to send WhatsApp:", error);
    throw error;
  }
}

export async function sendAppointmentReminder(
  phone: string,
  clientName: string,
  appointmentDate: Date,
  appointmentType: string,
) {
  const message = `Bonjour ${clientName},

Rappel: Vous avez un rendez-vous ${appointmentType} prévu le ${appointmentDate.toLocaleDateString("fr-BE")} à ${appointmentDate.toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })}.

MonApplication.be`;

  return sendSMS(phone, message);
}

export async function sendQuoteNotification(
  phone: string,
  clientName: string,
  quoteNumber: string,
  quoteUrl: string,
) {
  const message = `Bonjour ${clientName},

Votre devis ${quoteNumber} est prêt ! Consultez-le ici: ${quoteUrl}

Merci,
L'équipe MonApplication.be`;

  return sendWhatsApp(phone, message);
}
