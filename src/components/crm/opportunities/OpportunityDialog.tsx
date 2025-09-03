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
import { Opportunity, Company, Contact, PipelineStage } from '@/types/crm';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/angola-translations';
import { AngolaDateTimePicker } from '@/components/angola/AngolaDateTimePicker';
import { KwanzaInput } from '@/components/angola/KwanzaCurrencyDisplay';

interface OpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: Opportunity | null;
  onSave: (opportunity: Opportunity) => void;
}

interface OpportunityFormData {
  name: string;
  company_id?: number;
  contact_id?: number;
  pipeline_stage_id?: number;
  value: number;
  currency: string;
  probability: number;
  expected_close_date?: Date;
  source: string;
  description: string;
  status: 'open' | 'won' | 'lost';
}

export function OpportunityDialog({ 
  open, 
  onOpenChange, 
  opportunity, 
  onSave 
}: OpportunityDialogProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [formData, setFormData] = useState<OpportunityFormData>({
    name: '',
    value: 0,
    currency: 'AOA',
    probability: 0,
    source: '',
    description: '',
    status: 'open',
  });

  const fetchCompanies = useCallback(async () => {
    try {
      const data = await api.get<Company[]>('/companies');
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    try {
      const data = await api.get<Contact[]>('/contacts');
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }, []);

  const fetchPipelineStages = useCallback(async () => {
    try {
      const data = await api.get<PipelineStage[]>('/pipeline-stages');
      setPipelineStages(data);
    } catch (error) {
      console.error('Error fetching pipeline stages:', error);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchCompanies();
      fetchContacts();
      fetchPipelineStages();
    }
  }, [open, fetchCompanies, fetchContacts, fetchPipelineStages]);

  // Reset form when dialog opens/closes or opportunity changes
  useEffect(() => {
    if (open) {
      if (opportunity) {
        setFormData({
          name: opportunity.name,
          company_id: opportunity.company_id,
          contact_id: opportunity.contact_id,
          pipeline_stage_id: opportunity.pipeline_stage_id,
          value: opportunity.value || 0,
          currency: opportunity.currency || 'AOA',
          probability: opportunity.probability || 0,
          expected_close_date: opportunity.expected_close_date ? new Date(opportunity.expected_close_date) : undefined,
          source: opportunity.source || '',
          description: opportunity.description || '',
          status: opportunity.status,
        });
      } else {
        setFormData({
          name: '',
          value: 0,
          currency: 'AOA',
          probability: 0,
          source: '',
          description: '',
          status: 'open',
        });
      }
    }
  }, [open, opportunity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(`${t('fields.name')} é obrigatório`);
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        expected_close_date: formData.expected_close_date?.toISOString().split('T')[0],
      };

      let savedOpportunity: Opportunity;
      
      if (opportunity) {
        // Update existing opportunity
        savedOpportunity = await api.put<Opportunity>(`/opportunities?id=${opportunity.id}`, submitData);
      } else {
        // Create new opportunity
        savedOpportunity = await api.post<Opportunity>('/opportunities', submitData);
      }
      
      onSave(savedOpportunity);
    } catch (error) {
      toast.error(opportunity ? t('messages.saveError') : t('messages.saveError'));
      console.error('Error saving opportunity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof OpportunityFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter contacts by selected company
  const filteredContacts = formData.company_id 
    ? contacts.filter(c => c.company_id === formData.company_id)
    : contacts;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {opportunity ? t('actions.edit') : t('actions.create')} Oportunidade
          </DialogTitle>
          <DialogDescription>
            {opportunity 
              ? 'Actualize as informações da oportunidade abaixo.'
              : 'Adicione uma nova oportunidade ao seu pipeline de vendas.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Oportunidade *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nome da oportunidade"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Select 
                  value={formData.company_id?.toString() || ''} 
                  onValueChange={(value) => {
                    const companyId = value ? parseInt(value) : undefined;
                    handleInputChange('company_id', companyId);
                    // Reset contact when company changes
                    if (formData.contact_id) {
                      handleInputChange('contact_id', undefined);
                    }
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
            </div>
          </div>

          {/* Sales Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Valor (Kz)</Label>
                <KwanzaInput
                  value={formData.value}
                  onChange={(value) => handleInputChange('value', value)}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="probability">Probabilidade (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability || ''}
                  onChange={(e) => handleInputChange('probability', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pipeline_stage">Fase do Pipeline</Label>
                <Select 
                  value={formData.pipeline_stage_id?.toString() || ''} 
                  onValueChange={(value) => handleInputChange('pipeline_stage_id', value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar fase" />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelineStages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id.toString()}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_close_date">Data de Fecho Esperada</Label>
                <AngolaDateTimePicker
                  date={formData.expected_close_date}
                  onDateChange={(date) => handleInputChange('expected_close_date', date)}
                  placeholder="Seleccionar data"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source">Fonte</Label>
                <Select 
                  value={formData.source} 
                  onValueChange={(value) => handleInputChange('source', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar fonte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Sítio Web</SelectItem>
                    <SelectItem value="referral">Referência</SelectItem>
                    <SelectItem value="social_media">Redes Sociais</SelectItem>
                    <SelectItem value="email_campaign">Campanha de Email</SelectItem>
                    <SelectItem value="cold_call">Chamada Fria</SelectItem>
                    <SelectItem value="trade_show">Feira Comercial</SelectItem>
                    <SelectItem value="partner">Parceiro</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'open' | 'won' | 'lost') => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Aberto</SelectItem>
                    <SelectItem value="won">Ganho</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição detalhada da oportunidade..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('actions.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {opportunity ? 'Actualizar Oportunidade' : 'Criar Oportunidade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}