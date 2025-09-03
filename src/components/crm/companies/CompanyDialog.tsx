"use client";

import { useState, useEffect } from 'react';
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
import { Company } from '@/types/crm';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AngolaFormFields } from '@/components/angola/AngolaFormFields';
import { useTranslation } from '@/lib/angola-translations';
import { angolaLocalization } from '@/lib/angola-localization';

interface CompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
  onSave: (company: Company) => void;
}

interface CompanyFormData {
  name: string;
  industry: string;
  size: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  description: string;
  annual_revenue: number;
  employee_count: number;
  nif: string;
  alvara_number: string;
  tax_regime: string;
  province: string;
  municipality: string;
}

export function CompanyDialog({ 
  open, 
  onOpenChange, 
  company, 
  onSave 
}: CompanyDialogProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    industry: '',
    size: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: 'Angola',
    postal_code: '',
    description: '',
    annual_revenue: 0,
    employee_count: 0,
    nif: '',
    alvara_number: '',
    tax_regime: '',
    province: '',
    municipality: '',
  });

  // Reset form when dialog opens/closes or company changes
  useEffect(() => {
    if (open) {
      if (company) {
        setFormData({
          name: company.name,
          industry: company.industry || '',
          size: company.size || '',
          website: company.website || '',
          phone: company.phone || '',
          email: company.email || '',
          address: company.address || '',
          city: company.city || '',
          state: company.state || '',
          country: company.country || 'Angola',
          postal_code: company.postal_code || '',
          description: company.description || '',
          annual_revenue: company.annual_revenue || 0,
          employee_count: company.employee_count || 0,
          nif: (company as any).nif || '',
          alvara_number: (company as any).alvara_number || '',
          tax_regime: (company as any).tax_regime || '',
          province: (company as any).province || '',
          municipality: (company as any).municipality || '',
        });
      } else {
        setFormData({
          name: '',
          industry: '',
          size: '',
          website: '',
          phone: '',
          email: '',
          address: '',
          city: '',
          state: '',
          country: 'Angola',
          postal_code: '',
          description: '',
          annual_revenue: 0,
          employee_count: 0,
          nif: '',
          alvara_number: '',
          tax_regime: '',
          province: '',
          municipality: '',
        });
      }
    }
  }, [open, company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error(`${t('fields.name')} é obrigatório`);
      return;
    }

    setLoading(true);
    try {
      let savedCompany: Company;
      
      if (company) {
        // Update existing company
        savedCompany = await api.put<Company>(`/companies?id=${company.id}`, formData);
      } else {
        // Create new company
        savedCompany = await api.post<Company>('/companies', formData);
      }
      
      onSave(savedCompany);
    } catch (error) {
      toast.error(company ? t('messages.saveError') : t('messages.saveError'));
      console.error('Error saving company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CompanyFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAngolaFieldChange = (field: string, value: string) => {
    if (field in formData) {
      handleInputChange(field as keyof CompanyFormData, value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {company ? t('actions.edit') : t('actions.create')} {t('navigation.companies').slice(0, -1)}
          </DialogTitle>
          <DialogDescription>
            {company 
              ? 'Actualize as informações da empresa abaixo.'
              : 'Adicione uma nova empresa ao seu sistema CRM.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fields.name')} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome da empresa"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('fields.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@empresa.ao"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('fields.phone')}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+244-222-000-000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">{t('fields.website')}</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://empresa.ao"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Empresariais</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">{t('fields.industry')}</Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => handleInputChange('industry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('messages.selectOption')} />
                  </SelectTrigger>
                  <SelectContent>
                    {angolaLocalization.industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">{t('fields.size')}</Label>
                <Select 
                  value={formData.size} 
                  onValueChange={(value) => handleInputChange('size', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('messages.selectOption')} />
                  </SelectTrigger>
                  <SelectContent>
                    {angolaLocalization.businessSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="annual_revenue">Receita Anual (Kz)</Label>
                <Input
                  id="annual_revenue"
                  type="number"
                  value={formData.annual_revenue || ''}
                  onChange={(e) => handleInputChange('annual_revenue', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee_count">Número de Funcionários</Label>
                <Input
                  id="employee_count"
                  type="number"
                  value={formData.employee_count || ''}
                  onChange={(e) => handleInputChange('employee_count', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações de Localização</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address">{t('fields.address')}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua, número, bairro"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t('fields.city')}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Luanda"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">{t('fields.province')}</Label>
                <Select 
                  value={formData.province} 
                  onValueChange={(value) => handleInputChange('province', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('messages.selectOption')} />
                  </SelectTrigger>
                  <SelectContent>
                    {angolaLocalization.provinces.map((province) => (
                      <SelectItem key={province} value={province}>
                        {province}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">{t('fields.postalCode')}</Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  placeholder="1000"
                />
              </div>
            </div>
          </div>

          {/* Angola-specific fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Documentação Angolana</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nif">NIF</Label>
                <Input
                  id="nif"
                  value={formData.nif}
                  onChange={(e) => handleInputChange('nif', e.target.value)}
                  placeholder="123456789"
                />
                <p className="text-xs text-muted-foreground">
                  Número de Identificação Fiscal (9 dígitos)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alvara_number">Alvará</Label>
                <Input
                  id="alvara_number"
                  value={formData.alvara_number}
                  onChange={(e) => handleInputChange('alvara_number', e.target.value)}
                  placeholder="ALV/2024/001"
                />
                <p className="text-xs text-muted-foreground">
                  Alvará de funcionamento comercial
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_regime">Regime Fiscal</Label>
              <Select 
                value={formData.tax_regime} 
                onValueChange={(value) => handleInputChange('tax_regime', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar regime" />
                </SelectTrigger>
                <SelectContent>
                  {angolaLocalization.taxRegimes.map((regime) => (
                    <SelectItem key={regime} value={regime}>
                      {regime}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('fields.description')}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descrição da empresa e suas actividades..."
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
              {company ? `${t('actions.edit')} Empresa` : `${t('actions.create')} Empresa`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}