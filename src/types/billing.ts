// Tipos para o Sistema de Faturação Angolano

export interface Proforma {
  id: number;
  user_id: number;
  document_number: string;
  company_id?: number;
  contact_id?: number;
  issue_date: string;
  due_date?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'converted';
  notes?: string;
  terms_conditions?: string;
  converted_to_invoice_id?: number;
  create_time: string;
  modify_time: string;
}

export interface ProformaItem {
  id: number;
  proforma_id: number;
  product_id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  discount_amount: number;
  subtotal: number;
  tax_rate: number;
  tax_exemption_code?: string;
  tax_exemption_reason?: string;
  tax_amount: number;
  total_amount: number;
  create_time: string;
}

export interface Invoice {
  id: number;
  user_id: number;
  document_number: string;
  atcud?: string;
  hash_control?: string;
  digital_signature?: string;
  qr_code_data?: string;
  company_id?: number;
  contact_id?: number;
  proforma_id?: number;
  issue_date: string;
  due_date?: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status: 'issued' | 'paid' | 'overdue' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'paid';
  paid_amount: number;
  notes?: string;
  terms_conditions?: string;
  certification_date?: string;
  create_time: string;
  modify_time: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  product_id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  discount_amount: number;
  subtotal: number;
  tax_rate: number;
  tax_exemption_code?: string;
  tax_exemption_reason?: string;
  tax_amount: number;
  total_amount: number;
  create_time: string;
}

export interface CreditNote {
  id: number;
  user_id: number;
  document_number: string;
  atcud?: string;
  hash_control?: string;
  digital_signature?: string;
  qr_code_data?: string;
  original_invoice_id: number;
  original_invoice_number: string;
  company_id?: number;
  contact_id?: number;
  issue_date: string;
  reason: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status: string;
  notes?: string;
  certification_date?: string;
  create_time: string;
  modify_time: string;
}

export interface CreditNoteItem {
  id: number;
  credit_note_id: number;
  original_invoice_item_id?: number;
  product_id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  discount_amount: number;
  subtotal: number;
  tax_rate: number;
  tax_exemption_code?: string;
  tax_exemption_reason?: string;
  tax_amount: number;
  total_amount: number;
  create_time: string;
}

export interface PaymentReceipt {
  id: number;
  user_id: number;
  document_number: string;
  atcud?: string;
  hash_control?: string;
  digital_signature?: string;
  qr_code_data?: string;
  company_id?: number;
  contact_id?: number;
  issue_date: string;
  payment_date: string;
  payment_method_id?: number;
  payment_reference?: string;
  total_amount: number;
  currency: string;
  status: string;
  notes?: string;
  certification_date?: string;
  create_time: string;
  modify_time: string;
}

export interface PaymentReceiptItem {
  id: number;
  payment_receipt_id: number;
  invoice_id: number;
  invoice_number: string;
  invoice_date: string;
  invoice_total: number;
  paid_amount: number;
  create_time: string;
}

export interface Product {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  sku?: string;
  category?: string;
  unit_price: number;
  tax_rate: number;
  tax_exemption_code?: string;
  tax_exemption_reason?: string;
  is_service: boolean;
  is_active: boolean;
  create_time: string;
  modify_time: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  create_time: string;
  modify_time: string;
}

export interface DocumentSequence {
  id: number;
  user_id: number;
  document_type: string;
  series: string;
  current_number: number;
  year: number;
  create_time: string;
  modify_time: string;
}

export interface CompanyConfig {
  id: number;
  user_id: number;
  company_name: string;
  nif: string;
  address: string;
  city: string;
  province: string;
  postal_code?: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  logo_url?: string;
  bank_name?: string;
  bank_account?: string;
  iban?: string;
  swift_code?: string;
  software_name: string;
  software_version: string;
  certificate_number: string;
  create_time: string;
  modify_time: string;
}

// Tipos para SAF-T
export interface SafTExportData {
  header: SafTHeader;
  masterFiles: SafTMasterFiles;
  sourceDocuments: SafTSourceDocuments;
}

export interface SafTHeader {
  auditFileVersion: string;
  companyID: string;
  taxRegistrationNumber: string;
  taxAccountingBasis: string;
  companyName: string;
  businessName?: string;
  companyAddress: SafTAddress;
  fiscalYear: string;
  startDate: string;
  endDate: string;
  currencyCode: string;
  dateCreated: string;
  taxEntity: string;
  productCompanyTaxID: string;
  softwareCertificateNumber: string;
  productID: string;
  productVersion: string;
}

export interface SafTAddress {
  buildingNumber?: string;
  streetName?: string;
  addressDetail: string;
  city: string;
  postalCode?: string;
  region?: string;
  country: string;
}

export interface SafTMasterFiles {
  generalLedgerAccounts?: any[];
  customer: SafTCustomer[];
  supplier?: any[];
  product: SafTProduct[];
  taxTable: SafTTaxTable;
}

export interface SafTCustomer {
  customerID: string;
  accountID: string;
  customerTaxID?: string;
  companyName: string;
  contact?: string;
  billingAddress: SafTAddress;
  shipToAddress?: SafTAddress;
  telephone?: string;
  fax?: string;
  email?: string;
  website?: string;
  selfBillingIndicator: number;
}

export interface SafTProduct {
  productType: string;
  productCode: string;
  productGroup?: string;
  productDescription: string;
  productNumberCode?: string;
}

export interface SafTTaxTable {
  taxTableEntry: SafTTaxTableEntry[];
}

export interface SafTTaxTableEntry {
  taxType: string;
  taxCountryRegion: string;
  taxCode: string;
  description: string;
  taxPercentage?: number;
  taxAmount?: number;
}

export interface SafTSourceDocuments {
  salesInvoices: SafTSalesInvoices;
  payments?: SafTPayments;
}

export interface SafTSalesInvoices {
  numberOfEntries: number;
  totalDebit: number;
  totalCredit: number;
  invoice: SafTInvoice[];
}

export interface SafTInvoice {
  invoiceNo: string;
  atcud: string;
  documentStatus: SafTDocumentStatus;
  hash: string;
  hashControl: string;
  period?: string;
  invoiceDate: string;
  invoiceType: string;
  specialRegimes?: SafTSpecialRegimes;
  sourceID: string;
  eacCode?: string;
  systemEntryDate: string;
  transactionID?: string;
  customerID: string;
  shipTo?: SafTAddress;
  shipFrom?: SafTAddress;
  movementEndTime?: string;
  movementStartTime?: string;
  line: SafTInvoiceLine[];
  documentTotals: SafTDocumentTotals;
}

export interface SafTDocumentStatus {
  invoiceStatus: string;
  invoiceStatusDate: string;
  reason?: string;
  sourceID: string;
  sourceBilling: string;
}

export interface SafTSpecialRegimes {
  selfBillingIndicator: number;
  cashVATSchemeIndicator: number;
  thirdPartiesBillingIndicator: number;
}

export interface SafTInvoiceLine {
  lineNumber: number;
  productCode?: string;
  productDescription: string;
  quantity?: number;
  unitOfMeasure?: string;
  unitPrice?: number;
  taxPointDate?: string;
  description?: string;
  productSerialNumber?: SafTProductSerialNumber;
  debitAmount?: number;
  creditAmount?: number;
  tax: SafTTax;
  taxExemptionReason?: string;
  taxExemptionCode?: string;
  settlementAmount?: number;
}

export interface SafTProductSerialNumber {
  serialNumber: string;
}

export interface SafTTax {
  taxType: string;
  taxCountryRegion: string;
  taxCode: string;
  taxPercentage?: number;
  taxAmount?: number;
}

export interface SafTDocumentTotals {
  taxPayable: number;
  netTotal: number;
  grossTotal: number;
  currency?: SafTCurrency;
  settlement?: SafTSettlement[];
}

export interface SafTCurrency {
  currencyCode: string;
  currencyAmount: number;
  exchangeRate: number;
}

export interface SafTSettlement {
  settlementDiscount?: string;
  settlementAmount?: number;
  settlementDate?: string;
  paymentTerms?: string;
}

export interface SafTPayments {
  numberOfEntries: number;
  totalDebit: number;
  totalCredit: number;
  payment: SafTPayment[];
}

export interface SafTPayment {
  paymentRefNo: string;
  atcud: string;
  period?: string;
  transactionID?: string;
  transactionDate: string;
  paymentType: string;
  description?: string;
  systemID?: string;
  documentStatus: SafTDocumentStatus;
  paymentMethod: SafTPaymentMethod[];
  sourceID: string;
  systemEntryDate: string;
  customerID?: string;
  supplierID?: string;
  line: SafTPaymentLine[];
  documentTotals: SafTPaymentDocumentTotals;
}

export interface SafTPaymentMethod {
  paymentMechanism: string;
  paymentAmount: number;
  paymentDate: string;
}

export interface SafTPaymentLine {
  lineNumber: number;
  sourceDocumentID: SafTSourceDocumentID[];
  settlementAmount?: number;
  debitAmount?: number;
  creditAmount?: number;
  tax?: SafTTax;
}

export interface SafTSourceDocumentID {
  originatingON: string;
  invoiceDate: string;
  description?: string;
}

export interface SafTPaymentDocumentTotals {
  taxPayable: number;
  netTotal: number;
  grossTotal: number;
  settlement?: SafTSettlement[];
}

// Códigos de isenção AGT
export const TAX_EXEMPTION_CODES = {
  M00: 'Artigo 9º do CIVA (Operações isentas)',
  M02: 'Artigo 12º do CIVA (Exportações)',
  M11: 'Decreto Executivo nº 418/18',
  M12: 'Outras situações'
} as const;

export type TaxExemptionCode = keyof typeof TAX_EXEMPTION_CODES;

// Constantes do sistema
export const DOCUMENT_TYPES = {
  PROFORMA: 'PF',
  INVOICE: 'FT',
  CREDIT_NOTE: 'NC',
  PAYMENT_RECEIPT: 'RG'
} as const;

export const INVOICE_STATUS = {
  ISSUED: 'issued',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid'
} as const;

export const PROFORMA_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CONVERTED: 'converted'
} as const;

export const DEFAULT_TAX_RATE = 14.00;
export const DEFAULT_CURRENCY = 'AOA';
export const SOFTWARE_CERTIFICATE = 'n31.1/AGT20';

// Interface para formulário de criação de documentos
export interface BillingFormData {
  company_id?: number;
  contact_id?: number;
  issue_date: string;
  due_date?: string;
  currency: string;
  notes?: string;
  terms_conditions?: string;
  items: BillingItemFormData[];
}

export interface BillingItemFormData {
  product_id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  tax_rate?: number;
  tax_exemption_code?: string;
  tax_exemption_reason?: string;
}

// Interface para conversão de proforma para fatura
export interface ProformaToInvoiceData {
  proforma_id: number;
  issue_date?: string;
  due_date?: string;
  notes?: string;
  terms_conditions?: string;
}

// Interface para criação de nota de crédito
export interface CreditNoteFormData {
  original_invoice_id: number;
  original_invoice_number: string;
  company_id?: number;
  contact_id?: number;
  issue_date: string;
  reason: string;
  currency: string;
  notes?: string;
  items: CreditNoteItemFormData[];
}

export interface CreditNoteItemFormData {
  original_invoice_item_id?: number;
  product_id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  tax_rate?: number;
  tax_exemption_code?: string;
  tax_exemption_reason?: string;
}

// Interface para criação de recibo de pagamento
export interface PaymentReceiptFormData {
  company_id?: number;
  contact_id?: number;
  issue_date: string;
  payment_date: string;
  payment_method_id?: number;
  payment_reference?: string;
  currency: string;
  notes?: string;
  invoices: PaymentInvoiceData[];
}

export interface PaymentInvoiceData {
  invoice_id: number;
  invoice_number: string;
  invoice_date: string;
  invoice_total: number;
  paid_amount: number;
}
