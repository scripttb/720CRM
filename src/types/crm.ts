// CRM System Type Definitions

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'sales_manager' | 'sales_rep';
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  last_login?: string;
  create_time: string;
  modify_time: string;
  // Campos específicos para Angola
  bi_number?: string;
  nif?: string;
  preferred_language?: string;
}

export interface Company {
  id: number;
  name: string;
  industry?: string;
  size?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  logo_url?: string;
  description?: string;
  annual_revenue?: number;
  employee_count?: number;
  assigned_user_id?: number;
  create_time: string;
  modify_time: string;
  // Campos específicos para Angola
  province?: string;
  municipality?: string;
  nif?: string;
  alvara_number?: string;
  tax_regime?: string;
}

export interface Contact {
  id: number;
  company_id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  mobile?: string;
  job_title?: string;
  department?: string;
  is_primary: boolean;
  linkedin_url?: string;
  avatar_url?: string;
  notes?: string;
  assigned_user_id?: number;
  create_time: string;
  modify_time: string;
  // Campos específicos para Angola
  bi_number?: string;
  nif?: string;
  nationality?: string;
  province?: string;
  municipality?: string;
}

export interface PipelineStage {
  id: number;
  name: string;
  description?: string;
  stage_order: number;
  probability: number;
  is_active: boolean;
  create_time: string;
  modify_time: string;
}

export interface Opportunity {
  id: number;
  name: string;
  company_id?: number;
  contact_id?: number;
  assigned_user_id?: number;
  pipeline_stage_id?: number;
  value?: number;
  currency: string;
  probability?: number;
  expected_close_date?: string;
  actual_close_date?: string;
  source?: string;
  description?: string;
  status: 'open' | 'won' | 'lost';
  lost_reason?: string;
  create_time: string;
  modify_time: string;
}

export interface Activity {
  id: number;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  subject: string;
  description?: string;
  company_id?: number;
  contact_id?: number;
  opportunity_id?: number;
  assigned_user_id?: number;
  created_by_user_id?: number;
  status: 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  completed_date?: string;
  duration_minutes?: number;
  location?: string;
  create_time: string;
  modify_time: string;
}

export interface Communication {
  id: number;
  type: 'email' | 'call' | 'meeting' | 'sms' | 'social';
  direction?: 'inbound' | 'outbound';
  subject?: string;
  content?: string;
  company_id?: number;
  contact_id?: number;
  opportunity_id?: number;
  user_id?: number;
  external_id?: string;
  metadata?: any;
  occurred_at: string;
  create_time: string;
  modify_time: string;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
  description?: string;
  create_time: string;
  modify_time: string;
}

export interface CustomerSegment {
  id: number;
  name: string;
  description?: string;
  criteria?: any;
  color?: string;
  is_active: boolean;
  create_time: string;
  modify_time: string;
}

export interface Document {
  id: number;
  name: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  company_id?: number;
  contact_id?: number;
  opportunity_id?: number;
  uploaded_by_user_id?: number;
  is_public: boolean;
  description?: string;
  create_time: string;
  modify_time: string;
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalCompanies: number;
  totalContacts: number;
  totalOpportunities: number;
  totalRevenue: number;
  openOpportunities: number;
  wonOpportunities: number;
  lostOpportunities: number;
  activitiesThisWeek: number;
  conversionRate: number;
  averageDealSize: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  opportunities: number;
}

export interface PipelineData {
  stage: string;
  count: number;
  value: number;
}
