"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { KwanzaCurrencyDisplay } from '@/components/angola/KwanzaCurrencyDisplay';
import { AngolaDateDisplay } from '@/components/angola/AngolaDateTimePicker';
import { useOpportunities } from '@/hooks/use-opportunities';
import { Opportunity, PipelineStage } from '@/types/crm';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar, 
  Building2,
  User,
  TrendingUp,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

interface PipelineKanbanProps {
  onEditOpportunity: (opportunity: Opportunity) => void;
  onCreateOpportunity: () => void;
}

export function PipelineKanban({ onEditOpportunity, onCreateOpportunity }: PipelineKanbanProps) {
  const { 
    opportunities, 
    pipelineStages, 
    moveToStage, 
    deleteOpportunity,
    getOpportunitiesByStage 
  } = useOpportunities();

  const [draggedOpportunity, setDraggedOpportunity] = useState<Opportunity | null>(null);

  const handleDragStart = (e: React.DragEvent, opportunity: Opportunity) => {
    setDraggedOpportunity(opportunity);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStageId: number) => {
    e.preventDefault();
    
    if (!draggedOpportunity || draggedOpportunity.pipeline_stage_id === targetStageId) {
      setDraggedOpportunity(null);
      return;
    }

    try {
      await moveToStage(draggedOpportunity.id, targetStageId);
    } catch (error) {
      console.error('Error moving opportunity:', error);
    } finally {
      setDraggedOpportunity(null);
    }
  };

  const handleDeleteOpportunity = async (opportunityId: number) => {
    if (!confirm('Tem a certeza que deseja eliminar esta oportunidade?')) {
      return;
    }

    try {
      await deleteOpportunity(opportunityId);
    } catch (error) {
      console.error('Error deleting opportunity:', error);
    }
  };

  const getStageTotal = (stageId: number) => {
    const stageOpportunities = getOpportunitiesByStage(stageId);
    return stageOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-blue-600';
      case 'won':
        return 'text-green-600';
      case 'lost':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pipeline de Vendas</h2>
          <p className="text-muted-foreground">
            Arraste e solte oportunidades entre as fases do pipeline
          </p>
        </div>
        <Button onClick={onCreateOpportunity}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Oportunidade
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto">
        {pipelineStages
          .sort((a, b) => a.stage_order - b.stage_order)
          .map((stage) => {
            const stageOpportunities = getOpportunitiesByStage(stage.id);
            const stageTotal = getStageTotal(stage.id);
            
            return (
              <div
                key={stage.id}
                className="min-w-[300px] bg-muted/30 rounded-lg p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {/* Stage Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{stage.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {stageOpportunities.length}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <KwanzaCurrencyDisplay amount={stageTotal} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stage.probability}% probabilidade
                  </div>
                </div>

                {/* Opportunities in Stage */}
                <div className="space-y-3 min-h-[200px]">
                  {stageOpportunities.map((opportunity) => (
                    <Card
                      key={opportunity.id}
                      className={`cursor-move hover:shadow-md transition-shadow ${
                        draggedOpportunity?.id === opportunity.id ? 'opacity-50' : ''
                      }`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, opportunity)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Opportunity Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-2">
                                {opportunity.name}
                              </h4>
                              {opportunity.company_id && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Building2 className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    Empresa #{opportunity.company_id}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onEditOpportunity(opportunity)}>
                                  <Edit className="mr-2 h-3 w-3" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteOpportunity(opportunity.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-3 w-3" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Value and Probability */}
                          <div className="space-y-1">
                            {opportunity.value && (
                              <div className="font-semibold text-sm">
                                <KwanzaCurrencyDisplay amount={opportunity.value} />
                              </div>
                            )}
                            {opportunity.probability !== undefined && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {opportunity.probability}% probabilidade
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Expected Close Date */}
                          {opportunity.expected_close_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                <AngolaDateDisplay date={opportunity.expected_close_date} />
                              </span>
                            </div>
                          )}

                          {/* Assigned User */}
                          {opportunity.assigned_user_id && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback className="text-xs">
                                  U{opportunity.assigned_user_id}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                Utilizador #{opportunity.assigned_user_id}
                              </span>
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className="flex justify-end">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(opportunity.status)}`}
                            >
                              {opportunity.status === 'open' ? 'Aberto' : 
                               opportunity.status === 'won' ? 'Ganho' : 'Perdido'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Empty State */}
                  {stageOpportunities.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="text-xs">Nenhuma oportunidade</div>
                      <div className="text-xs">nesta fase</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Pipeline Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{opportunities.length}</div>
              <div className="text-sm text-muted-foreground">Total de Oportunidades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                <KwanzaCurrencyDisplay 
                  amount={opportunities.reduce((sum, o) => sum + (o.value || 0), 0)} 
                  showSymbol={false}
                />
              </div>
              <div className="text-sm text-muted-foreground">Valor Total do Pipeline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {opportunities.filter(o => o.status === 'won').length}
              </div>
              <div className="text-sm text-muted-foreground">Negócios Ganhos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {((opportunities.filter(o => o.status === 'won').length / (opportunities.length || 1)) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Taxa de Conversão</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}