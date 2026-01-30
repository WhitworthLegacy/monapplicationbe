import webpush from "web-push";

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:contact@monapplication.be",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: {
    title: string;
    body: string;
    icon?: string;
    url?: string;
  },
) {
  try {
    return await webpush.sendNotification(
      subscription,
      JSON.stringify(payload),
    );
  } catch (error) {
    console.error("Failed to send push notification:", error);
    throw error;
  }
}

export function generateVapidKeys() {
  return webpush.generateVAPIDKeys();
}
