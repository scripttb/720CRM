"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Building2, Receipt, BarChart3, Shield, ArrowRight, CheckCircle, Globe, Zap } from "lucide-react"

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Sistema CRM Angola</span>
          </div>
          <Button onClick={handleGetStarted}>
            Aceder ao Sistema
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4">
            🇦🇴 Desenvolvido para Angola
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Sistema CRM Completo para Empresas Angolanas
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Gerir clientes, pipeline de vendas e faturação com certificação AGT. Totalmente adaptado para o mercado
            angolano com suporte a Kwanza e documentos locais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Funcionalidades Principais</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tudo o que precisa para gerir o seu negócio num só lugar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Building2 className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Gestão de Clientes</CardTitle>
              <CardDescription>
                Organize empresas e contactos com informações completas adaptadas para Angola
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Validação de BI e NIF
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Províncias e municípios
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Regimes fiscais angolanos
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Target className="h-10 w-10 text-green-600 mb-2" />
              <CardTitle>Pipeline de Vendas</CardTitle>
              <CardDescription>Acompanhe oportunidades desde o primeiro contacto até ao fecho</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Fases personalizáveis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Previsões em Kwanza
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Relatórios de desempenho
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Receipt className="h-10 w-10 text-purple-600 mb-2" />
              <CardTitle>Faturação AGT</CardTitle>
              <CardDescription>Sistema completo de faturação com certificação da AGT</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Certificação digital AGT
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Exportação SAF-T
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  QR Codes e ATCUD
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-orange-600 mb-2" />
              <CardTitle>Relatórios e Analytics</CardTitle>
              <CardDescription>Análise detalhada do desempenho de vendas e métricas</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Dashboard em tempo real
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Gráficos interactivos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Exportação de dados
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Globe className="h-10 w-10 text-teal-600 mb-2" />
              <CardTitle>Localização Angola</CardTitle>
              <CardDescription>Totalmente adaptado para o mercado e regulamentações angolanas</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Português de Angola
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Moeda Kwanza (AOA)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Fuso horário de Luanda
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/20 transition-colors">
            <CardHeader>
              <Shield className="h-10 w-10 text-red-600 mb-2" />
              <CardTitle>Segurança e Compliance</CardTitle>
              <CardDescription>Protecção de dados e conformidade com regulamentações locais</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Encriptação de dados
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Backup automático
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Auditoria completa
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Zap className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Pronto para Transformar o Seu Negócio?</h2>
            <p className="text-muted-foreground mb-8">
              Junte-se a centenas de empresas angolanas que já utilizam o nosso sistema CRM para aumentar as vendas e
              melhorar o relacionamento com os clientes.
            </p>
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8">
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-5 w-5" />
            <span className="font-semibold">Sistema CRM Angola</span>
          </div>
          <p className="text-sm">© 2024 Sistema CRM. Desenvolvido especialmente para empresas angolanas.</p>
        </div>
      </footer>
    </div>
  )
}
