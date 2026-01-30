/**
 * Complete database types mapped from Supabase schema
 * This file contains all table definitions
 */

// ============================================================================
// PROFILES
// ============================================================================

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'manager'
  | 'marketing'
  | 'staff';

export interface Profile {
  id: string;  // uuid
  email: string;
  full_name?: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// ACTIVITIES (Audit Log)
// ============================================================================

export interface Activity {
  id: string;  // uuid
  created_at?: string;

  // User who performed the action
  user_id?: string;  // uuid
  user_email?: string;
  user_role?: string;

  // What action was performed
  action: string;  // 'created', 'updated', 'deleted', 'viewed', etc.
  entity_type: string;  // 'client', 'appointment', 'quote', etc.
  entity_id: string;  // uuid

  // Details
  description?: string;
  metadata?: Record<string, any>;  // jsonb

  // Request context
  ip_address?: string;
  user_agent?: string;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export type NotificationType = 'email' | 'sms' | 'whatsapp' | 'push';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';

export interface Notification {
  id: string;  // uuid
  created_at?: string;

  // Recipient
  client_id?: string;  // uuid
  recipient_email?: string;
  recipient_phone?: string;

  // Notification details
  type: NotificationType;
  template: string;  // 'booking_confirmation', 'quote_sent', etc.
  subject?: string;
  message: string;

  // Status tracking
  status: NotificationStatus;
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
  provider_message_id?: string;

  // Additional data
  metadata?: Record<string, any>;  // jsonb
}

// ============================================================================
// SETTINGS
// ============================================================================

export interface Setting {
  key: string;  // Primary key
  value: Record<string, any>;  // jsonb
  description?: string;
  updated_at?: string;
  updated_by?: string;  // uuid
}

// ============================================================================
// CONTACT SUBMISSIONS (from website)
// ============================================================================

export interface ContactSubmission {
  id: string;  // uuid
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at?: string;
}
