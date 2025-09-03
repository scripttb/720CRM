"use client";

import { useState, useCallback } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  FileSpreadsheet,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Document, Company, Contact, Opportunity } from '@/types/crm';
import { toast } from 'sonner';

interface DocumentUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (document: Document) => void;
  companies?: Company[];
  contacts?: Contact[];
  opportunities?: Opportunity[];
}

interface UploadFormData {
  name: string;
  description: string;
  company_id?: number;
  contact_id?: number;
  opportunity_id?: number;
  is_public: boolean;
  category: string;
}

export function DocumentUpload({ 
  open, 
  onOpenChange, 
  onUploadComplete,
  companies = [],
  contacts = [],
  opportunities = []
}: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState<UploadFormData>({
    name: '',
    description: '',
    is_public: false,
    category: 'general'
  });

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ];

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    selectedFiles.forEach(file => {
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: Arquivo muito grande (máx. 10MB)`);
      } else if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Tipo de arquivo não suportado`);
      } else {
        validFiles.push(file);
      }
    });
    
    if (errors.length > 0) {
      toast.error(`Erros de validação:\n${errors.join('\n')}`);
    }
    
    setFiles(validFiles);
    
    // Auto-fill name if only one file
    if (validFiles.length === 1 && !formData.name) {
      setFormData(prev => ({
        ...prev,
        name: validFiles[0].name
      }));
    }
  }, [formData.name, maxFileSize]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-4 w-4 text-green-600" />;
    } else if (mimeType.includes('pdf')) {
      return <FileText className="h-4 w-4 text-red-600" />;
    } else if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) {
      return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
    } else {
      return <File className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const simulateUpload = async (): Promise<Document[]> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Create mock documents
          const uploadedDocs = files.map((file, index) => ({
            id: Date.now() + index,
            name: formData.name || file.name,
            file_path: `/documents/${file.name}`,
            file_size: file.size,
            mime_type: file.type,
            company_id: formData.company_id,
            contact_id: formData.contact_id,
            opportunity_id: formData.opportunity_id,
            uploaded_by_user_id: 1,
            is_public: formData.is_public,
            description: formData.description,
            create_time: new Date().toISOString(),
            modify_time: new Date().toISOString(),
          }));
          
          resolve(uploadedDocs);
        }
        setUploadProgress(Math.min(progress, 100));
      }, 200);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Selecione pelo menos um arquivo');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Nome do documento é obrigatório');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedDocs = await simulateUpload();
      
      uploadedDocs.forEach(doc => {
        onUploadComplete(doc);
      });
      
      toast.success(`${uploadedDocs.length} documento(s) carregado(s) com sucesso`);
      
      // Reset form
      setFiles([]);
      setFormData({
        name: '',
        description: '',
        is_public: false,
        category: 'general'
      });
      setUploadProgress(0);
      onOpenChange(false);
      
    } catch (error) {
      toast.error('Erro ao carregar documentos');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const filteredContacts = formData.company_id 
    ? contacts.filter(c => c.company_id === formData.company_id)
    : contacts;

  const filteredOpportunities = formData.company_id 
    ? opportunities.filter(o => o.company_id === formData.company_id)
    : opportunities;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Carregar Documentos
          </DialogTitle>
          <DialogDescription>
            Carregue documentos e associe-os a empresas, contactos ou oportunidades
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Selecionar Arquivos</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Arraste arquivos aqui ou clique para selecionar
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>Selecionar Arquivos</span>
                    </Button>
                  </Label>
                </div>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Arquivos Selecionados</Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getFileIcon(file.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        className="h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Document Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Documento *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome descritivo do documento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do conteúdo do documento..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Geral</SelectItem>
                  <SelectItem value="contracts">Contratos</SelectItem>
                  <SelectItem value="proposals">Propostas</SelectItem>
                  <SelectItem value="invoices">Faturas</SelectItem>
                  <SelectItem value="legal">Documentos Legais</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="technical">Documentação Técnica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Associations */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Associações (Opcional)</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Select 
                  value={formData.company_id?.toString() || ''} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    company_id: value ? parseInt(value) : undefined,
                    contact_id: undefined,
                    opportunity_id: undefined
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma empresa</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id.toString()}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contacto</Label>
                  <Select 
                    value={formData.contact_id?.toString() || ''} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      contact_id: value ? parseInt(value) : undefined 
                    }))}
                    disabled={!formData.company_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar contacto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum contacto</SelectItem>
                      {filteredContacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id.toString()}>
                          {contact.first_name} {contact.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="opportunity">Oportunidade</Label>
                  <Select 
                    value={formData.opportunity_id?.toString() || ''} 
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      opportunity_id: value ? parseInt(value) : undefined 
                    }))}
                    disabled={!formData.company_id}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar oportunidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhuma oportunidade</SelectItem>
                      {filteredOpportunities.map((opportunity) => (
                        <SelectItem key={opportunity.id} value={opportunity.id.toString()}>
                          {opportunity.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
              />
              <Label htmlFor="is_public">Documento público</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Documentos públicos podem ser vistos por todos os utilizadores
            </p>
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Progresso do Carregamento</Label>
                <span className="text-sm text-muted-foreground">{uploadProgress.toFixed(0)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* File Size Warning */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Tipos suportados:</strong> PDF, Word, Excel, Imagens (JPG, PNG, GIF), Texto
              <br />
              <strong>Tamanho máximo:</strong> 10MB por arquivo
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={files.length === 0 || !formData.name.trim() || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Carregar {files.length} Arquivo(s)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}