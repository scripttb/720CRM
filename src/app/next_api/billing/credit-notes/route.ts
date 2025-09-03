import { NextRequest } from 'next/server';
import { 
  CrudOperations, 
  withErrorHandling, 
  parseQueryParams, 
  validateRequestBody,
  successResponse,
  errorResponse 
} from '@/lib/api-utils';

const creditNotesCrud = new CrudOperations('credit_notes');
const creditNoteItemsCrud = new CrudOperations('credit_note_items');

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { limit, offset, search } = parseQueryParams(request);
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const originalInvoiceId = searchParams.get('original_invoice_id');
  
  const filters: Record<string, any> = {};
  if (status) {
    filters.status = status;
  }
  if (originalInvoiceId) {
    filters.original_invoice_id = originalInvoiceId;
  }
  if (search) {
    filters.document_number = search;
  }

  const data = await creditNotesCrud.findMany(filters, limit, offset);
  return successResponse(data);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await validateRequestBody(request);
  
  if (!body.original_invoice_id || !body.reason || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
    return errorResponse('Fatura original, motivo e itens são obrigatórios', 400);
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
  const documentNumber = `NC ${currentYear}/000001`; // Implementar sequência automática
  const atcud = `NC-1-${Date.now()}`; // Implementar geração ATCUD
  const hashControl = generateDocumentHash(documentNumber, totalAmount);
  
  const creditNoteData = {
    user_id: body.user_id || 1,
    document_number: documentNumber,
    atcud,
    hash_control: hashControl,
    original_invoice_id: body.original_invoice_id,
    original_invoice_number: body.original_invoice_number,
    company_id: body.company_id,
    contact_id: body.contact_id,
    issue_date: body.issue_date || new Date().toISOString().split('T')[0],
    reason: body.reason,
    subtotal,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    currency: body.currency || 'AOA',
    status: 'issued',
    notes: body.notes,
    certification_date: new Date().toISOString()
  };

  const creditNote = await creditNotesCrud.create(creditNoteData);

  // Criar itens da nota de crédito
  for (const item of body.items) {
    const itemSubtotal = item.quantity * item.unit_price;
    const itemDiscount = (itemSubtotal * (item.discount_percentage || 0)) / 100;
    const itemNetAmount = itemSubtotal - itemDiscount;
    const itemTaxAmount = (itemNetAmount * (item.tax_rate || 0)) / 100;
    const itemTotalAmount = itemNetAmount + itemTaxAmount;

    await creditNoteItemsCrud.create({
      credit_note_id: creditNote.id,
      original_invoice_item_id: item.original_invoice_item_id,
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

  return successResponse(creditNote, 201);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return errorResponse('ID é obrigatório', 400);
  }

  const body = await validateRequestBody(request);
  
  const existing = await creditNotesCrud.findById(id);
  if (!existing) {
    return errorResponse('Nota de crédito não encontrada', 404);
  }

  const data = await creditNotesCrud.update(id, body);
  return successResponse(data);
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return errorResponse('ID é obrigatório', 400);
  }

  const existing = await creditNotesCrud.findById(id);
  if (!existing) {
    return errorResponse('Nota de crédito não encontrada', 404);
  }

  const data = await creditNotesCrud.delete(id);
  return successResponse(data);
});

// Função auxiliar para gerar hash do documento
function generateDocumentHash(documentNumber: string, totalAmount: number): string {
  const data = `${documentNumber}${totalAmount}${Date.now()}`;
  return Buffer.from(data).toString('base64').substring(0, 32);
}
