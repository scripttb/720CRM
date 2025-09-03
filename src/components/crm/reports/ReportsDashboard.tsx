"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { KwanzaCurrencyDisplay } from '@/components/angola/KwanzaCurrencyDisplay';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Calendar,
  Download,
  Filter,
  Loader2
} from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock data for reports
const salesData = [
  { month: 'Jan', revenue: 45000, deals: 12 },
  { month: 'Fev', revenue: 52000, deals: 15 },
  { month: 'Mar', revenue: 48000, deals: 13 },
  { month: 'Abr', revenue: 61000, deals: 18 },
  { month: 'Mai', revenue: 55000, deals: 16 },
  { month: 'Jun', revenue: 67000, deals: 20 },
];

const pipelineData = [
  { stage: 'Contacto Inicial', count: 45, value: 450000 },
  { stage: 'Qualificado', count: 32, value: 640000 },
  { stage: 'Proposta', count: 18, value: 540000 },
  { stage: 'Negociação', count: 12, value: 480000 },
  { stage: 'Fechado', count: 8, value: 320000 },
];

const sourceData = [
  { name: 'Sítio Web', value: 35, color: '#8884d8' },
  { name: 'Referência', value: 25, color: '#82ca9d' },
  { name: 'Redes Sociais', value: 20, color: '#ffc658' },
  { name: 'Campanha Email', value: 15, color: '#ff7300' },
  { name: 'Outros', value: 5, color: '#00ff00' },
];

export function ReportsDashboard() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReport, setSelectedReport] = useState('overview');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const reportTypes = [
    { value: 'overview', label: 'Visão Geral de Vendas' },
    { value: 'pipeline', label: 'Análise do Pipeline' },
    { value: 'performance', label: 'Desempenho da Equipa' },
    { value: 'forecast', label: 'Previsão de Vendas' },
  ];

  const periods = [
    { value: '1month', label: 'Último Mês' },
    { value: '3months', label: 'Últimos 3 Meses' },
    { value: '6months', label: 'Últimos 6 Meses' },
    { value: '1year', label: 'Último Ano' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-[200px]">
              <BarChart3 className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Seleccionar tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <KwanzaCurrencyDisplay amount={328000} />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12,5%</span> do período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negócios Fechados</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8,2%</span> do período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-2,1%</span> do período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Médio por Negócio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <KwanzaCurrencyDisplay amount={3489} />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5,7%</span> do período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Receita</CardTitle>
            <CardDescription>Receita mensal e contagem de negócios ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Receita",
                  color: "hsl(var(--chart-1))",
                },
                deals: {
                  label: "Negócios",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Pipeline Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Análise do Pipeline</CardTitle>
            <CardDescription>Oportunidades por fase do pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: {
                  label: "Contagem",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Fontes de Contactos</CardTitle>
            <CardDescription>Distribuição das fontes de contactos</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Percentagem",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividade Recente</CardTitle>
            <CardDescription>Últimas actividades de vendas e marcos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Negócio fechado com Acme Corp</p>
                  <p className="text-xs text-muted-foreground">Kz 25.000 • há 2 horas</p>
                </div>
                <Badge variant="outline" className="text-green-600">Ganho</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Novo contacto do sítio web</p>
                  <p className="text-xs text-muted-foreground">Global Industries • há 4 horas</p>
                </div>
                <Badge variant="outline" className="text-blue-600">Novo</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-orange-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Proposta enviada para TechStart</p>
                  <p className="text-xs text-muted-foreground">Kz 45.000 • há 6 horas</p>
                </div>
                <Badge variant="outline" className="text-orange-600">Proposta</Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-purple-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Reunião agendada</p>
                  <p className="text-xs text-muted-foreground">Innovation Labs • há 8 horas</p>
                </div>
                <Badge variant="outline" className="text-purple-600">Reunião</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
