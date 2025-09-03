import { NextRequest } from 'next/server';
import { 
  CrudOperations, 
  withErrorHandling, 
  parseQueryParams, 
  validateRequestBody,
  successResponse,
  errorResponse 
} from '@/lib/api-utils';

const contactsCrud = new CrudOperations('contacts');

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { limit, offset, search } = parseQueryParams(request);
  const searchParams = request.nextUrl.searchParams;
  const companyId = searchParams.get('company_id');
  
  const filters: Record<string, any> = {};
  if (companyId) {
    filters.company_id = companyId;
  }
  if (search) {
    filters.first_name = search;
  }

  const data = await contactsCrud.findMany(filters, limit, offset);
  return successResponse(data);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await validateRequestBody(request);
  
  if (!body.first_name || !body.last_name) {
    return errorResponse('First name and last name are required', 400);
  }

  const data = await contactsCrud.create(body);
  return successResponse(data, 201);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return errorResponse('ID parameter is required', 400);
  }

  const body = await validateRequestBody(request);
  
  const existing = await contactsCrud.findById(id);
  if (!existing) {
    return errorResponse('Contact not found', 404);
  }

  const data = await contactsCrud.update(id, body);
  return successResponse(data);
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return errorResponse('ID parameter is required', 400);
  }

  const existing = await contactsCrud.findById(id);
  if (!existing) {
    return errorResponse('Contact not found', 404);
  }

  const data = await contactsCrud.delete(id);
  return successResponse(data);
});
