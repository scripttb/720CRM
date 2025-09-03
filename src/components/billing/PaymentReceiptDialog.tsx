import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mockCompanies, mockContacts } from '@/lib/mock-data';
import { mockInvoices, mockPaymentMethods } from '@/data/billing-mock-data';
import { PaymentReceipt, PaymentReceiptFormData, Invoice, PaymentMethod } from '@/types/billing';
import { Company, Contact } from '@/types/crm';
import { toast } from 'sonner';
import { Loader2, Shield, CheckCircle, Info } from 'lucide-react';
import { KwanzaInput } from '@/components/angola/KwanzaCurrencyDisplay';

interface PaymentReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paymentReceipt: PaymentReceipt | null;
  onSave: (paymentReceipt: PaymentReceipt) => void;
}

export function PaymentReceiptDialog({ 
  open, 
  onOpenChange, 
  paymentReceipt, 
  onSave 
}: PaymentReceiptDialogProps) {
  const [loading, setLoading] = useState(false);
  const [companies] = useState<Company[]>(mockCompanies);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [invoices] = useState<Invoice[]>(mockInvoices.filter(i => i.status === 'issued'));
  const [paymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [formData, setFormData] = useState<PaymentReceiptFormData>({
    issue_date: new Date().toISOString().split('T')[0],
    payment_date: new Date().toISOString().split('T')[0],
    currency: 'AOA',
    invoices: []
  });

  const fetchContacts = useCallback(async (companyId: number) => {
    const filteredContacts = mockContacts.filter(c => c.company_id === companyId);
    setContacts(filteredContacts);
  }, []);

  useEffect(() => {
    if (open) {
      if (paymentReceipt) {
        setFormData({
          company_id: paymentReceipt.company_id,
          contact_id: paymentReceipt.contact_id,
          issue_date: paymentReceipt.issue_date,
          payment_date: paymentReceipt.payment_date,
          payment_method_id: paymentReceipt.payment_method_id,
          payment_reference: paymentReceipt.payment_reference,
          currency: paymentReceipt.currency,
          notes: paymentReceipt.notes,
          invoices: []
        });
      } else {
        setFormData({
          issue_date: new Date().toISOString().split('T')[0],
          payment_date: new Date().toISOString().split('T')[0],
          currency: 'AOA',
          invoices: []
        });
      }
    }
  }, [open, paymentReceipt]);

  useEffect(() => {
    if (formData.company_id) {
      fetchContacts(formData.company_id);
    }
  }, [formData.company_id, fetchContacts]);

  const calculateTotal = () => {
    return formData.invoices.reduce((sum, inv) => sum + inv.paid_amount, 0);
  };

  const generateAGTCertification = () => {
    const timestamp = Date.now();
    return {
      atcud: `RG-${timestamp}`,
      hash_control: `hash-rg-${timestamp.toString(36)}`,
      digital_signature: `MEUCIQDReceipt${timestamp}`,
      qr_code_data: `RG|${formData.payment_date}|${calculateTotal()}|hash-rg-${timestamp.toString(36)}`
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_id) {
      toast.error('Empresa é obrigatória');
      return;
    }

    if (formData.invoices.length === 0) {
      toast.error('Pelo menos uma fatura deve ser selecionada');
      return;
    }

    if (!formData.payment_method_id) {
      toast.error('Método de pagamento é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const total = calculateTotal();
      const agtCert = generateAGTCertification();
      
      const savedPaymentReceipt: PaymentReceipt = {
        id: paymentReceipt?.id || Date.now(),
        user_id: 1,
        document_number: paymentReceipt?.document_number || `RG 2024/${String(Date.now()).slice(-6)}`,
        ...agtCert,
        company_id: formData.company_id,
        contact_id: formData.contact_id,
        issue_date: formData.issue_date,
        payment_date: formData.payment_date,
        payment_method_id: formData.payment_method_id,
        payment_reference: formData.payment_reference,
        total_amount: total,
        currency: formData.currency,
        status: 'issued',
        notes: formData.notes,
        certification_date: new Date().toISOString(),
        create_time: paymentReceipt?.create_time || new Date().toISOString(),
        modify_time: new Date().toISOString(),
      };
      
      onSave(savedPaymentReceipt);
      toast.success(paymentReceipt ? 'Recibo actualizado com sucesso' : 'Recibo criado com certificação AGT');
    } catch (error) {
      toast.error('Erro ao guardar recibo');
      console.error('Error saving payment receipt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceToggle = (invoice: Invoice, checked: boolean) => {
    if (checked) {
      const remainingAmount = invoice.total_amount - invoice.paid_amount;
      setFormData(prev => ({
        ...prev,
        invoices: [...prev.invoices, {
          invoice_id: invoice.id,
          invoice_number: invoice.document_number,
          invoice_date: invoice.issue_date,
          invoice_total: invoice.total_amount,
          paid_amount: remainingAmount
        }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        invoices: prev.invoices.filter(i => i.invoice_id !== invoice.id)
      }));
    }
  };

  const updateInvoicePaidAmount = (invoiceId: number, paidAmount: number) => {
    setFormData(prev => ({
      ...prev,
      invoices: prev.invoices.map(i => 
        i.invoice_id === invoiceId ? { ...i, paid_amount: paidAmount } : i
      )
    }));
  };

  const availableInvoices = invoices.filter(i => 
    !formData.company_id || i.company_id === formData.company_id
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {paymentReceipt ? 'Editar' : 'Criar'} Recibo de Pagamento
          </DialogTitle>
          <DialogDescription>
            {paymentReceipt 
              ? 'Actualizar as informações do recibo abaixo.'
              : 'Criar um novo recibo de pagamento para faturas liquidadas.'
            }
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            O recibo de pagamento comprova a liquidação de faturas e é obrigatório para 
            efeitos fiscais em Angola.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações do Cliente */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações do Cliente</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa *</Label>
                <Select 
                  value={formData.company_id?.toString() || ''} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    company_id: value ? parseInt(value) : undefined,
                    contact_id: undefined,
                    invoices: []
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contacto</Label>
                <Select 
                  value={formData.contact_id?.toString() || ''} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    contact_id: value ? parseInt(value) : undefined 
                  }))}
                  disabled={!formData.company_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar contacto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum contacto</SelectItem>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id.toString()}>
                        {contact.first_name} {contact.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Datas e Método de Pagamento */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações do Pagamento</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issue_date">Data de Emissão *</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_date">Data de Pagamento *</Label>
                <Input
                  id="payment_date"
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, payment_date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">Método de Pagamento *</Label>
                <Select 
                  value={formData.payment_method_id?.toString() || ''} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    payment_method_id: value ? parseInt(value) : undefined 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id.toString()}>
                        {method.name} ({method.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_reference">Referência de Pagamento</Label>
              <Input
                id="payment_reference"
                value={formData.payment_reference || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_reference: e.target.value }))}
                placeholder="Número de transferência, cheque, etc."
              />
            </div>
          </div>

          {/* Faturas a Liquidar */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Faturas a Liquidar</h3>
            
            {availableInvoices.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    {formData.company_id 
                      ? 'Nenhuma fatura em aberto para esta empresa'
                      : 'Seleccione uma empresa para ver as faturas disponíveis'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {availableInvoices.map((invoice) => {
                  const isSelected = formData.invoices.some(i => i.invoice_id === invoice.id);
                  const selectedInvoice = formData.invoices.find(i => i.invoice_id === invoice.id);
                  const remainingAmount = invoice.total_amount - invoice.paid_amount;
                  
                  return (
                    <Card key={invoice.id} className={isSelected ? 'border-green-200 bg-green-50' : ''}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleInvoiceToggle(invoice, checked as boolean)}
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{invoice.document_number}</p>
                                <p className="text-sm text-muted-foreground">
                                  Emitida em {new Date(invoice.issue_date).toLocaleDateString('pt-AO')}
                                </p>
                                {invoice.atcud && (
                                  <div className="flex items-center gap-1 text-xs text-green-600">
                                    <Shield className="h-3 w-3" />
                                    Certificada AGT
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  Total: Kz {invoice.total_amount.toLocaleString('pt-AO')}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Em aberto: Kz {remainingAmount.toLocaleString('pt-AO')}
                                </p>
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="space-y-2">
                                <Label>Valor a Liquidar (Kz)</Label>
                                <KwanzaInput
                                  value={selectedInvoice?.paid_amount || remainingAmount}
                                  onChange={(value) => updateInvoicePaidAmount(invoice.id, value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Máximo: Kz {remainingAmount.toLocaleString('pt-AO')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total do Recibo */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Total do Recibo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                Kz {calculateTotal().toLocaleString('pt-AO', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.invoices.length} fatura(s) selecionada(s)
              </p>
            </CardContent>
          </Card>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações sobre o pagamento..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Shield className="mr-2 h-4 w-4" />
              {paymentReceipt ? 'Actualizar Recibo' : 'Criar Recibo Certificado'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}