"use client";

import { useState, useEffect, useCallback } from 'react';
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
  FileText,
  Download,
  Eye,
  Upload,
  File,
  Image,
  FileSpreadsheet,
  FileVideo,
  Loader2
} from 'lucide-react';
import { Document } from '@/types/crm';
import { DocumentUpload } from './DocumentUpload';
import { mockCompanies, mockContacts, mockOpportunities } from '@/lib/mock-data';
import { toast } from 'sonner';
import { ResponsiveTable, MobileTable, MobileCard } from '@/components/ui/mobile-table';

// Mock data for documents since we don't have API yet
const mockDocuments: Document[] = [
  {
    id: 1,
    name: 'Proposta de Vendas - Acme Corp.pdf',
    file_path: '/documents/sales-proposal-acme.pdf',
    file_size: 2048576,
    mime_type: 'application/pdf',
    company_id: 1,
    uploaded_by_user_id: 1,
    is_public: false,
    description: 'Proposta de vendas para solução empresarial da Acme Corporation',
    create_time: '2024-01-25T10:30:00Z',
    modify_time: '2024-01-25T10:30:00Z',
  },
  {
    id: 2,
    name: 'Modelo de Contrato.docx',
    file_path: '/documents/contract-template.docx',
    file_size: 1024000,
    mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    is_public: true,
    description: 'Modelo de contrato padrão para novos clientes',
    create_time: '2024-01-20T14:15:00Z',
    modify_time: '2024-01-20T14:15:00Z',
  },
  {
    id: 3,
    name: 'Apresentação Comercial.pptx',
    file_path: '/documents/commercial-presentation.pptx',
    file_size: 5242880,
    mime_type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    company_id: 2,
    uploaded_by_user_id: 1,
    is_public: false,
    description: 'Apresentação comercial para clientes do setor bancário',
    create_time: '2024-01-28T16:20:00Z',
    modify_time: '2024-01-28T16:20:00Z',
  },
  {
    id: 4,
    name: 'Certificado AGT.pdf',
    file_path: '/documents/agt-certificate.pdf',
    file_size: 512000,
    mime_type: 'application/pdf',
    uploaded_by_user_id: 1,
    is_public: true,
    description: 'Certificado de software AGT para faturação',
    create_time: '2024-01-10T09:00:00Z',
    modify_time: '2024-01-10T09:00:00Z',
  },
];

export function DocumentsList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Load documents from localStorage
  useEffect(() => {
    const savedDocuments = localStorage.getItem('crm_documents');
    if (savedDocuments) {
      try {
        const parsed = JSON.parse(savedDocuments);
        setDocuments(prev => [...parsed, ...prev]);
      } catch (error) {
        console.error('Error loading saved documents:', error);
      }
    }
  }, []);
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredData = [...mockDocuments];
      
      if (searchQuery) {
        filteredData = filteredData.filter(doc => 
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (selectedVisibility !== 'all') {
        const isPublic = selectedVisibility === 'public';
        filteredData = filteredData.filter(doc => doc.is_public === isPublic);
      }
      
      setDocuments(filteredData);
    } catch (error) {
      toast.error('Falha ao carregar documentos');
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedVisibility]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUploadComplete = (document: Document) => {
    setDocuments(prev => [document, ...prev]);
    toast.success('Documento carregado com sucesso');
  };

  const handleDownloadDocument = (document: Document) => {
    if (document.file_path.startsWith('blob:')) {
      // For uploaded files, trigger download
      const a = document.createElement('a');
      a.href = document.file_path;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      toast.info('Download simulado - arquivo não disponível');
    }
  };

  const handleViewDocument = (document: Document) => {
    if (document.file_path.startsWith('blob:')) {
      window.open(document.file_path, '_blank');
    } else {
      toast.info('Visualização simulada - arquivo não disponível');
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm('Tem a certeza que deseja eliminar este documento?')) {
      return;
    }

    try {
      setDocuments(documents.filter(d => d.id !== documentId));
      
      // Remove from localStorage
      const savedDocuments = JSON.parse(localStorage.getItem('crm_documents') || '[]');
      const updatedDocuments = savedDocuments.filter((d: Document) => d.id !== documentId);
      localStorage.setItem('crm_documents', JSON.stringify(updatedDocuments));
      
      toast.success('Documento eliminado com sucesso');
    } catch (error) {
      toast.error('Falha ao eliminar documento');
      console.error('Error deleting document:', error);
    }
  };

  const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <File className="h-4 w-4" />;
    
    if (mimeType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-green-600" />;
    } else if (mimeType.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-600" />;
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    } else if (mimeType.startsWith('video/')) {
      return <FileVideo className="h-4 w-4 text-purple-600" />;
    } else {
      return <File className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Desconhecido';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-AO');
  };


  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar documentos por nome ou descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedVisibility} onValueChange={setSelectedVisibility}>
            <SelectTrigger className="w-[120px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Visibilidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="public">Públicos</SelectItem>
              <SelectItem value="private">Privados</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Carregar Documento
          </Button>
        </div>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Nenhum documento encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? 'Tente ajustar os termos de pesquisa'
                  : 'Comece por carregar o seu primeiro documento'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setUploadDialogOpen(true)} className="mt-4">
                  <Upload className="mr-2 h-4 w-4" />
                  Carregar Documento
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Visibilidade</TableHead>
                    <TableHead>Carregado</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getFileIcon(document.mime_type)}
                          <div>
                            <div className="font-medium">{document.name}</div>
                            {document.company_id && (
                              <div className="text-sm text-muted-foreground">
                                ID da Empresa: {document.company_id}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {document.mime_type?.split('/')[1]?.toUpperCase() || 'Desconhecido'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatFileSize(document.file_size)}
                      </TableCell>
                      <TableCell>
                        {document.is_public ? (
                          <Badge variant="outline" className="text-green-600">Público</Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600">Privado</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(document.create_time)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {document.description ? (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {document.description}
                            </p>
                          ) : (
                            <span className="text-muted-foreground">Sem descrição</span>
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
                              <Eye className="mr-2 h-4 w-4" onClick={() => handleViewDocument(document)} />
                              Ver
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" onClick={() => handleDownloadDocument(document)} />
                              Descarregar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteDocument(document.id)}
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

      {/* Mobile View */}
      <div className="md:hidden">
        <Card>
          <CardHeader>
            <CardTitle>Documentos ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <MobileTable
                data={documents}
                renderCard={(document) => (
                  <MobileCard key={document.id}>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getFileIcon(document.mime_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{document.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatFileSize(document.file_size)} • {formatDateTime(document.create_time)}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
                              <Download className="mr-2 h-4 w-4" />
                              Descarregar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteDocument(document.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {document.mime_type?.split('/')[1]?.toUpperCase() || 'Desconhecido'}
                        </Badge>
                        {document.is_public ? (
                          <Badge variant="outline" className="text-green-600">Público</Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600">Privado</Badge>
                        )}
                      </div>
                      
                      {document.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {document.description}
                        </p>
                      )}
                      
                      {document.company_id && (
                        <div className="text-xs text-muted-foreground">
                          Empresa ID: {document.company_id}
                        </div>
                      )}
                    </div>
                  </MobileCard>
                )}
                emptyState={
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-2 text-sm font-semibold">Nenhum documento encontrado</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {searchQuery
                        ? 'Tente ajustar os termos de pesquisa'
                        : 'Comece por carregar o seu primeiro documento'
                      }
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setUploadDialogOpen(true)} className="mt-4">
                        <Upload className="mr-2 h-4 w-4" />
                        Carregar Documento
                      </Button>
                    )}
                  </div>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
      {/* Document Upload Dialog */}
      <DocumentUpload
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={handleUploadComplete}
        companies={mockCompanies}
        contacts={mockContacts}
        opportunities={mockOpportunities}
      />
    </div>
  );
}
