import { ActivitiesList } from '@/components/crm/activities/ActivitiesList'

export function ActivitiesPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Actividades</h1>
          <p className="text-muted-foreground">
            Gerir as suas tarefas, reuniões, chamadas e outras actividades
          </p>
        </div>
      </div>
      
      <ActivitiesList />
    </div>
  )
}