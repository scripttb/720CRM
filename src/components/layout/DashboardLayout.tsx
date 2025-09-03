import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { CRMSidebar } from '@/components/crm/CRMSidebar'
import { CRMHeader } from '@/components/crm/CRMHeader'
import { CompanyDialog } from '@/components/crm/companies/CompanyDialog'
import { ContactDialog } from '@/components/crm/contacts/ContactDialog'
import { OpportunityDialog } from '@/components/crm/opportunities/OpportunityDialog'
import { ActivityDialog } from '@/components/crm/activities/ActivityDialog'
import { InvoiceDialog } from '@/components/billing/InvoiceDialog'
import { mockCompanies } from '@/lib/mock-data'
import { useIsMobile } from '@/components/ui/use-mobile'

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [opportunityDialogOpen, setOpportunityDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'company':
        setCompanyDialogOpen(true);
        break;
      case 'contact':
        setContactDialogOpen(true);
        break;
      case 'opportunity':
        setOpportunityDialogOpen(true);
        break;
      case 'activity':
        setActivityDialogOpen(true);
        break;
      case 'invoice':
        setInvoiceDialogOpen(true);
        break;
    }
  };

  return (
    <>
      <div className={cn(
        "flex h-screen bg-background",
        isMobile ? "flex-col" : "flex-row"
      )}>
        <CRMSidebar onQuickAction={handleQuickAction} />
        <div className={cn(
          "flex flex-col flex-1 overflow-hidden",
          isMobile ? "min-h-0" : ""
        )}>
          <CRMHeader />
          <main className={cn(
            "flex-1 overflow-y-auto",
            isMobile ? "px-2" : ""
          )}>
            <Outlet />
          </main>
        </div>
      </div>
      
      {/* Global Quick Action Dialogs */}
      <CompanyDialog
        open={companyDialogOpen}
        onOpenChange={setCompanyDialogOpen}
        company={null}
        onSave={() => setCompanyDialogOpen(false)}
      />

      <ContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        contact={null}
        companies={mockCompanies}
        onSave={() => setContactDialogOpen(false)}
      />

      <OpportunityDialog
        open={opportunityDialogOpen}
        onOpenChange={setOpportunityDialogOpen}
        opportunity={null}
        onSave={() => setOpportunityDialogOpen(false)}
      />

      <ActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        activity={null}
        onSave={() => setActivityDialogOpen(false)}
      />

      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        invoice={null}
        onSave={() => setInvoiceDialogOpen(false)}
      />
    </>
  )
}