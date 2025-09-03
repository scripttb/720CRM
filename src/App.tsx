import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/crm/LoginForm'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { HomePage } from '@/pages/HomePage'
import { DashboardPage } from '@/pages/DashboardPage'
import { CompaniesPage } from '@/pages/CompaniesPage'
import { ContactsPage } from '@/pages/ContactsPage'
import { OpportunitiesPage } from '@/pages/OpportunitiesPage'
import { ActivitiesPage } from '@/pages/ActivitiesPage'
import { CommunicationsPage } from '@/pages/CommunicationsPage'
import { BillingPage } from '@/pages/BillingPage'
import { DocumentsPage } from '@/pages/DocumentsPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'

function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginForm />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}>
        <Route index element={<DashboardPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="activities" element={<ActivitiesPage />} />
        <Route path="communications" element={<CommunicationsPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Redirect old routes */}
      <Route path="/companies" element={<Navigate to="/dashboard/companies" replace />} />
      <Route path="/contacts" element={<Navigate to="/dashboard/contacts" replace />} />
      <Route path="/opportunities" element={<Navigate to="/dashboard/opportunities" replace />} />
      <Route path="/activities" element={<Navigate to="/dashboard/activities" replace />} />
      <Route path="/communications" element={<Navigate to="/dashboard/communications" replace />} />
      <Route path="/documents" element={<Navigate to="/dashboard/documents" replace />} />
      <Route path="/reports" element={<Navigate to="/dashboard/reports" replace />} />
      <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
    </Routes>
  )
}

export default App