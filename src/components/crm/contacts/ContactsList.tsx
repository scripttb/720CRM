"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail, 
  Phone,
  Building2,
  User,
  Loader2
} from 'lucide-react';
import { FileText } from 'lucide-react';
import { Contact } from '@/types/crm';
import { useContacts } from '@/hooks/use-contacts';
import { useCompanies } from '@/hooks/use-companies';
import { toast } from 'sonner';
import { ContactDialog } from './ContactDialog';
import { ResponsiveTable, MobileTable, MobileCard } from '@/components/ui/mobile-table';

export function ContactsList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const {
    contacts,
    loading,
    searchQuery,
    filters,
    setSearchQuery,
    setFilters,
    deleteContact
  } = useContacts();

  const { companies } = useCompanies();

  const handleCreateContact = () => {
    setEditingContact(null);
    setDialogOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setDialogOpen(true);
  };

  const handleDeleteContact = async (contactId: number) => {
    if (!confirm('Tem a certeza que deseja eliminar este contacto?')) {
      return;
    }

    try {
      await deleteContact(contactId);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleContactSaved = (savedContact: Contact) => {
    setDialogOpen(false);
    setEditingContact(null);
  };

  const getCompanyName = (companyId?: number) => {
    if (!companyId) return 'Sem Empresa';
    const company = companies.find(c => c.id === companyId);
    return company?.name || 'Empresa Desconhecida';
  };

  const getContactInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar contactos por nome, email ou cargo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filters.company_id} onValueChange={(value) => setFilters(prev => ({ ...prev, company_id: value }))}>
            <SelectTrigger className="w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Empresas</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={handleCreateContact}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Contacto
          </Button>
        </div>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contactos ({contacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhum contacto encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || filters.company_id !== 'all' 
                  ? 'Tente ajustar a sua pesquisa ou filtros'
                  : 'Comece por criar o seu primeiro contacto'
                }
              </p>
              {!searchQuery && filters.company_id === 'all' && (
                <Button onClick={handleCreateContact} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Contacto
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Informações de Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={contact.avatar_url} />
                            <AvatarFallback>
                              {getContactInitials(contact.first_name, contact.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {contact.first_name} {contact.last_name}
                              {contact.is_primary && (
                                <Badge variant="secondary" className="ml-2 text-xs">
                                  Principal
                                </Badge>
                              )}
                            </div>
                            {contact.department && (
                              <div className="text-sm text-muted-foreground">
                                {contact.department}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {getCompanyName(contact.company_id)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {contact.job_title || (
                          <span className="text-muted-foreground">Sem cargo</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {contact.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <a 
                                href={`mailto:${contact.email}`}
                                className="text-blue-600 hover:underline"
                              >
                                {contact.email}
                              </a>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="font-mono">{contact.phone}</span>
                            </div>
                          )}
                          {(contact as any).bi_number && (
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span className="font-mono text-xs">BI: {(contact as any).bi_number}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          Activo
                        </Badge>
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
                            <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteContact(contact.id)}
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

      {/* Mobile View */}
      <div className="md:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Contactos ({contacts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <MobileTable
                data={contacts}
                renderCard={(contact) => (
                  <MobileCard key={contact.id}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar_url} />
                          <AvatarFallback>
                            {getContactInitials(contact.first_name, contact.last_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">
                            {contact.first_name} {contact.last_name}
                            {contact.is_primary && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                Principal
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {contact.job_title || 'Cargo não especificado'}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteContact(contact.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{getCompanyName(contact.company_id)}</span>
                        </div>
                        
                        {contact.department && (
                          <div className="text-sm text-muted-foreground">
                            Departamento: {contact.department}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {contact.email && (
                          <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-xs text-blue-600">
                            <Mail className="h-3 w-3" />
                            Email
                          </a>
                        )}
                        {contact.phone && (
                          <a href={`tel:${contact.phone}`} className="flex items-center gap-1 text-xs text-blue-600">
                            <Phone className="h-3 w-3" />
                            Telefone
                          </a>
                        )}
                      </div>
                      
                      {(contact as any).bi_number && (
                        <div className="text-xs">
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3 text-muted-foreground" />
                            <span className="font-mono">BI: {(contact as any).bi_number}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </MobileCard>
                )}
                emptyState={
                  <div className="text-center py-8">
                    <User className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-semibold">Nenhum contacto encontrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {searchQuery || filters.company_id !== 'all' 
                        ? 'Tente ajustar a sua pesquisa ou filtros'
                        : 'Comece por criar o seu primeiro contacto'
                      }
                    </p>
                    {!searchQuery && filters.company_id === 'all' && (
                      <Button onClick={handleCreateContact} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Contacto
                      </Button>
                    )}
                  </div>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
      {/* Contact Dialog */}
      <ContactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        contact={editingContact}
        companies={companies}
        onSave={handleContactSaved}
      />
    </div>
  );
}
