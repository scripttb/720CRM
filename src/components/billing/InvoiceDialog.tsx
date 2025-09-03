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
import { mockCompanies, mockContacts } from '@/lib/mock-data';
import { mockProducts } from '@/data/billing-mock-data';
import { Invoice, BillingFormData, Product } from '@/types/billing';
import { Company, Contact } from '@/types/crm';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Shield } from 'lucide-react';
import { KwanzaInput } from '@/components/angola/KwanzaCurrencyDisplay';
import { TAX_EXEMPTION_CODES } from '@/types/billing';

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onSave: (invoice: Invoice) => void;
}

export function InvoiceDialog({ 
  open, 
  onOpenChange, 
  invoice, 
  onSave 
}: InvoiceDialogProps) {
  const [loading, setLoading] = useState(false);
  const [companies] = useState<Company[]>(mockCompanies);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [products] = useState<Product[]>(mockProducts);
  const [formData, setFormData] = useState<BillingFormData>({
    issue_date: new Date().toISOString().split('T')[0],
    currency: 'AOA',
    items: [{
      description: '',
      quantity: 1,
      unit_price: 0,
      discount_percentage: 0,
      tax_rate: 14.00
    }]
  });

  const fetchContacts = useCallback(async (companyId: number) => {
    const filteredContacts = mockContacts.filter(c => c.company_id === companyId);
    setContacts(filteredContacts);
  }, []);

  useEffect(() => {
    if (open) {
      if (invoice) {
        setFormData({
          company_id: invoice.company_id,
          contact_id: invoice.contact_id,
          issue_date: invoice.issue_date,
          due_date: invoice.due_date,
          currency: invoice.currency,
          notes: invoice.notes,
          terms_conditions: invoice.terms_conditions,
          items: [{
            description: 'Item da fatura',
            quantity: 1,
            unit_price: invoice.subtotal,
            discount_percentage: 0,
            tax_rate: 14.00
          }]
        });
      } else {
        setFormData({
          issue_date: new Date().toISOString().split('T')[0],
          currency: 'AOA',
          items: [{
            description: '',
            quantity: 1,
            unit_price: 0,
            discount_percentage: 0,
            tax_rate: 14.00
          }]
        });
      }
    }
  }, [open, invoice]);

  useEffect(() => {
    if (formData.company_id) {
      fetchContacts(formData.company_id);
    }
  }, [formData.company_id, fetchContacts]);

  const calculateTotals = () => {
    let subtotal = 0;
    let taxAmount = 0;

    formData.items.forEach(item => {
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

  const generateAGTCertification = () => {
    const timestamp = Date.now();
    return {
      atcud: `FT-${timestamp}`,
      hash_control: `hash-${timestamp.toString(36)}`,
      digital_signature: `MEUCIQDExample${timestamp}`,
      qr_code_data: `FT|${formData.issue_date}|${calculateTotals().total}|hash-${timestamp.toString(36)}|MEUCIQDExample${timestamp}`
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_id) {
      toast.error('Empresa é obrigatória');
      return;
    }

    if (formData.items.length === 0 || !formData.items[0].description) {
      toast.error('Pelo menos um item é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const totals = calculateTotals();
      const agtCert = generateAGTCertification();
      
      const savedInvoice: Invoice = {
        id: invoice?.id || Date.now(),
        user_id: 1,
        document_number: invoice?.document_number || `FT 2024/${String(Date.now()).slice(-6)}`,
        ...agtCert,
        company_id: formData.company_id,
        contact_id: formData.contact_id,
        issue_date: formData.issue_date,
        due_date: formData.due_date,
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        total_amount: totals.total,
        currency: formData.currency,
        status: 'issued',
        payment_status: 'pending',
        paid_amount: 0,
        notes: formData.notes,
        terms_conditions: formData.terms_conditions,
        certification_date: new Date().toISOString(),
        create_time: invoice?.create_time || new Date().toISOString(),
        modify_time: new Date().toISOString(),
      };
      
      onSave(savedInvoice);
      toast.success(invoice ? 'Fatura actualizada com sucesso' : 'Fatura criada com certificação AGT');
    } catch (error) {
      toast.error('Erro ao guardar fatura');
      console.error('Error saving invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        description: '',
        quantity: 1,
        unit_price: 0,
        discount_percentage: 0,
        tax_rate: 14.00
      }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            {invoice ? 'Editar' : 'Criar'} Fatura com Certificação AGT
          </DialogTitle>
          <DialogDescription>
            {invoice 
              ? 'Actualizar as informações da fatura abaixo.'
              : 'Criar uma nova fatura com certificação digital AGT automática.'
            }
          </DialogDescription>
        </DialogHeader>

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
                    contact_id: undefined
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

          {/* Datas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Datas</h3>
            
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="due_date">Data de Vencimento</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value || undefined }))}
                />
              </div>
            </div>
          </div>

          {/* Itens da Fatura */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Itens da Fatura</h3>
              <Button type="button" variant="outline" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Item {index + 1}</CardTitle>
                      {formData.items.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Descrição *</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Descrição do produto ou serviço"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Quantidade</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.001"
                          value={item.quantity || ''}
                          onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Preço Unitário (Kz)</Label>
                        <KwanzaInput
                          value={item.unit_price}
                          onChange={(value) => updateItem(index, 'unit_price', value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Desconto (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={item.discount_percentage || ''}
                          onChange={(e) => updateItem(index, 'discount_percentage', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Taxa de IVA (%)</Label>
                        <Select 
                          value={item.tax_rate?.toString() || '14'} 
                          onValueChange={(value) => updateItem(index, 'tax_rate', parseFloat(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="14">14% (Taxa Normal)</SelectItem>
                            <SelectItem value="0">0% (Isento)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {item.tax_rate === 0 && (
                        <div className="space-y-2">
                          <Label>Código de Isenção</Label>
                          <Select 
                            value={item.tax_exemption_code || ''} 
                            onValueChange={(value) => {
                              updateItem(index, 'tax_exemption_code', value);
                              updateItem(index, 'tax_exemption_reason', TAX_EXEMPTION_CODES[value as keyof typeof TAX_EXEMPTION_CODES]);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar código" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(TAX_EXEMPTION_CODES).map(([code, description]) => (
                                <SelectItem key={code} value={code}>
                                  {code} - {description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Certificação AGT */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Shield className="h-5 w-5" />
                Certificação AGT Automática
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">ATCUD:</p>
                  <p className="text-muted-foreground">Gerado automaticamente</p>
                </div>
                <div>
                  <p className="font-medium">Hash de Controlo:</p>
                  <p className="text-muted-foreground">Calculado pelo sistema</p>
                </div>
                <div>
                  <p className="font-medium">QR Code:</p>
                  <p className="text-muted-foreground">Incluído na fatura</p>
                </div>
                <div>
                  <p className="font-medium">Assinatura Digital:</p>
                  <p className="text-muted-foreground">Certificado n31.1/AGT20</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Totais */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Fatura</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Kz {totals.subtotal.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (14%):</span>
                  <span>Kz {totals.taxAmount.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>Kz {totals.total.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Observações adicionais..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Termos e Condições</Label>
              <Textarea
                id="terms"
                value={formData.terms_conditions || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, terms_conditions: e.target.value }))}
                placeholder="Termos e condições de pagamento..."
                rows={3}
              />
            </div>
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
              {invoice ? 'Actualizar Fatura' : 'Criar Fatura Certificada'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}