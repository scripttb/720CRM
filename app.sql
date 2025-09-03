-- Users and Authentication
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'sales_manager', 'sales_rep')),
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer Companies
CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    size VARCHAR(50),
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    logo_url TEXT,
    description TEXT,
    annual_revenue DECIMAL(15,2),
    employee_count INTEGER,
    assigned_user_id BIGINT,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Individual Contacts
CREATE TABLE contacts (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    linkedin_url VARCHAR(255),
    avatar_url TEXT,
    notes TEXT,
    assigned_user_id BIGINT,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sales Pipeline Stages
CREATE TABLE pipeline_stages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    stage_order INTEGER NOT NULL,
    probability DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sales Opportunities
CREATE TABLE opportunities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company_id BIGINT,
    contact_id BIGINT,
    assigned_user_id BIGINT,
    pipeline_stage_id BIGINT,
    value DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    probability DECIMAL(5,2),
    expected_close_date DATE,
    actual_close_date DATE,
    source VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'won', 'lost')),
    lost_reason TEXT,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activities and Tasks
CREATE TABLE activities (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'task', 'note')),
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    company_id BIGINT,
    contact_id BIGINT,
    opportunity_id BIGINT,
    assigned_user_id BIGINT,
    created_by_user_id BIGINT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    location VARCHAR(255),
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Communication Log
CREATE TABLE communications (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'call', 'meeting', 'sms', 'social')),
    direction VARCHAR(20) CHECK (direction IN ('inbound', 'outbound')),
    subject VARCHAR(255),
    content TEXT,
    company_id BIGINT,
    contact_id BIGINT,
    opportunity_id BIGINT,
    user_id BIGINT,
    external_id VARCHAR(255),
    metadata JSONB,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Document Management
CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    company_id BIGINT,
    contact_id BIGINT,
    opportunity_id BIGINT,
    uploaded_by_user_id BIGINT,
    is_public BOOLEAN DEFAULT false,
    description TEXT,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Customer Segments
CREATE TABLE customer_segments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    criteria JSONB,
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT true,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Company Segment Assignments
CREATE TABLE company_segments (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL,
    segment_id BIGINT NOT NULL,
    assigned_by_user_id BIGINT,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(company_id, segment_id)
);

-- Tags System
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7),
    description TEXT,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tag Assignments
CREATE TABLE entity_tags (
    id BIGSERIAL PRIMARY KEY,
    tag_id BIGINT NOT NULL,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('company', 'contact', 'opportunity')),
    entity_id BIGINT NOT NULL,
    tagged_by_user_id BIGINT,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tag_id, entity_type, entity_id)
);

-- Audit Trail
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('create', 'update', 'delete', 'view')),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_companies_assigned_user ON companies(assigned_user_id);
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_contacts_company ON contacts(company_id);
CREATE INDEX idx_contacts_assigned_user ON contacts(assigned_user_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_opportunities_company ON opportunities(company_id);
CREATE INDEX idx_opportunities_assigned_user ON opportunities(assigned_user_id);
CREATE INDEX idx_opportunities_stage ON opportunities(pipeline_stage_id);
CREATE INDEX idx_opportunities_close_date ON opportunities(expected_close_date);
CREATE INDEX idx_activities_assigned_user ON activities(assigned_user_id);
CREATE INDEX idx_activities_due_date ON activities(due_date);
CREATE INDEX idx_activities_company ON activities(company_id);
CREATE INDEX idx_communications_company ON communications(company_id);
CREATE INDEX idx_communications_contact ON communications(contact_id);
CREATE INDEX idx_documents_company ON documents(company_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);

-- Insert Default Pipeline Stages
INSERT INTO pipeline_stages (name, description, stage_order, probability) VALUES
('Lead', 'Initial contact or inquiry', 1, 10),
('Qualified', 'Lead has been qualified as potential customer', 2, 25),
('Proposal', 'Proposal has been sent to prospect', 3, 50),
('Negotiation', 'In active negotiation phase', 4, 75),
('Closed Won', 'Deal successfully closed', 5, 100),
('Closed Lost', 'Deal was lost', 6, 0);

-- Insert Sample Users
INSERT INTO users (email, password_hash, first_name, last_name, role, phone) VALUES
('admin@crm.com', '$2b$10$example_hash', 'Admin', 'User', 'admin', '+1-555-0001'),
('manager@crm.com', '$2b$10$example_hash', 'Sales', 'Manager', 'sales_manager', '+1-555-0002'),
('rep1@crm.com', '$2b$10$example_hash', 'John', 'Smith', 'sales_rep', '+1-555-0003'),
('rep2@crm.com', '$2b$10$example_hash', 'Sarah', 'Johnson', 'sales_rep', '+1-555-0004'),
('rep3@crm.com', '$2b$10$example_hash', 'Mike', 'Davis', 'sales_rep', '+1-555-0005');

-- Insert Sample Companies
INSERT INTO companies (name, industry, size, website, phone, email, address, city, state, country, annual_revenue, employee_count, assigned_user_id) VALUES
('TechCorp Solutions', 'Technology', 'Medium', 'https://techcorp.com', '+1-555-1001', 'info@techcorp.com', '123 Tech Street', 'San Francisco', 'CA', 'USA', 5000000.00, 150, 3),
('Global Manufacturing Inc', 'Manufacturing', 'Large', 'https://globalmanuf.com', '+1-555-1002', 'contact@globalmanuf.com', '456 Industrial Ave', 'Detroit', 'MI', 'USA', 25000000.00, 500, 4),
('StartupXYZ', 'Software', 'Small', 'https://startupxyz.com', '+1-555-1003', 'hello@startupxyz.com', '789 Innovation Blvd', 'Austin', 'TX', 'USA', 1000000.00, 25, 5),
('Healthcare Partners', 'Healthcare', 'Medium', 'https://healthpartners.com', '+1-555-1004', 'info@healthpartners.com', '321 Medical Center Dr', 'Boston', 'MA', 'USA', 8000000.00, 200, 3),
('Retail Chain Co', 'Retail', 'Large', 'https://retailchain.com', '+1-555-1005', 'corporate@retailchain.com', '654 Commerce St', 'Chicago', 'IL', 'USA', 50000000.00, 1000, 4),
('Consulting Group', 'Consulting', 'Medium', 'https://consultinggroup.com', '+1-555-1006', 'contact@consultinggroup.com', '987 Business Plaza', 'New York', 'NY', 'USA', 12000000.00, 75, 5),
('Energy Solutions Ltd', 'Energy', 'Large', 'https://energysolutions.com', '+1-555-1007', 'info@energysolutions.com', '147 Power Ave', 'Houston', 'TX', 'USA', 75000000.00, 800, 3);

-- Insert Sample Contacts
INSERT INTO contacts (company_id, first_name, last_name, email, phone, job_title, department, is_primary, assigned_user_id) VALUES
(1, 'Robert', 'Chen', 'robert.chen@techcorp.com', '+1-555-2001', 'CTO', 'Technology', true, 3),
(1, 'Lisa', 'Wang', 'lisa.wang@techcorp.com', '+1-555-2002', 'VP Sales', 'Sales', false, 3),
(2, 'David', 'Miller', 'david.miller@globalmanuf.com', '+1-555-2003', 'CEO', 'Executive', true, 4),
(3, 'Emma', 'Thompson', 'emma@startupxyz.com', '+1-555-2004', 'Founder', 'Executive', true, 5),
(4, 'James', 'Wilson', 'james.wilson@healthpartners.com', '+1-555-2005', 'Director of Operations', 'Operations', true, 3),
(5, 'Maria', 'Garcia', 'maria.garcia@retailchain.com', '+1-555-2006', 'VP Technology', 'IT', true, 4),
(6, 'Thomas', 'Brown', 'thomas.brown@consultinggroup.com', '+1-555-2007', 'Managing Partner', 'Executive', true, 5),
(7, 'Jennifer', 'Davis', 'jennifer.davis@energysolutions.com', '+1-555-2008', 'VP Business Development', 'Sales', true, 3);

-- Insert Sample Opportunities
INSERT INTO opportunities (name, company_id, contact_id, assigned_user_id, pipeline_stage_id, value, expected_close_date, source, description) VALUES
('TechCorp CRM Implementation', 1, 1, 3, 3, 150000.00, '2024-03-15', 'Website', 'Full CRM system implementation for 150 users'),
('Global Manufacturing ERP Upgrade', 2, 3, 4, 2, 500000.00, '2024-04-30', 'Referral', 'Enterprise resource planning system upgrade'),
('StartupXYZ Growth Package', 3, 4, 5, 4, 25000.00, '2024-02-28', 'Cold Call', 'Startup growth and scaling solutions'),
('Healthcare Digital Transformation', 4, 5, 3, 2, 300000.00, '2024-05-15', 'Trade Show', 'Complete digital transformation project'),
('Retail Chain POS System', 5, 6, 4, 1, 200000.00, '2024-06-01', 'Website', 'Point of sale system for 50 locations'),
('Consulting Automation Tools', 6, 7, 5, 3, 75000.00, '2024-03-30', 'LinkedIn', 'Business process automation suite'),
('Energy Management Platform', 7, 8, 3, 2, 400000.00, '2024-07-15', 'Partner', 'Comprehensive energy management solution');

-- Insert Sample Customer Segments
INSERT INTO customer_segments (name, description, color) VALUES
('Enterprise', 'Large enterprise customers with 500+ employees', '#FF6B6B'),
('Mid-Market', 'Medium-sized companies with 50-500 employees', '#4ECDC4'),
('Small Business', 'Small businesses with less than 50 employees', '#45B7D1'),
('High Value', 'Customers with annual revenue over $10M', '#96CEB4'),
('Technology', 'Companies in the technology sector', '#FFEAA7');

-- Insert Sample Tags
INSERT INTO tags (name, color, description) VALUES
('Hot Lead', '#FF4757', 'High priority leads requiring immediate attention'),
('VIP Customer', '#5352ED', 'Very important customers with special treatment'),
('Renewal Due', '#FFA502', 'Customers with upcoming contract renewals'),
('Upsell Opportunity', '#2ED573', 'Potential for additional product sales'),
('At Risk', '#FF3838', 'Customers at risk of churning');

-- Tabela para configurações de localização e idiomas
CREATE TABLE localization_settings (
    id BIGSERIAL PRIMARY KEY,
    locale_code VARCHAR(10) NOT NULL UNIQUE,
    language_name VARCHAR(100) NOT NULL,
    country_code VARCHAR(3) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    date_format VARCHAR(50) DEFAULT 'DD/MM/YYYY',
    time_format VARCHAR(20) DEFAULT '24h',
    timezone VARCHAR(50) DEFAULT 'Africa/Luanda',
    decimal_separator VARCHAR(1) DEFAULT ',',
    thousands_separator VARCHAR(1) DEFAULT '.',
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para traduções de interface
CREATE TABLE translations (
    id BIGSERIAL PRIMARY KEY,
    locale_code VARCHAR(10) NOT NULL,
    translation_key VARCHAR(255) NOT NULL,
    translation_value TEXT NOT NULL,
    context VARCHAR(100),
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(locale_code, translation_key)
);

-- Tabela para configurações de moedas
CREATE TABLE currencies (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    decimal_places INTEGER DEFAULT 2,
    exchange_rate NUMERIC(15,6) DEFAULT 1.0,
    is_base_currency BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para tipos de documentos angolanos
CREATE TABLE document_types (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    validation_pattern VARCHAR(255),
    is_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para informações fiscais e regulamentares
CREATE TABLE tax_configurations (
    id BIGSERIAL PRIMARY KEY,
    tax_type VARCHAR(50) NOT NULL,
    tax_name VARCHAR(100) NOT NULL,
    tax_rate NUMERIC(5,2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE,
    effective_to DATE,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar colunas específicas para Angola na tabela companies
ALTER TABLE companies ADD COLUMN nif VARCHAR(20);
ALTER TABLE companies ADD COLUMN alvara_number VARCHAR(50);
ALTER TABLE companies ADD COLUMN tax_regime VARCHAR(50);
ALTER TABLE companies ADD COLUMN province VARCHAR(100);
ALTER TABLE companies ADD COLUMN municipality VARCHAR(100);

-- Adicionar colunas específicas para Angola na tabela contacts
ALTER TABLE contacts ADD COLUMN bi_number VARCHAR(20);
ALTER TABLE contacts ADD COLUMN nif VARCHAR(20);
ALTER TABLE contacts ADD COLUMN nationality VARCHAR(100) DEFAULT 'Angolana';

-- Adicionar colunas específicas para Angola na tabela users
ALTER TABLE users ADD COLUMN bi_number VARCHAR(20);
ALTER TABLE users ADD COLUMN nif VARCHAR(20);
ALTER TABLE users ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'pt-AO';

-- Atualizar a tabela opportunities para suporte melhor a moedas
ALTER TABLE opportunities ALTER COLUMN currency SET DEFAULT 'AOA';

-- Criar índices para melhor performance
CREATE INDEX idx_translations_locale ON translations(locale_code);
CREATE INDEX idx_translations_key ON translations(translation_key);
CREATE INDEX idx_companies_nif ON companies(nif);
CREATE INDEX idx_contacts_bi ON contacts(bi_number);
CREATE INDEX idx_users_preferred_language ON users(preferred_language);

-- Inserir configurações de localização para Angola
INSERT INTO localization_settings (locale_code, language_name, country_code, currency_code, date_format, time_format, timezone, is_default, is_active) VALUES
('pt-AO', 'Português (Angola)', 'AO', 'AOA', 'DD/MM/YYYY', '24h', 'Africa/Luanda', TRUE, TRUE),
('pt-BR', 'Português (Brasil)', 'BR', 'BRL', 'DD/MM/YYYY', '24h', 'America/Sao_Paulo', FALSE, TRUE),
('en-US', 'English (United States)', 'US', 'USD', 'MM/DD/YYYY', '12h', 'America/New_York', FALSE, TRUE),
('pt-PT', 'Português (Portugal)', 'PT', 'EUR', 'DD/MM/YYYY', '24h', 'Europe/Lisbon', FALSE, TRUE),
('fr-FR', 'Français (France)', 'FR', 'EUR', 'DD/MM/YYYY', '24h', 'Europe/Paris', FALSE, TRUE);

-- Inserir moedas principais
INSERT INTO currencies (code, name, symbol, decimal_places, exchange_rate, is_base_currency, is_active) VALUES
('AOA', 'Kwanza Angolano', 'Kz', 2, 1.0, TRUE, TRUE),
('USD', 'Dólar Americano', '$', 2, 830.0, FALSE, TRUE),
('EUR', 'Euro', '€', 2, 900.0, FALSE, TRUE),
('BRL', 'Real Brasileiro', 'R$', 2, 150.0, FALSE, TRUE),
('ZAR', 'Rand Sul-Africano', 'R', 2, 45.0, FALSE, TRUE);

-- Inserir tipos de documentos angolanos
INSERT INTO document_types (code, name, description, validation_pattern, is_required, is_active) VALUES
('BI', 'Bilhete de Identidade', 'Documento de identificação nacional angolano', '^[0-9]{9}[A-Z]{2}[0-9]{3}$', TRUE, TRUE),
('NIF', 'Número de Identificação Fiscal', 'Número de identificação fiscal angolano', '^[0-9]{9}$', TRUE, TRUE),
('ALVARA', 'Alvará Comercial', 'Licença comercial para empresas', '^[A-Z0-9]{10,20}$', FALSE, TRUE),
('PASSPORT', 'Passaporte', 'Documento de viagem internacional', '^[A-Z]{2}[0-9]{7}$', FALSE, TRUE),
('CARTA_CONDUCAO', 'Carta de Condução', 'Licença de condução angolana', '^[0-9]{8}$', FALSE, TRUE);

-- Inserir configurações fiscais angolanas
INSERT INTO tax_configurations (tax_type, tax_name, tax_rate, description, is_active, effective_from) VALUES
('IVA', 'Imposto sobre o Valor Acrescentado', 14.00, 'Taxa geral de IVA em Angola', TRUE, '2023-01-01'),
('IVA_REDUZIDO', 'IVA Taxa Reduzida', 7.00, 'Taxa reduzida de IVA para produtos essenciais', TRUE, '2023-01-01'),
('IRT', 'Imposto sobre o Rendimento do Trabalho', 7.00, 'Imposto sobre salários até 70.000 Kz', TRUE, '2023-01-01'),
('IRT_MEDIO', 'IRT Taxa Média', 15.50, 'Imposto sobre salários de 70.001 a 150.000 Kz', TRUE, '2023-01-01'),
('IRT_ALTO', 'IRT Taxa Alta', 25.00, 'Imposto sobre salários acima de 150.000 Kz', TRUE, '2023-01-01'),
('IS', 'Imposto sobre Sociedades', 25.00, 'Imposto sobre lucros empresariais', TRUE, '2023-01-01'),
('SISA', 'Sisa', 2.00, 'Imposto sobre transmissão de bens imóveis', TRUE, '2023-01-01');

-- Inserir traduções básicas para português de Angola
INSERT INTO translations (locale_code, translation_key, translation_value, context) VALUES
('pt-AO', 'welcome', 'Bem-vindo', 'interface'),
('pt-AO', 'login', 'Entrar', 'interface'),
('pt-AO', 'logout', 'Sair', 'interface'),
('pt-AO', 'dashboard', 'Painel Principal', 'interface'),
('pt-AO', 'companies', 'Empresas', 'interface'),
('pt-AO', 'contacts', 'Contactos', 'interface'),
('pt-AO', 'opportunities', 'Oportunidades', 'interface'),
('pt-AO', 'activities', 'Actividades', 'interface'),
('pt-AO', 'reports', 'Relatórios', 'interface'),
('pt-AO', 'settings', 'Configurações', 'interface'),
('pt-AO', 'save', 'Guardar', 'interface'),
('pt-AO', 'cancel', 'Cancelar', 'interface'),
('pt-AO', 'delete', 'Eliminar', 'interface'),
('pt-AO', 'edit', 'Editar', 'interface'),
('pt-AO', 'create', 'Criar', 'interface'),
('pt-AO', 'search', 'Pesquisar', 'interface'),
('pt-AO', 'filter', 'Filtrar', 'interface'),
('pt-AO', 'export', 'Exportar', 'interface'),
('pt-AO', 'import', 'Importar', 'interface'),
('pt-AO', 'currency_aoa', 'Kwanza', 'currency'),
('pt-AO', 'phone_number', 'Número de Telefone', 'form'),
('pt-AO', 'email_address', 'Endereço de Email', 'form'),
('pt-AO', 'bi_number', 'Número do BI', 'form'),
('pt-AO', 'nif_number', 'Número do NIF', 'form'),
('pt-AO', 'province', 'Província', 'form'),
('pt-AO', 'municipality', 'Município', 'form'),
('pt-AO', 'address', 'Morada', 'form'),
('pt-AO', 'postal_code', 'Código Postal', 'form');

-- Tabela de configurações da empresa para faturação e SAF-T
CREATE TABLE company_configs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    nif VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Angola',
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url TEXT,
    bank_name VARCHAR(255),
    bank_account VARCHAR(50),
    iban VARCHAR(50),
    swift_code VARCHAR(20),
    software_name VARCHAR(100) DEFAULT 'CRM Angola',
    software_version VARCHAR(20) DEFAULT '1.0',
    certificate_number VARCHAR(50) DEFAULT 'n31.1/AGT20',
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de sequências de documentos
CREATE TABLE document_sequences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    document_type VARCHAR(10) NOT NULL, -- FT, NC, RG, PF
    series VARCHAR(10) NOT NULL,
    current_number INTEGER DEFAULT 0,
    year INTEGER NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, document_type, series, year)
);

-- Tabela de produtos/serviços
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    sku VARCHAR(100),
    category VARCHAR(100),
    unit_price NUMERIC(15,2) NOT NULL DEFAULT 0,
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 14.00,
    tax_exemption_code VARCHAR(10), -- M00, M02, M11, M12
    tax_exemption_reason TEXT,
    is_service BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de proformas
CREATE TABLE proformas (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    document_number VARCHAR(50) NOT NULL,
    company_id BIGINT,
    contact_id BIGINT,
    issue_date DATE NOT NULL,
    due_date DATE,
    subtotal NUMERIC(15,2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'AOA',
    status VARCHAR(20) DEFAULT 'draft', -- draft, sent, accepted, rejected, converted
    notes TEXT,
    terms_conditions TEXT,
    converted_to_invoice_id BIGINT,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'converted'))
);

-- Tabela de itens de proforma
CREATE TABLE proforma_items (
    id BIGSERIAL PRIMARY KEY,
    proforma_id BIGINT NOT NULL,
    product_id BIGINT,
    description TEXT NOT NULL,
    quantity NUMERIC(10,3) NOT NULL DEFAULT 1,
    unit_price NUMERIC(15,2) NOT NULL,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    discount_amount NUMERIC(15,2) DEFAULT 0,
    subtotal NUMERIC(15,2) NOT NULL,
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 14.00,
    tax_exemption_code VARCHAR(10),
    tax_exemption_reason TEXT,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15,2) NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de faturas
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    document_number VARCHAR(50) NOT NULL,
    atcud VARCHAR(100), -- Código Único de Documento AGT
    hash_control VARCHAR(255), -- Hash de controlo
    digital_signature TEXT, -- Assinatura digital
    qr_code_data TEXT, -- Dados do QR Code
    company_id BIGINT,
    contact_id BIGINT,
    proforma_id BIGINT, -- Referência à proforma original
    issue_date DATE NOT NULL,
    due_date DATE,
    subtotal NUMERIC(15,2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'AOA',
    status VARCHAR(20) DEFAULT 'issued', -- issued, paid, overdue, cancelled
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, partial, paid
    paid_amount NUMERIC(15,2) DEFAULT 0,
    notes TEXT,
    terms_conditions TEXT,
    certification_date TIMESTAMP WITH TIME ZONE,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CHECK (status IN ('issued', 'paid', 'overdue', 'cancelled')),
    CHECK (payment_status IN ('pending', 'partial', 'paid'))
);

-- Tabela de itens de fatura
CREATE TABLE invoice_items (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    product_id BIGINT,
    description TEXT NOT NULL,
    quantity NUMERIC(10,3) NOT NULL DEFAULT 1,
    unit_price NUMERIC(15,2) NOT NULL,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    discount_amount NUMERIC(15,2) DEFAULT 0,
    subtotal NUMERIC(15,2) NOT NULL,
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 14.00,
    tax_exemption_code VARCHAR(10),
    tax_exemption_reason TEXT,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15,2) NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de notas de crédito
CREATE TABLE credit_notes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    document_number VARCHAR(50) NOT NULL,
    atcud VARCHAR(100),
    hash_control VARCHAR(255),
    digital_signature TEXT,
    qr_code_data TEXT,
    original_invoice_id BIGINT NOT NULL, -- Fatura original
    original_invoice_number VARCHAR(50) NOT NULL,
    company_id BIGINT,
    contact_id BIGINT,
    issue_date DATE NOT NULL,
    reason TEXT NOT NULL, -- Motivo obrigatório
    subtotal NUMERIC(15,2) NOT NULL DEFAULT 0,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'AOA',
    status VARCHAR(20) DEFAULT 'issued',
    notes TEXT,
    certification_date TIMESTAMP WITH TIME ZONE,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens de nota de crédito
CREATE TABLE credit_note_items (
    id BIGSERIAL PRIMARY KEY,
    credit_note_id BIGINT NOT NULL,
    original_invoice_item_id BIGINT,
    product_id BIGINT,
    description TEXT NOT NULL,
    quantity NUMERIC(10,3) NOT NULL DEFAULT 1,
    unit_price NUMERIC(15,2) NOT NULL,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    discount_amount NUMERIC(15,2) DEFAULT 0,
    subtotal NUMERIC(15,2) NOT NULL,
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 14.00,
    tax_exemption_code VARCHAR(10),
    tax_exemption_reason TEXT,
    tax_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(15,2) NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de métodos de pagamento
CREATE TABLE payment_methods (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de recibos de pagamento
CREATE TABLE payment_receipts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    document_number VARCHAR(50) NOT NULL,
    atcud VARCHAR(100),
    hash_control VARCHAR(255),
    digital_signature TEXT,
    qr_code_data TEXT,
    company_id BIGINT,
    contact_id BIGINT,
    issue_date DATE NOT NULL,
    payment_date DATE NOT NULL,
    payment_method_id BIGINT,
    payment_reference VARCHAR(100),
    total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'AOA',
    status VARCHAR(20) DEFAULT 'issued',
    notes TEXT,
    certification_date TIMESTAMP WITH TIME ZONE,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    modify_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de itens de recibo (faturas liquidadas)
CREATE TABLE payment_receipt_items (
    id BIGSERIAL PRIMARY KEY,
    payment_receipt_id BIGINT NOT NULL,
    invoice_id BIGINT NOT NULL,
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    invoice_total NUMERIC(15,2) NOT NULL,
    paid_amount NUMERIC(15,2) NOT NULL,
    create_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_company_configs_user ON company_configs(user_id);
CREATE INDEX idx_document_sequences_user_type ON document_sequences(user_id, document_type);
CREATE INDEX idx_products_user ON products(user_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_proformas_user ON proformas(user_id);
CREATE INDEX idx_proformas_company ON proformas(company_id);
CREATE INDEX idx_proformas_status ON proformas(status);
CREATE INDEX idx_proforma_items_proforma ON proforma_items(proforma_id);
CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_company ON invoices(company_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX idx_invoice_items_invoice ON invoice_items(invoice_id);
CREATE INDEX idx_credit_notes_user ON credit_notes(user_id);
CREATE INDEX idx_credit_notes_original_invoice ON credit_notes(original_invoice_id);
CREATE INDEX idx_credit_note_items_credit_note ON credit_note_items(credit_note_id);
CREATE INDEX idx_payment_receipts_user ON payment_receipts(user_id);
CREATE INDEX idx_payment_receipts_company ON payment_receipts(company_id);
CREATE INDEX idx_payment_receipt_items_receipt ON payment_receipt_items(payment_receipt_id);
CREATE INDEX idx_payment_receipt_items_invoice ON payment_receipt_items(invoice_id);

-- Função para gerar número de documento
CREATE OR REPLACE FUNCTION generate_document_number(
    p_user_id BIGINT,
    p_document_type VARCHAR(10),
    p_series VARCHAR(10) DEFAULT 'A'
) RETURNS VARCHAR(50) AS $$
DECLARE
    v_year INTEGER;
    v_next_number INTEGER;
    v_document_number VARCHAR(50);
BEGIN
    v_year := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Inserir ou atualizar sequência
    INSERT INTO document_sequences (user_id, document_type, series, current_number, year)
    VALUES (p_user_id, p_document_type, p_series, 1, v_year)
    ON CONFLICT (user_id, document_type, series, year)
    DO UPDATE SET 
        current_number = document_sequences.current_number + 1,
        modify_time = CURRENT_TIMESTAMP
    RETURNING current_number INTO v_next_number;
    
    -- Gerar número do documento
    v_document_number := p_document_type || ' ' || v_year || '/' || LPAD(v_next_number::TEXT, 6, '0');
    
    RETURN v_document_number;
END;
$$ LANGUAGE plpgsql;

-- Dados iniciais para métodos de pagamento
INSERT INTO payment_methods (name, code, description) VALUES
('Numerário', 'NU', 'Pagamento em dinheiro'),
('Transferência Bancária', 'TB', 'Transferência bancária'),
('Cheque', 'CH', 'Pagamento por cheque'),
('Cartão de Débito', 'CD', 'Pagamento com cartão de débito'),
('Cartão de Crédito', 'CC', 'Pagamento com cartão de crédito'),
('Multicaixa Express', 'ME', 'Pagamento via Multicaixa Express'),
('Unitel Money', 'UM', 'Pagamento via Unitel Money'),
('Kwik', 'KW', 'Pagamento via Kwik'),
('Outros', 'OU', 'Outros métodos de pagamento');

-- Dados de exemplo para produtos
INSERT INTO products (user_id, name, description, sku, category, unit_price, tax_rate, is_service) VALUES
(1, 'Consultoria Empresarial', 'Serviços de consultoria para gestão empresarial', 'CONS-001', 'Serviços', 50000.00, 14.00, true),
(1, 'Formação Profissional', 'Cursos de formação profissional personalizados', 'FORM-001', 'Educação', 25000.00, 14.00, true),
(1, 'Auditoria Financeira', 'Serviços de auditoria e revisão financeira', 'AUD-001', 'Serviços', 75000.00, 14.00, true),
(1, 'Software de Gestão', 'Licença anual de software de gestão empresarial', 'SOFT-001', 'Software', 120000.00, 14.00, false),
(1, 'Suporte Técnico', 'Suporte técnico mensal para sistemas', 'SUP-001', 'Serviços', 15000.00, 14.00, true),
(1, 'Equipamento Informático', 'Computadores e equipamentos de escritório', 'EQ-001', 'Equipamentos', 80000.00, 14.00, false),
(1, 'Material de Escritório', 'Papelaria e material de escritório', 'MAT-001', 'Material', 5000.00, 14.00, false),
(1, 'Serviços de Marketing', 'Campanhas publicitárias e marketing digital', 'MARK-001', 'Marketing', 35000.00, 14.00, true);

-- Dados de exemplo para configuração da empresa
INSERT INTO company_configs (user_id, company_name, nif, address, city, province, postal_code, phone, email) VALUES
(1, 'Empresa Exemplo Lda', '5417000001', 'Rua da Independência, 123', 'Luanda', 'Luanda', '1000', '+244 923 456 789', 'geral@exemplo.ao');

-- Dados de exemplo para proformas
INSERT INTO proformas (user_id, document_number, company_id, contact_id, issue_date, due_date, subtotal, tax_amount, total_amount, status) VALUES
(1, 'PF 2024/000001', 1, 1, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 100000.00, 14000.00, 114000.00, 'sent'),
(1, 'PF 2024/000002', 2, 2, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 75000.00, 10500.00, 85500.00, 'accepted'),
(1, 'PF 2024/000003', 3, 3, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 150000.00, 21000.00, 171000.00, 'draft');

-- Dados de exemplo para itens de proforma
INSERT INTO proforma_items (proforma_id, product_id, description, quantity, unit_price, subtotal, tax_rate, tax_amount, total_amount) VALUES
(1, 1, 'Consultoria Empresarial - Análise de Processos', 2, 50000.00, 100000.00, 14.00, 14000.00, 114000.00),
(2, 2, 'Formação Profissional - Gestão de Equipas', 3, 25000.00, 75000.00, 14.00, 10500.00, 85500.00),
(3, 3, 'Auditoria Financeira - Revisão Anual', 2, 75000.00, 150000.00, 14.00, 21000.00, 171000.00);

-- Dados de exemplo para faturas
INSERT INTO invoices (user_id, document_number, atcud, company_id, contact_id, issue_date, due_date, subtotal, tax_amount, total_amount, status) VALUES
(1, 'FT 2024/000001', 'FT-1-1234567890', 1, 1, CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '15 days', 50000.00, 7000.00, 57000.00, 'issued'),
(1, 'FT 2024/000002', 'FT-2-1234567891', 2, 2, CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE + INTERVAL '20 days', 120000.00, 16800.00, 136800.00, 'paid'),
(1, 'FT 2024/000003', 'FT-3-1234567892', 3, 3, CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '25 days', 80000.00, 11200.00, 91200.00, 'issued');

-- Dados de exemplo para itens de fatura
INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, subtotal, tax_rate, tax_amount, total_amount) VALUES
(1, 1, 'Consultoria Empresarial', 1, 50000.00, 50000.00, 14.00, 7000.00, 57000.00),
(2, 4, 'Software de Gestão - Licença Anual', 1, 120000.00, 120000.00, 14.00, 16800.00, 136800.00),
(3, 6, 'Equipamento Informático', 1, 80000.00, 80000.00, 14.00, 11200.00, 91200.00);

-- Dados de exemplo para recibos de pagamento
INSERT INTO payment_receipts (user_id, document_number, atcud, company_id, contact_id, issue_date, payment_date, payment_method_id, total_amount) VALUES
(1, 'RG 2024/000001', 'RG-1-1234567890', 2, 2, CURRENT_DATE - INTERVAL '8 days', CURRENT_DATE - INTERVAL '8 days', 2, 136800.00),
(1, 'RG 2024/000002', 'RG-2-1234567891', 1, 1, CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days', 1, 57000.00);

-- Dados de exemplo para itens de recibo
INSERT INTO payment_receipt_items (payment_receipt_id, invoice_id, invoice_number, invoice_date, invoice_total, paid_amount) VALUES
(1, 2, 'FT 2024/000002', CURRENT_DATE - INTERVAL '10 days', 136800.00, 136800.00),
(2, 1, 'FT 2024/000001', CURRENT_DATE - INTERVAL '15 days', 57000.00, 57000.00);
