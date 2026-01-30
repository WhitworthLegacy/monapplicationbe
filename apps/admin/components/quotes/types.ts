/**
 * Types for Quotes system - Mapped to Supabase schema
 */

export type QuoteStatus =
  | 'draft'      // Brouillon
  | 'sent'       // Envoyé
  | 'viewed'     // Vu par le client
  | 'accepted'   // Accepté
  | 'refused'    // Refusé
  | 'expired';   // Expiré

export interface Quote {
  // Core fields
  id: string;
  client_id: string;
  quote_number: string;

  // Details
  title: string;
  description?: string;
  status: QuoteStatus;

  // Amounts (in cents)
  subtotal: number;
  tax_rate: number;  // Percentage (e.g., 21.00 for 21%)
  tax_amount: number;
  total: number;

  // Timestamps
  created_at?: string;
  updated_at?: string;
  sent_at?: string;
  viewed_at?: string;
  accepted_at?: string;
  refused_at?: string;
  expires_at?: string;

  // Additional
  pdf_url?: string;
  notes?: string;
  terms_and_conditions?: string;

  // Relations (not in DB but populated)
  client_name?: string;
  client_email?: string;
  client_company?: string;
  items?: QuoteItem[];
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  description: string;
  quantity: number;       // numeric in DB
  unit_price: number;     // integer (cents)
  line_total: number;     // integer (cents)
  position?: number;
}

export interface QuoteFormData {
  client_id: string;
  title: string;
  description?: string;
  items: Omit<QuoteItem, 'id' | 'quote_id'>[];
  notes?: string;
  terms_and_conditions?: string;
  expires_at?: string;
}

export interface QuoteFilters {
  search?: string;
  status?: QuoteStatus;
  client_id?: string;
  date_from?: string;
  date_to?: string;
}
