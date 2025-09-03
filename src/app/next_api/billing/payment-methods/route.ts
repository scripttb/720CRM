import { NextRequest } from 'next/server';
import { 
  withErrorHandling, 
  successResponse 
} from '@/lib/api-utils';

// Métodos de pagamento para Angola
const paymentMethods = [
  {
    id: 1,
    name: 'Transferência Bancária',
    code: 'TB',
    description: 'Transferência bancária nacional',
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Multicaixa',
    code: 'MC',
    description: 'Pagamento via Multicaixa',
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Express Payment',
    code: 'EP',
    description: 'Pagamento via Express Payment',
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'Unitel Money',
    code: 'UM',
    description: 'Pagamento via Unitel Money',
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'Dinheiro',
    code: 'DH',
    description: 'Pagamento em dinheiro',
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    name: 'Cheque',
    code: 'CH',
    description: 'Pagamento por cheque',
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  }
];

export const GET = withErrorHandling(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const activeOnly = searchParams.get('active_only') === 'true';
  
  let filteredMethods = paymentMethods;
  
  if (activeOnly) {
    filteredMethods = paymentMethods.filter(m => m.is_active);
  }
  
  return successResponse(filteredMethods);
});
