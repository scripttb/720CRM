"use client";

import { angolaLocalization } from '@/lib/angola-localization';
import { angolaCurrencyUtils } from '@/lib/angola-utils';
import { useTranslation } from '@/lib/angola-translations';

interface KwanzaCurrencyDisplayProps {
  amount: number;
  className?: string;
  showSymbol?: boolean;
  showCode?: boolean;
}

export function KwanzaCurrencyDisplay({ 
  amount, 
  className = '', 
  showSymbol = true, 
  showCode = false 
}: KwanzaCurrencyDisplayProps) {
  const formatAmount = (value: number) => {
    const formatted = angolaCurrencyUtils.format(value);
    
    if (!showSymbol) {
      return formatted.replace('Kz', '').trim();
    }
    
    if (showCode) {
      return `${formatted} (${angolaLocalization.currency.code})`;
    }
    
    return formatted;
  };

  return (
    <span className={`font-medium ${className}`}>
      {formatAmount(amount)}
    </span>
  );
}

// Componente para input de valores em Kwanza
interface KwanzaInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export function KwanzaInput({ 
  value, 
  onChange, 
  placeholder = '0,00', 
  className = '',
  disabled = false,
  required = false
}: KwanzaInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = angolaCurrencyUtils.parse(inputValue);
    onChange(numericValue);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Format the value when user leaves the field
    const numericValue = angolaCurrencyUtils.parse(e.target.value);
    onChange(numericValue);
  };

  const displayValue = value > 0 
    ? value.toLocaleString('pt-AO', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })
    : '';

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
        Kz
      </span>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`pl-10 pr-3 py-2 h-10 w-full border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md ${className}`}
      />
    </div>
  );
}

// Componente para exibir percentagem
interface PercentageDisplayProps {
  value: number;
  className?: string;
  decimals?: number;
}

export function PercentageDisplay({ 
  value, 
  className = '',
  decimals = 1
}: PercentageDisplayProps) {
  return (
    <span className={className}>
      {value.toFixed(decimals)}%
    </span>
  );
}

// Componente para input de percentagem
interface PercentageInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function PercentageInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 0.01,
  placeholder = '0',
  className = '',
  disabled = false
}: PercentageInputProps) {
  return (
    <div className="relative">
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        disabled={disabled}
        className={`pr-8 pl-3 py-2 h-10 w-full border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md ${className}`}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        %
      </span>
    </div>
  );
}