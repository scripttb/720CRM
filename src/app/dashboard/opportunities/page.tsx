import { OpportunitiesList } from '@/components/crm/opportunities/OpportunitiesList';

export default function OpportunitiesPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Oportunidades</h1>
          <p className="text-muted-foreground">
            Acompanhar e gerir as suas oportunidades de vendas e negócios
          </p>
        </div>
      </div>
      
      <OpportunitiesList />
    </div>
  );
}
