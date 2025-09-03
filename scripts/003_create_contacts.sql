-- Create contacts table
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  position text,
  department text,
  company_id uuid references public.companies(id) on delete set null,
  notes text,
  status text default 'active',
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contacts enable row level security;

-- Create policies for contacts
create policy "contacts_select_own"
  on public.contacts for select
  using (auth.uid() = user_id);

create policy "contacts_insert_own"
  on public.contacts for insert
  with check (auth.uid() = user_id);

create policy "contacts_update_own"
  on public.contacts for update
  using (auth.uid() = user_id);

create policy "contacts_delete_own"
  on public.contacts for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists contacts_user_id_idx on public.contacts(user_id);
create index if not exists contacts_company_id_idx on public.contacts(company_id);
create index if not exists contacts_email_idx on public.contacts(email);
