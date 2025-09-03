"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Zap, 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  MoreHorizontal,
  Bell,
  Mail,
  CheckSquare,
  Webhook,
  TrendingUp,
  Activity,
  Clock
} from 'lucide-react';
import { useWorkflow, WorkflowRule, WorkflowAction } from '@/hooks/use-workflow';
import { toast } from 'sonner';

export function WorkflowManager() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<WorkflowRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    triggerEntity: 'contact',
    triggerEvent: 'created',
    actionType: 'notification',
    actionConfig: {}
  });

  const {
    rules,
    executions,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    getStatistics
  } = useWorkflow();

  const stats = getStatistics();

  const handleCreateRule = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      triggerEntity: 'contact',
      triggerEvent: 'created',
      actionType: 'notification',
      actionConfig: {}
    });
    setDialogOpen(true);
  };

  const handleEditRule = (rule: WorkflowRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      description: rule.description,
      triggerEntity: rule.trigger.entity,
      triggerEvent: rule.trigger.event,
      actionType: rule.actions[0]?.type || 'notification',
      actionConfig: rule.actions[0]?.config || {}
    });
    setDialogOpen(true);
  };

  const handleSaveRule = () => {
    if (!formData.name.trim()) {
      toast.error('Nome da regra é obrigatório');
      return;
    }

    const action: WorkflowAction = {
      type: formData.actionType as any,
      config: formData.actionConfig
    };

    const ruleData = {
      name: formData.name,
      description: formData.description,
      trigger: {
        entity: formData.triggerEntity as any,
        event: formData.triggerEvent as any
      },
      actions: [action],
      isActive: true
    };

    if (editingRule) {
      updateRule(editingRule.id, ruleData);
    } else {
      createRule(ruleData);
    }

    setDialogOpen(false);
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Tem a certeza que deseja eliminar esta regra?')) {
      deleteRule(ruleId);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'notification':
        return <Bell className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      case 'webhook':
        return <Webhook className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'company':
        return '🏢';
      case 'contact':
        return '👤';
      case 'opportunity':
        return '🎯';
      case 'activity':
        return '📅';
      case 'invoice':
        return '🧾';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regras Ativas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRules}</div>
            <p className="text-xs text-muted-foreground">
              de {stats.totalRules} regras totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Execuções</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExecutions}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{stats.successRate.toFixed(1)}%</span> taxa de sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Últimas 24h</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentExecutions}</div>
            <p className="text-xs text-muted-foreground">execuções recentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.successfulExecutions}
            </div>
            <p className="text-xs text-muted-foreground">execuções bem-sucedidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Workflow Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Regras de Workflow</CardTitle>
              <CardDescription>
                Automatize processos e notificações baseadas em eventos do sistema
              </CardDescription>
            </div>
            <Button onClick={handleCreateRule}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Regra</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Ações</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Execuções</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {rule.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getEntityIcon(rule.trigger.entity)}</span>
                        <div>
                          <div className="text-sm font-medium capitalize">
                            {rule.trigger.entity} {rule.trigger.event}
                          </div>
                          {rule.trigger.conditions && (
                            <div className="text-xs text-muted-foreground">
                              Com condições
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {rule.actions.map((action, index) => (
                          <div key={index} className="flex items-center gap-1">
                            {getActionIcon(action.type)}
                            <span className="text-sm capitalize">{action.type}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{rule.triggerCount}</div>
                        {rule.lastTriggered && (
                          <div className="text-xs text-muted-foreground">
                            Última: {new Date(rule.lastTriggered).toLocaleDateString('pt-AO')}
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
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditRule(rule)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleRule(rule.id)}>
                            {rule.isActive ? (
                              <>
                                <Pause className="mr-2 h-4 w-4" />
                                Desativar
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Ativar
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteRule(rule.id)}
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
        </CardContent>
      </Card>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle>Execuções Recentes</CardTitle>
          <CardDescription>
            Histórico das últimas execuções de workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {executions.slice(0, 10).map((execution) => {
              const rule = rules.find(r => r.id === execution.ruleId);
              return (
                <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${execution.success ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-medium">{rule?.name || 'Regra Desconhecida'}</p>
                      <p className="text-sm text-muted-foreground">
                        {execution.entityType} #{execution.entityId} • {new Date(execution.executedAt).toLocaleString('pt-AO')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={execution.success ? "default" : "destructive"}>
                      {execution.success ? "Sucesso" : "Erro"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {execution.actions.length} ação(ões)
                    </span>
                  </div>
                </div>
              );
            })}
            
            {executions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Nenhuma execução ainda</p>
                <p className="text-xs">As execuções aparecerão aqui quando as regras forem ativadas</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Rule Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? 'Editar' : 'Criar'} Regra de Workflow
            </DialogTitle>
            <DialogDescription>
              Configure quando e como o sistema deve reagir a eventos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Regra *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome descritivo da regra"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o que esta regra faz..."
                  rows={2}
                />
              </div>
            </div>

            {/* Trigger Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Trigger (Quando Executar)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Entidade</Label>
                  <Select 
                    value={formData.triggerEntity} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, triggerEntity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">Empresa</SelectItem>
                      <SelectItem value="contact">Contacto</SelectItem>
                      <SelectItem value="opportunity">Oportunidade</SelectItem>
                      <SelectItem value="activity">Atividade</SelectItem>
                      <SelectItem value="invoice">Fatura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Evento</Label>
                  <Select 
                    value={formData.triggerEvent} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, triggerEvent: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created">Criado</SelectItem>
                      <SelectItem value="updated">Atualizado</SelectItem>
                      <SelectItem value="deleted">Eliminado</SelectItem>
                      <SelectItem value="status_changed">Estado Alterado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Ação (O que Fazer)</h3>
              
              <div className="space-y-2">
                <Label>Tipo de Ação</Label>
                <Select 
                  value={formData.actionType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, actionType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notification">Notificação</SelectItem>
                    <SelectItem value="email">Enviar Email</SelectItem>
                    <SelectItem value="task">Criar Tarefa</SelectItem>
                    <SelectItem value="webhook">Webhook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action-specific configuration */}
              {formData.actionType === 'notification' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Título da Notificação</Label>
                    <Input
                      value={formData.actionConfig.title || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        actionConfig: { ...prev.actionConfig, title: e.target.value }
                      }))}
                      placeholder="Título da notificação"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mensagem</Label>
                    <Textarea
                      value={formData.actionConfig.message || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        actionConfig: { ...prev.actionConfig, message: e.target.value }
                      }))}
                      placeholder="Mensagem da notificação (use {entityName} para nome da entidade)"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select 
                      value={formData.actionConfig.type || 'info'} 
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        actionConfig: { ...prev.actionConfig, type: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Informação</SelectItem>
                        <SelectItem value="success">Sucesso</SelectItem>
                        <SelectItem value="warning">Aviso</SelectItem>
                        <SelectItem value="error">Erro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {formData.actionType === 'task' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Assunto da Tarefa</Label>
                    <Input
                      value={formData.actionConfig.subject || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        actionConfig: { ...prev.actionConfig, subject: e.target.value }
                      }))}
                      placeholder="Assunto da tarefa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea
                      value={formData.actionConfig.description || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        actionConfig: { ...prev.actionConfig, description: e.target.value }
                      }))}
                      placeholder="Descrição da tarefa"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prioridade</Label>
                      <Select 
                        value={formData.actionConfig.priority || 'medium'} 
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          actionConfig: { ...prev.actionConfig, priority: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Vencimento (dias)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.actionConfig.dueInDays || '1'}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          actionConfig: { ...prev.actionConfig, dueInDays: parseInt(e.target.value) }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRule}>
              {editingRule ? 'Atualizar' : 'Criar'} Regra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}