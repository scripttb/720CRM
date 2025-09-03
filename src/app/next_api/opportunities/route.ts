import { NextRequest } from 'next/server';
import { 
  CrudOperations, 
  withErrorHandling, 
  parseQueryParams, 
  validateRequestBody,
  successResponse,
  errorResponse 
} from '@/lib/api-utils';

const opportunitiesCrud = new CrudOperations('opportunities');

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { limit, offset, search } = parseQueryParams(request);
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const stageId = searchParams.get('stage_id');
  
  const filters: Record<string, any> = {};
  if (status) {
    filters.status = status;
  }
  if (stageId) {
    filters.pipeline_stage_id = stageId;
  }
  if (search) {
    filters.name = search;
  }

  const data = await opportunitiesCrud.findMany(filters, limit, offset);
  return successResponse(data);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await validateRequestBody(request);
  
  if (!body.name) {
    return errorResponse('Opportunity name is required', 400);
  }

  // Set default values
  body.status = body.status || 'open';
  body.currency = body.currency || 'USD';

  const data = await opportunitiesCrud.create(body);
  return successResponse(data, 201);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return errorResponse('ID parameter is required', 400);
  }

  const body = await validateRequestBody(request);
  
  const existing = await opportunitiesCrud.findById(id);
  if (!existing) {
    return errorResponse('Opportunity not found', 404);
  }

  const data = await opportunitiesCrud.update(id, body);
  return successResponse(data);
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return errorResponse('ID parameter is required', 400);
  }

  const existing = await opportunitiesCrud.findById(id);
  if (!existing) {
    return errorResponse('Opportunity not found', 404);
  }

  const data = await opportunitiesCrud.delete(id);
  return successResponse(data);
});
