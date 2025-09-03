import { NextRequest } from 'next/server';
import { 
  withErrorHandling, 
  successResponse,
  errorResponse 
} from '@/lib/api-utils';

// Dados das moedas para Angola
const currencies = [
  {
    id: 1,
    code: 'AOA',
    name: 'Kwanza Angolano',
    symbol: 'Kz',
    decimal_places: 2,
    exchange_rate: 1.0,
    is_base_currency: true,
    is_active: true,
    last_updated: new Date().toISOString(),
    create_time: '2024-01-01T00:00:00Z',
    modify_time: new Date().toISOString(),
  },
  {
    id: 2,
    code: 'USD',
    name: 'Dólar Americano',
    symbol: '$',
    decimal_places: 2,
    exchange_rate: 825.50, // Taxa de câmbio aproximada AOA/USD
    is_base_currency: false,
    is_active: true,
    last_updated: new Date().toISOString(),
    create_time: '2024-01-01T00:00:00Z',
    modify_time: new Date().toISOString(),
  },
  {
    id: 3,
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimal_places: 2,
    exchange_rate: 900.75, // Taxa de câmbio aproximada AOA/EUR
    is_base_currency: false,
    is_active: true,
    last_updated: new Date().toISOString(),
    create_time: '2024-01-01T00:00:00Z',
    modify_time: new Date().toISOString(),
  }
];

export const GET = withErrorHandling(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const activeOnly = searchParams.get('active_only') === 'true';
  
  let filteredCurrencies = currencies;
  
  if (activeOnly) {
    filteredCurrencies = currencies.filter(c => c.is_active);
  }
  
  return successResponse(filteredCurrencies);
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  return errorResponse('Currency creation not implemented', 501);
});
