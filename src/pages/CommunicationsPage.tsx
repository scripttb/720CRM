import { CommunicationsList } from '@/components/crm/communications/CommunicationsList'

export function CommunicationsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comunicações</h1>
          <p className="text-muted-foreground">
            Acompanhar todas as comunicações com os seus clientes e prospectos
          </p>
        </div>
      </div>
      
      <CommunicationsList />
    </div>
  )
}