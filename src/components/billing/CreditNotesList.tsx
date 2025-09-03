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
  CreditCard,
  Eye,
  Download,
  Shield,
  Loader2,
  Plus
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { CreditNote } from '@/types/billing';
import { toast } from 'sonner';
import { KwanzaCurrencyDisplay } from '@/components/angola/KwanzaCurrencyDisplay';
import { AngolaDateDisplay } from '@/components/angola/AngolaDateTimePicker';

export function CreditNotesList() {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCreditNotes = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const data = await api.get<CreditNote[]>('/billing/credit-notes', params);
      setCreditNotes(data);
    } catch (error) {
      toast.error('Falha ao carregar notas de crédito');
      console.error('Error fetching credit notes:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchCreditNotes();
  }, [fetchCreditNotes]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCreditNotes();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, fetchCreditNotes]);

  const handleCreateCreditNote = () => {
    // Implementar diálogo de criação de nota de crédito
    toast.info('Funcionalidade em desenvolvimento');
  };

  const handleDeleteCreditNote = async (creditNoteId: number) => {
    if (!confirm('Tem a certeza que deseja eliminar esta nota de crédito?')) {
      return;
    }

    try {
      await api.delete(`/billing/credit-notes?id=${creditNoteId}`);
      setCreditNotes(creditNotes.filter(cn => cn.id !== creditNoteId));
      toast.success('Nota de crédito eliminada com sucesso');
    } catch (error) {
      toast.error('Falha ao eliminar nota de crédito');
      console.error('Error deleting credit note:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar notas de crédito por número ou fatura original..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button onClick={handleCreateCreditNote}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Nota de Crédito
        </Button>
      </div>

      {/* Credit Notes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Notas de Crédito ({creditNotes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : creditNotes.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhuma nota de crédito encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? 'Tente ajustar a sua pesquisa'
                  : 'As notas de crédito aparecerão aqui quando forem criadas'
                }
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateCreditNote} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Nota de Crédito
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Fatura Original</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data de Emissão</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Certificação</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditNotes.map((creditNote) => (
                    <TableRow key={creditNote.id}>
                      <TableCell>
                        <div className="font-medium">{creditNote.document_number}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{creditNote.original_invoice_number}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {creditNote.original_invoice_id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">Cliente #{creditNote.company_id}</div>
                          {creditNote.contact_id && (
                            <div className="text-sm text-muted-foreground">
                              Contacto #{creditNote.contact_id}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <AngolaDateDisplay date={creditNote.issue_date} />
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm line-clamp-2">{creditNote.reason}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <KwanzaCurrencyDisplay amount={creditNote.total_amount} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {creditNote.atcud && (
                            <div className="flex items-center gap-1">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span className="sr-only">Certificada AGT</span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-green-600">
                            Certificada
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
                              onClick={() => handleDeleteCreditNote(creditNote.id)}
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
