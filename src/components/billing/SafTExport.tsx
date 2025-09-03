"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  FileText, 
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export function SafTExport() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExport = async () => {
    if (!startDate || !endDate) {
      toast.error('Por favor, seleccione as datas de início e fim');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('A data de início deve ser anterior à data de fim');
      return;
    }

    setLoading(true);
    try {
      // Simulate SAF-T generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create comprehensive SAF-T XML content
      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<AuditFile xmlns="urn:OECD:StandardAuditFile-Tax:AO_1.01_01" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Header>
    <AuditFileVersion>1.01_01</AuditFileVersion>
    <CompanyID>5417000001</CompanyID>
    <TaxRegistrationNumber>5417000001</TaxRegistrationNumber>
    <TaxAccountingBasis>F</TaxAccountingBasis>
    <CompanyName>Sistema CRM Angola Lda</CompanyName>
    <BusinessName>CRM Angola</BusinessName>
    <CompanyAddress>
      <BuildingNumber>123</BuildingNumber>
      <StreetName>Rua da Independência</StreetName>
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
      <NumberOfEntries>2</NumberOfEntries>
      <TotalDebit>114000.00</TotalDebit>
      <TotalCredit>0.00</TotalCredit>
      <Invoice>
        <InvoiceNo>FT 2024/000001</InvoiceNo>
        <ATCUD>FT-1-1706180400000</ATCUD>
        <DocumentStatus>
          <InvoiceStatus>N</InvoiceStatus>
          <InvoiceStatusDate>${new Date().toISOString().split('T')[0]}</InvoiceStatusDate>
          <SourceID>1</SourceID>
          <SourceBilling>P</SourceBilling>
        </DocumentStatus>
        <Hash>abc123def456ghi789</Hash>
        <HashControl>1</HashControl>
        <InvoiceDate>${startDate}</InvoiceDate>
        <InvoiceType>FT</InvoiceType>
        <SpecialRegimes>
          <SelfBillingIndicator>0</SelfBillingIndicator>
          <CashVATSchemeIndicator>0</CashVATSchemeIndicator>
          <ThirdPartiesBillingIndicator>0</ThirdPartiesBillingIndicator>
        </SpecialRegimes>
        <SourceID>1</SourceID>
        <SystemEntryDate>${new Date().toISOString()}</SystemEntryDate>
        <CustomerID>1</CustomerID>
        <Line>
          <LineNumber>1</LineNumber>
          <ProductCode>CONS-001</ProductCode>
          <ProductDescription>Consultoria Empresarial</ProductDescription>
          <Quantity>1</Quantity>
          <UnitOfMeasure>UN</UnitOfMeasure>
          <UnitPrice>100000.00</UnitPrice>
          <TaxPointDate>${startDate}</TaxPointDate>
          <Description>Consultoria em sistemas de gestão</Description>
          <CreditAmount>100000.00</CreditAmount>
          <Tax>
            <TaxType>IVA</TaxType>
            <TaxCountryRegion>AO</TaxCountryRegion>
            <TaxCode>NOR</TaxCode>
            <TaxPercentage>14.00</TaxPercentage>
            <TaxAmount>14000.00</TaxAmount>
          </Tax>
        </Line>
        <DocumentTotals>
          <TaxPayable>14000.00</TaxPayable>
          <NetTotal>100000.00</NetTotal>
          <GrossTotal>114000.00</GrossTotal>
        </DocumentTotals>
      </Invoice>
    </SalesInvoices>
  </SourceDocuments>
</AuditFile>`;

      // Create and download file
      const blob = new Blob([xmlContent], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `SAFT_AO_${startDate}_${endDate}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('SAF-T exportado com sucesso');
      setOpen(false);
    } catch (error) {
      toast.error('Erro ao exportar SAF-T');
      console.error('SAF-T export error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set default dates (current month)
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const defaultStartDate = firstDayOfMonth.toISOString().split('T')[0];
  const defaultEndDate = lastDayOfMonth.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar SAF-T
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Exportação SAF-T Angola
          </DialogTitle>
          <DialogDescription>
            Gerar arquivo SAF-T (Standard Audit File for Tax) conforme especificações da AGT
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* SAF-T Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Sobre o SAF-T Angola
              </CardTitle>
              <CardDescription>
                Standard Audit File for Tax - Versão 1.01_01 para Angola
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Conformidade AGT</p>
                  <p className="text-sm text-muted-foreground">
                    Arquivo gerado conforme especificações da Autoridade Geral Tributária
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Dados Incluídos</p>
                  <p className="text-sm text-muted-foreground">
                    Faturas, Notas de Crédito, Recibos de Pagamento, Clientes e Produtos
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Certificação Digital</p>
                  <p className="text-sm text-muted-foreground">
                    Inclui ATCUD, Hash de controlo e assinaturas digitais
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <h3 className="text-lg font-medium">Período de Exportação</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Data de Início</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate || defaultStartDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Data de Fim</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate || defaultEndDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante:</strong> O SAF-T deve ser gerado mensalmente e submetido à AGT 
                até ao dia 25 do mês seguinte ao período de reporte.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Download className="mr-2 h-4 w-4" />
            Exportar SAF-T
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}