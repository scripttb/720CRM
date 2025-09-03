"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Plus, 
  X, 
  Save,
  History,
  Star,
  Building2,
  Users,
  Target,
  Calendar,
  Receipt,
  Loader2
} from 'lucide-react';
import { useAdvancedSearch, SearchFilter, SearchResult } from '@/hooks/use-advanced-search';
import { toast } from 'sonner';

interface AdvancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResultSelect?: (result: SearchResult) => void;
}

export function AdvancedSearchDialog({ 
  open, 
  onOpenChange, 
  onResultSelect 
}: AdvancedSearchDialogProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDescription, setSaveDescription] = useState('');
  const [selectedEntities, setSelectedEntities] = useState<string[]>(['companies', 'contacts', 'opportunities']);

  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    searchResults,
    isSearching,
    addFilter,
    removeFilter,
    clearFilters,
    getFilterSummary,
    performSearch,
    getSearchSuggestions,
    savedSearches,
    saveCurrentSearch,
    loadSavedSearch,
    deleteSavedSearch,
    searchHistory,
    clearSearchHistory
  } = useAdvancedSearch();

  const [newFilter, setNewFilter] = useState({
    field: '',
    operator: 'contains' as const,
    value: '',
    label: ''
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Digite algo para pesquisar');
      return;
    }

    await performSearch(searchQuery, selectedEntities);
  };

  const handleAddFilter = () => {
    if (!newFilter.field || !newFilter.value) {
      toast.error('Campo e valor são obrigatórios');
      return;
    }

    const label = `${newFilter.field} ${newFilter.operator} "${newFilter.value}"`;
    addFilter({
      field: newFilter.field,
      operator: newFilter.operator,
      value: newFilter.value,
      label
    });

    setNewFilter({
      field: '',
      operator: 'contains',
      value: '',
      label: ''
    });
  };

  const handleSaveSearch = () => {
    if (!saveName.trim()) {
      toast.error('Nome da pesquisa é obrigatório');
      return;
    }

    saveCurrentSearch(saveName, saveDescription);
    setSaveDialogOpen(false);
    setSaveName('');
    setSaveDescription('');
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'company':
        return <Building2 className="h-4 w-4" />;
      case 'contact':
        return <Users className="h-4 w-4" />;
      case 'opportunity':
        return <Target className="h-4 w-4" />;
      case 'activity':
        return <Calendar className="h-4 w-4" />;
      case 'invoice':
        return <Receipt className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const suggestions = getSearchSuggestions(searchQuery);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pesquisa Avançada
          </DialogTitle>
          <DialogDescription>
            Pesquise em todo o sistema com filtros avançados e salve pesquisas frequentes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Termo de Pesquisa</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite para pesquisar..."
                  className="pl-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && searchQuery && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Sugestões</Label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery(suggestion)}
                      className="text-xs"
                    >
                      <History className="mr-1 h-3 w-3" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Entity Selection */}
            <div className="space-y-2">
              <Label>Pesquisar em:</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'companies', label: 'Empresas', icon: Building2 },
                  { key: 'contacts', label: 'Contactos', icon: Users },
                  { key: 'opportunities', label: 'Oportunidades', icon: Target },
                  { key: 'activities', label: 'Atividades', icon: Calendar },
                  { key: 'invoices', label: 'Faturas', icon: Receipt }
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={selectedEntities.includes(key) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedEntities(prev => 
                        prev.includes(key) 
                          ? prev.filter(e => e !== key)
                          : [...prev, key]
                      );
                    }}
                  >
                    <Icon className="mr-1 h-3 w-3" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Filtros Avançados</Label>
              {activeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              )}
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <Badge key={filter.id} variant="secondary" className="gap-1">
                    {filter.label}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 p-0"
                      onClick={() => removeFilter(filter.id)}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Add Filter */}
            <div className="grid grid-cols-4 gap-2">
              <Select 
                value={newFilter.field} 
                onValueChange={(value) => setNewFilter(prev => ({ ...prev, field: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Telefone</SelectItem>
                  <SelectItem value="industry">Setor</SelectItem>
                  <SelectItem value="status">Estado</SelectItem>
                  <SelectItem value="value">Valor</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={newFilter.operator} 
                onValueChange={(value) => setNewFilter(prev => ({ ...prev, operator: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contains">Contém</SelectItem>
                  <SelectItem value="equals">Igual a</SelectItem>
                  <SelectItem value="starts_with">Começa com</SelectItem>
                  <SelectItem value="greater_than">Maior que</SelectItem>
                  <SelectItem value="less_than">Menor que</SelectItem>
                </SelectContent>
              </Select>

              <Input
                value={newFilter.value}
                onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Valor"
              />

              <Button onClick={handleAddFilter} size="sm">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Search Actions */}
          <div className="flex items-center gap-2">
            <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Pesquisar
            </Button>

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={!searchQuery.trim()}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Pesquisa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Salvar Pesquisa</DialogTitle>
                  <DialogDescription>
                    Salve esta pesquisa para reutilizar mais tarde
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nome *</Label>
                    <Input
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder="Nome da pesquisa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={saveDescription}
                      onChange={(e) => setSaveDescription(e.target.value)}
                      placeholder="Descrição opcional"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveSearch}>
                    Salvar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Resultados da Pesquisa ({searchResults.length})</Label>
              </div>
              
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        onResultSelect?.(result);
                        onOpenChange(false);
                      }}
                    >
                      {getEntityIcon(result.type)}
                      <div className="flex-1">
                        <div className="font-medium">{result.title}</div>
                        {result.subtitle && (
                          <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                        )}
                        {result.description && (
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {result.description}
                          </div>
                        )}
                        {result.matchedFields.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {result.matchedFields.map((field) => (
                              <Badge key={field} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.relevance}% relevância
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Pesquisas Salvas</Label>
                <Button variant="ghost" size="sm" onClick={clearSearchHistory}>
                  Limpar Histórico
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {savedSearches.slice(0, 6).map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-2 border rounded cursor-pointer hover:bg-muted/50"
                    onClick={() => loadSavedSearch(search.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <div>
                        <div className="text-sm font-medium">{search.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Usado {search.useCount} vez(es)
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSavedSearch(search.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}