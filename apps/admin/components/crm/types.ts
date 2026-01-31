import { CrmStage, Industry, CompanySize } from '@/lib/constants';

/**
 * Colonne CRM pour le board Kanban
 */
export interface CrmColumn {
  id: string;
  slug: string;
  label: string;
  position: number;
  color?: string;
  description?: string;
  count?: number;
}

/**
 * Client/Lead dans le CRM
 */
export interface CrmClient {
  id: string;
  tracking_id?: number;

  // Informations de contact
  full_name: string;
  email?: string;
  phone: string;
  company?: string;

  // Informations entreprise
  industry?: Industry;
  company_size?: CompanySize;

  // Adresse
  address?: string;
  zip_code?: string;
  city?: string;
  country?: string;

  // CRM
  crm_stage: CrmStage;
  source?: string;
  assigned_to?: string;
  assigned_to_name?: string;

  // Communication
  prefers_email?: boolean;
  prefers_whatsapp?: boolean;
  prefers_sms?: boolean;
  language?: 'fr' | 'nl' | 'en';

  // Cold calling
  call_status?: string;
  last_call_date?: string;
  next_callback_date?: string;
  call_notes?: string;

  // Relances
  relance_1?: string;
  relance_2?: string;
  relance_3?: string;

  // Progression client (checkboxes d'avancement)
  first_email_sent?: boolean;
  first_email_sent_at?: string;
  quote_sent?: boolean;
  quote_sent_at?: string;
  meeting_scheduled?: boolean;
  meeting_scheduled_at?: string;
  follow_up_done?: boolean;
  follow_up_done_at?: string;

  // Données
  notes?: string;
  tags?: string[];

  // UTM tracking
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;

  // Timestamps
  created_at?: string;
  updated_at?: string;

  // Relations
  appointments_count?: number;
  quotes_count?: number;
  last_quote_date?: string;
  last_appointment_date?: string;
}

/**
 * Note/Activité sur un client
 */
export interface ClientActivity {
  id: string;
  client_id: string;
  user_id: string;
  user_name?: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'stage_change' | 'quote_sent';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

/**
 * Formulaire de création rapide
 */
export interface QuickCreateForm {
  full_name: string;
  phone: string;
  email?: string;
  company?: string;
  source?: string;
  crm_stage?: CrmStage;
  notes?: string;
}

/**
 * Filtres de recherche CRM
 */
export interface CrmFilters {
  search: string;
  stage?: CrmStage;
  source?: string;
  assigned_to?: string;
  call_status?: string;
  industry?: Industry;
  company_size?: CompanySize;
}
