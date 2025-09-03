import { Outlet } from 'react-router-dom'
import { CRMSidebar } from '@/components/crm/CRMSidebar'
import { CRMHeader } from '@/components/crm/CRMHeader'

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background">
      <CRMSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <CRMHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}