import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SettingsPanel } from '@/components/crm/settings/SettingsPanel'
import { PermissionManager } from '@/components/crm/permissions/PermissionManager'
import { Settings, Shield } from 'lucide-react'

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
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações Gerais
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <SettingsPanel />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}