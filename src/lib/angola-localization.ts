// Configurações de localização para Angola
export const angolaLocalization = {
  locale: 'pt-AO',
  currency: {
    code: 'AOA',
    symbol: 'Kz',
    name: 'Kwanza Angolano',
    decimalPlaces: 2,
    decimalSeparator: ',',
    thousandsSeparator: '.',
    format: (amount: number) => {
      return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount).replace('AOA', 'Kz');
    }
  },
  dateTime: {
    timezone: 'Africa/Luanda',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'dd/MM/yyyy HH:mm',
    formatDate: (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString('pt-AO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Africa/Luanda'
      });
    },
    formatDateTime: (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleString('pt-AO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Luanda'
      });
    }
  },
  documents: {
    types: {
      BI: {
        name: 'Bilhete de Identidade',
        pattern: /^\d{9}[A-Z]{2}\d{3}$/,
        placeholder: '123456789AB123',
        description: 'Bilhete de Identidade angolano'
      },
      NIF: {
        name: 'Número de Identificação Fiscal',
        pattern: /^\d{9}$/,
        placeholder: '123456789',
        description: 'NIF para pessoas singulares e colectivas'
      },
      ALVARA: {
        name: 'Alvará Comercial',
        pattern: /^[A-Z0-9\-\/]+$/,
        placeholder: 'ALV/2024/001',
        description: 'Alvará de funcionamento comercial'
      }
    }
  },
  provinces: [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando Cubango',
    'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
    'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico',
    'Namibe', 'Uíge', 'Zaire'
  ],
  taxRegimes: [
    'Regime Geral',
    'Regime Simplificado',
    'Regime de Exclusão',
    'Regime Especial'
  ],
  businessSizes: [
    'Microempresa',
    'Pequena Empresa',
    'Média Empresa',
    'Grande Empresa'
  ],
  industries: [
    'Agricultura e Pecuária',
    'Petróleo e Gás',
    'Mineração',
    'Construção Civil',
    'Manufactura',
    'Comércio',
    'Serviços Financeiros',
    'Telecomunicações',
    'Turismo e Hotelaria',
    'Transportes e Logística',
    'Educação',
    'Saúde',
    'Tecnologia da Informação',
    'Energia',
    'Imobiliário'
  ],
  banks: [
    'Banco de Fomento Angola (BFA)',
    'Banco Angolano de Investimentos (BAI)',
    'Banco de Poupança e Crédito (BPC)',
    'Banco Económico',
    'Banco Millennium Atlântico',
    'Banco Sol',
    'Banco Caixa Geral Angola',
    'Banco de Negócios Internacional (BNI)',
    'Banco Prestígio',
    'Banco Yetu'
  ],
  paymentMethods: [
    'Transferência Bancária',
    'Multicaixa',
    'Express Payment',
    'Unitel Money',
    'Dinheiro',
    'Cheque'
  ]
};

// Validadores para documentos angolanos
export const angolaValidators = {
  validateBI: (bi: string): boolean => {
    return angolaLocalization.documents.types.BI.pattern.test(bi);
  },
  
  validateNIF: (nif: string): boolean => {
    return angolaLocalization.documents.types.NIF.pattern.test(nif);
  },
  
  validateAlvara: (alvara: string): boolean => {
    return angolaLocalization.documents.types.ALVARA.pattern.test(alvara);
  },
  
  formatBI: (bi: string): string => {
    // Remove espaços e converte para maiúsculas
    return bi.replace(/\s/g, '').toUpperCase();
  },
  
  formatNIF: (nif: string): string => {
    // Remove espaços e mantém apenas números
    return nif.replace(/\D/g, '');
  }
};

// Configurações fiscais
export const angolaFiscal = {
  taxes: {
    IVA: {
      name: 'Imposto sobre o Valor Acrescentado',
      standardRate: 14,
      reducedRate: 7,
      exemptRate: 0
    },
    IRT: {
      name: 'Imposto sobre o Rendimento do Trabalho',
      rates: [
        { min: 0, max: 70000, rate: 0 },
        { min: 70001, max: 100000, rate: 13 },
        { min: 100001, max: 150000, rate: 16 },
        { min: 150001, max: 200000, rate: 18 },
        { min: 200001, max: 300000, rate: 19 },
        { min: 300001, max: 500000, rate: 20 },
        { min: 500001, max: Infinity, rate: 25 }
      ]
    },
    IIS: {
      name: 'Imposto Industrial',
      rate: 30
    }
  }
};
