-- Create opportunities table
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  value decimal(15,2),
  currency text default 'AOA',
  stage text not null default 'prospecting',
  probability integer default 0 check (probability >= 0 and probability <= 100),
  expected_close_date date,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  status text default 'open',
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.opportunities enable row level security;

-- Create policies for opportunities
create policy "opportunities_select_own"
  on public.opportunities for select
  using (auth.uid() = user_id);

create policy "opportunities_insert_own"
  on public.opportunities for insert
  with check (auth.uid() = user_id);

create policy "opportunities_update_own"
  on public.opportunities for update
  using (auth.uid() = user_id);

create policy "opportunities_delete_own"
  on public.opportunities for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists opportunities_user_id_idx on public.opportunities(user_id);
create index if not exists opportunities_company_id_idx on public.opportunities(company_id);
create index if not exists opportunities_stage_idx on public.opportunities(stage);
create index if not exists opportunities_status_idx on public.opportunities(status);
