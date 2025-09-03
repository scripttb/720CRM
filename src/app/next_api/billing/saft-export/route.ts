import { NextRequest } from 'next/server';
import { 
  withErrorHandling, 
  parseQueryParams,
  successResponse,
  errorResponse,
  validateEnv
} from '@/lib/api-utils';
import { postgrestClient } from '@/lib/postgrest';
import { SafTExportData, SafTHeader, SafTMasterFiles, SafTSourceDocuments } from '@/types/billing';

export const GET = withErrorHandling(async (request: NextRequest) => {
  validateEnv();
  
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const userId = searchParams.get('user_id') || '1';
  
  if (!startDate || !endDate) {
    return errorResponse('Datas de início e fim são obrigatórias', 400);
  }

  try {
    // Obter configuração da empresa
    const { data: companyConfig } = await postgrestClient
      .from('company_configs')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!companyConfig) {
      return errorResponse('Configuração da empresa não encontrada', 404);
    }

    // Obter dados para SAF-T
    const [
      { data: companies },
      { data: products },
      { data: invoices },
      { data: creditNotes },
      { data: paymentReceipts }
    ] = await Promise.all([
      postgrestClient.from('companies').select('*'),
      postgrestClient.from('products').select('*').eq('user_id', userId),
      postgrestClient
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .gte('issue_date', startDate)
        .lte('issue_date', endDate),
      postgrestClient
        .from('credit_notes')
        .select('*')
        .eq('user_id', userId)
        .gte('issue_date', startDate)
        .lte('issue_date', endDate),
      postgrestClient
        .from('payment_receipts')
        .select('*')
        .eq('user_id', userId)
        .gte('issue_date', startDate)
        .lte('issue_date', endDate)
    ]);

    // Construir dados SAF-T
    const safTData: SafTExportData = {
      header: buildSafTHeader(companyConfig, startDate, endDate),
      masterFiles: buildSafTMasterFiles(companies || [], products || []),
      sourceDocuments: buildSafTSourceDocuments(invoices || [], creditNotes || [], paymentReceipts || [])
    };

    // Gerar XML
    const xmlContent = generateSafTXML(safTData);

    return new Response(xmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment; filename="SAFT_AO_${startDate}_${endDate}.xml"`
      }
    });

  } catch (error) {
    console.error('Erro ao gerar SAF-T:', error);
    return errorResponse('Erro interno do servidor', 500);
  }
});

function buildSafTHeader(companyConfig: any, startDate: string, endDate: string): SafTHeader {
  return {
    auditFileVersion: '1.01_01',
    companyID: companyConfig.nif,
    taxRegistrationNumber: companyConfig.nif,
    taxAccountingBasis: 'F',
    companyName: companyConfig.company_name,
    companyAddress: {
      addressDetail: companyConfig.address,
      city: companyConfig.city,
      postalCode: companyConfig.postal_code,
      region: companyConfig.province,
      country: companyConfig.country
    },
    fiscalYear: new Date(startDate).getFullYear().toString(),
    startDate,
    endDate,
    currencyCode: 'AOA',
    dateCreated: new Date().toISOString().split('T')[0],
    taxEntity: 'Global',
    productCompanyTaxID: companyConfig.nif,
    softwareCertificateNumber: companyConfig.certificate_number,
    productID: companyConfig.software_name,
    productVersion: companyConfig.software_version
  };
}

function buildSafTMasterFiles(companies: any[], products: any[]): SafTMasterFiles {
  return {
    customer: companies.map(company => ({
      customerID: company.id.toString(),
      accountID: `C${company.id}`,
      customerTaxID: company.nif,
      companyName: company.name,
      billingAddress: {
        addressDetail: company.address || '',
        city: company.city || '',
        postalCode: company.postal_code,
        region: company.province,
        country: company.country || 'AO'
      },
      telephone: company.phone,
      email: company.email,
      website: company.website,
      selfBillingIndicator: 0
    })),
    product: products.map(product => ({
      productType: product.is_service ? 'S' : 'P',
      productCode: product.sku || product.id.toString(),
      productDescription: product.name,
      productNumberCode: product.sku
    })),
    taxTable: {
      taxTableEntry: [
        {
          taxType: 'IVA',
          taxCountryRegion: 'AO',
          taxCode: 'NOR',
          description: 'Taxa Normal',
          taxPercentage: 14.00
        },
        {
          taxType: 'IVA',
          taxCountryRegion: 'AO',
          taxCode: 'ISE',
          description: 'Isento',
          taxPercentage: 0.00
        }
      ]
    }
  };
}

function buildSafTSourceDocuments(invoices: any[], creditNotes: any[], paymentReceipts: any[]): SafTSourceDocuments {
  const allInvoices = [
    ...invoices.map(inv => ({ ...inv, type: 'FT' })),
    ...creditNotes.map(cn => ({ ...cn, type: 'NC' }))
  ];

  return {
    salesInvoices: {
      numberOfEntries: allInvoices.length,
      totalDebit: allInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0),
      totalCredit: 0,
      invoice: allInvoices.map(invoice => ({
        invoiceNo: invoice.document_number,
        atcud: invoice.atcud || '',
        documentStatus: {
          invoiceStatus: 'N',
          invoiceStatusDate: invoice.issue_date,
          sourceID: 'CRM',
          sourceBilling: 'P'
        },
        hash: invoice.hash_control || '',
        hashControl: '1',
        invoiceDate: invoice.issue_date,
        invoiceType: invoice.type,
        sourceID: 'CRM',
        systemEntryDate: invoice.create_time,
        customerID: invoice.company_id?.toString() || '',
        line: [{
          lineNumber: 1,
          productDescription: 'Produto/Serviço',
          quantity: 1,
          unitPrice: invoice.subtotal,
          debitAmount: invoice.total_amount,
          tax: {
            taxType: 'IVA',
            taxCountryRegion: 'AO',
            taxCode: invoice.tax_amount > 0 ? 'NOR' : 'ISE',
            taxPercentage: invoice.tax_amount > 0 ? 14.00 : 0.00,
            taxAmount: invoice.tax_amount
          }
        }],
        documentTotals: {
          taxPayable: invoice.tax_amount,
          netTotal: invoice.subtotal,
          grossTotal: invoice.total_amount
        }
      }))
    },
    payments: {
      numberOfEntries: paymentReceipts.length,
      totalDebit: paymentReceipts.reduce((sum, pr) => sum + (pr.total_amount || 0), 0),
      totalCredit: 0,
      payment: paymentReceipts.map(receipt => ({
        paymentRefNo: receipt.document_number,
        atcud: receipt.atcud || '',
        transactionDate: receipt.payment_date,
        paymentType: 'RG',
        documentStatus: {
          invoiceStatus: 'N',
          invoiceStatusDate: receipt.issue_date,
          sourceID: 'CRM',
          sourceBilling: 'P'
        },
        paymentMethod: [{
          paymentMechanism: 'TB',
          paymentAmount: receipt.total_amount,
          paymentDate: receipt.payment_date
        }],
        sourceID: 'CRM',
        systemEntryDate: receipt.create_time,
        customerID: receipt.company_id?.toString() || '',
        line: [{
          lineNumber: 1,
          sourceDocumentID: [{
            originatingON: 'FT 2024/000001',
            invoiceDate: receipt.payment_date
          }],
          debitAmount: receipt.total_amount
        }],
        documentTotals: {
          taxPayable: 0,
          netTotal: receipt.total_amount,
          grossTotal: receipt.total_amount
        }
      }))
    }
  };
}

function generateSafTXML(data: SafTExportData): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<AuditFile xmlns="urn:OECD:StandardAuditFile-Tax:AO_1.01_01">
  <Header>
    <AuditFileVersion>${data.header.auditFileVersion}</AuditFileVersion>
    <CompanyID>${data.header.companyID}</CompanyID>
    <TaxRegistrationNumber>${data.header.taxRegistrationNumber}</TaxRegistrationNumber>
    <TaxAccountingBasis>${data.header.taxAccountingBasis}</TaxAccountingBasis>
    <CompanyName>${data.header.companyName}</CompanyName>
    <CompanyAddress>
      <AddressDetail>${data.header.companyAddress.addressDetail}</AddressDetail>
      <City>${data.header.companyAddress.city}</City>
      <PostalCode>${data.header.companyAddress.postalCode || ''}</PostalCode>
      <Region>${data.header.companyAddress.region || ''}</Region>
      <Country>${data.header.companyAddress.country}</Country>
    </CompanyAddress>
    <FiscalYear>${data.header.fiscalYear}</FiscalYear>
    <StartDate>${data.header.startDate}</StartDate>
    <EndDate>${data.header.endDate}</EndDate>
    <CurrencyCode>${data.header.currencyCode}</CurrencyCode>
    <DateCreated>${data.header.dateCreated}</DateCreated>
    <TaxEntity>${data.header.taxEntity}</TaxEntity>
    <ProductCompanyTaxID>${data.header.productCompanyTaxID}</ProductCompanyTaxID>
    <SoftwareCertificateNumber>${data.header.softwareCertificateNumber}</SoftwareCertificateNumber>
    <ProductID>${data.header.productID}</ProductID>
    <ProductVersion>${data.header.productVersion}</ProductVersion>
  </Header>
  <MasterFiles>
    ${data.masterFiles.customer.map(customer => `
    <Customer>
      <CustomerID>${customer.customerID}</CustomerID>
      <AccountID>${customer.accountID}</AccountID>
      <CustomerTaxID>${customer.customerTaxID || ''}</CustomerTaxID>
      <CompanyName>${customer.companyName}</CompanyName>
      <BillingAddress>
        <AddressDetail>${customer.billingAddress.addressDetail}</AddressDetail>
        <City>${customer.billingAddress.city}</City>
        <PostalCode>${customer.billingAddress.postalCode || ''}</PostalCode>
        <Region>${customer.billingAddress.region || ''}</Region>
        <Country>${customer.billingAddress.country}</Country>
      </BillingAddress>
      <Telephone>${customer.telephone || ''}</Telephone>
      <Email>${customer.email || ''}</Email>
      <Website>${customer.website || ''}</Website>
      <SelfBillingIndicator>${customer.selfBillingIndicator}</SelfBillingIndicator>
    </Customer>`).join('')}
    ${data.masterFiles.product.map(product => `
    <Product>
      <ProductType>${product.productType}</ProductType>
      <ProductCode>${product.productCode}</ProductCode>
      <ProductDescription>${product.productDescription}</ProductDescription>
      <ProductNumberCode>${product.productNumberCode || ''}</ProductNumberCode>
    </Product>`).join('')}
    <TaxTable>
      ${data.masterFiles.taxTable.taxTableEntry.map(tax => `
      <TaxTableEntry>
        <TaxType>${tax.taxType}</TaxType>
        <TaxCountryRegion>${tax.taxCountryRegion}</TaxCountryRegion>
        <TaxCode>${tax.taxCode}</TaxCode>
        <Description>${tax.description}</Description>
        <TaxPercentage>${tax.taxPercentage}</TaxPercentage>
      </TaxTableEntry>`).join('')}
    </TaxTable>
  </MasterFiles>
  <SourceDocuments>
    <SalesInvoices>
      <NumberOfEntries>${data.sourceDocuments.salesInvoices.numberOfEntries}</NumberOfEntries>
      <TotalDebit>${data.sourceDocuments.salesInvoices.totalDebit.toFixed(2)}</TotalDebit>
      <TotalCredit>${data.sourceDocuments.salesInvoices.totalCredit.toFixed(2)}</TotalCredit>
      ${data.sourceDocuments.salesInvoices.invoice.map(invoice => `
      <Invoice>
        <InvoiceNo>${invoice.invoiceNo}</InvoiceNo>
        <ATCUD>${invoice.atcud}</ATCUD>
        <DocumentStatus>
          <InvoiceStatus>${invoice.documentStatus.invoiceStatus}</InvoiceStatus>
          <InvoiceStatusDate>${invoice.documentStatus.invoiceStatusDate}</InvoiceStatusDate>
          <SourceID>${invoice.documentStatus.sourceID}</SourceID>
          <SourceBilling>${invoice.documentStatus.sourceBilling}</SourceBilling>
        </DocumentStatus>
        <Hash>${invoice.hash}</Hash>
        <HashControl>${invoice.hashControl}</HashControl>
        <InvoiceDate>${invoice.invoiceDate}</InvoiceDate>
        <InvoiceType>${invoice.invoiceType}</InvoiceType>
        <SourceID>${invoice.sourceID}</SourceID>
        <SystemEntryDate>${invoice.systemEntryDate}</SystemEntryDate>
        <CustomerID>${invoice.customerID}</CustomerID>
        ${invoice.line.map(line => `
        <Line>
          <LineNumber>${line.lineNumber}</LineNumber>
          <ProductDescription>${line.productDescription}</ProductDescription>
          <Quantity>${line.quantity}</Quantity>
          <UnitPrice>${line.unitPrice?.toFixed(2)}</UnitPrice>
          <DebitAmount>${line.debitAmount?.toFixed(2)}</DebitAmount>
          <Tax>
            <TaxType>${line.tax.taxType}</TaxType>
            <TaxCountryRegion>${line.tax.taxCountryRegion}</TaxCountryRegion>
            <TaxCode>${line.tax.taxCode}</TaxCode>
            <TaxPercentage>${line.tax.taxPercentage}</TaxPercentage>
            <TaxAmount>${line.tax.taxAmount?.toFixed(2)}</TaxAmount>
          </Tax>
        </Line>`).join('')}
        <DocumentTotals>
          <TaxPayable>${invoice.documentTotals.taxPayable.toFixed(2)}</TaxPayable>
          <NetTotal>${invoice.documentTotals.netTotal.toFixed(2)}</NetTotal>
          <GrossTotal>${invoice.documentTotals.grossTotal.toFixed(2)}</GrossTotal>
        </DocumentTotals>
      </Invoice>`).join('')}
    </SalesInvoices>
    ${data.sourceDocuments.payments ? `
    <Payments>
      <NumberOfEntries>${data.sourceDocuments.payments.numberOfEntries}</NumberOfEntries>
      <TotalDebit>${data.sourceDocuments.payments.totalDebit.toFixed(2)}</TotalDebit>
      <TotalCredit>${data.sourceDocuments.payments.totalCredit.toFixed(2)}</TotalCredit>
      ${data.sourceDocuments.payments.payment.map(payment => `
      <Payment>
        <PaymentRefNo>${payment.paymentRefNo}</PaymentRefNo>
        <ATCUD>${payment.atcud}</ATCUD>
        <TransactionDate>${payment.transactionDate}</TransactionDate>
        <PaymentType>${payment.paymentType}</PaymentType>
        <DocumentStatus>
          <InvoiceStatus>${payment.documentStatus.invoiceStatus}</InvoiceStatus>
          <InvoiceStatusDate>${payment.documentStatus.invoiceStatusDate}</InvoiceStatusDate>
          <SourceID>${payment.documentStatus.sourceID}</SourceID>
          <SourceBilling>${payment.documentStatus.sourceBilling}</SourceBilling>
        </DocumentStatus>
        ${payment.paymentMethod.map(method => `
        <PaymentMethod>
          <PaymentMechanism>${method.paymentMechanism}</PaymentMechanism>
          <PaymentAmount>${method.paymentAmount.toFixed(2)}</PaymentAmount>
          <PaymentDate>${method.paymentDate}</PaymentDate>
        </PaymentMethod>`).join('')}
        <SourceID>${payment.sourceID}</SourceID>
        <SystemEntryDate>${payment.systemEntryDate}</SystemEntryDate>
        <CustomerID>${payment.customerID}</CustomerID>
        ${payment.line.map(line => `
        <Line>
          <LineNumber>${line.lineNumber}</LineNumber>
          ${line.sourceDocumentID?.map(doc => `
          <SourceDocumentID>
            <OriginatingON>${doc.originatingON}</OriginatingON>
            <InvoiceDate>${doc.invoiceDate}</InvoiceDate>
          </SourceDocumentID>`).join('')}
          <DebitAmount>${line.debitAmount?.toFixed(2)}</DebitAmount>
        </Line>`).join('')}
        <DocumentTotals>
          <TaxPayable>${payment.documentTotals.taxPayable.toFixed(2)}</TaxPayable>
          <NetTotal>${payment.documentTotals.netTotal.toFixed(2)}</NetTotal>
          <GrossTotal>${payment.documentTotals.grossTotal.toFixed(2)}</GrossTotal>
        </DocumentTotals>
      </Payment>`).join('')}
    </Payments>` : ''}
  </SourceDocuments>
</AuditFile>`;
}
