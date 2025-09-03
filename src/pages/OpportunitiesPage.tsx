import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OpportunitiesList } from '@/components/crm/opportunities/OpportunitiesList'
import { PipelineKanban } from '@/components/crm/opportunities/PipelineKanban'
import { OpportunityDialog } from '@/components/crm/opportunities/OpportunityDialog'
import { LayoutGrid, List, Plus } from 'lucide-react'

export function OpportunitiesPage() {
  const [view, setView] = useState<'list' | 'kanban'>('kanban')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingOpportunity, setEditingOpportunity] = useState(null)

  const handleCreateOpportunity = () => {
    setEditingOpportunity(null)
    setDialogOpen(true)
  }

  const handleEditOpportunity = (opportunity: any) => {
    setEditingOpportunity(opportunity)
    setDialogOpen(true)
  }

  const handleOpportunitySaved = () => {
    setDialogOpen(false)
    setEditingOpportunity(null)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Oportunidades</h1>
          <p className="text-muted-foreground">
            Acompanhar e gerir as suas oportunidades de vendas e negócios
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={view === 'kanban' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('kanban')}
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Kanban
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('list')}
            >
              <List className="mr-2 h-4 w-4" />
              Lista
            </Button>
          </div>
          <Button onClick={handleCreateOpportunity}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Oportunidade
          </Button>
        </div>
      </div>
      
      <Tabs value={view} onValueChange={(value) => setView(value as 'list' | 'kanban')}>
        <TabsContent value="kanban">
          <PipelineKanban 
            onEditOpportunity={handleEditOpportunity}
            onCreateOpportunity={handleCreateOpportunity}
          />
        </TabsContent>
        <TabsContent value="list">
          <OpportunitiesList />
        </TabsContent>
      </Tabs>

      <OpportunityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        opportunity={editingOpportunity}
        onSave={handleOpportunitySaved}
      />
    </div>
  )
}