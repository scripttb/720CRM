# CRM Angola - Sistema de Gestão de Relacionamento com Clientes

Um sistema CRM completo desenvolvido especificamente para o mercado angolano, com funcionalidades de faturação, gestão de contactos e relatórios.

## 🚀 Funcionalidades

- **Gestão de Empresas e Contactos**
- **Pipeline de Vendas e Oportunidades**
- **Sistema de Faturação Angolano** (Proformas, Faturas, Notas de Crédito, Recibos)
- **Relatórios e Análises**
- **Localização para Angola** (Português, Kwanza, Fuso horário de Luanda)
- **Conformidade com SAF-T Angola**

## 🛠️ Configuração

### 1. Configuração do Supabase (Opcional)

O sistema funciona com dados de demonstração, mas para usar uma base de dados real:

1. Aceda ao [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá para **SQL Editor**
3. Execute o script `app.sql` completo para criar todas as tabelas
4. As credenciais já estão configuradas no `.env.local`

### 2. Contas de Demonstração

Use estas credenciais para testar o sistema:

- **Gestor:** demo@crm.com / password
- **Admin:** admin@crm.com / password
- **Vendedor:** vendedor@crm.com / password

### 3. Executar o Projeto

```bash
npm install
npm run dev
```

## 📊 Base de Dados

O ficheiro `app.sql` contém:
- Schema completo para CRM
- Dados específicos para Angola (províncias, moedas, impostos)
- Sistema de faturação conforme legislação angolana
- Dados de demonstração

## 🇦🇴 Características Angolanas

- **Moeda:** Kwanza (AOA) como padrão
- **Impostos:** IVA 14%, IRT, IS conforme legislação
- **Documentos:** BI, NIF, Alvará
- **Localização:** Português de Angola, fuso horário de Luanda
- **Faturação:** Conforme Decreto Executivo 48/19

## 📱 Tecnologias

- React + TypeScript
- Vite
- Supabase
- Tailwind CSS
- Shadcn/ui

## 🔧 Resolução de Problemas

Se encontrar erros de "tabela não encontrada":
1. Execute o script `app.sql` no Supabase SQL Editor
2. O sistema funcionará com dados mock até a base de dados estar configurada

Para problemas de autenticação:
- Use as contas de demonstração listadas acima
- O sistema tem fallback automático para dados mock