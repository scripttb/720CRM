"use client";

import { angolaLocalization } from '@/lib/angola-localization';
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
  const { t } = useTranslation();
  
  const formatAmount = (value: number) => {
    const formatted = angolaLocalization.currency.format(value);
    
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
}

export function KwanzaInput({ 
  value, 
  onChange, 
  placeholder = '0,00', 
  className = '',
  disabled = false 
}: KwanzaInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Remove tudo exceto números, vírgulas e pontos
    const cleanValue = inputValue.replace(/[^\d,\.]/g, '');
    
    // Converte vírgula para ponto para parsing
    const numericValue = parseFloat(cleanValue.replace(',', '.')) || 0;
    
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
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        Kz
      </span>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`pl-8 pr-3 py-2 border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md ${className}`}
      />
    </div>
  );
}
