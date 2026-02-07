import { google } from "googleapis";

const TIMEZONE = "Europe/Brussels";
const SLOT_DURATION = 60; // minutes
const BUSINESS_START = 11; // 11h
const BUSINESS_END = 15; // 15h (last slot: 14:00-15:00)

/**
 * Get the UTC offset for Brussels on a given date (handles DST)
 * Returns e.g. "+01:00" (winter) or "+02:00" (summer)
 */
function getBrusselsOffset(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const h = parseInt(parts.find((p) => p.type === "hour")!.value);
  const m = parseInt(parts.find((p) => p.type === "minute")!.value);
  const diffMin = h * 60 + m - 12 * 60;
  const sign = diffMin >= 0 ? "+" : "-";
  const absH = Math.floor(Math.abs(diffMin) / 60);
  const absM = Math.abs(diffMin) % 60;
  return `${sign}${String(absH).padStart(2, "0")}:${String(absM).padStart(2, "0")}`;
}

function getCalendarClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.calendar({ version: "v3", auth: oauth2Client });
}

export interface TimeSlot {
  time: string; // "09:00"
  datetime: string; // "2026-02-10T09:00:00+01:00"
  available: boolean;
}

/**
 * Get available 30-min slots for a given date
 */
export async function getAvailableSlots(date: string): Promise<TimeSlot[]> {
  const calendar = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) throw new Error("GOOGLE_CALENDAR_ID not configured");

  const offset = getBrusselsOffset(date);

  // Only allow Monday (1) to Thursday (4)
  const dayOfWeek = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (dayOfWeek === 0 || dayOfWeek >= 5) {
    return [];
  }

  // Fetch busy times
  const freeBusy = await calendar.freebusy.query({
    requestBody: {
      timeMin: new Date(`${date}T00:00:00${offset}`).toISOString(),
      timeMax: new Date(`${date}T23:59:59${offset}`).toISOString(),
      timeZone: TIMEZONE,
      items: [{ id: calendarId }],
    },
  });

  const busySlots = freeBusy.data.calendars?.[calendarId]?.busy || [];

  // Generate slots using Brussels timezone offset
  const slots: TimeSlot[] = [];
  const now = new Date();

  for (let hour = BUSINESS_START; hour < BUSINESS_END; hour++) {
    const timeStr = `${String(hour).padStart(2, "0")}:00`;
    const slotStart = new Date(`${date}T${timeStr}:00${offset}`);
    const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION * 60 * 1000);

    // Skip past times
    if (slotStart <= now) continue;

    // Check against busy slots (both in UTC)
    const isBusy = busySlots.some((busy) => {
      const busyStart = new Date(busy.start!);
      const busyEnd = new Date(busy.end!);
      return slotStart < busyEnd && slotEnd > busyStart;
    });

    slots.push({
      time: timeStr,
      datetime: slotStart.toISOString(),
      available: !isBusy,
    });
  }

  return slots.filter((s) => s.available);
}

export interface BookingParams {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  date: string; // "2026-02-10"
  time: string; // "09:00"
  description?: string;
}

export interface BookingResult {
  eventId: string;
  meetLink: string;
  htmlLink: string;
}

/**
 * Create a Google Calendar event with Google Meet link
 */
export async function createCalendarBooking(
  params: BookingParams
): Promise<BookingResult> {
  const calendar = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  if (!calendarId) throw new Error("GOOGLE_CALENDAR_ID not configured");

  // Build start/end datetime strings in local time (no UTC conversion)
  const startDateTime = `${params.date}T${params.time}:00`;
  const [h, m] = params.time.split(":").map(Number);
  const endMinutes = h * 60 + m + SLOT_DURATION;
  const endH = Math.floor(endMinutes / 60);
  const endM = endMinutes % 60;
  const endDateTime = `${params.date}T${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00`;

  const companyStr = params.company ? ` (${params.company})` : "";
  const phoneStr = params.phone ? `\nTéléphone: ${params.phone}` : "";

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Appel découverte — ${params.name}${companyStr}`,
      description: `Appel découverte avec ${params.name}${companyStr}${phoneStr}\nEmail: ${params.email}\n\n${params.description || ""}`,
      start: {
        dateTime: startDateTime,
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: endDateTime,
        timeZone: TIMEZONE,
      },
      attendees: [{ email: params.email }],
      conferenceData: {
        createRequest: {
          requestId: `booking-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 15 },
        ],
      },
    },
  });

  return {
    eventId: event.data.id || "",
    meetLink: event.data.conferenceData?.entryPoints?.[0]?.uri || "",
    htmlLink: event.data.htmlLink || "",
  };
}
