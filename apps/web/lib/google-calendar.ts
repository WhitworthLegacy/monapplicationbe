import { google } from "googleapis";

const TIMEZONE = "Europe/Brussels";
const SLOT_DURATION = 30; // minutes
const BUSINESS_START = 9; // 9h
const BUSINESS_END = 18; // 18h

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

  // Build time range for the day
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);

  // Check if weekend
  const dayOfWeek = dayStart.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return [];
  }

  // Fetch busy times
  const freeBusy = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      timeZone: TIMEZONE,
      items: [{ id: calendarId }],
    },
  });

  const busySlots = freeBusy.data.calendars?.[calendarId]?.busy || [];

  // Generate all possible slots
  const slots: TimeSlot[] = [];
  const now = new Date();

  for (let hour = BUSINESS_START; hour < BUSINESS_END; hour++) {
    for (let min = 0; min < 60; min += SLOT_DURATION) {
      const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      const slotStart = new Date(`${date}T${timeStr}:00`);
      const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION * 60 * 1000);

      // Skip past times
      if (slotStart <= now) continue;

      // Check against busy slots
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

  const startDateTime = `${params.date}T${params.time}:00`;
  const startDate = new Date(startDateTime);
  const endDate = new Date(startDate.getTime() + SLOT_DURATION * 60 * 1000);

  const companyStr = params.company ? ` (${params.company})` : "";
  const phoneStr = params.phone ? `\nTéléphone: ${params.phone}` : "";

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Appel découverte — ${params.name}${companyStr}`,
      description: `Appel découverte avec ${params.name}${companyStr}${phoneStr}\nEmail: ${params.email}\n\n${params.description || ""}`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: endDate.toISOString(),
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
