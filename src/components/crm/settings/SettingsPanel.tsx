"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Bell, Shield, Database, Mail, Save, Users, Building2, Target } from "lucide-react"
import { toast } from "sonner"

export function SettingsPanel() {
  const [loading, setLoading] = useState(false)

  // General Settings
  const [companyName, setCompanyName] = useState("Minha Empresa CRM")
  const [companyEmail, setCompanyEmail] = useState("contacto@minhaempresa.ao")
  const [companyPhone, setCompanyPhone] = useState("+244-923-000-000")
  const [timezone, setTimezone] = useState("Africa/Luanda")
  const [currency, setCurrency] = useState("AOA")

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyReports, setWeeklyReports] = useState(true)
  const [dealAlerts, setDealAlerts] = useState(true)

  // User Management
  const [users] = useState([
    { id: 1, name: "António Silva", email: "antonio@empresa.ao", role: "Administrador", status: "Activo" },
    { id: 2, name: "Maria Santos", email: "maria@empresa.ao", role: "Gestor de Vendas", status: "Activo" },
    { id: 3, name: "João Fernandes", email: "joao@empresa.ao", role: "Representante de Vendas", status: "Inactivo" },
  ])

  const handleSaveSettings = async (section: string) => {
    console.log("[v0] Starting to save settings for section:", section)
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            resolve(undefined)
          } catch (error) {
            reject(error)
          }
        }, 1000)
      }).catch((error) => {
        console.error("[v0] Promise rejection in handleSaveSettings:", error)
        throw error
      })

      console.log("[v0] Settings saved successfully for section:", section)
      toast.success(`Configurações de ${section} guardadas com sucesso`)
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      toast.error("Falha ao guardar configurações")
    } finally {
      setLoading(false)
      console.log("[v0] Finished saving settings for section:", section)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Utilizadores
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Integrações
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>Actualizar os detalhes e preferências da sua empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email da Empresa</Label>
                  <Input
                    id="company-email"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telefone da Empresa</Label>
                  <Input id="company-phone" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Luanda">Hora de Angola (WAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Europe/Lisbon">Hora de Lisboa</SelectItem>
                      <SelectItem value="Europe/London">Hora de Londres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Moeda Padrão</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AOA">AOA - Kwanza Angolano</SelectItem>
                    <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - Libra Esterlina</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => handleSaveSettings("Geral")} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Configurar como pretende receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações via correio electrónico</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações push no seu navegador</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Relatórios Semanais</Label>
                  <p className="text-sm text-muted-foreground">Receber relatórios semanais de desempenho de vendas</p>
                </div>
                <Switch checked={weeklyReports} onCheckedChange={setWeeklyReports} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertas de Negócios</Label>
                  <p className="text-sm text-muted-foreground">Ser notificado quando negócios estão prestes a fechar</p>
                </div>
                <Switch checked={dealAlerts} onCheckedChange={setDealAlerts} />
              </div>

              <Button onClick={() => handleSaveSettings("Notificação")} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Utilizadores</CardTitle>
              <CardDescription>Gerir membros da equipa e as suas permissões</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Membros da Equipa</h4>
                  <Button size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Convidar Utilizador
                  </Button>
                </div>

                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{user.role}</Badge>
                        <Badge variant={user.status === "Activo" ? "default" : "secondary"}>{user.status}</Badge>
                        <Button variant="ghost" size="sm">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Configurar segurança e controlos de acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Política de Palavras-passe</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Definir requisitos mínimos para palavras-passe de utilizadores
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Mínimo 8 caracteres</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Requer letras maiúsculas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Requer números</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Requer caracteres especiais</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Gestão de Sessões</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Controlar comportamento de sessões de utilizadores
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Logout automático após inactividade</span>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings("Segurança")} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Configurações de Segurança
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>Conectar o seu CRM com serviços externos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">Integração de Email</h4>
                      <p className="text-sm text-muted-foreground">
                        Conectar com Gmail, Outlook ou outros fornecedores de email
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-green-600" />
                    <div>
                      <h4 className="font-medium">Integração de Calendário</h4>
                      <p className="text-sm text-muted-foreground">
                        Sincronizar reuniões e actividades com o seu calendário
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Conectado
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Automação de Marketing</h4>
                      <p className="text-sm text-muted-foreground">
                        Conectar com plataformas de marketing para rastreamento de leads
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-8 w-8 text-orange-600" />
                    <div>
                      <h4 className="font-medium">Exportação de Dados</h4>
                      <p className="text-sm text-muted-foreground">Exportar os seus dados CRM para sistemas externos</p>
                    </div>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
