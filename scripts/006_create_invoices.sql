-- Create invoices table for billing
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null,
  type text not null default 'invoice', -- invoice, proforma, credit_note, receipt
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  issue_date date not null default current_date,
  due_date date,
  subtotal decimal(15,2) not null default 0,
  tax_amount decimal(15,2) not null default 0,
  total_amount decimal(15,2) not null default 0,
  currency text default 'AOA',
  status text default 'draft', -- draft, sent, paid, overdue, cancelled
  notes text,
  terms text,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create invoice items table
create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity decimal(10,2) not null default 1,
  unit_price decimal(15,2) not null,
  total_price decimal(15,2) not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.invoices enable row level security;
alter table public.invoice_items enable row level security;

-- Create policies for invoices
create policy "invoices_select_own"
  on public.invoices for select
  using (auth.uid() = user_id);

create policy "invoices_insert_own"
  on public.invoices for insert
  with check (auth.uid() = user_id);

create policy "invoices_update_own"
  on public.invoices for update
  using (auth.uid() = user_id);

create policy "invoices_delete_own"
  on public.invoices for delete
  using (auth.uid() = user_id);

-- Create policies for invoice items
create policy "invoice_items_select_own"
  on public.invoice_items for select
  using (auth.uid() = user_id);

create policy "invoice_items_insert_own"
  on public.invoice_items for insert
  with check (auth.uid() = user_id);

create policy "invoice_items_update_own"
  on public.invoice_items for update
  using (auth.uid() = user_id);

create policy "invoice_items_delete_own"
  on public.invoice_items for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists invoices_user_id_idx on public.invoices(user_id);
create index if not exists invoices_company_id_idx on public.invoices(company_id);
create index if not exists invoices_status_idx on public.invoices(status);
create index if not exists invoices_type_idx on public.invoices(type);
create index if not exists invoice_items_invoice_id_idx on public.invoice_items(invoice_id);
