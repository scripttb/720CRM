import { NextRequest } from 'next/server';
import { 
  CrudOperations, 
  withErrorHandling, 
  parseQueryParams, 
  validateRequestBody,
  successResponse,
  errorResponse 
} from '@/lib/api-utils';

const pipelineStagesCrud = new CrudOperations('pipeline_stages');

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { limit, offset } = parseQueryParams(request);
  
  // Get all active stages ordered by stage_order
  const data = await pipelineStagesCrud.findMany({ is_active: true }, limit, offset);
  return successResponse(data);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await validateRequestBody(request);
  
  if (!body.name || body.stage_order === undefined) {
    return errorResponse('Name and stage order are required', 400);
  }

  // Set default values
  body.probability = body.probability || 0;
  body.is_active = body.is_active !== undefined ? body.is_active : true;

  const data = await pipelineStagesCrud.create(body);
  return successResponse(data, 201);
});

export const PUT = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return errorResponse('ID parameter is required', 400);
  }

  const body = await validateRequestBody(request);
  
  const existing = await pipelineStagesCrud.findById(id);
  if (!existing) {
    return errorResponse('Pipeline stage not found', 404);
  }

  const data = await pipelineStagesCrud.update(id, body);
  return successResponse(data);
});

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const { id } = parseQueryParams(request);

  if (!id) {
    return errorResponse('ID parameter is required', 400);
  }

  const existing = await pipelineStagesCrud.findById(id);
  if (!existing) {
    return errorResponse('Pipeline stage not found', 404);
  }

  const data = await pipelineStagesCrud.delete(id);
  return successResponse(data);
});
