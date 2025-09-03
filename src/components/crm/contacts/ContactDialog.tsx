"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Contact, Company } from '@/types/crm';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AngolaFormFields } from '@/components/angola/AngolaFormFields';
import { useTranslation } from '@/lib/angola-translations';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  companies: Company[];
  onSave: (contact: Contact) => void;
}

interface ContactFormData {
  company_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  job_title: string;
  department: string;
  is_primary: boolean;
  linkedin_url: string;
  notes: string;
  bi_number: string;
  nif: string;
  nationality: string;
  province?: string;
  municipality?: string;
}

export function ContactDialog({ 
  open, 
  onOpenChange, 
  contact, 
  companies, 
  onSave 
}: ContactDialogProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    mobile: '',
    job_title: '',
    department: '',
    is_primary: false,
    linkedin_url: '',
    notes: '',
    bi_number: '',
    nif: '',
    nationality: 'Angolana',
  });

  // Reset form when dialog opens/closes or contact changes
  useEffect(() => {
    if (open) {
      if (contact) {
        setFormData({
          company_id: contact.company_id,
          first_name: contact.first_name,
          last_name: contact.last_name,
          email: contact.email || '',
          phone: contact.phone || '',
          mobile: contact.mobile || '',
          job_title: contact.job_title || '',
          department: contact.department || '',
          is_primary: contact.is_primary,
          linkedin_url: contact.linkedin_url || '',
          notes: contact.notes || '',
          bi_number: (contact as any).bi_number || '',
          nif: (contact as any).nif || '',
          nationality: (contact as any).nationality || 'Angolana',
          province: (contact as any).province || '',
          municipality: (contact as any).municipality || '',
        });
      } else {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          mobile: '',
          job_title: '',
          department: '',
          is_primary: false,
          linkedin_url: '',
          notes: '',
          bi_number: '',
          nif: '',
          nationality: 'Angolana',
        });
      }
    }
  }, [open, contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast.error(`${t('fields.firstName')} e ${t('fields.lastName')} são obrigatórios`);
      return;
    }

    setLoading(true);
    try {
      let savedContact: Contact;
      
      if (contact) {
        // Update existing contact
        savedContact = await api.put<Contact>(`/contacts?id=${contact.id}`, formData);
      } else {
        // Create new contact
        savedContact = await api.post<Contact>('/contacts', formData);
      }
      
      onSave(savedContact);
    } catch (error) {
      toast.error(contact ? t('messages.saveError') : t('messages.saveError'));
      console.error('Error saving contact:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAngolaFieldChange = (field: string, value: string) => {
    // Type-safe handler for Angola form fields
    if (field in formData) {
      handleInputChange(field as keyof ContactFormData, value);
    }
  };

  const handleCompanyChange = (value: string) => {
    if (value === '') {
      // Remove company_id from formData when empty string is selected
      const { company_id, ...rest } = formData;
      setFormData(rest);
    } else {
      handleInputChange('company_id', parseInt(value));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {contact ? t('actions.edit') : t('actions.create')} {t('navigation.contacts').slice(0, -1)}
          </DialogTitle>
          <DialogDescription>
            {contact 
              ? 'Actualize as informações do contacto abaixo.'
              : 'Adicione um novo contacto ao seu sistema CRM.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Selection */}
          <div className="space-y-2">
            <Label htmlFor="company">{t('navigation.companies').slice(0, -1)}</Label>
            <Select 
              value={formData.company_id?.toString() || ''} 
              onValueChange={handleCompanyChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={`${t('actions.select')} uma empresa (opcional)`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhuma Empresa</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t('fields.firstName')} *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                placeholder={`Insira o ${t('fields.firstName').toLowerCase()}`}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">{t('fields.lastName')} *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                placeholder={`Insira o ${t('fields.lastName').toLowerCase()}`}
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('fields.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={`Insira o ${t('fields.email').toLowerCase()}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('fields.phone')}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Insira o número de telefone"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">{t('fields.mobile')}</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="Insira o número de telemóvel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="job_title">{t('fields.jobTitle')}</Label>
              <Input
                id="job_title"
                value={formData.job_title}
                onChange={(e) => handleInputChange('job_title', e.target.value)}
                placeholder={`Insira o ${t('fields.jobTitle').toLowerCase()}`}
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">{t('fields.department')}</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder={`Insira o ${t('fields.department').toLowerCase()}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                value={formData.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          {/* Angola-specific fields */}
          <AngolaFormFields
            formData={formData}
            onFieldChange={handleAngolaFieldChange}
            showValidation={true}
          />

          {/* Primary Contact Switch */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_primary"
              checked={formData.is_primary}
              onCheckedChange={(checked) => handleInputChange('is_primary', checked)}
            />
            <Label htmlFor="is_primary">Contacto principal desta empresa</Label>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('fields.notes')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Adicione observações sobre este contacto..."
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
              {contact ? `${t('actions.edit')} Contacto` : `${t('actions.create')} Contacto`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
