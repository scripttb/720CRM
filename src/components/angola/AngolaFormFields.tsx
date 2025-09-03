"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { angolaLocalization } from '@/lib/angola-localization';
import { validateAngolaDocument, formatDocument, angolaAddressUtils } from '@/lib/angola-utils';
import { useTranslation } from '@/lib/angola-translations';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AngolaFormFieldsProps {
  formData: any;
  onFieldChange: (field: string, value: string) => void;
  showValidation?: boolean;
  fieldPrefix?: string;
}

export function AngolaFormFields({ 
  formData, 
  onFieldChange, 
  showValidation = true,
  fieldPrefix = ''
}: AngolaFormFieldsProps) {
  const { t } = useTranslation();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [municipalities, setMunicipalities] = useState<string[]>([]);

  // Update municipalities when province changes
  useEffect(() => {
    const province = formData[`${fieldPrefix}province`] || formData.province;
    if (province) {
      const municipalitiesList = angolaAddressUtils.getMunicipalities(province);
      setMunicipalities(municipalitiesList);
      
      // Clear municipality if it's not valid for the new province
      const currentMunicipality = formData[`${fieldPrefix}municipality`] || formData.municipality;
      if (currentMunicipality && !municipalitiesList.includes(currentMunicipality)) {
        onFieldChange(`${fieldPrefix}municipality`, '');
      }
    } else {
      setMunicipalities([]);
    }
  }, [formData, fieldPrefix, onFieldChange]);

  const validateField = (field: string, value: string) => {
    if (!showValidation) return;
    
    const errors: Record<string, string> = { ...validationErrors };
    
    switch (field.replace(fieldPrefix, '')) {
      case 'bi_number':
        const biValidation = validateAngolaDocument.bi(value);
        if (!biValidation.isValid && biValidation.message) {
          errors[field] = biValidation.message;
        } else {
          delete errors[field];
        }
        break;
      case 'nif':
        const nifValidation = validateAngolaDocument.nif(value);
        if (!nifValidation.isValid && nifValidation.message) {
          errors[field] = nifValidation.message;
        } else {
          delete errors[field];
        }
        break;
      case 'email':
        const emailValidation = validateAngolaDocument.email(value);
        if (!emailValidation.isValid && emailValidation.message) {
          errors[field] = emailValidation.message;
        } else {
          delete errors[field];
        }
        break;
      case 'phone':
      case 'mobile':
        const phoneValidation = validateAngolaDocument.phone(value);
        if (!phoneValidation.isValid && phoneValidation.message) {
          errors[field] = phoneValidation.message;
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
    const fieldName = field.replace(fieldPrefix, '');
    
    // Formatação automática para campos específicos
    switch (fieldName) {
      case 'bi_number':
        formattedValue = formatDocument.bi(value);
        break;
      case 'nif':
        formattedValue = formatDocument.nif(value);
        break;
      case 'phone':
      case 'mobile':
        formattedValue = formatDocument.phone(value);
        break;
    }
    
    onFieldChange(field, formattedValue);
    validateField(field, formattedValue);
  };

  const getFieldValue = (field: string) => {
    return formData[`${fieldPrefix}${field}`] || formData[field] || '';
  };

  const renderValidationMessage = (field: string) => {
    const error = validationErrors[`${fieldPrefix}${field}`];
    if (!error) return null;

    return (
      <Alert variant="destructive" className="py-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {error}
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="space-y-4">
      {/* Campos de Documentação Angolana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}bi_number`}>
            {t('fields.bi')} {formData.hasOwnProperty('company_id') ? '' : '*'}
          </Label>
          <div className="relative">
            <Input
              id={`${fieldPrefix}bi_number`}
              value={getFieldValue('bi_number')}
              onChange={(e) => handleFieldChange(`${fieldPrefix}bi_number`, e.target.value)}
              placeholder={angolaLocalization.documents.types.BI.placeholder}
              className={validationErrors[`${fieldPrefix}bi_number`] ? 'border-red-500' : ''}
            />
            {getFieldValue('bi_number') && !validationErrors[`${fieldPrefix}bi_number`] && (
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
            )}
          </div>
          {renderValidationMessage('bi_number')}
          <p className="text-xs text-muted-foreground">
            {angolaLocalization.documents.types.BI.description}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}nif`}>
            {t('fields.nif')} {formData.hasOwnProperty('company_id') ? '*' : ''}
          </Label>
          <div className="relative">
            <Input
              id={`${fieldPrefix}nif`}
              value={getFieldValue('nif')}
              onChange={(e) => handleFieldChange(`${fieldPrefix}nif`, e.target.value)}
              placeholder={angolaLocalization.documents.types.NIF.placeholder}
              className={validationErrors[`${fieldPrefix}nif`] ? 'border-red-500' : ''}
            />
            {getFieldValue('nif') && !validationErrors[`${fieldPrefix}nif`] && (
              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
            )}
          </div>
          {renderValidationMessage('nif')}
          <p className="text-xs text-muted-foreground">
            {angolaLocalization.documents.types.NIF.description}
          </p>
        </div>
      </div>

      {/* Localização Angolana */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}province`}>{t('fields.province')}</Label>
          <Select 
            value={getFieldValue('province')} 
            onValueChange={(value) => onFieldChange(`${fieldPrefix}province`, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('messages.selectOption')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Seleccionar província</SelectItem>
              {angolaLocalization.provinces.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${fieldPrefix}municipality`}>{t('fields.municipality')}</Label>
          <Select 
            value={getFieldValue('municipality')} 
            onValueChange={(value) => onFieldChange(`${fieldPrefix}municipality`, value)}
            disabled={!getFieldValue('province')}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                getFieldValue('province') 
                  ? "Seleccionar município" 
                  : "Primeiro seleccione a província"
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Seleccionar município</SelectItem>
              {municipalities.map((municipality) => (
                <SelectItem key={municipality} value={municipality}>
                  {municipality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Nacionalidade (padrão Angola) */}
      <div className="space-y-2">
        <Label htmlFor={`${fieldPrefix}nationality`}>{t('fields.nationality')}</Label>
        <Input
          id={`${fieldPrefix}nationality`}
          value={getFieldValue('nationality') || 'Angolana'}
          onChange={(e) => onFieldChange(`${fieldPrefix}nationality`, e.target.value)}
          placeholder="Angolana"
        />
      </div>

      {/* Campos específicos para empresas */}
      {formData.hasOwnProperty('alvara_number') && (
        <>
          <div className="space-y-2">
            <Label htmlFor={`${fieldPrefix}alvara_number`}>{t('documents.alvara')}</Label>
            <Input
              id={`${fieldPrefix}alvara_number`}
              value={getFieldValue('alvara_number')}
              onChange={(e) => onFieldChange(`${fieldPrefix}alvara_number`, e.target.value)}
              placeholder={angolaLocalization.documents.types.ALVARA.placeholder}
            />
            <p className="text-xs text-muted-foreground">
              {angolaLocalization.documents.types.ALVARA.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${fieldPrefix}tax_regime`}>{t('fields.taxRegime')}</Label>
            <Select 
              value={getFieldValue('tax_regime')} 
              onValueChange={(value) => onFieldChange(`${fieldPrefix}tax_regime`, value)}
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
          <Label htmlFor={`${fieldPrefix}industry`}>{t('fields.industry')}</Label>
          <Select 
            value={getFieldValue('industry')} 
            onValueChange={(value) => onFieldChange(`${fieldPrefix}industry`, value)}
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
          <Label htmlFor={`${fieldPrefix}size`}>Dimensão da Empresa</Label>
          <Select 
            value={getFieldValue('size')} 
            onValueChange={(value) => onFieldChange(`${fieldPrefix}size`, value)}
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