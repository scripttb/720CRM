"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/ui/datepicker';
import { Label } from '@/components/ui/label';
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
  AreaChart,
  ComposedChart,
  Scatter,
  ScatterChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Target,
  Users,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  Download
} from 'lucide-react';
import { KwanzaCurrencyDisplay } from '@/components/angola/KwanzaCurrencyDisplay';
import { useCompanies } from '@/hooks/use-companies';
import { useContacts } from '@/hooks/use-contacts';
import { useOpportunities } from '@/hooks/use-opportunities';
import { useActivities } from '@/hooks/use-activities';
import { useBilling } from '@/hooks/use-billing';

export function AdvancedAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1),
    end: new Date()
  });

  const { getStatistics: getCompanyStats } = useCompanies();
  const { getStatistics: getContactStats } = useContacts();
  const { getStatistics: getOpportunityStats } = useOpportunities();
  const { getStatistics: getActivityStats } = useActivities();
  const { getStatistics: getBillingStats } = useBilling();

  // Generate comprehensive analytics data
  const analyticsData = useMemo(() => {
    const companyStats = getCompanyStats();
    const contactStats = getContactStats();
    const opportunityStats = getOpportunityStats();
    const activityStats = getActivityStats();
    const billingStats = getBillingStats();

    // Sales funnel data
    const funnelData = [
      { stage: 'Leads', count: 150, conversion: 100 },
      { stage: 'Qualificados', count: 120, conversion: 80 },
      { stage: 'Propostas', count: 80, conversion: 53.3 },
      { stage: 'Negociações', count: 45, conversion: 30 },
      { stage: 'Fechados', count: 25, conversion: 16.7 }
    ];

    // Revenue trend (mock data)
    const revenueTrend = [
      { month: 'Jul', revenue: 45000, target: 50000, deals: 12 },
      { month: 'Ago', revenue: 52000, target: 50000, deals: 15 },
      { month: 'Set', revenue: 48000, target: 55000, deals: 13 },
      { month: 'Out', revenue: 61000, target: 55000, deals: 18 },
      { month: 'Nov', revenue: 55000, target: 60000, deals: 16 },
      { month: 'Dez', revenue: 67000, target: 60000, deals: 20 }
    ];

    // Customer acquisition
    const acquisitionData = [
      { source: 'Website', customers: 45, cost: 1200, cac: 26.7 },
      { source: 'Referências', customers: 32, cost: 800, cac: 25.0 },
      { source: 'Redes Sociais', customers: 28, cost: 1500, cac: 53.6 },
      { source: 'Email Marketing', customers: 22, cost: 600, cac: 27.3 },
      { source: 'Eventos', customers: 18, cost: 2000, cac: 111.1 }
    ];

    // Performance metrics
    const performanceMetrics = {
      salesVelocity: 45.2, // days
      dealSize: opportunityStats.averageValue,
      winRate: opportunityStats.conversionRate,
      customerLifetimeValue: 125000,
      churnRate: 5.2,
      nps: 72
    };

    return {
      companyStats,
      contactStats,
      opportunityStats,
      activityStats,
      billingStats,
      funnelData,
      revenueTrend,
      acquisitionData,
      performanceMetrics
    };
  }, [getCompanyStats, getContactStats, getOpportunityStats, getActivityStats, getBillingStats]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  const exportAnalytics = () => {
    const exportData = {
      period: selectedPeriod,
      dateRange,
      metrics: analyticsData,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success('Analytics exportados com sucesso');
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Avançados
          </CardTitle>
          <CardDescription>
            Análise profunda do desempenho empresarial e tendências
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Último Mês</SelectItem>
                  <SelectItem value="3months">Últimos 3 Meses</SelectItem>
                  <SelectItem value="6months">Últimos 6 Meses</SelectItem>
                  <SelectItem value="1year">Último Ano</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Métrica Principal</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Receita</SelectItem>
                  <SelectItem value="deals">Negócios</SelectItem>
                  <SelectItem value="customers">Clientes</SelectItem>
                  <SelectItem value="activities">Atividades</SelectItem>
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
              <Button onClick={exportAnalytics} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Velocidade de Vendas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.performanceMetrics.salesVelocity} dias</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-5,2 dias</span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Vitória</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.performanceMetrics.winRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2,3%</span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio do Negócio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <KwanzaCurrencyDisplay amount={analyticsData.performanceMetrics.dealSize} showSymbol={false} />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8,7%</span> vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.performanceMetrics.nps}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5 pontos</span> vs período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue vs Target */}
        <Card>
          <CardHeader>
            <CardTitle>Receita vs Meta</CardTitle>
            <CardDescription>Comparação entre receita real e metas estabelecidas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Receita Real",
                  color: "hsl(var(--chart-1))",
                },
                target: {
                  label: "Meta",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analyticsData.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="var(--color-target)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sales Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Funil de Conversão</CardTitle>
            <CardDescription>Análise detalhada do funil de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Quantidade",
                  color: "hsl(var(--chart-3))",
                },
                conversion: {
                  label: "Conversão %",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analyticsData.funnelData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="count" fill="var(--color-count)" />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="conversion" 
                    stroke="var(--color-conversion)" 
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Customer Acquisition Cost */}
        <Card>
          <CardHeader>
            <CardTitle>Custo de Aquisição de Cliente (CAC)</CardTitle>
            <CardDescription>Análise de eficiência por canal de aquisição</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                customers: {
                  label: "Clientes",
                  color: "hsl(var(--chart-1))",
                },
                cac: {
                  label: "CAC (Kz)",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={analyticsData.acquisitionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="customers" name="Clientes" />
                  <YAxis dataKey="cac" name="CAC" />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      name === 'cac' ? `Kz ${value}` : value,
                      name === 'cac' ? 'CAC' : 'Clientes'
                    ]}
                  />
                  <Scatter dataKey="cac" fill="var(--color-cac)" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Activity Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Atividades</CardTitle>
            <CardDescription>Tipos de atividade e sua efetividade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analyticsData.activityStats.typeDistribution).map(([type, count]) => {
                const percentage = (count / analyticsData.activityStats.total) * 100;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{type}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{count}</span>
                        <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Previsões e Tendências</CardTitle>
          <CardDescription>
            Análise preditiva baseada em dados históricos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Previsão de Receita
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Próximo Mês:</span>
                  <span className="font-medium">
                    <KwanzaCurrencyDisplay amount={72000} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Próximo Trimestre:</span>
                  <span className="font-medium">
                    <KwanzaCurrencyDisplay amount={195000} />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Confiança:</span>
                  <Badge variant="outline" className="text-green-600">87%</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                Pipeline Health
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Qualidade do Pipeline:</span>
                  <Badge variant="outline" className="text-green-600">Boa</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Risco de Churn:</span>
                  <Badge variant="outline" className="text-yellow-600">Baixo</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Oportunidades em Risco:</span>
                  <span className="font-medium text-orange-600">3</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                Insights de Clientes
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Segmento Mais Valioso:</span>
                  <span className="font-medium">Grande Empresa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Setor em Crescimento:</span>
                  <span className="font-medium">Tecnologia</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Satisfação Média:</span>
                  <Badge variant="outline" className="text-green-600">4.2/5</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas Detalhadas</CardTitle>
          <CardDescription>
            Comparação detalhada de métricas por período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">
                  <KwanzaCurrencyDisplay amount={analyticsData.performanceMetrics.customerLifetimeValue} showSymbol={false} />
                </div>
                <div className="text-sm text-muted-foreground">Customer Lifetime Value</div>
                <div className="text-xs text-green-600 mt-1">+12,5% vs anterior</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{analyticsData.performanceMetrics.churnRate}%</div>
                <div className="text-sm text-muted-foreground">Taxa de Churn</div>
                <div className="text-xs text-red-600 mt-1">+0,8% vs anterior</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{analyticsData.activityStats.completionRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
                <div className="text-xs text-green-600 mt-1">+5,2% vs anterior</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{analyticsData.performanceMetrics.nps}</div>
                <div className="text-sm text-muted-foreground">Net Promoter Score</div>
                <div className="text-xs text-green-600 mt-1">+5 pontos vs anterior</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}