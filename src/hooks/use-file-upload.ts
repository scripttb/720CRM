import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export function useFileUpload() {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const uploadFile = useCallback(async (file: File): Promise<UploadedFile> => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Add to upload progress
    setUploads(prev => [...prev, {
      fileId,
      progress: 0,
      status: 'uploading'
    }]);

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploads(prev => prev.map(upload => 
          upload.fileId === fileId 
            ? { ...upload, progress }
            : upload
        ));
      }

      // Create file URL (in real implementation, this would be from your storage service)
      const fileUrl = URL.createObjectURL(file);
      
      const uploadedFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        uploadedAt: new Date()
      };

      // Mark as completed
      setUploads(prev => prev.map(upload => 
        upload.fileId === fileId 
          ? { ...upload, status: 'completed' }
          : upload
      ));

      // Add to uploaded files
      setUploadedFiles(prev => [uploadedFile, ...prev]);

      // Remove from progress after delay
      setTimeout(() => {
        setUploads(prev => prev.filter(upload => upload.fileId !== fileId));
      }, 2000);

      return uploadedFile;
    } catch (error) {
      // Mark as error
      setUploads(prev => prev.map(upload => 
        upload.fileId === fileId 
          ? { ...upload, status: 'error' }
          : upload
      ));

      toast.error(`Erro ao carregar ${file.name}`);
      throw error;
    }
  }, []);

  const uploadMultipleFiles = useCallback(async (files: File[]): Promise<UploadedFile[]> => {
    const uploadPromises = files.map(file => uploadFile(file));
    return Promise.all(uploadPromises);
  }, [uploadFile]);

  const deleteFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    // In real implementation, also delete from storage service
    toast.success('Arquivo eliminado com sucesso');
  }, []);

  const getUploadProgress = useCallback((fileId: string) => {
    return uploads.find(upload => upload.fileId === fileId);
  }, [uploads]);

  return {
    uploadFile,
    uploadMultipleFiles,
    deleteFile,
    getUploadProgress,
    uploads,
    uploadedFiles
  };
}