import { NextRequest } from 'next/server';
import { 
  CrudOperations, 
  withErrorHandling, 
  parseQueryParams, 
  validateRequestBody,
  successResponse,
  errorResponse 
} from '@/lib/api-utils';

const activitiesCrud = new CrudOperations('activities');

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { limit, offset } = parseQueryParams(request);
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const type = searchParams.get('type');
  const assignedUserId = searchParams.get('assigned_user_id');
  
  const filters: Record<string, any> = {};
  if (status) {
    filters.status = status;
  }
  if (type) {
    filters.type = type;
  }
  if (assignedUserId) {
    filters.assigned_user_id = assignedUserId;
  }

  const data = await activitiesCrud.findMany(filters, limit, offset);
  return successResponse(data);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await validateRequestBody(request);
  
  if (!body.type || !body.subject) {
    return errorResponse('Type and subject are required', 400);
  }

  // Set default values
  body.status = body.status || 'pending';
  body.priority = body.priority || 'medium';

  const data = await activitiesCrud.create(body);
  return successResponse(data, 201);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return errorResponse('ID parameter is required', 400);
  }

  const body = await validateRequestBody(request);
  
  const existing = await activitiesCrud.findById(id);
  if (!existing) {
    return errorResponse('Activity not found', 404);
  }

  const data = await activitiesCrud.update(id, body);
  return successResponse(data);
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return errorResponse('ID parameter is required', 400);
  }

  const existing = await activitiesCrud.findById(id);
  if (!existing) {
    return errorResponse('Activity not found', 404);
  }

  const data = await activitiesCrud.delete(id);
  return successResponse(data);
});
