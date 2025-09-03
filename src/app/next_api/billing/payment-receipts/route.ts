import { NextRequest } from 'next/server';
import { 
  CrudOperations, 
  withErrorHandling, 
  parseQueryParams, 
  validateRequestBody,
  successResponse,
  errorResponse 
} from '@/lib/api-utils';

const paymentReceiptsCrud = new CrudOperations('payment_receipts');
const paymentReceiptItemsCrud = new CrudOperations('payment_receipt_items');

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { limit, offset, search } = parseQueryParams(request);
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const companyId = searchParams.get('company_id');
  
  const filters: Record<string, any> = {};
  if (status) {
    filters.status = status;
  }
  if (companyId) {
    filters.company_id = companyId;
  }
  if (search) {
    filters.document_number = search;
  }

  const data = await paymentReceiptsCrud.findMany(filters, limit, offset);
  return successResponse(data);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await validateRequestBody(request);
  
  if (!body.company_id || !body.payment_method_id || !body.invoices || !Array.isArray(body.invoices) || body.invoices.length === 0) {
    return errorResponse('Empresa, método de pagamento e faturas são obrigatórios', 400);
  }

  // Calcular total
  let totalAmount = 0;
  for (const invoice of body.invoices) {
    totalAmount += invoice.paid_amount;
  }

  // Gerar número do documento e certificação
  const currentYear = new Date().getFullYear();
  const documentNumber = `RG ${currentYear}/000001`; // Implementar sequência automática
  const atcud = `RG-1-${Date.now()}`; // Implementar geração ATCUD
  const hashControl = generateDocumentHash(documentNumber, totalAmount);
  
  const paymentReceiptData = {
    user_id: body.user_id || 1,
    document_number: documentNumber,
    atcud,
    hash_control: hashControl,
    company_id: body.company_id,
    contact_id: body.contact_id,
    issue_date: body.issue_date || new Date().toISOString().split('T')[0],
    payment_date: body.payment_date || new Date().toISOString().split('T')[0],
    payment_method_id: body.payment_method_id,
    payment_reference: body.payment_reference,
    total_amount: totalAmount,
    currency: body.currency || 'AOA',
    status: 'issued',
    notes: body.notes,
    certification_date: new Date().toISOString()
  };

  const paymentReceipt = await paymentReceiptsCrud.create(paymentReceiptData);

  // Criar itens do recibo
  for (const invoice of body.invoices) {
    await paymentReceiptItemsCrud.create({
      payment_receipt_id: paymentReceipt.id,
      invoice_id: invoice.invoice_id,
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date,
      invoice_total: invoice.invoice_total,
      paid_amount: invoice.paid_amount
    });
  }

  return successResponse(paymentReceipt, 201);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return errorResponse('ID é obrigatório', 400);
  }

  const body = await validateRequestBody(request);
  
  const existing = await paymentReceiptsCrud.findById(id);
  if (!existing) {
    return errorResponse('Recibo de pagamento não encontrado', 404);
  }

  const data = await paymentReceiptsCrud.update(id, body);
  return successResponse(data);
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return errorResponse('ID é obrigatório', 400);
  }

  const existing = await paymentReceiptsCrud.findById(id);
  if (!existing) {
    return errorResponse('Recibo de pagamento não encontrado', 404);
  }

  const data = await paymentReceiptsCrud.delete(id);
  return successResponse(data);
});

// Função auxiliar para gerar hash do documento
function generateDocumentHash(documentNumber: string, totalAmount: number): string {
  const data = `${documentNumber}${totalAmount}${Date.now()}`;
  return Buffer.from(data).toString('base64').substring(0, 32);
}
