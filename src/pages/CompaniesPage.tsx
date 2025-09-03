import { CompaniesList } from '@/components/crm/companies/CompaniesList'

export function CompaniesPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerir as suas empresas clientes e organizações
          </p>
        </div>
      </div>
      
      <CompaniesList />
    </div>
  )
}