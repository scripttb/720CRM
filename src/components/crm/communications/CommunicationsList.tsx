"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  MessageSquare,
  Phone,
  Mail,
  Users,
  MessageCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2
} from 'lucide-react';
import { Communication } from '@/types/crm';
import { toast } from 'sonner';

// Mock data for communications since we don't have API yet
const mockCommunications: Communication[] = [
  {
    id: 1,
    type: 'email',
    direction: 'outbound',
    subject: 'Acompanhamento da proposta',
    content: 'Olá João, queria fazer o acompanhamento da proposta que enviámos na semana passada...',
    company_id: 1,
    contact_id: 1,
    user_id: 1,
    occurred_at: '2024-01-25T10:30:00Z',
    create_time: '2024-01-25T10:30:00Z',
    modify_time: '2024-01-25T10:30:00Z',
  },
  {
    id: 2,
    type: 'call',
    direction: 'inbound',
    subject: 'Consulta de cliente',
    content: 'Cliente ligou a perguntar sobre preços para o plano empresarial',
    company_id: 2,
    contact_id: 2,
    user_id: 1,
    occurred_at: '2024-01-24T14:15:00Z',
    create_time: '2024-01-24T14:15:00Z',
    modify_time: '2024-01-24T14:15:00Z',
  },
];

export function CommunicationsList() {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDirection, setSelectedDirection] = useState<string>('all');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCommunications(mockCommunications);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDeleteCommunication = async (communicationId: number) => {
    if (!confirm('Tem a certeza que deseja eliminar esta comunicação?')) {
      return;
    }

    try {
      setCommunications(communications.filter(c => c.id !== communicationId));
      toast.success('Comunicação eliminada com sucesso');
    } catch (error) {
      toast.error('Falha ao eliminar comunicação');
      console.error('Error deleting communication:', error);
    }
  };

  const getCommunicationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'sms':
        return <MessageCircle className="h-4 w-4" />;
      case 'social':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getDirectionIcon = (direction?: string) => {
    switch (direction) {
      case 'inbound':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'outbound':
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getDirectionBadge = (direction?: string) => {
    switch (direction) {
      case 'inbound':
        return <Badge variant="outline" className="text-green-600">Recebida</Badge>;
      case 'outbound':
        return <Badge variant="outline" className="text-blue-600">Enviada</Badge>;
      default:
        return <Badge variant="outline">Desconhecida</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-AO');
  };

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = !searchQuery || 
      comm.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || comm.type === selectedType;
    const matchesDirection = selectedDirection === 'all' || comm.direction === selectedDirection;
    
    return matchesSearch && matchesType && matchesDirection;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar comunicações por assunto ou conteúdo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="call">Chamada</SelectItem>
              <SelectItem value="meeting">Reunião</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="social">Redes Sociais</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDirection} onValueChange={setSelectedDirection}>
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Direcção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Direcções</SelectItem>
              <SelectItem value="inbound">Recebida</SelectItem>
              <SelectItem value="outbound">Enviada</SelectItem>
            </SelectContent>
          </Select>
          
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Registar Comunicação
          </Button>
        </div>
      </div>

      {/* Communications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comunicações ({filteredCommunications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredCommunications.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhuma comunicação encontrada</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery || selectedType !== 'all' || selectedDirection !== 'all'
                  ? 'Tente ajustar a sua pesquisa ou filtros'
                  : 'Comece por registar a sua primeira comunicação'
                }
              </p>
              {!searchQuery && selectedType === 'all' && selectedDirection === 'all' && (
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Registar Comunicação
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Comunicação</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Direcção</TableHead>
                    <TableHead>Data e Hora</TableHead>
                    <TableHead>Pré-visualização do Conteúdo</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCommunications.map((communication) => (
                    <TableRow key={communication.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {communication.subject || 'Sem Assunto'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID da Empresa: {communication.company_id || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCommunicationIcon(communication.type)}
                          <span className="capitalize">{communication.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDirectionIcon(communication.direction)}
                          {getDirectionBadge(communication.direction)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDateTime(communication.occurred_at)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {communication.content ? (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {communication.content}
                            </p>
                          ) : (
                            <span className="text-muted-foreground">Sem conteúdo</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acções</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCommunication(communication.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
