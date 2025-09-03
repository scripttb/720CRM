import { NextRequest } from 'next/server';
import { 
  CrudOperations, 
  withErrorHandling, 
  parseQueryParams, 
  validateRequestBody,
  successResponse,
  errorResponse 
} from '@/lib/api-utils';

const companiesCrud = new CrudOperations('companies');

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { limit, offset, search } = parseQueryParams(request);
  
  const filters: Record<string, any> = {};
  if (search) {
    // Note: PostgREST doesn't support complex text search easily
    // For now, we'll search by name
    filters.name = search;
  }

  const data = await companiesCrud.findMany(filters, limit, offset);
  return successResponse(data);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await validateRequestBody(request);
  
  if (!body.name) {
    return errorResponse('Company name is required', 400);
  }

  const data = await companiesCrud.create(body);
  return successResponse(data, 201);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return errorResponse('ID parameter is required', 400);
  }

  const body = await validateRequestBody(request);
  
  const existing = await companiesCrud.findById(id);
  if (!existing) {
    return errorResponse('Company not found', 404);
  }

  const data = await companiesCrud.update(id, body);
  return successResponse(data);
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return errorResponse('ID parameter is required', 400);
  }

  const existing = await companiesCrud.findById(id);
  if (!existing) {
    return errorResponse('Company not found', 404);
  }

  const data = await companiesCrud.delete(id);
  return successResponse(data);
});
