"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api-client';
import { Activity, Company, Contact, Opportunity } from '@/types/crm';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/angola-translations';
import { AngolaDateTimePicker } from '@/components/angola/AngolaDateTimePicker';

interface ActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activity: Activity | null;
  onSave: (activity: Activity) => void;
}

interface ActivityFormData {
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  subject: string;
  description: string;
  company_id?: number;
  contact_id?: number;
  opportunity_id?: number;
  status: 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: Date;
  duration_minutes: number;
  location: string;
}

export function ActivityDialog({ 
  open, 
  onOpenChange, 
  activity, 
  onSave 
}: ActivityDialogProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [formData, setFormData] = useState<ActivityFormData>({
    type: 'task',
    subject: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    duration_minutes: 30,
    location: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [companiesData, contactsData, opportunitiesData] = await Promise.all([
        api.get<Company[]>('/companies'),
        api.get<Contact[]>('/contacts'),
        api.get<Opportunity[]>('/opportunities')
      ]);
      setCompanies(companiesData);
      setContacts(contactsData);
      setOpportunities(opportunitiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, fetchData]);

  // Reset form when dialog opens/closes or activity changes
  useEffect(() => {
    if (open) {
      if (activity) {
        setFormData({
          type: activity.type,
          subject: activity.subject,
          description: activity.description || '',
          company_id: activity.company_id,
          contact_id: activity.contact_id,
          opportunity_id: activity.opportunity_id,
          status: activity.status,
          priority: activity.priority,
          due_date: activity.due_date ? new Date(activity.due_date) : undefined,
          duration_minutes: activity.duration_minutes || 30,
          location: activity.location || '',
        });
      } else {
        setFormData({
          type: 'task',
          subject: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          duration_minutes: 30,
          location: '',
        });
      }
    }
  }, [open, activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim()) {
      toast.error('Assunto é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        due_date: formData.due_date?.toISOString(),
        assigned_user_id: 1, // Current user
        created_by_user_id: 1, // Current user
      };

      let savedActivity: Activity;
      
      if (activity) {
        // Update existing activity
        savedActivity = await api.put<Activity>(`/activities?id=${activity.id}`, submitData);
      } else {
        // Create new activity
        savedActivity = await api.post<Activity>('/activities', submitData);
      }
      
      onSave(savedActivity);
    } catch (error) {
      toast.error(activity ? 'Erro ao actualizar actividade' : 'Erro ao criar actividade');
      console.error('Error saving activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ActivityFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter contacts by selected company
  const filteredContacts = formData.company_id 
    ? contacts.filter(c => c.company_id === formData.company_id)
    : contacts;

  // Filter opportunities by selected company
  const filteredOpportunities = formData.company_id 
    ? opportunities.filter(o => o.company_id === formData.company_id)
    : opportunities;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {activity ? 'Editar' : 'Criar'} Actividade
          </DialogTitle>
          <DialogDescription>
            {activity 
              ? 'Actualize as informações da actividade abaixo.'
              : 'Adicione uma nova actividade ao seu calendário.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Actividade *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: 'call' | 'email' | 'meeting' | 'task' | 'note') => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Chamada</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Reunião</SelectItem>
                    <SelectItem value="task">Tarefa</SelectItem>
                    <SelectItem value="note">Nota</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => handleInputChange('priority', value)}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Assunto *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Assunto da actividade"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrição detalhada da actividade..."
                rows={3}
              />
            </div>
          </div>

          {/* Related Records */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Relacionamentos</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Select 
                  value={formData.company_id?.toString() || ''} 
                  onValueChange={(value) => {
                    const companyId = value ? parseInt(value) : undefined;
                    handleInputChange('company_id', companyId);
                    // Reset related fields when company changes
                    handleInputChange('contact_id', undefined);
                    handleInputChange('opportunity_id', undefined);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma empresa</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contacto</Label>
                <Select 
                  value={formData.contact_id?.toString() || ''} 
                  onValueChange={(value) => handleInputChange('contact_id', value ? parseInt(value) : undefined)}
                  disabled={!formData.company_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar contacto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum contacto</SelectItem>
                    {filteredContacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id.toString()}>
                        {contact.first_name} {contact.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="opportunity">Oportunidade</Label>
                <Select 
                  value={formData.opportunity_id?.toString() || ''} 
                  onValueChange={(value) => handleInputChange('opportunity_id', value ? parseInt(value) : undefined)}
                  disabled={!formData.company_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar oportunidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma oportunidade</SelectItem>
                    {filteredOpportunities.map((opportunity) => (
                      <SelectItem key={opportunity.id} value={opportunity.id.toString()}>
                        {opportunity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Agendamento</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="due_date">Data e Hora</Label>
                <AngolaDateTimePicker
                  date={formData.due_date}
                  onDateChange={(date) => handleInputChange('due_date', date)}
                  placeholder="Seleccionar data"
                  showTime={true}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration_minutes || ''}
                  onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value) || 30)}
                  placeholder="30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'pending' | 'completed' | 'cancelled') => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Escritório, endereço, ou plataforma online"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {activity ? 'Actualizar Actividade' : 'Criar Actividade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}