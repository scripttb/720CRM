"use client";

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
import { mockInvoices } from '@/data/billing-mock-data';
import { CreditNote, CreditNoteFormData, Invoice } from '@/types/billing';
import { Company, Contact } from '@/types/crm';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { KwanzaInput } from '@/components/angola/KwanzaCurrencyDisplay';
import { TAX_EXEMPTION_CODES } from '@/types/billing';

interface CreditNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditNote: CreditNote | null;
  onSave: (creditNote: CreditNote) => void;
}

export function CreditNoteDialog({ 
  open, 
  onOpenChange, 
  creditNote, 
  onSave 
}: CreditNoteDialogProps) {
  const [loading, setLoading] = useState(false);
  const [companies] = useState<Company[]>(mockCompanies);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [formData, setFormData] = useState<CreditNoteFormData>({
    original_invoice_id: 0,
    original_invoice_number: '',
    issue_date: new Date().toISOString().split('T')[0],
    reason: '',
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
      if (creditNote) {
        setFormData({
          original_invoice_id: creditNote.original_invoice_id,
          original_invoice_number: creditNote.original_invoice_number,
          company_id: creditNote.company_id,
          contact_id: creditNote.contact_id,
          issue_date: creditNote.issue_date,
          reason: creditNote.reason,
          currency: creditNote.currency,
          notes: creditNote.notes,
          items: [{
            description: 'Item da nota de crédito',
            quantity: 1,
            unit_price: creditNote.subtotal,
            discount_percentage: 0,
            tax_rate: 14.00
          }]
        });
      } else {
        setFormData({
          original_invoice_id: 0,
          original_invoice_number: '',
          issue_date: new Date().toISOString().split('T')[0],
          reason: '',
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
  }, [open, creditNote]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.original_invoice_id) {
      toast.error('Fatura original é obrigatória');
      return;
    }

    if (!formData.reason.trim()) {
      toast.error('Motivo é obrigatório');
      return;
    }

    if (formData.items.length === 0 || !formData.items[0].description) {
      toast.error('Pelo menos um item é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const totals = calculateTotals();
      
      const savedCreditNote: CreditNote = {
        id: creditNote?.id || Date.now(),
        user_id: 1,
        document_number: creditNote?.document_number || `NC 2024/${String(Date.now()).slice(-6)}`,
        atcud: `NC-${Date.now()}`,
        hash_control: `hash-${Date.now()}`,
        original_invoice_id: formData.original_invoice_id,
        original_invoice_number: formData.original_invoice_number,
        company_id: formData.company_id,
        contact_id: formData.contact_id,
        issue_date: formData.issue_date,
        reason: formData.reason,
        subtotal: totals.subtotal,
        tax_amount: totals.taxAmount,
        total_amount: totals.total,
        currency: formData.currency,
        status: 'issued',
        notes: formData.notes,
        certification_date: new Date().toISOString(),
        create_time: creditNote?.create_time || new Date().toISOString(),
        modify_time: new Date().toISOString(),
      };
      
      onSave(savedCreditNote);
      toast.success(creditNote ? 'Nota de crédito actualizada com sucesso' : 'Nota de crédito criada com sucesso');
    } catch (error) {
      toast.error('Erro ao guardar nota de crédito');
      console.error('Error saving credit note:', error);
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

  const handleInvoiceChange = (invoiceId: string) => {
    const invoice = invoices.find(i => i.id === parseInt(invoiceId));
    if (invoice) {
      setFormData(prev => ({
        ...prev,
        original_invoice_id: invoice.id,
        original_invoice_number: invoice.document_number,
        company_id: invoice.company_id,
        contact_id: invoice.contact_id,
        currency: invoice.currency
      }));
    }
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {creditNote ? 'Editar' : 'Criar'} Nota de Crédito
          </DialogTitle>
          <DialogDescription>
            {creditNote 
              ? 'Actualizar as informações da nota de crédito abaixo.'
              : 'Criar uma nova nota de crédito para cancelar ou corrigir uma fatura.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Fatura Original */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fatura Original</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice">Fatura Original *</Label>
                <Select 
                  value={formData.original_invoice_id?.toString() || ''} 
                  onValueChange={handleInvoiceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar fatura" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices.map((invoice) => (
                      <SelectItem key={invoice.id} value={invoice.id.toString()}>
                        {invoice.document_number} - Kz {invoice.total_amount.toLocaleString('pt-AO')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo *</Label>
                <Select 
                  value={formData.reason} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cancelamento por solicitação do cliente">Cancelamento por solicitação do cliente</SelectItem>
                    <SelectItem value="Erro na faturação">Erro na faturação</SelectItem>
                    <SelectItem value="Devolução de mercadoria">Devolução de mercadoria</SelectItem>
                    <SelectItem value="Desconto comercial">Desconto comercial</SelectItem>
                    <SelectItem value="Correção de dados">Correção de dados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Data */}
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

          {/* Itens da Nota de Crédito */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Itens da Nota de Crédito</h3>
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
                        placeholder="Descrição do item a creditar"
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

          {/* Totais */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Nota de Crédito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Kz {totals.subtotal.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA:</span>
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
              {creditNote ? 'Actualizar Nota de Crédito' : 'Criar Nota de Crédito'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}