/**
 * FALCO API Integration
 * Docs: https://docs.falco-app.be
 */

const FALCO_API_URL = process.env.FALCO_API_URL || "https://api.falco-app.be";
const FALCO_APP_ID = process.env.FALCO_APP_ID!;
const FALCO_SECRET = process.env.FALCO_SECRET!;

interface FalcoClient {
  name: string;
  email?: string;
  vat_number?: string;
  address?: string;
  zip_code?: string;
  city?: string;
  country?: string;
}

interface FalcoQuoteItem {
  description: string;
  quantity: number;
  unit_price: number; // in cents
}

interface FalcoQuote {
  client_id: string;
  title: string;
  items: FalcoQuoteItem[];
  tax_rate?: number;
  notes?: string;
}

async function falcoRequest(endpoint: string, options: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${FALCO_SECRET}`,
    "X-App-Id": FALCO_APP_ID,
    ...options.headers,
  };

  const response = await fetch(`${FALCO_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `FALCO API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a client in FALCO
 */
export async function createFalcoClient(client: FalcoClient) {
  return falcoRequest("/clients", {
    method: "POST",
    body: JSON.stringify(client),
  });
}

/**
 * Create a quote in FALCO
 */
export async function createFalcoQuote(quote: FalcoQuote) {
  return falcoRequest("/quotes", {
    method: "POST",
    body: JSON.stringify(quote),
  });
}

/**
 * Send invoice via Peppol
 */
export async function sendFalcoInvoice(invoiceId: string) {
  return falcoRequest(`/invoices/${invoiceId}/send`, {
    method: "POST",
  });
}

/**
 * Get invoice status
 */
export async function getFalcoInvoiceStatus(invoiceId: string) {
  return falcoRequest(`/invoices/${invoiceId}/status`);
}

/**
 * Check if a VAT number is registered on Peppol
 */
export async function checkPeppolRegistration(vatNumber: string) {
  return falcoRequest(`/peppol/check/${vatNumber}`);
}

/**
 * Sync CRM client to FALCO
 */
export async function syncClientToFalco(client: {
  full_name: string;
  email?: string;
  company?: string;
  address?: string;
  zip_code?: string;
  city?: string;
  country?: string;
}) {
  const falcoClient: FalcoClient = {
    name: client.company || client.full_name,
    email: client.email,
    address: client.address,
    zip_code: client.zip_code,
    city: client.city,
    country: client.country || "BE",
  };

  return createFalcoClient(falcoClient);
}

/**
 * Sync CRM quote to FALCO and send
 */
export async function syncQuoteToFalco(quote: {
  client_id: string;
  title: string;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number; // in cents
  }>;
  tax_rate?: number;
  notes?: string;
}) {
  // Create quote in FALCO
  const falcoQuote = await createFalcoQuote({
    client_id: quote.client_id,
    title: quote.title,
    items: quote.items,
    tax_rate: quote.tax_rate || 21,
    notes: quote.notes,
  });

  // Send via Peppol
  if (falcoQuote.id) {
    await sendFalcoInvoice(falcoQuote.id);
  }

  return falcoQuote;
}
