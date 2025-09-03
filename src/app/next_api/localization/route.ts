import { NextRequest } from 'next/server';
import { 
  withErrorHandling, 
  successResponse 
} from '@/lib/api-utils';
import { angolaLocalization } from '@/lib/angola-localization';
import { angolaTranslations } from '@/lib/angola-translations';

export const GET = withErrorHandling(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  
  switch (type) {
    case 'provinces':
      return successResponse(angolaLocalization.provinces);
    
    case 'industries':
      return successResponse(angolaLocalization.industries);
    
    case 'business-sizes':
      return successResponse(angolaLocalization.businessSizes);
    
    case 'tax-regimes':
      return successResponse(angolaLocalization.taxRegimes);
    
    case 'banks':
      return successResponse(angolaLocalization.banks);
    
    case 'payment-methods':
      return successResponse(angolaLocalization.paymentMethods);
    
    case 'translations':
      return successResponse(angolaTranslations);
    
    case 'currency':
      return successResponse(angolaLocalization.currency);
    
    case 'datetime':
      return successResponse(angolaLocalization.dateTime);
    
    default:
      return successResponse({
        provinces: angolaLocalization.provinces,
        industries: angolaLocalization.industries,
        businessSizes: angolaLocalization.businessSizes,
        taxRegimes: angolaLocalization.taxRegimes,
        banks: angolaLocalization.banks,
        paymentMethods: angolaLocalization.paymentMethods,
        currency: angolaLocalization.currency,
        dateTime: angolaLocalization.dateTime,
        translations: angolaTranslations
      });
  }
});
