// Hook personalizado para gestão de faturação
import { useState, useEffect, useCallback } from 'react';
import { billingApi } from '@/lib/billing-api';
import { 
  Proforma, 
  Invoice, 
  CreditNote, 
  PaymentReceipt,
  Product,
  PaymentMethod 
} from '@/types/billing';
import { toast } from 'sonner';

export function useBilling() {
  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [paymentReceipts, setPaymentReceipts] = useState<PaymentReceipt[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all billing data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        proformasData,
        invoicesData,
        creditNotesData,
        receiptsData,
        productsData,
        methodsData
      ] = await Promise.all([
        billingApi.getProformas(),
        billingApi.getInvoices(),
        billingApi.getCreditNotes(),
        billingApi.getPaymentReceipts(),
        billingApi.getProducts(),
        billingApi.getPaymentMethods()
      ]);

      setProformas(proformasData);
      setInvoices(invoicesData);
      setCreditNotes(creditNotesData);
      setPaymentReceipts(receiptsData);
      setProducts(productsData);
      setPaymentMethods(methodsData);
    } catch (error) {
      toast.error('Erro ao carregar dados de faturação');
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Proforma operations
  const createProforma = useCallback(async (data: any) => {
    try {
      const newProforma = await billingApi.createProforma(data);
      setProformas(prev => [newProforma, ...prev]);
      toast.success('Proforma criada com sucesso');
      return newProforma;
    } catch (error) {
      toast.error('Erro ao criar proforma');
      throw error;
    }
  }, []);

  const convertProformaToInvoice = useCallback(async (proformaId: number) => {
    try {
      const newInvoice = await billingApi.convertProformaToInvoice(proformaId);
      
      // Update proforma status
      setProformas(prev => prev.map(p => 
        p.id === proformaId 
          ? { ...p, status: 'converted', converted_to_invoice_id: newInvoice.id }
          : p
      ));
      
      // Add new invoice
      setInvoices(prev => [newInvoice, ...prev]);
      
      toast.success(`Proforma convertida em fatura ${newInvoice.document_number}`);
      return newInvoice;
    } catch (error) {
      toast.error('Erro ao converter proforma');
      throw error;
    }
  }, []);

  // Invoice operations
  const createInvoice = useCallback(async (data: any) => {
    try {
      const newInvoice = await billingApi.createInvoice(data);
      setInvoices(prev => [newInvoice, ...prev]);
      toast.success('Fatura criada com certificação AGT');
      return newInvoice;
    } catch (error) {
      toast.error('Erro ao criar fatura');
      throw error;
    }
  }, []);

  // Credit note operations
  const createCreditNote = useCallback(async (data: any) => {
    try {
      const newCreditNote = await billingApi.createCreditNote(data);
      setCreditNotes(prev => [newCreditNote, ...prev]);
      toast.success('Nota de crédito criada com certificação AGT');
      return newCreditNote;
    } catch (error) {
      toast.error('Erro ao criar nota de crédito');
      throw error;
    }
  }, []);

  // Payment receipt operations
  const createPaymentReceipt = useCallback(async (data: any) => {
    try {
      const newReceipt = await billingApi.createPaymentReceipt(data);
      setPaymentReceipts(prev => [newReceipt, ...prev]);
      
      // Update invoices payment status
      setInvoices(prev => prev.map(invoice => {
        const paidInvoice = data.invoices.find((i: any) => i.invoice_id === invoice.id);
        if (paidInvoice) {
          const newPaidAmount = invoice.paid_amount + paidInvoice.paid_amount;
          return {
            ...invoice,
            paid_amount: newPaidAmount,
            payment_status: newPaidAmount >= invoice.total_amount ? 'paid' : 'partial',
            status: newPaidAmount >= invoice.total_amount ? 'paid' : invoice.status
          };
        }
        return invoice;
      }));
      
      toast.success('Recibo de pagamento criado com certificação AGT');
      return newReceipt;
    } catch (error) {
      toast.error('Erro ao criar recibo de pagamento');
      throw error;
    }
  }, []);

  // SAF-T export
  const exportSafT = useCallback(async (startDate: string, endDate: string) => {
    try {
      const xmlContent = await billingApi.generateSafT(startDate, endDate);
      
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
    } catch (error) {
      toast.error('Erro ao exportar SAF-T');
      throw error;
    }
  }, []);

  // Statistics
  const getStatistics = useCallback(() => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.paid_amount, 0);
    const pendingPayments = totalInvoiced - totalPaid;
    
    return {
      totalInvoiced,
      totalPaid,
      pendingPayments,
      documentsThisMonth: invoices.filter(inv => 
        new Date(inv.issue_date).getMonth() === new Date().getMonth()
      ).length,
      proformasCount: proformas.length,
      invoicesCount: invoices.length,
      creditNotesCount: creditNotes.length,
      receiptsCount: paymentReceipts.length
    };
  }, [proformas, invoices, creditNotes, paymentReceipts]);

  return {
    // Data
    proformas,
    invoices,
    creditNotes,
    paymentReceipts,
    products,
    paymentMethods,
    loading,
    
    // Operations
    createProforma,
    convertProformaToInvoice,
    createInvoice,
    createCreditNote,
    createPaymentReceipt,
    exportSafT,
    
    // Utils
    getStatistics,
    refreshData: fetchAllData
  };
}