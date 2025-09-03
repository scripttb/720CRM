import { ReportsDashboard } from '@/components/crm/reports/ReportsDashboard'

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
      
      <ReportsDashboard />
    </div>
  )
}