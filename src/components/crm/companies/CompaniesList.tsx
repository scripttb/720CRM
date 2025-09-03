"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Building2,
  Globe,
  Phone,
  Mail,
  Users,
  Loader2,
  FileText
} from 'lucide-react';
import { api } from '@/lib/api-client';
import { Company } from '@/types/crm';
import { toast } from 'sonner';
import { KwanzaCurrencyDisplay } from '@/components/angola/KwanzaCurrencyDisplay';
import { useTranslation } from '@/lib/angola-translations';
import { CompanyDialog } from './CompanyDialog';

export function CompaniesList() {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const data = await api.get<Company[]>('/companies', params);
      setCompanies(data);
    } catch (error) {
      toast.error(t('messages.saveError'));
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, t]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCompanies();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, fetchCompanies]);

  const handleCreateCompany = () => {
    setEditingCompany(null);
    setDialogOpen(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setDialogOpen(true);
  };

  const handleDeleteCompany = async (companyId: number) => {
    if (!confirm(t('messages.deleteConfirm'))) {
      return;
    }

    try {
      await api.delete(`/companies?id=${companyId}`);
      setCompanies(companies.filter(c => c.id !== companyId));
      toast.success(t('messages.deleteSuccess'));
    } catch (error) {
      toast.error(t('messages.deleteError'));
      console.error('Error deleting company:', error);
    }
  };

  const handleCompanySaved = (savedCompany: Company) => {
    if (editingCompany) {
      // Update existing company
      setCompanies(companies.map(c => 
        c.id === savedCompany.id ? savedCompany : c
      ));
      toast.success('Empresa actualizada com sucesso');
    } else {
      // Add new company
      setCompanies([savedCompany, ...companies]);
      toast.success('Empresa criada com sucesso');
    }
    setDialogOpen(false);
    setEditingCompany(null);
  };

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`${t('actions.search')} ${t('navigation.companies').toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button onClick={handleCreateCompany}>
          <Plus className="mr-2 h-4 w-4" />
          {t('actions.add')} {t('navigation.companies').slice(0, -1)}
        </Button>
      </div>

      {/* Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('navigation.companies')} ({companies.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">{t('messages.noData')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery 
                  ? 'Tente ajustar os termos de pesquisa'
                  : 'Comece por criar a sua primeira empresa'
                }
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateCompany} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('actions.add')} {t('navigation.companies').slice(0, -1)}
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('navigation.companies').slice(0, -1)}</TableHead>
                    <TableHead>{t('fields.industry')}</TableHead>
                    <TableHead>{t('fields.size')}</TableHead>
                    <TableHead>Receita</TableHead>
                    <TableHead>Documentação</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={company.logo_url} />
                            <AvatarFallback>
                              {getCompanyInitials(company.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{company.name}</div>
                            {company.website && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Globe className="h-3 w-3" />
                                <a 
                                  href={company.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {company.website.replace(/^https?:\/\//, '')}
                                </a>
                              </div>
                            )}
                            {company.state && (
                              <div className="text-sm text-muted-foreground">
                                {company.city && `${company.city}, `}{company.state}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {company.industry || (
                          <span className="text-muted-foreground">Não especificado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {company.size && (
                            <Badge variant="outline">{company.size}</Badge>
                          )}
                          {company.employee_count && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {company.employee_count.toLocaleString()} funcionários
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {company.annual_revenue ? (
                          <KwanzaCurrencyDisplay amount={company.annual_revenue} />
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {(company as any).nif && (
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span className="font-mono">NIF: {(company as any).nif}</span>
                            </div>
                          )}
                          {(company as any).alvara_number && (
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-3 w-3 text-muted-foreground" />
                              <span className="font-mono">Alvará: {(company as any).alvara_number}</span>
                            </div>
                          )}
                          {(company as any).tax_regime && (
                            <Badge variant="secondary" className="text-xs">
                              {(company as any).tax_regime}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {company.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <a 
                                href={`mailto:${company.email}`}
                                className="text-blue-600 hover:underline"
                              >
                                {company.email}
                              </a>
                            </div>
                          )}
                          {company.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <a 
                                href={`tel:${company.phone}`}
                                className="text-blue-600 hover:underline"
                              >
                                {company.phone}
                              </a>
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
                            <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t('actions.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCompany(company.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('actions.delete')}
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

      {/* Company Dialog */}
      <CompanyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        company={editingCompany}
        onSave={handleCompanySaved}
      />
    </div>
  );
}
