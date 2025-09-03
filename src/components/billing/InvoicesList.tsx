"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Receipt,
  Eye,
  Download,
  QrCode,
  Shield,
  Loader2,
  Plus
} from 'lucide-react';
import { mockInvoices } from '@/data/billing-mock-data';
import { Invoice } from '@/types/billing';
import { toast } from 'sonner';
import { useBilling } from '@/hooks/use-billing';
import { KwanzaCurrencyDisplay } from '@/components/angola/KwanzaCurrencyDisplay';
import { AngolaDateDisplay } from '@/components/angola/AngolaDateTimePicker';
import { InvoiceDialog } from './InvoiceDialog';

export function InvoicesList() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  
  const { 
    invoices, 
    createInvoice,
    refreshData 
  } = useBilling();

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredData = [...mockInvoices];
      
      if (searchQuery) {
        filteredData = filteredData.filter(i => 
          i.document_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedStatus !== 'all') {
        filteredData = filteredData.filter(i => i.status === selectedStatus);
      }
      
      if (selectedPaymentStatus !== 'all') {
        filteredData = filteredData.filter(i => i.payment_status === selectedPaymentStatus);
      }
      
      // Data is now managed by useBilling hook
      setLoading(false);
    } catch (error) {
      toast.error('Falha ao carregar faturas');
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatus, selectedPaymentStatus, invoices]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleCreateInvoice = () => {
    setEditingInvoice(null);
    setDialogOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setDialogOpen(true);
  };

  const handleDeleteInvoice = async (invoiceId: number) => {
    if (!confirm('Tem a certeza que deseja eliminar esta fatura?')) {
      return;
    }

    try {
      // In a real app, this would call an API
      await refreshData();
      toast.success('Fatura eliminada com sucesso');
    } catch (error) {
      toast.error('Falha ao eliminar fatura');
      console.error('Error deleting invoice:', error);
    }
  };

  const handleInvoiceSaved = async (data: any) => {
    try {
      await createInvoice(data);
    } catch (error) {
      console.error('Error saving invoice:', error);
    }
    setDialogOpen(false);
    setEditingInvoice(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'issued':
        return <Badge variant="outline" className="text-blue-600">Emitida</Badge>;
      case 'paid':
        return <Badge variant="outline" className="text-green-600">Paga</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="text-red-600">Vencida</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-gray-600">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600">Pendente</Badge>;
      case 'partial':
        return <Badge variant="outline" className="text-yellow-600">Parcial</Badge>;
      case 'paid':
        return <Badge variant="outline" className="text-green-600">Pago</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = !searchQuery || 
      invoice.document_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || invoice.payment_status === selectedPaymentStatus;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar faturas por número ou empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="issued">Emitida</SelectItem>
              <SelectItem value="paid">Paga</SelectItem>
              <SelectItem value="overdue">Vencida</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="partial">Parcial</SelectItem>
              <SelectItem value="paid">Pago</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleCreateInvoice}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Fatura
          </Button>
        </div>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Faturas ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhuma fatura encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || selectedStatus !== 'all' || selectedPaymentStatus !== 'all'
                  ? 'Tente ajustar a sua pesquisa ou filtros'
                  : 'Comece por criar a sua primeira fatura'
                }
              </p>
              {!searchQuery && selectedStatus === 'all' && selectedPaymentStatus === 'all' && (
                <Button onClick={handleCreateInvoice} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Fatura
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data de Emissão</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Certificação</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="font-medium">{invoice.document_number}</div>
                        {invoice.proforma_id && (
                          <div className="text-sm text-muted-foreground">
                            Da proforma #{invoice.proforma_id}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">Cliente #{invoice.company_id}</div>
                          {invoice.contact_id && (
                            <div className="text-sm text-muted-foreground">
                              Contacto #{invoice.contact_id}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <AngolaDateDisplay date={invoice.issue_date} />
                      </TableCell>
                      <TableCell>
                        {invoice.due_date ? (
                          <AngolaDateDisplay date={invoice.due_date} />
                        ) : (
                          <span className="text-muted-foreground">Sem vencimento</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <KwanzaCurrencyDisplay amount={invoice.total_amount} />
                        {invoice.paid_amount > 0 && (
                          <div className="text-sm text-green-600">
                            Pago: <KwanzaCurrencyDisplay amount={invoice.paid_amount} />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.status)}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(invoice.payment_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {invoice.atcud && (
                            <div className="flex items-center gap-1">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span className="sr-only">Certificada AGT</span>
                            </div>
                          )}
                          {invoice.qr_code_data && (
                            <div className="flex items-center gap-1">
                              <QrCode className="h-4 w-4 text-blue-600" />
                              <span className="sr-only">QR Code disponível</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acções</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Descarregar PDF
                            </DropdownMenuItem>
                            {invoice.qr_code_data && (
                              <DropdownMenuItem>
                                <QrCode className="mr-2 h-4 w-4" />
                                Ver QR Code
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Dialog */}
      <InvoiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        invoice={editingInvoice}
        onSave={handleInvoiceSaved}
      />
    </div>
  );
}