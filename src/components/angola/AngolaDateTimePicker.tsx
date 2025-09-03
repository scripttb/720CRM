"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { angolaLocalization } from '@/lib/angola-localization';
import { useTranslation } from '@/lib/angola-translations';

interface AngolaDateTimePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showTime?: boolean;
}

export function AngolaDateTimePicker({
  date,
  onDateChange,
  placeholder,
  className,
  disabled = false,
  showTime = false
}: AngolaDateTimePickerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const formatDate = (date: Date) => {
    if (showTime) {
      return angolaLocalization.dateTime.formatDateTime(date);
    }
    return angolaLocalization.dateTime.formatDate(date);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : (placeholder || t('messages.selectOption'))}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onDateChange(selectedDate);
            setOpen(false);
          }}
          disabled={disabled}
          initialFocus
          locale={ptBR}
        />
        {showTime && date && (
          <div className="p-3 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="time"
                value={format(date, 'HH:mm')}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  const newDate = new Date(date);
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  onDateChange(newDate);
                }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// Componente para exibir data/hora formatada
interface AngolaDateDisplayProps {
  date: Date | string;
  showTime?: boolean;
  className?: string;
}

export function AngolaDateDisplay({ 
  date, 
  showTime = false, 
  className = '' 
}: AngolaDateDisplayProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const formatDate = () => {
    if (showTime) {
      return angolaLocalization.dateTime.formatDateTime(dateObj);
    }
    return angolaLocalization.dateTime.formatDate(dateObj);
  };

  return (
    <span className={className}>
      {formatDate()}
    </span>
  );
}
