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
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Target,
  Calendar,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { Opportunity } from '@/types/crm';
import { useOpportunities } from '@/hooks/use-opportunities';
import { toast } from 'sonner';
import { KwanzaCurrencyDisplay } from '@/components/angola/KwanzaCurrencyDisplay';
import { AngolaDateDisplay } from '@/components/angola/AngolaDateTimePicker';
import { useTranslation } from '@/lib/angola-translations';
import { OpportunityDialog } from './OpportunityDialog';

export function OpportunitiesList() {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const {
    opportunities,
    pipelineStages,
    loading,
    searchQuery,
    filters,
    setSearchQuery,
    setFilters,
    deleteOpportunity
  } = useOpportunities();

  const handleCreateOpportunity = () => {
    setEditingOpportunity(null);
    setDialogOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setDialogOpen(true);
  };

  const handleDeleteOpportunity = async (opportunityId: number) => {
    if (!confirm(t('messages.deleteConfirm'))) {
      return;
    }

    try {
      await deleteOpportunity(opportunityId);
    } catch (error) {
      console.error('Error deleting opportunity:', error);
    }
  };

  const handleOpportunitySaved = (savedOpportunity: Opportunity) => {
    setDialogOpen(false);
    setEditingOpportunity(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="text-blue-600">{t('status.open')}</Badge>;
      case 'won':
        return <Badge variant="outline" className="text-green-600">{t('status.won')}</Badge>;
      case 'lost':
        return <Badge variant="outline" className="text-red-600">{t('status.lost')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStageName = (stageId?: number) => {
    if (!stageId) return 'Sem Fase';
    const stage = pipelineStages.find(s => s.id === stageId);
    return stage?.name || 'Fase Desconhecida';
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`${t('actions.search')} ${t('navigation.opportunities').toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Estados</SelectItem>
              <SelectItem value="open">{t('status.open')}</SelectItem>
              <SelectItem value="won">{t('status.won')}</SelectItem>
              <SelectItem value="lost">{t('status.lost')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleCreateOpportunity}>
            <Plus className="mr-2 h-4 w-4" />
            {t('actions.add')} Oportunidade
          </Button>
        </div>
      </div>

      {/* Opportunities Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('navigation.opportunities')} ({opportunities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-8">
              <Target className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">{t('messages.noData')}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || selectedStatus !== 'all'
                  ? 'Tente ajustar a sua pesquisa ou filtros'
                  : 'Comece por criar a sua primeira oportunidade'
                }
              </p>
              {!searchQuery && selectedStatus === 'all' && (
                <Button onClick={handleCreateOpportunity} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('actions.add')} Oportunidade
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Oportunidade</TableHead>
                    <TableHead>Fase</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Probabilidade</TableHead>
                    <TableHead>Data de Fecho</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opportunities.map((opportunity) => (
                    <TableRow key={opportunity.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{opportunity.name}</div>
                          {opportunity.source && (
                            <div className="text-sm text-muted-foreground">
                              Fonte: {opportunity.source}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getStageName(opportunity.pipeline_stage_id)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {opportunity.value ? (
                          <KwanzaCurrencyDisplay amount={opportunity.value} />
                        ) : (
                          <span className="text-muted-foreground">Valor não definido</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          {opportunity.probability ? `${opportunity.probability}%` : 'Não definida'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {opportunity.expected_close_date ? (
                            <AngolaDateDisplay date={opportunity.expected_close_date} />
                          ) : (
                            'Não definida'
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(opportunity.status)}
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
                            <DropdownMenuItem onClick={() => handleEditOpportunity(opportunity)}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t('actions.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteOpportunity(opportunity.id)}
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

      {/* Opportunity Dialog */}
      <OpportunityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        opportunity={editingOpportunity}
        onSave={handleOpportunitySaved}
      />
    </div>
  );
}
