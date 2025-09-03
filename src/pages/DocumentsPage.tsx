import { useState } from 'react'
import { DocumentsList } from '@/components/crm/documents/DocumentsList'
import { DocumentUpload } from '@/components/crm/documents/DocumentUpload'
import { mockCompanies, mockContacts, mockOpportunities } from '@/lib/mock-data'

export function DocumentsPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])

  const handleUploadComplete = (document: any) => {
    setDocuments(prev => [document, ...prev])
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
          <p className="text-muted-foreground">
            Gerir e organizar os seus documentos e ficheiros empresariais
          </p>
        </div>
      </div>
      
      <DocumentsList />

      <DocumentUpload
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={handleUploadComplete}
        companies={mockCompanies}
        contacts={mockContacts}
        opportunities={mockOpportunities}
      />
    </div>
  )
}