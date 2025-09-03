"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import { KwanzaCurrencyDisplay } from '@/components/angola/KwanzaCurrencyDisplay';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Download, 
  Filter, 
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import { useOpportunities } from '@/hooks/use-opportunities';
import { useCompanies } from '@/hooks/use-companies';
import { useContacts } from '@/hooks/use-contacts';
import { useActivities } from '@/hooks/use-activities';
import { useBilling } from '@/hooks/use-billing';
import { toast } from 'sonner';

export function InteractiveReports() {
  const [selectedReport, setSelectedReport] = useState('sales-overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const { getStatistics: getOpportunityStats } = useOpportunities();
  const { getStatistics: getCompanyStats } = useCompanies();
  const { getStatistics: getContactStats } = useContacts();
  const { getStatistics: getActivityStats } = useActivities();
  const { getStatistics: getBillingStats } = useBilling();

  // Generate report data based on selections
  const generateReportData = () => {
    const opportunityStats = getOpportunityStats();
    const companyStats = getCompanyStats();
    const contactStats = getContactStats();
    const activityStats = getActivityStats();
    const billingStats = getBillingStats();

    return {
      opportunityStats,
      companyStats,
      contactStats,
      activityStats,
      billingStats
    };
  };

  const reportData = generateReportData();

  // Sales trend data (mock)
  const salesTrendData = [
    { month: 'Jan', revenue: 45000, opportunities: 12, conversion: 24.5 },
    { month: 'Fev', revenue: 52000, opportunities: 15, conversion: 26.7 },
    { month: 'Mar', revenue: 48000, opportunities: 13, conversion: 23.1 },
    { month: 'Abr', revenue: 61000, opportunities: 18, conversion: 27.8 },
    { month: 'Mai', revenue: 55000, opportunities: 16, conversion: 25.0 },
    { month: 'Jun', revenue: 67000, opportunities: 20, conversion: 30.0 },
  ];

  // Pipeline funnel data
  const pipelineData = reportData.opportunityStats.stageDistribution.map(stage => ({
    stage: stage.stage,
    count: stage.count,
    value: stage.value,
    percentage: (stage.count / reportData.opportunityStats.total) * 100
  }));

  // Industry distribution
  const industryData = Object.entries(reportData.companyStats.industriesCount || {}).map(([industry, count]) => ({
    name: industry,
    value: count,
    percentage: (count / reportData.companyStats.total) * 100
  }));

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

  const exportReport = () => {
    const reportContent = {
      title: 'Relatório CRM Angola',
      period: `${dateRange.start.toLocaleDateString('pt-AO')} - ${dateRange.end.toLocaleDateString('pt-AO')}`,
      data: reportData,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-crm-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success('Relatório exportado com sucesso');
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Relatórios Interativos
          </CardTitle>
          <CardDescription>
            Analise o desempenho do seu negócio com relatórios dinâmicos e filtráveis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Relatório</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales-overview">Visão Geral de Vendas</SelectItem>
                  <SelectItem value="pipeline-analysis">Análise do Pipeline</SelectItem>
                  <SelectItem value="customer-insights">Insights de Clientes</SelectItem>
                  <SelectItem value="activity-report">Relatório de Atividades</SelectItem>
                  <SelectItem value="billing-summary">Resumo de Faturação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="quarter">Este Trimestre</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                  <SelectItem value="custom">Período Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <DatePicker
                    date={dateRange.start}
                    onDateChange={(date) => setDateRange(prev => ({ ...prev, start: date || new Date() }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <DatePicker
                    date={dateRange.end}
                    onDateChange={(date) => setDateRange(prev => ({ ...prev, end: date || new Date() }))}
                  />
                </div>
              </>
            )}

            <div className="flex items-end">
              <Button onClick={exportReport} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <KwanzaCurrencyDisplay amount={reportData.billingStats.totalInvoiced} />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12,5%</span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.opportunityStats.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{reportData.opportunityStats.conversionRate.toFixed(1)}%</span> taxa de conversão
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.companyStats.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">{reportData.contactStats.total}</span> contactos totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividades</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.activityStats.total}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{reportData.activityStats.completionRate.toFixed(1)}%</span> taxa de conclusão
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts based on selected report */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Vendas</CardTitle>
            <CardDescription>Receita e oportunidades ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Receita (Kz)",
                  color: "hsl(var(--chart-1))",
                },
                opportunities: {
                  label: "Oportunidades",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1"
                    stroke="var(--color-revenue)" 
                    fill="var(--color-revenue)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pipeline Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Funil do Pipeline</CardTitle>
            <CardDescription>Distribuição de oportunidades por fase</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Oportunidades",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={100} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      `${value} oportunidades`,
                      name
                    ]}
                  />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Industry Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Setor</CardTitle>
            <CardDescription>Clientes por setor de atividade</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Empresas",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Activity Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Desempenho de Atividades</CardTitle>
            <CardDescription>Taxa de conclusão e distribuição por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Activity Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {reportData.activityStats.completed}
                  </div>
                  <div className="text-sm text-muted-foreground">Concluídas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {reportData.activityStats.pending}
                  </div>
                  <div className="text-sm text-muted-foreground">Pendentes</div>
                </div>
              </div>

              {/* Activity Types */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Distribuição por Tipo</h4>
                {Object.entries(reportData.activityStats.typeDistribution).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{type}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Detalhado</CardTitle>
          <CardDescription>Métricas detalhadas por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Sales Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4" />
                Resumo de Vendas
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total de Oportunidades:</span>
                  <span className="font-medium">{reportData.opportunityStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Valor Total do Pipeline:</span>
                  <span className="font-medium">
                    <KwanzaCurrencyDisplay amount={reportData.opportunityStats.totalValue} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Valor Médio por Negócio:</span>
                  <span className="font-medium">
                    <KwanzaCurrencyDisplay amount={reportData.opportunityStats.averageValue} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Taxa de Conversão:</span>
                  <span className="font-medium">{reportData.opportunityStats.conversionRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Customer Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Resumo de Clientes
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total de Empresas:</span>
                  <span className="font-medium">{reportData.companyStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total de Contactos:</span>
                  <span className="font-medium">{reportData.contactStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Contactos Principais:</span>
                  <span className="font-medium">{reportData.contactStats.primary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Com Email:</span>
                  <span className="font-medium">{reportData.contactStats.withEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}