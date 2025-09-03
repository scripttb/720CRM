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
  Calendar,
  Phone,
  Mail,
  Users,
  CheckSquare,
  FileText,
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Activity } from '@/types/crm';
import { useActivities } from '@/hooks/use-activities';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/angola-translations';
import { ActivityDialog } from './ActivityDialog';

export function ActivitiesList() {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const {
    activities,
    loading,
    searchQuery,
    filters,
    setSearchQuery,
    setFilters,
    deleteActivity,
    markAsCompleted
  } = useActivities();

  const handleCreateActivity = () => {
    setEditingActivity(null);
    setDialogOpen(true);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setDialogOpen(true);
  };

  const handleDeleteActivity = async (activityId: number) => {
    if (!confirm('Tem a certeza que deseja eliminar esta actividade?')) {
      return;
    }

    try {
      await deleteActivity(activityId);
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleMarkAsCompleted = async (activityId: number) => {
    try {
      await markAsCompleted(activityId);
    } catch (error) {
      console.error('Error marking activity as completed:', error);
    }
  };
  const handleActivitySaved = (savedActivity: Activity) => {
    setDialogOpen(false);
    setEditingActivity(null);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      case 'note':
        return <FileText className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600">Pendente</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600">Concluída</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgente</Badge>;
      case 'high':
        return <Badge variant="outline" className="text-red-600">Alta</Badge>;
      case 'medium':
        return <Badge variant="outline" className="text-yellow-600">Média</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-green-600">Baixa</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'Não definida';
    return new Date(dateString).toLocaleString('pt-AO');
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = !searchQuery || 
      activity.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar actividades por assunto ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="call">Chamada</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="meeting">Reunião</SelectItem>
              <SelectItem value="task">Tarefa</SelectItem>
              <SelectItem value="note">Nota</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Estados</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleCreateActivity}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Actividade
          </Button>
        </div>
      </div>

      {/* Activities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Actividades ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhuma actividade encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || filters.type !== 'all' || filters.status !== 'all'
                  ? 'Tente ajustar a sua pesquisa ou filtros'
                  : 'Comece por criar a sua primeira actividade'
                }
              </p>
              {!searchQuery && filters.type === 'all' && filters.status === 'all' && (
                <Button onClick={handleCreateActivity} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Actividade
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Actividade</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Data de Vencimento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{activity.subject}</div>
                          {activity.description && (
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {activity.description}
                            </div>
                          )}
                          {activity.location && (
                            <div className="text-sm text-muted-foreground">
                              📍 {activity.location}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActivityIcon(activity.type)}
                          <span className="capitalize">{activity.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(activity.priority)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {activity.due_date ? formatDateTime(activity.due_date) : 'Não definida'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(activity.status)}
                      </TableCell>
                      <TableCell>
                        {activity.duration_minutes ? `${activity.duration_minutes} min` : 'Não definida'}
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
                            {activity.status === 'pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleMarkAsCompleted(activity.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Marcar como Concluída
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem onClick={() => handleEditActivity(activity)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteActivity(activity.id)}
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

      {/* Activity Dialog */}
      <ActivityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        activity={editingActivity}
        onSave={handleActivitySaved}
      />
    </div>
  );
}