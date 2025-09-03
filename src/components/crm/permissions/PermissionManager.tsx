"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Shield, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Check,
  X,
  Settings
} from 'lucide-react';
import { User } from '@/types/crm';
import { mockUsers } from '@/lib/mock-data';
import { toast } from 'sonner';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermissions {
  role: string;
  permissions: string[];
}

const permissions: Permission[] = [
  // Companies
  { id: 'companies.view', name: 'Ver Empresas', description: 'Visualizar lista de empresas', category: 'Empresas' },
  { id: 'companies.create', name: 'Criar Empresas', description: 'Adicionar novas empresas', category: 'Empresas' },
  { id: 'companies.edit', name: 'Editar Empresas', description: 'Modificar dados de empresas', category: 'Empresas' },
  { id: 'companies.delete', name: 'Eliminar Empresas', description: 'Remover empresas do sistema', category: 'Empresas' },
  
  // Contacts
  { id: 'contacts.view', name: 'Ver Contactos', description: 'Visualizar lista de contactos', category: 'Contactos' },
  { id: 'contacts.create', name: 'Criar Contactos', description: 'Adicionar novos contactos', category: 'Contactos' },
  { id: 'contacts.edit', name: 'Editar Contactos', description: 'Modificar dados de contactos', category: 'Contactos' },
  { id: 'contacts.delete', name: 'Eliminar Contactos', description: 'Remover contactos do sistema', category: 'Contactos' },
  
  // Opportunities
  { id: 'opportunities.view', name: 'Ver Oportunidades', description: 'Visualizar pipeline de vendas', category: 'Vendas' },
  { id: 'opportunities.create', name: 'Criar Oportunidades', description: 'Adicionar novas oportunidades', category: 'Vendas' },
  { id: 'opportunities.edit', name: 'Editar Oportunidades', description: 'Modificar oportunidades', category: 'Vendas' },
  { id: 'opportunities.delete', name: 'Eliminar Oportunidades', description: 'Remover oportunidades', category: 'Vendas' },
  
  // Billing
  { id: 'billing.view', name: 'Ver Faturação', description: 'Visualizar documentos fiscais', category: 'Faturação' },
  { id: 'billing.create', name: 'Criar Documentos', description: 'Emitir faturas e proformas', category: 'Faturação' },
  { id: 'billing.edit', name: 'Editar Documentos', description: 'Modificar documentos fiscais', category: 'Faturação' },
  { id: 'billing.delete', name: 'Eliminar Documentos', description: 'Remover documentos fiscais', category: 'Faturação' },
  { id: 'billing.export', name: 'Exportar SAF-T', description: 'Gerar arquivos SAF-T', category: 'Faturação' },
  
  // Reports
  { id: 'reports.view', name: 'Ver Relatórios', description: 'Aceder a relatórios e analytics', category: 'Relatórios' },
  { id: 'reports.export', name: 'Exportar Relatórios', description: 'Exportar dados e relatórios', category: 'Relatórios' },
  
  // Administration
  { id: 'admin.users', name: 'Gerir Utilizadores', description: 'Adicionar/remover utilizadores', category: 'Administração' },
  { id: 'admin.settings', name: 'Configurações', description: 'Modificar configurações do sistema', category: 'Administração' },
  { id: 'admin.permissions', name: 'Gerir Permissões', description: 'Definir permissões de utilizadores', category: 'Administração' },
];

const defaultRolePermissions: RolePermissions[] = [
  {
    role: 'admin',
    permissions: permissions.map(p => p.id) // Admin tem todas as permissões
  },
  {
    role: 'sales_manager',
    permissions: [
      'companies.view', 'companies.create', 'companies.edit',
      'contacts.view', 'contacts.create', 'contacts.edit',
      'opportunities.view', 'opportunities.create', 'opportunities.edit', 'opportunities.delete',
      'billing.view', 'billing.create', 'billing.edit',
      'reports.view', 'reports.export'
    ]
  },
  {
    role: 'sales_rep',
    permissions: [
      'companies.view', 'companies.create',
      'contacts.view', 'contacts.create', 'contacts.edit',
      'opportunities.view', 'opportunities.create', 'opportunities.edit',
      'billing.view'
    ]
  }
];

export function PermissionManager() {
  const [users] = useState<User[]>(mockUsers);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>(defaultRolePermissions);
  const [selectedRole, setSelectedRole] = useState<string>('sales_rep');

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'sales_manager':
        return 'Gestor de Vendas';
      case 'sales_rep':
        return 'Representante de Vendas';
      default:
        return role;
    }
  };

  const getRolePermissions = (role: string) => {
    return rolePermissions.find(rp => rp.role === role)?.permissions || [];
  };

  const hasPermission = (role: string, permissionId: string) => {
    const rolePerms = getRolePermissions(role);
    return rolePerms.includes(permissionId);
  };

  const togglePermission = (role: string, permissionId: string) => {
    setRolePermissions(prev => 
      prev.map(rp => {
        if (rp.role === role) {
          const hasPermission = rp.permissions.includes(permissionId);
          return {
            ...rp,
            permissions: hasPermission 
              ? rp.permissions.filter(p => p !== permissionId)
              : [...rp.permissions, permissionId]
          };
        }
        return rp;
      })
    );
  };

  const savePermissions = () => {
    // Simulate saving to backend
    localStorage.setItem('crm_permissions', JSON.stringify(rolePermissions));
    toast.success('Permissões guardadas com sucesso');
  };

  const resetToDefaults = () => {
    setRolePermissions(defaultRolePermissions);
    toast.success('Permissões repostas para os valores padrão');
  };

  // Group permissions by category
  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const selectedRolePermissions = getRolePermissions(selectedRole);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestão de Permissões
          </CardTitle>
          <CardDescription>
            Configure as permissões de acesso para cada função de utilizador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label>Função a Configurar</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="sales_manager">Gestor de Vendas</SelectItem>
                  <SelectItem value="sales_rep">Representante de Vendas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={savePermissions}>
                <Check className="mr-2 h-4 w-4" />
                Guardar Alterações
              </Button>
              <Button variant="outline" onClick={resetToDefaults}>
                Repor Padrões
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users with Roles */}
      <Card>
        <CardHeader>
          <CardTitle>Utilizadores e Funções</CardTitle>
          <CardDescription>Utilizadores ativos e suas funções no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizador</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const userPermissions = getRolePermissions(user.role);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.first_name} {user.last_name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {userPermissions.length} permissões
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Matriz de Permissões - {getRoleDisplayName(selectedRole)}</CardTitle>
          <CardDescription>
            Configure as permissões específicas para a função selecionada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
              <div key={category} className="space-y-3">
                <h3 className="font-semibold text-lg border-b pb-2">{category}</h3>
                <div className="grid gap-3">
                  {categoryPermissions.map((permission) => {
                    const isEnabled = hasPermission(selectedRole, permission.id);
                    return (
                      <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Label className="font-medium">{permission.name}</Label>
                            {isEnabled ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <X className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={() => togglePermission(selectedRole, permission.id)}
                          disabled={selectedRole === 'admin'} // Admin sempre tem todas as permissões
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {selectedRole === 'admin' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Administrador</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                Os administradores têm acesso total a todas as funcionalidades do sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}