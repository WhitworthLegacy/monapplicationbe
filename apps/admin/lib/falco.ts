/**
 * Falco API Client
 * Belgian e-invoicing and quote system
 * Documentation: https://api.falco-app.be/docs
 */

const FALCO_BASE_URL = 'https://api.falco-app.be/v1';
const FALCO_APP_ID = process.env.FALCO_APP_ID!;
const FALCO_API_SECRET = process.env.FALCO_API_SECRET!;

interface FalcoCustomer {
  name: string;
  email?: string;
  phone?: string;
  vat_number?: string;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
  company_name?: string;
}

interface FalcoInvoiceItem {
  description: string;
  quantity: number;
  unit_price: number; // in cents
  vat_rate?: number; // percentage, default 21
}

interface FalcoInvoice {
  customer_id?: string;
  customer?: FalcoCustomer;
  items: FalcoInvoiceItem[];
  type: 'invoice' | 'quote' | 'credit_note';
  due_date?: string; // ISO date
  notes?: string;
  discount_percentage?: number;
}

interface FalcoResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Make authenticated request to Falco API
 */
async function falcoRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<FalcoResponse<T>> {
  const url = `${FALCO_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'X-Falco-App-Secret': FALCO_API_SECRET,
    'X-Falco-Api-Key': FALCO_APP_ID,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || 'Falco API error',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Falco API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create or update a customer in Falco
 */
export async function createFalcoCustomer(customer: FalcoCustomer): Promise<FalcoResponse> {
  return falcoRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(customer),
  });
}

/**
 * Create a quote in Falco
 */
export async function createFalcoQuote(invoice: FalcoInvoice): Promise<FalcoResponse> {
  // Ensure type is quote
  const quoteData = {
    ...invoice,
    type: 'quote' as const,
  };

  return falcoRequest('/invoices', {
    method: 'POST',
    body: JSON.stringify(quoteData),
  });
}

/**
 * Create an invoice in Falco
 */
export async function createFalcoInvoice(invoice: FalcoInvoice): Promise<FalcoResponse> {
  return falcoRequest('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoice),
  });
}

/**
 * Approve an invoice/quote (required before sending)
 */
export async function approveFalcoInvoice(invoiceId: string): Promise<FalcoResponse> {
  return falcoRequest(`/invoices/${invoiceId}/approve`, {
    method: 'POST',
  });
}

/**
 * Send invoice/quote via email
 */
export async function sendFalcoInvoice(
  invoiceId: string,
  options?: {
    email?: string;
    subject?: string;
    message?: string;
  }
): Promise<FalcoResponse> {
  return falcoRequest(`/invoices/${invoiceId}/send`, {
    method: 'POST',
    body: JSON.stringify(options || {}),
  });
}

/**
 * Get invoice/quote details
 */
export async function getFalcoInvoice(invoiceId: string): Promise<FalcoResponse> {
  return falcoRequest(`/invoices/${invoiceId}`);
}

/**
 * Get invoice/quote PDF URL
 */
export async function getFalcoInvoicePDF(invoiceId: string): Promise<FalcoResponse> {
  return falcoRequest(`/invoices/${invoiceId}/pdf`);
}

/**
 * List all invoices/quotes
 */
export async function listFalcoInvoices(params?: {
  type?: 'invoice' | 'quote' | 'credit_note';
  customer_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<FalcoResponse> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/invoices?${queryString}` : '/invoices';

  return falcoRequest(endpoint);
}

/**
 * Complete quote creation and sending workflow
 * 1. Create customer if needed
 * 2. Create quote
 * 3. Approve quote
 * 4. Send quote via email
 */
export async function createAndSendQuote(params: {
  customer: FalcoCustomer;
  items: FalcoInvoiceItem[];
  notes?: string;
  email?: string;
}): Promise<FalcoResponse<{ invoiceId: string; pdfUrl?: string }>> {
  try {
    // Step 1: Create customer
    const customerResult = await createFalcoCustomer(params.customer);
    if (!customerResult.success) {
      return customerResult;
    }

    const customerId = customerResult.data?.id;

    // Step 2: Create quote
    const quoteResult = await createFalcoQuote({
      customer_id: customerId,
      items: params.items,
      type: 'quote',
      notes: params.notes,
    });

    if (!quoteResult.success) {
      return quoteResult;
    }

    const invoiceId = quoteResult.data?.id;

    // Step 3: Approve quote
    const approveResult = await approveFalcoInvoice(invoiceId);
    if (!approveResult.success) {
      return approveResult;
    }

    // Step 4: Send quote
    const sendResult = await sendFalcoInvoice(invoiceId, {
      email: params.email || params.customer.email,
    });

    if (!sendResult.success) {
      return sendResult;
    }

    // Step 5: Get PDF URL
    const pdfResult = await getFalcoInvoicePDF(invoiceId);

    return {
      success: true,
      data: {
        invoiceId,
        pdfUrl: pdfResult.data?.url,
      },
    };
  } catch (error) {
    console.error('Quote creation workflow failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Quote creation failed',
    };
  }
}

export type { FalcoCustomer, FalcoInvoice, FalcoInvoiceItem, FalcoResponse };
