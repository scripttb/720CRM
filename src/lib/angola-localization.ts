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
      const formatted = amount.toLocaleString('pt-AO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      return `Kz ${formatted}`;
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
  getMunicipalities: (province: string): string[] => {
    const municipalities: Record<string, string[]> = {
      'Luanda': ['Luanda', 'Belas', 'Cacuaco', 'Cazenga', 'Icolo e Bengo', 'Quiçama', 'Viana'],
      'Benguela': ['Benguela', 'Baía Farta', 'Balombo', 'Bocoio', 'Caimbambo', 'Catumbela', 'Chongorói', 'Cubal', 'Ganda', 'Lobito'],
      'Huambo': ['Huambo', 'Bailundo', 'Caála', 'Catchiungo', 'Ekunha', 'Londuimbali', 'Longonjo', 'Mungo', 'Tchicala-Tcholoanga', 'Tchindjenje', 'Ukuma'],
      'Huíla': ['Lubango', 'Caconda', 'Cacula', 'Caluquembe', 'Chiange', 'Chibia', 'Chicomba', 'Chipindo', 'Cuvango', 'Humpata', 'Jamba', 'Matala', 'Quilengues', 'Quipungo'],
      'Bié': ['Kuito', 'Andulo', 'Camacupa', 'Catabola', 'Chinguar', 'Chitembo', 'Cunhinga', 'Nharea'],
      'Cabinda': ['Cabinda', 'Belize', 'Buco-Zau', 'Cacongo'],
      'Cuando Cubango': ['Menongue', 'Calai', 'Cuangar', 'Cuchi', 'Cuito Cuanavale', 'Dirico', 'Mavinga', 'Nancova', 'Rivungo'],
      'Cuanza Norte': ['Ndalatando', 'Ambaca', 'Banga', 'Bolongongo', 'Cambambe', 'Cazengo', 'Golungo Alto', 'Gonguembo', 'Lucala', 'Quiculungo', 'Samba Caju'],
      'Cuanza Sul': ['Sumbe', 'Amboim', 'Cassongue', 'Cela', 'Conda', 'Ebo', 'Libolo', 'Mussende', 'Porto Amboim', 'Quibala', 'Quilenda', 'Seles'],
      'Cunene': ['Ondjiva', 'Cahama', 'Cuanhama', 'Curoca', 'Namacunde', 'Ombadja'],
      'Malanje': ['Malanje', 'Cacuso', 'Calandula', 'Cambundi-Catembo', 'Cangandala', 'Caombo', 'Carimo', 'Cuaba Nzogo', 'Cunda-Dia-Baze', 'Luquembo', 'Marimba', 'Massango', 'Mucari', 'Quela'],
      'Moxico': ['Luena', 'Alto Zambeze', 'Bundas', 'Camanongue', 'Léua', 'Luacano', 'Luchazes', 'Lumeje', 'Moxico'],
      'Namibe': ['Moçâmedes', 'Bibala', 'Camucuio', 'Tômbwa', 'Virei'],
      'Uíge': ['Uíge', 'Alto Cauale', 'Ambuila', 'Bembe', 'Buengas', 'Bungo', 'Damba', 'Milunga', 'Mucaba', 'Negage', 'Puri', 'Quimbele', 'Quitexe', 'Sanza Pombo', 'Songo', 'Zombo'],
      'Zaire': ['Mbanza Congo', 'Cuimba', 'Nóqui', 'Nzeto', 'Soyo', 'Tomboco'],
      'Bengo': ['Caxito', 'Ambriz', 'Bula Atumba', 'Dande', 'Dembos', 'Nambuangongo', 'Pango Aluquém'],
      'Lunda Norte': ['Dundo', 'Cambulo', 'Capenda-Camulemba', 'Caungula', 'Chitato', 'Cuango', 'Cuílo', 'Lóvua', 'Lubalo', 'Xá-Muteba'],
      'Lunda Sul': ['Saurimo', 'Cacolo', 'Dala', 'Muconda']
    };
    
    return municipalities[province] || [];
  },
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
    if (!bi) return true;
    const cleanBI = bi.replace(/\s/g, '');
    return angolaLocalization.documents.types.BI.pattern.test(cleanBI);
  },
  
  validateNIF: (nif: string): boolean => {
    if (!nif) return true;
    const cleanNIF = nif.replace(/\D/g, '');
    return cleanNIF.length === 9 && /^\d{9}$/.test(cleanNIF);
  },
  
  validateAlvara: (alvara: string): boolean => {
    if (!alvara) return true;
    return angolaLocalization.documents.types.ALVARA.pattern.test(alvara);
  },
  
  formatBI: (bi: string): string => {
    const clean = bi.replace(/\s/g, '').toUpperCase();
    if (clean.length >= 9) {
      const numbers = clean.replace(/[^0-9]/g, '');
      const letters = clean.replace(/[^A-Z]/g, '');
      if (numbers.length >= 12 && letters.length >= 2) {
        return `${numbers.slice(0, 9)}${letters.slice(0, 2)}${numbers.slice(9, 12)}`;
      }
    }
    return clean;
  },
  
  formatNIF: (nif: string): string => {
    return nif.replace(/\D/g, '').slice(0, 9);
  },
  
  formatPhone: (phone: string): string => {
    const clean = phone.replace(/\D/g, '');
    if (clean.startsWith('244')) {
      return `+${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 9)}-${clean.slice(9, 12)}`;
    } else if (clean.length === 9) {
      return `+244-${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 9)}`;
    }
    return phone;
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
