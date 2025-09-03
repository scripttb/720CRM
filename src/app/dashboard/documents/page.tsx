import { DocumentsList } from '@/components/crm/documents/DocumentsList';

export default function DocumentsPage() {
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
    </div>
  );
}
