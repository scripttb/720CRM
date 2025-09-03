"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  MoreHorizontal, 
  Edit, 
  Trash2, 
  CheckCircle,
  Eye,
  Download,
  Shield,
  Loader2,
  Plus
} from 'lucide-react';
import { mockPaymentReceipts } from '@/data/billing-mock-data';
import { PaymentReceipt } from '@/types/billing';
import { toast } from 'sonner';
import { KwanzaCurrencyDisplay } from '@/components/angola/KwanzaCurrencyDisplay';
import { AngolaDateDisplay } from '@/components/angola/AngolaDateTimePicker';

export function PaymentReceiptsList() {
  const [paymentReceipts, setPaymentReceipts] = useState<PaymentReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPaymentReceipts = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredData = [...mockPaymentReceipts];
      
      if (searchQuery) {
        filteredData = filteredData.filter(pr => 
          pr.document_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pr.payment_reference?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setPaymentReceipts(filteredData);
    } catch (error) {
      toast.error('Falha ao carregar recibos de pagamento');
      console.error('Error fetching payment receipts:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchPaymentReceipts();
  }, [fetchPaymentReceipts]);

  const handleCreatePaymentReceipt = () => {
    toast.info('Funcionalidade de criação de recibo em desenvolvimento');
  };

  const handleDeletePaymentReceipt = async (receiptId: number) => {
    if (!confirm('Tem a certeza que deseja eliminar este recibo de pagamento?')) {
      return;
    }

    try {
      setPaymentReceipts(paymentReceipts.filter(pr => pr.id !== receiptId));
      toast.success('Recibo de pagamento eliminado com sucesso');
    } catch (error) {
      toast.error('Falha ao eliminar recibo de pagamento');
      console.error('Error deleting payment receipt:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar recibos por número ou cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button onClick={handleCreatePaymentReceipt}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Recibo
        </Button>
      </div>

      {/* Payment Receipts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recibos de Pagamento ({paymentReceipts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : paymentReceipts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhum recibo de pagamento encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? 'Tente ajustar a sua pesquisa'
                  : 'Os recibos de pagamento aparecerão aqui quando forem criados'
                }
              </p>
              {!searchQuery && (
                <Button onClick={handleCreatePaymentReceipt} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Recibo
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
                    <TableHead>Data de Pagamento</TableHead>
                    <TableHead>Método de Pagamento</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Certificação</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentReceipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell>
                        <div className="font-medium">{receipt.document_number}</div>
                        {receipt.payment_reference && (
                          <div className="text-sm text-muted-foreground">
                            Ref: {receipt.payment_reference}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">Cliente #{receipt.company_id}</div>
                          {receipt.contact_id && (
                            <div className="text-sm text-muted-foreground">
                              Contacto #{receipt.contact_id}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <AngolaDateDisplay date={receipt.issue_date} />
                      </TableCell>
                      <TableCell>
                        <AngolaDateDisplay date={receipt.payment_date} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          Método #{receipt.payment_method_id}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <KwanzaCurrencyDisplay amount={receipt.total_amount} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {receipt.atcud && (
                            <div className="flex items-center gap-1">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span className="sr-only">Certificado AGT</span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-green-600">
                            Certificado
                          </Badge>
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
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeletePaymentReceipt(receipt.id)}
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
    </div>
  );
}