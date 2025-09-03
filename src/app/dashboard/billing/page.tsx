import { BillingDashboard } from '@/components/billing/BillingDashboard';

export default function BillingPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Faturação</h1>
          <p className="text-muted-foreground">
            Gestão completa de documentos fiscais com certificação AGT e exportação SAF-T
          </p>
        </div>
      </div>
      
      <BillingDashboard />
    </div>
  );
}
