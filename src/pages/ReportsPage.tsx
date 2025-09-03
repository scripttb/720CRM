import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReportsDashboard } from '@/components/crm/reports/ReportsDashboard'
import { InteractiveReports } from '@/components/crm/reports/InteractiveReports'
import { AdvancedAnalytics } from '@/components/crm/analytics/AdvancedAnalytics'
import { BarChart3, TrendingUp, Zap } from 'lucide-react'

export function ReportsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Analisar o desempenho de vendas e métricas empresariais
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="interactive" className="space-y-6">
        <TabsList>
          <TabsTrigger value="interactive" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Relatórios Interativos
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Analytics Avançados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactive">
          <InteractiveReports />
        </TabsContent>

        <TabsContent value="overview">
          <ReportsDashboard />
        </TabsContent>

        <TabsContent value="analytics">
          <AdvancedAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}