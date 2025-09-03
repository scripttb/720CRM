// API específica para sistema de faturação
import { 
  Proforma, 
  Invoice, 
  CreditNote, 
  PaymentReceipt,
  Product,
  PaymentMethod,
  BillingFormData,
  CreditNoteFormData,
  PaymentReceiptFormData
} from '@/types/billing';
import { mockProformas, mockInvoices, mockCreditNotes, mockPaymentReceipts, mockProducts, mockPaymentMethods } from '@/data/billing-mock-data';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate document numbers
const generateDocumentNumber = (type: string): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `${type} ${year}/${timestamp}`;
};

// Generate AGT certification
const generateAGTCertification = (documentType: string, total: number, date: string) => {
  const timestamp = Date.now();
  return {
    atcud: `${documentType}-${timestamp}`,
    hash_control: `hash-${documentType.toLowerCase()}-${timestamp.toString(36)}`,
    digital_signature: `MEUCIQDExample${documentType}${timestamp}`,
    qr_code_data: `${documentType}|${date}|${total}|hash-${timestamp.toString(36)}|MEUCIQDExample${documentType}${timestamp}`
  };
};

// Calculate totals for billing items
const calculateTotals = (items: any[]) => {
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

export const billingApi = {
  // Proformas
  async getProformas(): Promise<Proforma[]> {
    await delay(300);
    return [...mockProformas];
  },

  async createProforma(data: BillingFormData): Promise<Proforma> {
    await delay(500);
    const totals = calculateTotals(data.items);
    
    const newProforma: Proforma = {
      id: Date.now(),
      user_id: 1,
      document_number: generateDocumentNumber('PF'),
      company_id: data.company_id,
      contact_id: data.contact_id,
      issue_date: data.issue_date,
      due_date: data.due_date,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total_amount: totals.total,
      currency: data.currency,
      status: 'draft',
      notes: data.notes,
      terms_conditions: data.terms_conditions,
      create_time: new Date().toISOString(),
      modify_time: new Date().toISOString(),
    };

    mockProformas.unshift(newProforma);
    return newProforma;
  },

  async updateProforma(id: number, data: BillingFormData): Promise<Proforma> {
    await delay(500);
    const totals = calculateTotals(data.items);
    
    const index = mockProformas.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Proforma não encontrada');

    const updatedProforma: Proforma = {
      ...mockProformas[index],
      company_id: data.company_id,
      contact_id: data.contact_id,
      issue_date: data.issue_date,
      due_date: data.due_date,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total_amount: totals.total,
      currency: data.currency,
      notes: data.notes,
      terms_conditions: data.terms_conditions,
      modify_time: new Date().toISOString(),
    };

    mockProformas[index] = updatedProforma;
    return updatedProforma;
  },

  async convertProformaToInvoice(proformaId: number): Promise<Invoice> {
    await delay(800);
    const proforma = mockProformas.find(p => p.id === proformaId);
    if (!proforma) throw new Error('Proforma não encontrada');

    const agtCert = generateAGTCertification('FT', proforma.total_amount, new Date().toISOString().split('T')[0]);
    
    const newInvoice: Invoice = {
      id: Date.now(),
      user_id: 1,
      document_number: generateDocumentNumber('FT'),
      ...agtCert,
      company_id: proforma.company_id,
      contact_id: proforma.contact_id,
      proforma_id: proforma.id,
      issue_date: new Date().toISOString().split('T')[0],
      due_date: proforma.due_date,
      subtotal: proforma.subtotal,
      tax_amount: proforma.tax_amount,
      total_amount: proforma.total_amount,
      currency: proforma.currency,
      status: 'issued',
      payment_status: 'pending',
      paid_amount: 0,
      notes: proforma.notes,
      terms_conditions: proforma.terms_conditions,
      certification_date: new Date().toISOString(),
      create_time: new Date().toISOString(),
      modify_time: new Date().toISOString(),
    };

    // Update proforma status
    const proformaIndex = mockProformas.findIndex(p => p.id === proformaId);
    if (proformaIndex !== -1) {
      mockProformas[proformaIndex] = {
        ...proforma,
        status: 'converted',
        converted_to_invoice_id: newInvoice.id,
        modify_time: new Date().toISOString()
      };
    }

    mockInvoices.unshift(newInvoice);
    return newInvoice;
  },

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    await delay(300);
    return [...mockInvoices];
  },

  async createInvoice(data: BillingFormData): Promise<Invoice> {
    await delay(500);
    const totals = calculateTotals(data.items);
    const agtCert = generateAGTCertification('FT', totals.total, data.issue_date);
    
    const newInvoice: Invoice = {
      id: Date.now(),
      user_id: 1,
      document_number: generateDocumentNumber('FT'),
      ...agtCert,
      company_id: data.company_id,
      contact_id: data.contact_id,
      issue_date: data.issue_date,
      due_date: data.due_date,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total_amount: totals.total,
      currency: data.currency,
      status: 'issued',
      payment_status: 'pending',
      paid_amount: 0,
      notes: data.notes,
      terms_conditions: data.terms_conditions,
      certification_date: new Date().toISOString(),
      create_time: new Date().toISOString(),
      modify_time: new Date().toISOString(),
    };

    mockInvoices.unshift(newInvoice);
    return newInvoice;
  },

  // Credit Notes
  async getCreditNotes(): Promise<CreditNote[]> {
    await delay(300);
    return [...mockCreditNotes];
  },

  async createCreditNote(data: CreditNoteFormData): Promise<CreditNote> {
    await delay(500);
    const totals = calculateTotals(data.items);
    const agtCert = generateAGTCertification('NC', totals.total, data.issue_date);
    
    const newCreditNote: CreditNote = {
      id: Date.now(),
      user_id: 1,
      document_number: generateDocumentNumber('NC'),
      ...agtCert,
      original_invoice_id: data.original_invoice_id,
      original_invoice_number: data.original_invoice_number,
      company_id: data.company_id,
      contact_id: data.contact_id,
      issue_date: data.issue_date,
      reason: data.reason,
      subtotal: totals.subtotal,
      tax_amount: totals.taxAmount,
      total_amount: totals.total,
      currency: data.currency,
      status: 'issued',
      notes: data.notes,
      certification_date: new Date().toISOString(),
      create_time: new Date().toISOString(),
      modify_time: new Date().toISOString(),
    };

    mockCreditNotes.unshift(newCreditNote);
    return newCreditNote;
  },

  // Payment Receipts
  async getPaymentReceipts(): Promise<PaymentReceipt[]> {
    await delay(300);
    return [...mockPaymentReceipts];
  },

  async createPaymentReceipt(data: PaymentReceiptFormData): Promise<PaymentReceipt> {
    await delay(500);
    const total = data.invoices.reduce((sum, inv) => sum + inv.paid_amount, 0);
    const agtCert = generateAGTCertification('RG', total, data.payment_date);
    
    const newReceipt: PaymentReceipt = {
      id: Date.now(),
      user_id: 1,
      document_number: generateDocumentNumber('RG'),
      ...agtCert,
      company_id: data.company_id,
      contact_id: data.contact_id,
      issue_date: data.issue_date,
      payment_date: data.payment_date,
      payment_method_id: data.payment_method_id,
      payment_reference: data.payment_reference,
      total_amount: total,
      currency: data.currency,
      status: 'issued',
      notes: data.notes,
      certification_date: new Date().toISOString(),
      create_time: new Date().toISOString(),
      modify_time: new Date().toISOString(),
    };

    // Update invoice payment status
    data.invoices.forEach(invoiceData => {
      const invoiceIndex = mockInvoices.findIndex(i => i.id === invoiceData.invoice_id);
      if (invoiceIndex !== -1) {
        const invoice = mockInvoices[invoiceIndex];
        const newPaidAmount = invoice.paid_amount + invoiceData.paid_amount;
        const newPaymentStatus = newPaidAmount >= invoice.total_amount ? 'paid' : 'partial';
        
        mockInvoices[invoiceIndex] = {
          ...invoice,
          paid_amount: newPaidAmount,
          payment_status: newPaymentStatus,
          status: newPaymentStatus === 'paid' ? 'paid' : invoice.status,
          modify_time: new Date().toISOString()
        };
      }
    });

    mockPaymentReceipts.unshift(newReceipt);
    return newReceipt;
  },

  // Products
  async getProducts(): Promise<Product[]> {
    await delay(200);
    return [...mockProducts];
  },

  // Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    await delay(200);
    return [...mockPaymentMethods];
  },

  // SAF-T Export
  async generateSafT(startDate: string, endDate: string): Promise<string> {
    await delay(2000);
    
    const invoicesInPeriod = mockInvoices.filter(inv => 
      inv.issue_date >= startDate && inv.issue_date <= endDate
    );

    const totalDebit = invoicesInPeriod.reduce((sum, inv) => sum + inv.total_amount, 0);

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<AuditFile xmlns="urn:OECD:StandardAuditFile-Tax:AO_1.01_01">
  <Header>
    <AuditFileVersion>1.01_01</AuditFileVersion>
    <CompanyID>5417000001</CompanyID>
    <TaxRegistrationNumber>5417000001</TaxRegistrationNumber>
    <TaxAccountingBasis>F</TaxAccountingBasis>
    <CompanyName>Sistema CRM Angola Lda</CompanyName>
    <BusinessName>CRM Angola</BusinessName>
    <CompanyAddress>
      <AddressDetail>Rua da Independência, 123</AddressDetail>
      <City>Luanda</City>
      <PostalCode>1000</PostalCode>
      <Region>Luanda</Region>
      <Country>AO</Country>
    </CompanyAddress>
    <FiscalYear>${new Date(startDate).getFullYear()}</FiscalYear>
    <StartDate>${startDate}</StartDate>
    <EndDate>${endDate}</EndDate>
    <CurrencyCode>AOA</CurrencyCode>
    <DateCreated>${new Date().toISOString().split('T')[0]}</DateCreated>
    <TaxEntity>Global</TaxEntity>
    <ProductCompanyTaxID>5417000001</ProductCompanyTaxID>
    <SoftwareCertificateNumber>n31.1/AGT20</SoftwareCertificateNumber>
    <ProductID>Sistema CRM Angola</ProductID>
    <ProductVersion>1.0</ProductVersion>
  </Header>
  <MasterFiles>
    <Customer>
      <CustomerID>1</CustomerID>
      <AccountID>C001</AccountID>
      <CustomerTaxID>5417000001</CustomerTaxID>
      <CompanyName>Sonangol EP</CompanyName>
      <BillingAddress>
        <AddressDetail>Rua Rainha Ginga, 29/31</AddressDetail>
        <City>Luanda</City>
        <PostalCode>1316</PostalCode>
        <Country>AO</Country>
      </BillingAddress>
      <Telephone>+244-222-640-000</Telephone>
      <Email>geral@sonangol.co.ao</Email>
      <SelfBillingIndicator>0</SelfBillingIndicator>
    </Customer>
    <Product>
      <ProductType>S</ProductType>
      <ProductCode>CONS-001</ProductCode>
      <ProductDescription>Consultoria Empresarial</ProductDescription>
    </Product>
    <TaxTable>
      <TaxTableEntry>
        <TaxType>IVA</TaxType>
        <TaxCountryRegion>AO</TaxCountryRegion>
        <TaxCode>NOR</TaxCode>
        <Description>Taxa Normal</Description>
        <TaxPercentage>14.00</TaxPercentage>
      </TaxTableEntry>
    </TaxTable>
  </MasterFiles>
  <SourceDocuments>
    <SalesInvoices>
      <NumberOfEntries>${invoicesInPeriod.length}</NumberOfEntries>
      <TotalDebit>${totalDebit.toFixed(2)}</TotalDebit>
      <TotalCredit>0.00</TotalCredit>
      ${invoicesInPeriod.map(invoice => `
      <Invoice>
        <InvoiceNo>${invoice.document_number}</InvoiceNo>
        <ATCUD>${invoice.atcud}</ATCUD>
        <DocumentStatus>
          <InvoiceStatus>N</InvoiceStatus>
          <InvoiceStatusDate>${invoice.issue_date}</InvoiceStatusDate>
          <SourceID>1</SourceID>
          <SourceBilling>P</SourceBilling>
        </DocumentStatus>
        <Hash>${invoice.hash_control}</Hash>
        <HashControl>1</HashControl>
        <InvoiceDate>${invoice.issue_date}</InvoiceDate>
        <InvoiceType>FT</InvoiceType>
        <SpecialRegimes>
          <SelfBillingIndicator>0</SelfBillingIndicator>
          <CashVATSchemeIndicator>0</CashVATSchemeIndicator>
          <ThirdPartiesBillingIndicator>0</ThirdPartiesBillingIndicator>
        </SpecialRegimes>
        <SourceID>1</SourceID>
        <SystemEntryDate>${invoice.create_time}</SystemEntryDate>
        <CustomerID>${invoice.company_id}</CustomerID>
        <Line>
          <LineNumber>1</LineNumber>
          <ProductCode>CONS-001</ProductCode>
          <ProductDescription>Serviços de consultoria</ProductDescription>
          <Quantity>1</Quantity>
          <UnitOfMeasure>UN</UnitOfMeasure>
          <UnitPrice>${invoice.subtotal.toFixed(2)}</UnitPrice>
          <TaxPointDate>${invoice.issue_date}</TaxPointDate>
          <CreditAmount>${invoice.subtotal.toFixed(2)}</CreditAmount>
          <Tax>
            <TaxType>IVA</TaxType>
            <TaxCountryRegion>AO</TaxCountryRegion>
            <TaxCode>NOR</TaxCode>
            <TaxPercentage>14.00</TaxPercentage>
            <TaxAmount>${invoice.tax_amount.toFixed(2)}</TaxAmount>
          </Tax>
        </Line>
        <DocumentTotals>
          <TaxPayable>${invoice.tax_amount.toFixed(2)}</TaxPayable>
          <NetTotal>${invoice.subtotal.toFixed(2)}</NetTotal>
          <GrossTotal>${invoice.total_amount.toFixed(2)}</GrossTotal>
        </DocumentTotals>
      </Invoice>`).join('')}
    </SalesInvoices>
  </SourceDocuments>
</AuditFile>`;

    return xmlContent;
  }
};