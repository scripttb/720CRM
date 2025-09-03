import { SettingsPanel } from '@/components/crm/settings/SettingsPanel'

export function SettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Configurar as preferências e definições do sistema CRM
          </p>
        </div>
      </div>
      
      <SettingsPanel />
    </div>
  )
}