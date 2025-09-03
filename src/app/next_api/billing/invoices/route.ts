import { NextRequest } from 'next/server';
import { 
  CrudOperations, 
  withErrorHandling, 
  parseQueryParams, 
  validateRequestBody,
  successResponse,
  errorResponse 
} from '@/lib/api-utils';

const invoicesCrud = new CrudOperations('invoices');
const invoiceItemsCrud = new CrudOperations('invoice_items');

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { limit, offset, search } = parseQueryParams(request);
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const paymentStatus = searchParams.get('payment_status');
  const companyId = searchParams.get('company_id');
  
  const filters: Record<string, any> = {};
  if (status) {
    filters.status = status;
  }
  if (paymentStatus) {
    filters.payment_status = paymentStatus;
  }
  if (companyId) {
    filters.company_id = companyId;
  }
  if (search) {
    filters.document_number = search;
  }

  const data = await invoicesCrud.findMany(filters, limit, offset);
  return successResponse(data);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await validateRequestBody(request);
  
  if (!body.company_id || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return errorResponse('Empresa e itens são obrigatórios', 400);
  }

  // Calcular totais
  let subtotal = 0;
  let taxAmount = 0;
  
  for (const item of body.items) {
    const itemSubtotal = item.quantity * item.unit_price;
    const itemDiscount = (itemSubtotal * (item.discount_percentage || 0)) / 100;
    const itemNetAmount = itemSubtotal - itemDiscount;
    const itemTaxAmount = (itemNetAmount * (item.tax_rate || 0)) / 100;
    
    subtotal += itemNetAmount;
    taxAmount += itemTaxAmount;
  }

  const totalAmount = subtotal + taxAmount;

  // Gerar número do documento e certificação
  const currentYear = new Date().getFullYear();
  const documentNumber = `FT ${currentYear}/000001`; // Implementar sequência automática
  const atcud = `FT-1-${Date.now()}`; // Implementar geração ATCUD
  const hashControl = generateDocumentHash(documentNumber, totalAmount); // Implementar hash
  
  const invoiceData = {
    user_id: body.user_id || 1, // Obter do contexto de autenticação
    document_number: documentNumber,
    atcud,
    hash_control: hashControl,
    company_id: body.company_id,
    contact_id: body.contact_id,
    proforma_id: body.proforma_id,
    issue_date: body.issue_date || new Date().toISOString().split('T')[0],
    due_date: body.due_date,
    subtotal,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    currency: body.currency || 'AOA',
    status: 'issued',
    payment_status: 'pending',
    paid_amount: 0,
    notes: body.notes,
    terms_conditions: body.terms_conditions,
    certification_date: new Date().toISOString()
  };

  const invoice = await invoicesCrud.create(invoiceData);

  // Criar itens da fatura
  for (const item of body.items) {
    const itemSubtotal = item.quantity * item.unit_price;
    const itemDiscount = (itemSubtotal * (item.discount_percentage || 0)) / 100;
    const itemNetAmount = itemSubtotal - itemDiscount;
    const itemTaxAmount = (itemNetAmount * (item.tax_rate || 0)) / 100;
    const itemTotalAmount = itemNetAmount + itemTaxAmount;

    await invoiceItemsCrud.create({
      invoice_id: invoice.id,
      product_id: item.product_id,
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_percentage: item.discount_percentage || 0,
      discount_amount: itemDiscount,
      subtotal: itemNetAmount,
      tax_rate: item.tax_rate || 0,
      tax_exemption_code: item.tax_exemption_code,
      tax_exemption_reason: item.tax_exemption_reason,
      tax_amount: itemTaxAmount,
      total_amount: itemTotalAmount
    });
  }

  // Gerar assinatura digital e QR Code (implementar via Edge Function)
  // await generateDigitalSignature(invoice.id);
  // await generateQRCode(invoice.id);

  return successResponse(invoice, 201);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return errorResponse('ID é obrigatório', 400);
  }

  const body = await validateRequestBody(request);
  
  const existing = await invoicesCrud.findById(id);
  if (!existing) {
    return errorResponse('Fatura não encontrada', 404);
  }

  const data = await invoicesCrud.update(id, body);
  return successResponse(data);
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return errorResponse('ID é obrigatório', 400);
  }

  const existing = await invoicesCrud.findById(id);
  if (!existing) {
    return errorResponse('Fatura não encontrada', 404);
  }

  const data = await invoicesCrud.delete(id);
  return successResponse(data);
});

// Função auxiliar para gerar hash do documento
function generateDocumentHash(documentNumber: string, totalAmount: number): string {
  // Implementar algoritmo de hash conforme especificações AGT
  const data = `${documentNumber}${totalAmount}${Date.now()}`;
  return Buffer.from(data).toString('base64').substring(0, 32);
}
