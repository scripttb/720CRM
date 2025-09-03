"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckSquare, 
  Trash2, 
  Edit, 
  Mail, 
  Tag,
  Download,
  Upload,
  MoreHorizontal,
  Loader2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export interface BulkOperation {
  id: string;
  type: 'delete' | 'update' | 'export' | 'tag' | 'email' | 'assign';
  name: string;
  description: string;
  icon: React.ReactNode;
  requiresConfirmation: boolean;
  config?: Record<string, any>;
}

export interface BulkOperationProgress {
  operationId: string;
  total: number;
  completed: number;
  failed: number;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  errors: string[];
}

interface BulkOperationsProps<T> {
  items: T[];
  selectedItems: T[];
  onSelectionChange: (items: T[]) => void;
  operations: BulkOperation[];
  onOperationExecute: (operation: BulkOperation, items: T[]) => Promise<void>;
  getItemId: (item: T) => number;
  getItemName: (item: T) => string;
}

export function BulkOperations<T>({
  items,
  selectedItems,
  onSelectionChange,
  operations,
  onOperationExecute,
  getItemId,
  getItemName
}: BulkOperationsProps<T>) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<BulkOperation | null>(null);
  const [operationProgress, setOperationProgress] = useState<BulkOperationProgress | null>(null);

  const isAllSelected = items.length > 0 && selectedItems.length === items.length;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < items.length;

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items);
    }
  }, [items, isAllSelected, onSelectionChange]);

  const handleItemToggle = useCallback((item: T) => {
    const itemId = getItemId(item);
    const isSelected = selectedItems.some(selected => getItemId(selected) === itemId);
    
    if (isSelected) {
      onSelectionChange(selectedItems.filter(selected => getItemId(selected) !== itemId));
    } else {
      onSelectionChange([...selectedItems, item]);
    }
  }, [selectedItems, onSelectionChange, getItemId]);

  const handleOperationClick = (operation: BulkOperation) => {
    if (selectedItems.length === 0) {
      toast.error('Selecione pelo menos um item');
      return;
    }

    setSelectedOperation(operation);
    
    if (operation.requiresConfirmation) {
      setConfirmDialogOpen(true);
    } else {
      executeOperation(operation);
    }
  };

  const executeOperation = async (operation: BulkOperation) => {
    if (!operation || selectedItems.length === 0) return;

    const progress: BulkOperationProgress = {
      operationId: operation.id,
      total: selectedItems.length,
      completed: 0,
      failed: 0,
      status: 'running',
      startedAt: new Date(),
      errors: []
    };

    setOperationProgress(progress);
    setConfirmDialogOpen(false);

    try {
      // Simulate batch processing
      for (let i = 0; i < selectedItems.length; i++) {
        try {
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 200));
          
          progress.completed++;
          setOperationProgress({ ...progress });
        } catch (error) {
          progress.failed++;
          progress.errors.push(`Erro no item ${getItemName(selectedItems[i])}: ${error}`);
          setOperationProgress({ ...progress });
        }
      }

      // Execute the actual operation
      await onOperationExecute(operation, selectedItems);

      progress.status = 'completed';
      progress.completedAt = new Date();
      setOperationProgress({ ...progress });

      toast.success(`Operação "${operation.name}" concluída com sucesso`);
      
      // Clear selection after successful operation
      onSelectionChange([]);

      // Clear progress after delay
      setTimeout(() => {
        setOperationProgress(null);
      }, 3000);

    } catch (error) {
      progress.status = 'failed';
      progress.completedAt = new Date();
      setOperationProgress({ ...progress });
      
      toast.error(`Erro na operação: ${error}`);
    }
  };

  return (
    <>
      {/* Selection Controls */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllSelected}
              ref={(el) => {
                if (el) el.indeterminate = isPartiallySelected;
              }}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">
              {selectedItems.length > 0 
                ? `${selectedItems.length} de ${items.length} selecionados`
                : `Selecionar todos (${items.length})`
              }
            </span>
          </div>

          {selectedItems.length > 0 && (
            <Badge variant="secondary">
              {selectedItems.length} item(s) selecionado(s)
            </Badge>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2">
            {operations.slice(0, 3).map((operation) => (
              <Button
                key={operation.id}
                variant="outline"
                size="sm"
                onClick={() => handleOperationClick(operation)}
                disabled={!!operationProgress}
              >
                {operation.icon}
                {operation.name}
              </Button>
            ))}
            
            {operations.length > 3 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Mais Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {operations.slice(3).map((operation) => (
                    <DropdownMenuItem
                      key={operation.id}
                      onClick={() => handleOperationClick(operation)}
                    >
                      {operation.icon}
                      {operation.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Operation Progress */}
      {operationProgress && (
        <Alert>
          <div className="flex items-center gap-2">
            {operationProgress.status === 'running' && <Loader2 className="h-4 w-4 animate-spin" />}
            {operationProgress.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {operationProgress.status === 'failed' && <AlertTriangle className="h-4 w-4 text-red-600" />}
          </div>
          <AlertDescription>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Executando operação em lote...</span>
                <span className="text-sm">
                  {operationProgress.completed} / {operationProgress.total}
                </span>
              </div>
              <Progress 
                value={(operationProgress.completed / operationProgress.total) * 100} 
                className="w-full"
              />
              {operationProgress.failed > 0 && (
                <div className="text-sm text-red-600">
                  {operationProgress.failed} item(s) falharam
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Confirmar Operação
            </DialogTitle>
            <DialogDescription>
              Tem a certeza que deseja executar esta operação?
            </DialogDescription>
          </DialogHeader>

          {selectedOperation && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {selectedOperation.icon}
                  <span className="font-medium">{selectedOperation.name}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedOperation.description}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  Esta operação será aplicada a <strong>{selectedItems.length}</strong> item(s):
                </p>
                <div className="max-h-32 overflow-y-auto">
                  <ul className="text-sm space-y-1">
                    {selectedItems.slice(0, 10).map((item) => (
                      <li key={getItemId(item)} className="text-muted-foreground">
                        • {getItemName(item)}
                      </li>
                    ))}
                    {selectedItems.length > 10 && (
                      <li className="text-muted-foreground">
                        ... e mais {selectedItems.length - 10} item(s)
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {selectedOperation.type === 'delete' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Atenção:</strong> Esta ação não pode ser desfeita. 
                    Os itens selecionados serão permanentemente eliminados.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => selectedOperation && executeOperation(selectedOperation)}
              variant={selectedOperation?.type === 'delete' ? 'destructive' : 'default'}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook para usar operações em lote
export function useBulkOperations<T>() {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const selectAll = useCallback((items: T[]) => {
    setSelectedItems(items);
  }, []);

  const toggleItem = useCallback((item: T, getId: (item: T) => number) => {
    const itemId = getId(item);
    const isSelected = selectedItems.some(selected => getId(selected) === itemId);
    
    if (isSelected) {
      setSelectedItems(prev => prev.filter(selected => getId(selected) !== itemId));
    } else {
      setSelectedItems(prev => [...prev, item]);
    }
  }, [selectedItems]);

  return {
    selectedItems,
    setSelectedItems,
    clearSelection,
    selectAll,
    toggleItem
  };
}