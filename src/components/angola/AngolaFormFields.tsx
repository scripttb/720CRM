"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { angolaLocalization, angolaValidators } from '@/lib/angola-localization';
import { useTranslation } from '@/lib/angola-translations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface AngolaFormFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: string) => void;
  showValidation?: boolean;
}

export function AngolaFormFields({ formData, onFieldChange, showValidation = true }: AngolaFormFieldsProps) {
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const errors: Record<string, string> = { ...validationErrors };
    
    switch (field) {
      case 'bi_number':
        if (value && !angolaValidators.validateBI(value)) {
          errors[field] = t('messages.invalidBI');
        } else {
          delete errors[field];
        }
        break;
      case 'nif':
        if (value && !angolaValidators.validateNIF(value)) {
          errors[field] = t('messages.invalidNIF');
        } else {
          delete errors[field];
        }
        break;
      default:
        delete errors[field];
    }
    
    setValidationErrors(errors);
  };

  const handleFieldChange = (field: string, value: string) => {
    let formattedValue = value;
    
    // Formatação automática para campos específicos
    switch (field) {
      case 'bi_number':
        formattedValue = angolaValidators.formatBI(value);
        break;
      case 'nif':
        formattedValue = angolaValidators.formatNIF(value);
        break;
    }
    
    onFieldChange(field, formattedValue);
    
    if (showValidation) {
      validateField(field, formattedValue);
    }
  };

  return (
    <div className="space-y-4">
      {/* Campos de Documentação Angolana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bi_number">{t('fields.bi')}</Label>
          <Input
            id="bi_number"
            value={formData.bi_number || ''}
            onChange={(e) => handleFieldChange('bi_number', e.target.value)}
            placeholder={angolaLocalization.documents.types.BI.placeholder}
            className={validationErrors.bi_number ? 'border-red-500' : ''}
          />
          {validationErrors.bi_number && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {validationErrors.bi_number}
              </AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-muted-foreground">
            {angolaLocalization.documents.types.BI.description}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nif">{t('fields.nif')}</Label>
          <Input
            id="nif"
            value={formData.nif || ''}
            onChange={(e) => handleFieldChange('nif', e.target.value)}
            placeholder={angolaLocalization.documents.types.NIF.placeholder}
            className={validationErrors.nif ? 'border-red-500' : ''}
          />
          {validationErrors.nif && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {validationErrors.nif}
              </AlertDescription>
            </Alert>
          )}
          <p className="text-xs text-muted-foreground">
            {angolaLocalization.documents.types.NIF.description}
          </p>
        </div>
      </div>

      {/* Localização Angolana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="province">{t('fields.province')}</Label>
          <Select 
            value={formData.province || ''} 
            onValueChange={(value) => onFieldChange('province', value)}
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
          <Label htmlFor="municipality">{t('fields.municipality')}</Label>
          <Input
            id="municipality"
            value={formData.municipality || ''}
            onChange={(e) => onFieldChange('municipality', e.target.value)}
            placeholder={t('fields.municipality')}
          />
        </div>
      </div>

      {/* Nacionalidade (padrão Angola) */}
      <div className="space-y-2">
        <Label htmlFor="nationality">{t('fields.nationality')}</Label>
        <Input
          id="nationality"
          value={formData.nationality || 'Angolana'}
          onChange={(e) => onFieldChange('nationality', e.target.value)}
          placeholder="Angolana"
        />
      </div>

      {/* Campos específicos para empresas */}
      {formData.hasOwnProperty('alvara_number') && (
        <>
          <div className="space-y-2">
            <Label htmlFor="alvara_number">{t('fields.alvara')}</Label>
            <Input
              id="alvara_number"
              value={formData.alvara_number || ''}
              onChange={(e) => onFieldChange('alvara_number', e.target.value)}
              placeholder={angolaLocalization.documents.types.ALVARA.placeholder}
            />
            <p className="text-xs text-muted-foreground">
              {angolaLocalization.documents.types.ALVARA.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tax_regime">{t('fields.taxRegime')}</Label>
            <Select 
              value={formData.tax_regime || ''} 
              onValueChange={(value) => onFieldChange('tax_regime', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('messages.selectOption')} />
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
        </>
      )}

      {/* Sector de Actividade */}
      {formData.hasOwnProperty('industry') && (
        <div className="space-y-2">
          <Label htmlFor="industry">{t('fields.industry')}</Label>
          <Select 
            value={formData.industry || ''} 
            onValueChange={(value) => onFieldChange('industry', value)}
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
      )}

      {/* Dimensão da Empresa */}
      {formData.hasOwnProperty('size') && (
        <div className="space-y-2">
          <Label htmlFor="size">{t('fields.size')}</Label>
          <Select 
            value={formData.size || ''} 
            onValueChange={(value) => onFieldChange('size', value)}
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
      )}
    </div>
  );
}
