/**
 * Video link generation utilities
 * Automatically generate video conference links like Calendly
 */

/**
 * Generate a unique meeting ID
 */
export function generateMeetingId(): string {
  // Generate a URL-safe ID (10 characters, URL-safe)
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(10);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 10; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

/**
 * Generate video conference link based on platform
 */
export function generateVideoLink(
  platform: 'meet' | 'zoom' | 'teams' | 'custom',
  meetingId?: string
): { link: string; meetingId: string } {
  const id = meetingId || generateMeetingId();

  switch (platform) {
    case 'meet':
      // Google Meet format: meet.google.com/xxx-yyyy-zzz
      const formattedId = id.match(/.{1,3}/g)?.join('-') || id;
      return {
        link: `https://meet.google.com/${formattedId}`,
        meetingId: id,
      };

    case 'zoom':
      // Zoom format: zoom.us/j/MEETING_ID
      // Note: This won't actually work without Zoom API, but format is correct
      return {
        link: `https://zoom.us/j/${id}`,
        meetingId: id,
      };

    case 'teams':
      // Microsoft Teams format
      return {
        link: `https://teams.microsoft.com/l/meetup-join/${id}`,
        meetingId: id,
      };

    case 'custom':
      // Custom platform - use your domain
      return {
        link: `https://monapplication.be/meet/${id}`,
        meetingId: id,
      };

    default:
      return generateVideoLink('meet', meetingId);
  }
}

/**
 * Get platform name for display
 */
export function getVideoPlatformName(platform?: string): string {
  switch (platform) {
    case 'meet': return 'Google Meet';
    case 'zoom': return 'Zoom';
    case 'teams': return 'Microsoft Teams';
    case 'custom': return 'MonApplication Meet';
    default: return 'Visioconférence';
  }
}

/**
 * Validate video link format
 */
export function isValidVideoLink(link: string): boolean {
  const validPatterns = [
    /^https:\/\/meet\.google\.com\//,
    /^https:\/\/zoom\.us\//,
    /^https:\/\/teams\.microsoft\.com\//,
    /^https:\/\/monapplication\.be\/meet\//,
    /^https?:\/\/.+/,
  ];

  return validPatterns.some((pattern) => pattern.test(link));
}

/**
 * Format meeting duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h${remainingMinutes}`;
}

/**
 * Calculate end time from start and duration
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const start = new Date(startTime);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  return end.toISOString();
}

/**
 * Check if appointment is upcoming (within next 2 hours)
 */
export function isUpcoming(scheduledAt: string): boolean {
  const now = new Date();
  const scheduled = new Date(scheduledAt);
  const diff = scheduled.getTime() - now.getTime();
  const twoHours = 2 * 60 * 60 * 1000;

  return diff > 0 && diff <= twoHours;
}

/**
 * Check if appointment is past
 */
export function isPast(scheduledAt: string): boolean {
  return new Date(scheduledAt) < new Date();
}

/**
 * Format date for display
 */
export function formatAppointmentDate(dateString: string, locale: string = 'fr-BE'): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format time for display
 */
export function formatAppointmentTime(dateString: string, locale: string = 'fr-BE'): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Generate iCal/ICS file content for calendar invite
 */
export function generateICSContent(appointment: {
  title: string;
  description?: string;
  scheduledAt: string;
  durationMinutes: number;
  location?: string;
  videoLink?: string;
}): string {
  const start = new Date(appointment.scheduledAt);
  const end = new Date(start.getTime() + appointment.durationMinutes * 60000);

  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//monapplication.be//NONSGML v1.0//EN',
    'BEGIN:VEVENT',
    `UID:${generateMeetingId()}@monapplication.be`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${appointment.title}`,
  ];

  if (appointment.description) {
    lines.push(`DESCRIPTION:${appointment.description}`);
  }

  if (appointment.videoLink) {
    lines.push(`LOCATION:${appointment.videoLink}`);
    lines.push(`URL:${appointment.videoLink}`);
  } else if (appointment.location) {
    lines.push(`LOCATION:${appointment.location}`);
  }

  lines.push('STATUS:CONFIRMED');
  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}
