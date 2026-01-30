/**
 * Types for Appointments/RDV system
 */

export type AppointmentStatus =
  | 'scheduled'    // Planifié
  | 'confirmed'    // Confirmé par le client
  | 'in_progress'  // En cours
  | 'completed'    // Terminé
  | 'cancelled'    // Annulé
  | 'no_show';     // Client absent

export type AppointmentType =
  | 'consultation'  // Consultation
  | 'demo'          // Démonstration
  | 'meeting'       // Réunion
  | 'call'          // Appel
  | 'video'         // Visio
  | 'onsite';       // Sur site

export interface Appointment {
  id: string;
  client_id: string;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_company?: string;

  // Détails du RDV
  title: string;
  description?: string;
  appointment_type: AppointmentType;

  // Planification
  scheduled_at: string; // ISO date string
  duration_minutes: number;
  end_time?: string; // Calculated from scheduled_at + duration

  // Statut
  status: AppointmentStatus;

  // Assignation
  assigned_to?: string;
  assigned_to_name?: string;

  // Location
  location?: string;
  is_remote: boolean;

  // Video conferencing
  video_link?: string;
  video_platform?: 'meet' | 'zoom' | 'teams' | 'custom';
  meeting_id?: string;

  // Notes
  notes?: string;
  internal_notes?: string;

  // Reminders
  reminder_sent?: boolean;
  reminder_sent_at?: string;
  send_reminder_24h?: boolean;
  send_reminder_1h?: boolean;

  // Timestamps
  created_at?: string;
  updated_at?: string;
  confirmed_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

export interface AppointmentFormData {
  client_id: string;
  title: string;
  description?: string;
  appointment_type: AppointmentType;
  scheduled_at: string;
  duration_minutes: number;
  status?: AppointmentStatus;
  assigned_to?: string;
  location?: string;
  is_remote: boolean;
  video_platform?: string;
  notes?: string;
  internal_notes?: string;
  send_reminder_24h?: boolean;
  send_reminder_1h?: boolean;
}

export interface AppointmentFilters {
  search?: string;
  status?: AppointmentStatus;
  type?: AppointmentType;
  assigned_to?: string;
  client_id?: string;
  date_from?: string;
  date_to?: string;
}

export type AppointmentViewMode = 'agenda' | 'calendar' | 'list';
