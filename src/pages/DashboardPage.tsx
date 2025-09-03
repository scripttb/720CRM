import { useState } from 'react';
import { DashboardStats } from '@/components/crm/DashboardStats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, Users, Target, Calendar, Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CompanyDialog } from '@/components/crm/companies/CompanyDialog'
import { ContactDialog } from '@/components/crm/contacts/ContactDialog'
import { OpportunityDialog } from '@/components/crm/opportunities/OpportunityDialog'
import { ActivityDialog } from '@/components/crm/activities/ActivityDialog'
import { InvoiceDialog } from '@/components/billing/InvoiceDialog'
import { mockCompanies } from '@/lib/mock-data'

export function DashboardPage() {
  const navigate = useNavigate();
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
      default:
        navigate(`/dashboard/${action}`);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Principal</h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Aqui está o que está a acontecer com o seu pipeline de vendas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => handleQuickAction('opportunity')}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Oportunidade
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Acções Rápidas
            </CardTitle>
            <CardDescription>
              Criar novos registos rapidamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('company')}
            >
              <Users className="mr-2 h-4 w-4" />
              Adicionar Empresa
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('contact')}
            >
              <Users className="mr-2 h-4 w-4" />
              Adicionar Contacto
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('opportunity')}
            >
              <Target className="mr-2 h-4 w-4" />
              Adicionar Oportunidade
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('activity')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Agendar Actividade
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('invoice')}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Nova Fatura
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Actividade Recente
            </CardTitle>
            <CardDescription>
              Últimas actualizações e actividades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">Nova oportunidade criada</p>
                  <p className="text-xs text-muted-foreground">há 2 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">Reunião agendada com cliente</p>
                  <p className="text-xs text-muted-foreground">há 4 horas</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 bg-orange-500 rounded-full mt-2" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">Informações de contacto actualizadas</p>
                  <p className="text-xs text-muted-foreground">há 1 dia</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Visão Geral do Pipeline
            </CardTitle>
            <CardDescription>
              Estado actual do pipeline de vendas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Contactos Qualificados</span>
                <span className="text-sm font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Propostas Enviadas</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Negociações</span>
                <span className="text-sm font-medium">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Fechamento Próximo</span>
                <span className="text-sm font-medium">5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Dialogs */}
      <CompanyDialog
        open={companyDialogOpen}
        onOpenChange={setCompanyDialogOpen}
        company={null}
        onSave={() => {
          setCompanyDialogOpen(false);
          navigate('/dashboard/companies');
        }}
      />

      <ContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        contact={null}
        companies={mockCompanies}
        onSave={() => {
          setContactDialogOpen(false);
          navigate('/dashboard/contacts');
        }}
      />

      <OpportunityDialog
        open={opportunityDialogOpen}
        onOpenChange={setOpportunityDialogOpen}
        opportunity={null}
        onSave={() => {
          setOpportunityDialogOpen(false);
          navigate('/dashboard/opportunities');
        }}
      />

      <ActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        activity={null}
        onSave={() => {
          setActivityDialogOpen(false);
          navigate('/dashboard/activities');
        }}
      />

      <InvoiceDialog
        open={invoiceDialogOpen}
        onOpenChange={setInvoiceDialogOpen}
        invoice={null}
        onSave={() => {
          setInvoiceDialogOpen(false);
          navigate('/dashboard/billing');
        }}
      />
    </div>
  )
}