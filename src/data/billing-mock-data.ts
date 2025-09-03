// Dados mock completos para o sistema de faturação

import { 
  Proforma, 
  Invoice, 
  CreditNote, 
  PaymentReceipt,
  Product,
  PaymentMethod
} from '@/types/billing';

export const mockProducts: Product[] = [
  {
    id: 1,
    user_id: 1,
    name: 'Consultoria em Sistemas de Gestão',
    description: 'Serviços de consultoria para implementação de sistemas de gestão empresarial',
    sku: 'CONS-001',
    category: 'Consultoria',
    unit_price: 25000,
    tax_rate: 14.00,
    is_service: true,
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    name: 'Licença de Software CRM',
    description: 'Licença anual para sistema CRM empresarial',
    sku: 'LIC-CRM-001',
    category: 'Software',
    unit_price: 45000,
    tax_rate: 14.00,
    is_service: false,
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    user_id: 1,
    name: 'Formação em CRM',
    description: 'Curso de formação para utilização do sistema CRM',
    sku: 'FORM-001',
    category: 'Formação',
    unit_price: 15000,
    tax_rate: 0.00,
    tax_exemption_code: 'M11',
    tax_exemption_reason: 'Decreto Executivo nº 418/18',
    is_service: true,
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    user_id: 1,
    name: 'Suporte Técnico Mensal',
    description: 'Serviços de suporte técnico e manutenção mensal',
    sku: 'SUP-001',
    category: 'Suporte',
    unit_price: 8500,
    tax_rate: 14.00,
    is_service: true,
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    user_id: 1,
    name: 'Equipamento Informático',
    description: 'Computadores e equipamentos de escritório',
    sku: 'EQ-001',
    category: 'Equipamentos',
    unit_price: 120000,
    tax_rate: 14.00,
    is_service: false,
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  }
];

export const mockPaymentMethods: PaymentMethod[] = [
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
    name: 'Multicaixa Express',
    code: 'ME',
    description: 'Pagamento via Multicaixa Express',
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    name: 'Unitel Money',
    code: 'UM',
    description: 'Pagamento via Unitel Money',
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    name: 'Express Payment',
    code: 'EP',
    description: 'Pagamento via Express Payment',
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    name: 'Numerário',
    code: 'NU',
    description: 'Pagamento em dinheiro',
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    name: 'Cheque',
    code: 'CH',
    description: 'Pagamento por cheque bancário',
    is_active: true,
    create_time: '2024-01-01T00:00:00Z',
    modify_time: '2024-01-01T00:00:00Z',
  }
];

export const mockProformas: Proforma[] = [
  {
    id: 1,
    user_id: 1,
    document_number: 'PF A2024/000001',
    company_id: 1,
    contact_id: 1,
    issue_date: '2024-01-15',
    due_date: '2024-02-15',
    subtotal: 45000,
    tax_amount: 6300,
    total_amount: 51300,
    currency: 'AOA',
    status: 'sent',
    notes: 'Proposta para implementação de sistema CRM',
    terms_conditions: 'Pagamento em 30 dias após aprovação',
    create_time: '2024-01-15T10:00:00Z',
    modify_time: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    user_id: 1,
    document_number: 'PF A2024/000002',
    company_id: 2,
    contact_id: 2,
    issue_date: '2024-01-20',
    due_date: '2024-02-20',
    subtotal: 25000,
    tax_amount: 3500,
    total_amount: 28500,
    currency: 'AOA',
    status: 'accepted',
    notes: 'Consultoria em transformação digital',
    create_time: '2024-01-20T14:30:00Z',
    modify_time: '2024-01-22T09:15:00Z',
  },
  {
    id: 3,
    user_id: 1,
    document_number: 'PF A2024/000003',
    company_id: 3,
    contact_id: 3,
    issue_date: '2024-01-25',
    due_date: '2024-02-25',
    subtotal: 120000,
    tax_amount: 16800,
    total_amount: 136800,
    currency: 'AOA',
    status: 'draft',
    notes: 'Equipamentos informáticos para escritório',
    terms_conditions: 'Entrega em 15 dias úteis',
    create_time: '2024-01-25T11:00:00Z',
    modify_time: '2024-01-25T11:00:00Z',
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: 1,
    user_id: 1,
    document_number: 'FT A2024/000001',
    atcud: 'FT-1-1706180400000',
    hash_control: 'abc123def456ghi789',
    digital_signature: 'MEUCIQDExample...',
    qr_code_data: 'FT|2024-01-25|51300|abc123|MEUCIQDExample',
    company_id: 1,
    contact_id: 1,
    proforma_id: 1,
    issue_date: '2024-01-25',
    due_date: '2024-02-25',
    subtotal: 45000,
    tax_amount: 6300,
    total_amount: 51300,
    currency: 'AOA',
    status: 'issued',
    payment_status: 'pending',
    paid_amount: 0,
    notes: 'Fatura convertida da proforma PF A2024/000001',
    terms_conditions: 'Pagamento em 30 dias',
    certification_date: '2024-01-25T10:30:00Z',
    create_time: '2024-01-25T10:30:00Z',
    modify_time: '2024-01-25T10:30:00Z',
  },
  {
    id: 2,
    user_id: 1,
    document_number: 'FT A2024/000002',
    atcud: 'FT-2-1706266800000',
    hash_control: 'def456ghi789jkl012',
    digital_signature: 'MEUCIQDExample2...',
    qr_code_data: 'FT|2024-01-26|136800|def456|MEUCIQDExample2',
    company_id: 3,
    contact_id: 3,
    issue_date: '2024-01-26',
    due_date: '2024-02-26',
    subtotal: 120000,
    tax_amount: 16800,
    total_amount: 136800,
    currency: 'AOA',
    status: 'paid',
    payment_status: 'paid',
    paid_amount: 136800,
    notes: 'Equipamentos informáticos entregues',
    certification_date: '2024-01-26T11:00:00Z',
    create_time: '2024-01-26T11:00:00Z',
    modify_time: '2024-01-28T15:20:00Z',
  },
  {
    id: 3,
    user_id: 1,
    document_number: 'FT A2024/000003',
    atcud: 'FT-3-1706353200000',
    hash_control: 'ghi789jkl012mno345',
    digital_signature: 'MEUCIQDExample3...',
    qr_code_data: 'FT|2024-01-27|28500|ghi789|MEUCIQDExample3',
    company_id: 2,
    contact_id: 2,
    proforma_id: 2,
    issue_date: '2024-01-27',
    due_date: '2024-02-27',
    subtotal: 25000,
    tax_amount: 3500,
    total_amount: 28500,
    currency: 'AOA',
    status: 'overdue',
    payment_status: 'partial',
    paid_amount: 15000,
    notes: 'Fatura convertida da proforma PF A2024/000002',
    certification_date: '2024-01-27T12:00:00Z',
    create_time: '2024-01-27T12:00:00Z',
    modify_time: '2024-01-30T10:00:00Z',
  }
];

export const mockCreditNotes: CreditNote[] = [
  {
    id: 1,
    user_id: 1,
    document_number: 'NC A2024/000001',
    atcud: 'NC-1-1706353200000',
    hash_control: 'ghi789jkl012mno345',
    digital_signature: 'MEUCIQDCreditNote1...',
    qr_code_data: 'NC|2024-01-27|51300|FT A2024/000001|ghi789',
    original_invoice_id: 1,
    original_invoice_number: 'FT A2024/000001',
    company_id: 1,
    contact_id: 1,
    issue_date: '2024-01-27',
    reason: 'Cancelamento por solicitação do cliente',
    subtotal: 45000,
    tax_amount: 6300,
    total_amount: 51300,
    currency: 'AOA',
    status: 'issued',
    notes: 'Cliente solicitou cancelamento devido a mudança de estratégia',
    certification_date: '2024-01-27T09:45:00Z',
    create_time: '2024-01-27T09:45:00Z',
    modify_time: '2024-01-27T09:45:00Z',
  }
];

export const mockPaymentReceipts: PaymentReceipt[] = [
  {
    id: 1,
    user_id: 1,
    document_number: 'RG A2024/000001',
    atcud: 'RG-1-1706439600000',
    hash_control: 'jkl012mno345pqr678',
    digital_signature: 'MEUCIQDReceipt1...',
    qr_code_data: 'RG|2024-01-28|136800|jkl012',
    company_id: 3,
    contact_id: 3,
    issue_date: '2024-01-28',
    payment_date: '2024-01-28',
    payment_method_id: 1,
    payment_reference: 'TRF20240128001',
    total_amount: 136800,
    currency: 'AOA',
    status: 'issued',
    notes: 'Pagamento integral da fatura FT A2024/000002',
    certification_date: '2024-01-28T15:20:00Z',
    create_time: '2024-01-28T15:20:00Z',
    modify_time: '2024-01-28T15:20:00Z',
  },
  {
    id: 2,
    user_id: 1,
    document_number: 'RG A2024/000002',
    atcud: 'RG-2-1706526000000',
    hash_control: 'mno345pqr678stu901',
    digital_signature: 'MEUCIQDReceipt2...',
    qr_code_data: 'RG|2024-01-29|15000|mno345',
    company_id: 2,
    contact_id: 2,
    issue_date: '2024-01-29',
    payment_date: '2024-01-29',
    payment_method_id: 2,
    payment_reference: 'MC20240129001',
    total_amount: 15000,
    currency: 'AOA',
    status: 'issued',
    notes: 'Pagamento parcial da fatura FT A2024/000003',
    certification_date: '2024-01-29T14:30:00Z',
    create_time: '2024-01-29T14:30:00Z',
    modify_time: '2024-01-29T14:30:00Z',
  }
];

// Função para obter próximo número de documento
export const getNextDocumentNumber = (type: 'PF' | 'FT' | 'NC' | 'RG'): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `${type} A${year}/${timestamp}`;
};

// Função para gerar certificação AGT
export const generateAGTCertification = (documentType: string, total: number, date: string) => {
  const timestamp = Date.now();
  return {
    atcud: `${documentType}-${timestamp}`,
    hash_control: `hash-${documentType.toLowerCase()}-${timestamp.toString(36)}`,
    digital_signature: `MEUCIQDExample${documentType}${timestamp}`,
    qr_code_data: `${documentType}|${date}|${total}|hash-${timestamp.toString(36)}|MEUCIQDExample${documentType}${timestamp}`
  };
};

// Função para calcular totais
export const calculateBillingTotals = (items: any[]) => {
  let subtotal = 0;
  let taxAmount = 0;

  items.forEach(item => {
    const itemSubtotal = item.quantity * item.unit_price;
    const itemDiscount = (itemSubtotal * (item.discount_percentage || 0)) / 100;
    const itemNetAmount = itemSubtotal - itemDiscount;
    const itemTaxAmount = (itemNetAmount * (item.tax_rate || 0)) / 100;
    
    subtotal += itemNetAmount;
    taxAmount += itemTaxAmount;
  });

  return {
    subtotal,
    taxAmount,
    total: subtotal + taxAmount
  };
};