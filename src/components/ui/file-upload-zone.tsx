"use client";

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { useFileUpload } from '@/hooks/use-file-upload';

interface FileUploadZoneProps {
  onFilesUploaded: (files: any[]) => void;
  maxFileSize?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  className?: string;
}

export function FileUploadZone({
  onFilesUploaded,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ],
  multiple = true,
  className
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { uploadMultipleFiles, uploads } = useFileUpload();

  const validateFiles = useCallback((files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    files.forEach(file => {
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: Arquivo muito grande (máx. ${Math.round(maxFileSize / 1024 / 1024)}MB)`);
      } else if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Tipo de arquivo não suportado`);
      } else {
        validFiles.push(file);
      }
    });
    
    return { validFiles, errors };
  }, [maxFileSize, allowedTypes]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const { validFiles, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      console.error('File validation errors:', errors);
    }
    
    setSelectedFiles(validFiles);
  }, [validateFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const { validFiles, errors } = validateFiles(files);
    
    if (errors.length > 0) {
      console.error('File validation errors:', errors);
    }
    
    setSelectedFiles(validFiles);
  }, [validateFiles]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      const uploadedFiles = await uploadMultipleFiles(selectedFiles);
      onFilesUploaded(uploadedFiles);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
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

  const hasActiveUploads = uploads.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
          isDragOver 
            ? "border-primary bg-primary/5" 
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <Upload className={cn(
          "mx-auto h-8 w-8 mb-2",
          isDragOver ? "text-primary" : "text-muted-foreground"
        )} />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {isDragOver 
              ? "Solte os arquivos aqui" 
              : "Arraste arquivos aqui ou clique para selecionar"
            }
          </p>
          <input
            type="file"
            multiple={multiple}
            onChange={handleFileSelect}
            accept={allowedTypes.join(',')}
            className="hidden"
            id="file-upload"
          />
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Arquivos Selecionados ({selectedFiles.length})</h4>
            <Button onClick={handleUpload} disabled={hasActiveUploads}>
              {hasActiveUploads ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Carregar
            </Button>
          </div>
          
          <div className="space-y-2">
            {selectedFiles.map((file, index) => {
              const uploadProgress = uploads.find(u => u.fileId.includes(index.toString()));
              
              return (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {file.type}
                    </p>
                    {uploadProgress && (
                      <div className="mt-2">
                        <Progress value={uploadProgress.progress} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {uploadProgress.progress.toFixed(0)}% carregado
                        </p>
                      </div>
                    )}
                  </div>
                  {!hasActiveUploads && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* File Type Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Tipos suportados:</strong> PDF, Word, Excel, Imagens (JPG, PNG, GIF), Texto
          <br />
          <strong>Tamanho máximo:</strong> {Math.round(maxFileSize / 1024 / 1024)}MB por arquivo
        </AlertDescription>
      </Alert>
    </div>
  );
}