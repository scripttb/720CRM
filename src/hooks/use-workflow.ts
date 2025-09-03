import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useNotifications } from './use-notifications';

export interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  trigger: {
    entity: 'company' | 'contact' | 'opportunity' | 'activity' | 'invoice';
    event: 'created' | 'updated' | 'deleted' | 'status_changed';
    conditions?: Record<string, any>;
  };
  actions: WorkflowAction[];
  isActive: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  triggerCount: number;
}

export interface WorkflowAction {
  type: 'notification' | 'email' | 'task' | 'update_field' | 'webhook';
  config: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  ruleId: string;
  entityType: string;
  entityId: number;
  executedAt: Date;
  success: boolean;
  error?: string;
  actions: {
    type: string;
    success: boolean;
    result?: any;
    error?: string;
  }[];
}

const defaultWorkflowRules: WorkflowRule[] = [
  {
    id: 'welcome-new-contact',
    name: 'Bem-vindo a Novo Contacto',
    description: 'Enviar notificação quando um novo contacto é adicionado',
    trigger: {
      entity: 'contact',
      event: 'created'
    },
    actions: [
      {
        type: 'notification',
        config: {
          title: 'Novo contacto adicionado',
          message: 'Um novo contacto foi adicionado ao sistema',
          type: 'info'
        }
      },
      {
        type: 'task',
        config: {
          subject: 'Contactar novo cliente',
          description: 'Fazer primeiro contacto com o novo cliente',
          priority: 'medium',
          dueInDays: 1
        }
      }
    ],
    isActive: true,
    createdAt: new Date(),
    triggerCount: 0
  },
  {
    id: 'opportunity-closing-soon',
    name: 'Oportunidade Prestes a Vencer',
    description: 'Alertar quando oportunidade tem data de fecho em 7 dias',
    trigger: {
      entity: 'opportunity',
      event: 'updated',
      conditions: {
        daysUntilClose: 7
      }
    },
    actions: [
      {
        type: 'notification',
        config: {
          title: 'Oportunidade prestes a vencer',
          message: 'Uma oportunidade tem data de fecho em 7 dias',
          type: 'warning'
        }
      }
    ],
    isActive: true,
    createdAt: new Date(),
    triggerCount: 0
  },
  {
    id: 'invoice-paid',
    name: 'Fatura Paga',
    description: 'Notificar quando uma fatura é marcada como paga',
    trigger: {
      entity: 'invoice',
      event: 'status_changed',
      conditions: {
        newStatus: 'paid'
      }
    },
    actions: [
      {
        type: 'notification',
        config: {
          title: 'Fatura paga',
          message: 'Uma fatura foi marcada como paga',
          type: 'success'
        }
      }
    ],
    isActive: true,
    createdAt: new Date(),
    triggerCount: 0
  }
];

export function useWorkflow() {
  const [rules, setRules] = useState<WorkflowRule[]>(() => {
    const saved = localStorage.getItem('crm_workflow_rules');
    return saved ? JSON.parse(saved) : defaultWorkflowRules;
  });
  
  const [executions, setExecutions] = useState<WorkflowExecution[]>(() => {
    const saved = localStorage.getItem('crm_workflow_executions');
    return saved ? JSON.parse(saved) : [];
  });

  const { addNotification } = useNotifications();

  // Save rules to localStorage
  const saveRules = useCallback((newRules: WorkflowRule[]) => {
    setRules(newRules);
    localStorage.setItem('crm_workflow_rules', JSON.stringify(newRules));
  }, []);

  // Save executions to localStorage
  const saveExecutions = useCallback((newExecutions: WorkflowExecution[]) => {
    setExecutions(newExecutions);
    localStorage.setItem('crm_workflow_executions', JSON.stringify(newExecutions));
  }, []);

  // Execute workflow actions
  const executeActions = useCallback(async (actions: WorkflowAction[], context: any) => {
    const results = [];
    
    for (const action of actions) {
      try {
        let result;
        
        switch (action.type) {
          case 'notification':
            addNotification({
              type: action.config.type || 'info',
              title: action.config.title,
              message: action.config.message.replace('{entityName}', context.entityName || 'Item'),
              priority: action.config.priority || 'medium'
            });
            result = { notificationSent: true };
            break;
            
          case 'task':
            // Create a task (would integrate with activities)
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + (action.config.dueInDays || 1));
            
            result = {
              taskCreated: true,
              task: {
                subject: action.config.subject,
                description: action.config.description,
                priority: action.config.priority,
                due_date: dueDate.toISOString()
              }
            };
            break;
            
          case 'email':
            // Simulate email sending
            result = { emailSent: true, recipient: action.config.recipient };
            break;
            
          default:
            result = { executed: true };
        }
        
        results.push({
          type: action.type,
          success: true,
          result
        });
      } catch (error) {
        results.push({
          type: action.type,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return results;
  }, [addNotification]);

  // Trigger workflow
  const triggerWorkflow = useCallback(async (
    entityType: string,
    event: string,
    entityData: any
  ) => {
    const matchingRules = rules.filter(rule => 
      rule.isActive &&
      rule.trigger.entity === entityType &&
      rule.trigger.event === event
    );

    for (const rule of matchingRules) {
      try {
        // Check conditions if any
        let shouldExecute = true;
        if (rule.trigger.conditions) {
          // Simple condition checking (can be expanded)
          for (const [key, value] of Object.entries(rule.trigger.conditions)) {
            if (key === 'daysUntilClose' && entityData.expected_close_date) {
              const closeDate = new Date(entityData.expected_close_date);
              const today = new Date();
              const daysUntil = Math.ceil((closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              shouldExecute = daysUntil <= value;
            } else if (key === 'newStatus') {
              shouldExecute = entityData.status === value;
            }
          }
        }

        if (shouldExecute) {
          const context = {
            entityName: entityData.name || entityData.document_number || `${entityType} #${entityData.id}`,
            entityType,
            entityData
          };

          const actionResults = await executeActions(rule.actions, context);
          
          // Record execution
          const execution: WorkflowExecution = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ruleId: rule.id,
            entityType,
            entityId: entityData.id,
            executedAt: new Date(),
            success: actionResults.every(r => r.success),
            actions: actionResults
          };

          setExecutions(prev => {
            const newExecutions = [execution, ...prev.slice(0, 99)]; // Keep last 100
            saveExecutions(newExecutions);
            return newExecutions;
          });

          // Update rule trigger count
          setRules(prev => {
            const newRules = prev.map(r => 
              r.id === rule.id 
                ? { ...r, triggerCount: r.triggerCount + 1, lastTriggered: new Date() }
                : r
            );
            saveRules(newRules);
            return newRules;
          });
        }
      } catch (error) {
        console.error(`Error executing workflow rule ${rule.id}:`, error);
      }
    }
  }, [rules, executeActions, saveRules, saveExecutions]);

  // Create new rule
  const createRule = useCallback((ruleData: Omit<WorkflowRule, 'id' | 'createdAt' | 'triggerCount'>) => {
    const newRule: WorkflowRule = {
      ...ruleData,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      triggerCount: 0
    };

    const newRules = [newRule, ...rules];
    saveRules(newRules);
    toast.success('Regra de workflow criada com sucesso');
    return newRule;
  }, [rules, saveRules]);

  // Update rule
  const updateRule = useCallback((ruleId: string, updates: Partial<WorkflowRule>) => {
    const newRules = rules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    saveRules(newRules);
    toast.success('Regra de workflow atualizada');
  }, [rules, saveRules]);

  // Delete rule
  const deleteRule = useCallback((ruleId: string) => {
    const newRules = rules.filter(rule => rule.id !== ruleId);
    saveRules(newRules);
    toast.success('Regra de workflow eliminada');
  }, [rules, saveRules]);

  // Toggle rule active status
  const toggleRule = useCallback((ruleId: string) => {
    const newRules = rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    );
    saveRules(newRules);
  }, [rules, saveRules]);

  // Get statistics
  const getStatistics = useCallback(() => {
    const activeRules = rules.filter(r => r.isActive).length;
    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter(e => e.success).length;
    const recentExecutions = executions.filter(e => 
      new Date(e.executedAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length;

    return {
      totalRules: rules.length,
      activeRules,
      totalExecutions,
      successfulExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0,
      recentExecutions
    };
  }, [rules, executions]);

  return {
    rules,
    executions,
    triggerWorkflow,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    getStatistics
  };
}