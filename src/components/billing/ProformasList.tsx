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
  FileText,
  Eye,
  Send,
  ArrowRight,
  Loader2,
  Plus
} from 'lucide-react';
import { mockProformas } from '@/data/billing-mock-data';
import { Proforma } from '@/types/billing';
import { toast } from 'sonner';
import { useBilling } from '@/hooks/use-billing';
import { KwanzaCurrencyDisplay } from '@/components/angola/KwanzaCurrencyDisplay';
import { AngolaDateDisplay } from '@/components/angola/AngolaDateTimePicker';
import { ProformaDialog } from './ProformaDialog';

export function ProformasList() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProforma, setEditingProforma] = useState<Proforma | null>(null);
  
  const { 
    proformas, 
    convertProformaToInvoice, 
    createProforma,
    refreshData 
  } = useBilling();

  const fetchProformas = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredData = [...mockProformas];
      
      if (searchQuery) {
        filteredData = filteredData.filter(p => 
          p.document_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedStatus !== 'all') {
        filteredData = filteredData.filter(p => p.status === selectedStatus);
      }
      
      // Data is now managed by useBilling hook
      setLoading(false);
    } catch (error) {
      toast.error('Falha ao carregar proformas');
      console.error('Error fetching proformas:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatus, proformas]);

  useEffect(() => {
    fetchProformas();
  }, [fetchProformas]);

  const handleCreateProforma = () => {
    setEditingProforma(null);
    setDialogOpen(true);
  };

  const handleEditProforma = (proforma: Proforma) => {
    setEditingProforma(proforma);
    setDialogOpen(true);
  };

  const handleDeleteProforma = async (proformaId: number) => {
    if (!confirm('Tem a certeza que deseja eliminar esta proforma?')) {
      return;
    }

    try {
      // In a real app, this would call an API
      await refreshData();
      toast.success('Proforma eliminada com sucesso');
    } catch (error) {
      toast.error('Falha ao eliminar proforma');
      console.error('Error deleting proforma:', error);
    }
  };

  const handleProformaSaved = async (data: any) => {
    try {
      await createProforma(data);
    } catch (error) {
      console.error('Error saving proforma:', error);
    }
    setDialogOpen(false);
    setEditingProforma(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="text-gray-600">Rascunho</Badge>;
      case 'sent':
        return <Badge variant="outline" className="text-blue-600">Enviada</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-green-600">Aceite</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600">Rejeitada</Badge>;
      case 'converted':
        return <Badge variant="outline" className="text-purple-600">Convertida</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleConvertToInvoice = async (proforma: Proforma) => {
    if (!confirm('Converter esta proforma em fatura?')) {
      return;
    }

    try {
      // Simulate conversion
      const newInvoice = {
        id: Date.now(),
        user_id: 1,
        document_number: `FT 2024/${String(Date.now()).slice(-6)}`,
        atcud: `FT-${Date.now()}`,
        hash_control: `hash-${Date.now()}`,
        company_id: proforma.company_id,
        contact_id: proforma.contact_id,
        proforma_id: proforma.id,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: proforma.due_date,
        subtotal: proforma.subtotal,
        tax_amount: proforma.tax_amount,
        total_amount: proforma.total_amount,
        currency: proforma.currency,
        status: 'issued' as const,
        payment_status: 'pending' as const,
        paid_amount: 0,
        notes: proforma.notes,
        terms_conditions: proforma.terms_conditions,
        certification_date: new Date().toISOString(),
        create_time: new Date().toISOString(),
        modify_time: new Date().toISOString(),
      };

      // Update proforma status
      const updatedProforma = {
        ...proforma,
        status: 'converted' as const,
        converted_to_invoice_id: newInvoice.id,
        modify_time: new Date().toISOString()
      };

      setProformas(proformas.map(p => 
        p.id === proforma.id ? updatedProforma : p
      ));

      toast.success(`Proforma convertida em fatura ${newInvoice.document_number} com certificação AGT`);
    } catch (error) {
      toast.error('Erro ao converter proforma');
      console.error('Error converting proforma:', error);
    }
  };

  const handleConvertToInvoice = async (proforma: Proforma) => {
    if (!confirm('Converter esta proforma em fatura?')) {
      return;
    }

    try {
      await convertProformaToInvoice(proforma.id);
    } catch (error) {
      console.error('Error converting proforma:', error);
    }
  };

  // Filter proformas based on search and status
  const filteredProformas = proformas.filter(proforma => {
    const matchesSearch = !searchQuery || 
      proforma.document_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proforma.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || proforma.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar proformas por número ou empresa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Estados</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="sent">Enviada</SelectItem>
              <SelectItem value="accepted">Aceite</SelectItem>
              <SelectItem value="rejected">Rejeitada</SelectItem>
              <SelectItem value="converted">Convertida</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleCreateProforma}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Proforma
          </Button>
        </div>
      </div>

      {/* Proformas Table */}
      <Card>
        <CardHeader>
          <CardTitle>Proformas ({proformas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : proformas.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhuma proforma encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || selectedStatus !== 'all'
                  ? 'Tente ajustar a sua pesquisa ou filtros'
                  : 'Comece por criar a sua primeira proforma'
                }
              </p>
              {!searchQuery && selectedStatus === 'all' && (
                <Button onClick={handleCreateProforma} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Proforma
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
                    <TableHead>Validade</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProformas.map((proforma) => (
                    <TableRow key={proforma.id}>
                      <TableCell>
                        <div className="font-medium">{proforma.document_number}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">Cliente #{proforma.company_id}</div>
                          {proforma.contact_id && (
                            <div className="text-sm text-muted-foreground">
                              Contacto #{proforma.contact_id}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <AngolaDateDisplay date={proforma.issue_date} />
                      </TableCell>
                      <TableCell>
                        {proforma.due_date ? (
                          <AngolaDateDisplay date={proforma.due_date} />
                        ) : (
                          <span className="text-muted-foreground">Sem validade</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <KwanzaCurrencyDisplay amount={proforma.total_amount} />
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(proforma.status)}
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
                            <DropdownMenuItem onClick={() => handleEditProforma(proforma)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            {proforma.status === 'draft' && (
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                Enviar
                              </DropdownMenuItem>
                            )}
                            {proforma.status === 'accepted' && !proforma.converted_to_invoice_id && (
                              <DropdownMenuItem>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                <span onClick={() => handleConvertToInvoice(proforma)}>
                                  Converter em Fatura
                                </span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteProforma(proforma.id)}
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

      {/* Proforma Dialog */}
      <ProformaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        proforma={editingProforma}
        onSave={handleProformaSaved}
      />
    </div>
  );
}