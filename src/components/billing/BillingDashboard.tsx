"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Receipt, 
  CreditCard, 
  Download,
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { ProformasList } from './ProformasList';
import { InvoicesList } from './InvoicesList';
import { CreditNotesList } from './CreditNotesList';
import { PaymentReceiptsList } from './PaymentReceiptsList';
import { SafTExport } from './SafTExport';
import { ProformaDialog } from './ProformaDialog';
import { InvoiceDialog } from './InvoiceDialog';
import { CreditNoteDialog } from './CreditNoteDialog';
import { PaymentReceiptDialog } from './PaymentReceiptDialog';
import { KwanzaCurrencyDisplay } from '@/components/angola/KwanzaCurrencyDisplay';
import { useBilling } from '@/hooks/use-billing';

export function BillingDashboard() {
  const [activeTab, setActiveTab] = useState('proformas');
  const [proformaDialogOpen, setProformaDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [creditNoteDialogOpen, setCreditNoteDialogOpen] = useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);

  const {
    proformas,
    invoices,
    creditNotes,
    paymentReceipts,
    getStatistics,
    createProforma,
    createInvoice,
    createCreditNote,
    createPaymentReceipt
  } = useBilling();

  const stats = getStatistics();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'proforma':
        setActiveTab('proformas');
        setProformaDialogOpen(true);
        break;
      case 'invoice':
        setActiveTab('invoices');
        setInvoiceDialogOpen(true);
        break;
      case 'credit-note':
        setActiveTab('credit-notes');
        setCreditNoteDialogOpen(true);
        break;
      case 'receipt':
        setActiveTab('receipts');
        setReceiptDialogOpen(true);
        break;
    }
  };

  const handleProformaSaved = async (data: any) => {
    try {
      await createProforma(data);
      setProformaDialogOpen(false);
    } catch (error) {
      console.error('Error saving proforma:', error);
    }
  };

  const handleInvoiceSaved = async (data: any) => {
    try {
      await createInvoice(data);
      setInvoiceDialogOpen(false);
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
  };

  const handleCreditNoteSaved = async (data: any) => {
    try {
      await createCreditNote(data);
      setCreditNoteDialogOpen(false);
    } catch (error) {
      console.error('Error saving credit note:', error);
    }
  };

  const handleReceiptSaved = async (data: any) => {
    try {
      await createPaymentReceipt(data);
      setReceiptDialogOpen(false);
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faturado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <KwanzaCurrencyDisplay amount={stats.totalInvoiced} />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12,5%</span> do mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <KwanzaCurrencyDisplay amount={stats.totalPaid} />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8,2%</span> do mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <KwanzaCurrencyDisplay amount={stats.pendingPayments} />
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.invoicesCount - stats.receiptsCount} faturas em aberto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos este Mês</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documentsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15,3%</span> do mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="proformas" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Proformas
              <Badge variant="secondary" className="ml-1">
                {stats.proformasCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Faturas
              <Badge variant="secondary" className="ml-1">
                {stats.invoicesCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="credit-notes" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              N. Crédito
              <Badge variant="secondary" className="ml-1">
                {stats.creditNotesCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="receipts" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Recibos
              <Badge variant="secondary" className="ml-1">
                {stats.receiptsCount}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button onClick={() => handleQuickAction('proforma')}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Proforma
            </Button>
            <Button onClick={() => handleQuickAction('invoice')}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Fatura
            </Button>
            <SafTExport />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Relatórios
            </Button>
          </div>
        </div>

        <TabsContent value="proformas" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Proformas</h2>
              <p className="text-muted-foreground">
                Gerir cotações e orçamentos para os seus clientes
              </p>
            </div>
          </div>
          <ProformasList />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Faturas</h2>
              <p className="text-muted-foreground">
                Documentos fiscais oficiais com certificação AGT
              </p>
            </div>
          </div>
          <InvoicesList />
        </TabsContent>

        <TabsContent value="credit-notes" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Notas de Crédito</h2>
              <p className="text-muted-foreground">
                Cancelamento e correção de faturas emitidas
              </p>
            </div>
          </div>
          <CreditNotesList />
        </TabsContent>

        <TabsContent value="receipts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Recibos de Pagamento</h2>
              <p className="text-muted-foreground">
                Comprovativos de pagamento de faturas
              </p>
            </div>
          </div>
          <PaymentReceiptsList />
        </TabsContent>
      </Tabs>

      {/* Quick Action Dialogs */}
      <ProformaDialog
        open={proformaDialogOpen}
        onOpenChange={setProformaDialogOpen}
        proforma={null}
        onSave={handleProformaSaved}
      />

      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        invoice={null}
        onSave={handleInvoiceSaved}
      />

      <CreditNoteDialog
        open={creditNoteDialogOpen}
        onOpenChange={setCreditNoteDialogOpen}
        creditNote={null}
        onSave={handleCreditNoteSaved}
      />

      <PaymentReceiptDialog
        open={receiptDialogOpen}
        onOpenChange={setReceiptDialogOpen}
        paymentReceipt={null}
        onSave={handleReceiptSaved}
      />
    </div>
  );
}