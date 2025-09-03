import { NextRequest } from 'next/server';
import { 
  CrudOperations, 
  withErrorHandling, 
  parseQueryParams, 
  validateRequestBody,
  successResponse,
  errorResponse 
} from '@/lib/api-utils';

const productsCrud = new CrudOperations('products');

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { limit, offset, search } = parseQueryParams(request);
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const isService = searchParams.get('is_service');
  const isActive = searchParams.get('is_active');
  
  const filters: Record<string, any> = {};
  if (category) {
    filters.category = category;
  }
  if (isService !== null) {
    filters.is_service = isService === 'true';
  }
  if (isActive !== null) {
    filters.is_active = isActive === 'true';
  }
  if (search) {
    filters.name = search;
  }

  const data = await productsCrud.findMany(filters, limit, offset);
  return successResponse(data);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await validateRequestBody(request);
  
  if (!body.name) {
    return errorResponse('Nome do produto é obrigatório', 400);
  }

  const productData = {
    user_id: body.user_id || 1,
    name: body.name,
    description: body.description,
    sku: body.sku,
    category: body.category,
    unit_price: body.unit_price || 0,
    tax_rate: body.tax_rate || 14.00,
    tax_exemption_code: body.tax_exemption_code,
    tax_exemption_reason: body.tax_exemption_reason,
    is_service: body.is_service || false,
    is_active: body.is_active !== undefined ? body.is_active : true
  };

  const data = await productsCrud.create(productData);
  return successResponse(data, 201);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return errorResponse('ID é obrigatório', 400);
  }

  const body = await validateRequestBody(request);
  
  const existing = await productsCrud.findById(id);
  if (!existing) {
    return errorResponse('Produto não encontrado', 404);
  }

  const data = await productsCrud.update(id, body);
  return successResponse(data);
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return errorResponse('ID é obrigatório', 400);
  }

  const existing = await productsCrud.findById(id);
  if (!existing) {
    return errorResponse('Produto não encontrado', 404);
  }

  const data = await productsCrud.delete(id);
  return successResponse(data);
});
