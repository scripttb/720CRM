import { ContactsList } from '@/components/crm/contacts/ContactsList'

export function ContactsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
          <p className="text-muted-foreground">
            Gerir os seus contactos de clientes e relacionamentos
          </p>
        </div>
      </div>
      
      <ContactsList />
    </div>
  )
}