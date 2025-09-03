// Utilitários específicos para Angola
import { angolaLocalization, angolaValidators } from '@/lib/angola-localization';

// Formatação de documentos
export const formatDocument = {
  bi: (value: string): string => {
    const clean = value.replace(/\D/g, '');
    if (clean.length >= 9) {
      return `${clean.slice(0, 9)}${value.slice(-5).replace(/\d/g, '').toUpperCase()}${clean.slice(-3)}`;
    }
    return value;
  },
  
  nif: (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 9);
  },
  
  phone: (value: string): string => {
    const clean = value.replace(/\D/g, '');
    if (clean.startsWith('244')) {
      return `+${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 9)}-${clean.slice(9, 12)}`;
    }
    return value;
  }
};

// Validação de documentos angolanos
export const validateAngolaDocument = {
  bi: (value: string): { isValid: boolean; message?: string } => {
    if (!value) return { isValid: true };
    
    const isValid = angolaValidators.validateBI(value);
    return {
      isValid,
      message: isValid ? undefined : 'Formato de BI inválido. Use: 123456789AB123'
    };
  },
  
  nif: (value: string): { isValid: boolean; message?: string } => {
    if (!value) return { isValid: true };
    
    const isValid = angolaValidators.validateNIF(value);
    return {
      isValid,
      message: isValid ? undefined : 'NIF deve ter exatamente 9 dígitos'
    };
  },
  
  email: (value: string): { isValid: boolean; message?: string } => {
    if (!value) return { isValid: true };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value);
    return {
      isValid,
      message: isValid ? undefined : 'Formato de email inválido'
    };
  },
  
  phone: (value: string): { isValid: boolean; message?: string } => {
    if (!value) return { isValid: true };
    
    const phoneRegex = /^\+244-?\d{3}-?\d{3}-?\d{3}$/;
    const isValid = phoneRegex.test(value) || /^\d{9}$/.test(value.replace(/\D/g, ''));
    return {
      isValid,
      message: isValid ? undefined : 'Formato de telefone inválido. Use: +244-923-000-000'
    };
  }
};

// Cálculos fiscais angolanos
export const angolaFiscalCalculations = {
  calculateIVA: (amount: number, rate: number = 14): number => {
    return (amount * rate) / 100;
  },
  
  calculateIRT: (salary: number): number => {
    const brackets = [
      { min: 0, max: 70000, rate: 0 },
      { min: 70001, max: 100000, rate: 13 },
      { min: 100001, max: 150000, rate: 16 },
      { min: 150001, max: 200000, rate: 18 },
      { min: 200001, max: 300000, rate: 19 },
      { min: 300001, max: 500000, rate: 20 },
      { min: 500001, max: Infinity, rate: 25 }
    ];
    
    const bracket = brackets.find(b => salary >= b.min && salary <= b.max);
    return bracket ? (salary * bracket.rate) / 100 : 0;
  },
  
  calculateNetAmount: (gross: number, discountPercentage: number = 0): number => {
    const discount = (gross * discountPercentage) / 100;
    return gross - discount;
  }
};

// Utilitários de data para Angola
export const angolaDateUtils = {
  formatDate: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Africa/Luanda'
    });
  },
  
  formatDateTime: (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Africa/Luanda'
    });
  },
  
  isBusinessDay: (date: Date): boolean => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday to Friday
  },
  
  addBusinessDays: (date: Date, days: number): Date => {
    const result = new Date(date);
    let addedDays = 0;
    
    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      if (angolaDateUtils.isBusinessDay(result)) {
        addedDays++;
      }
    }
    
    return result;
  }
};

// Utilitários de moeda
export const angolaCurrencyUtils = {
  format: (amount: number): string => {
    return angolaLocalization.currency.format(amount);
  },
  
  parse: (value: string): number => {
    const cleanValue = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  },
  
  convertFromUSD: (usdAmount: number, exchangeRate: number = 830): number => {
    return usdAmount * exchangeRate;
  },
  
  convertToUSD: (aoaAmount: number, exchangeRate: number = 830): number => {
    return aoaAmount / exchangeRate;
  }
};

// Geração de números de documento
export const documentNumberGenerator = {
  generate: (type: 'PF' | 'FT' | 'NC' | 'RG', series: string = 'A'): string => {
    const year = new Date().getFullYear();
    const sequence = Math.floor(Math.random() * 999999) + 1;
    return `${type} ${series}${year}/${sequence.toString().padStart(6, '0')}`;
  },
  
  validate: (documentNumber: string): boolean => {
    const pattern = /^(PF|FT|NC|RG)\s[A-Z]?\d{4}\/\d{6}$/;
    return pattern.test(documentNumber);
  }
};

// Utilitários para endereços angolanos
export const angolaAddressUtils = {
  getMunicipalities: (province: string): string[] => {
    const municipalities: Record<string, string[]> = {
      'Luanda': ['Luanda', 'Belas', 'Cacuaco', 'Cazenga', 'Icolo e Bengo', 'Quiçama', 'Viana'],
      'Benguela': ['Benguela', 'Baía Farta', 'Balombo', 'Bocoio', 'Caimbambo', 'Catumbela', 'Chongorói', 'Cubal', 'Ganda', 'Lobito'],
      'Huambo': ['Huambo', 'Bailundo', 'Caála', 'Catchiungo', 'Ekunha', 'Londuimbali', 'Longonjo', 'Mungo', 'Tchicala-Tcholoanga', 'Tchindjenje', 'Ukuma'],
      // Adicionar mais conforme necessário
    };
    
    return municipalities[province] || [];
  },
  
  formatAddress: (address: string, city: string, province: string): string => {
    return `${address}, ${city}, ${province}, Angola`;
  }
};

// Exportar todas as utilidades
export {
  angolaLocalization,
  angolaValidators,
  angolaFiscalCalculations,
  angolaDateUtils,
  angolaCurrencyUtils,
  documentNumberGenerator,
  angolaAddressUtils,
  formatDocument,
  validateAngolaDocument
};