-- Create companies table
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nif text unique,
  email text,
  phone text,
  address text,
  city text,
  province text,
  postal_code text,
  country text default 'Angola',
  website text,
  industry text,
  size text,
  notes text,
  status text default 'active',
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.companies enable row level security;

-- Create policies for companies
create policy "companies_select_own"
  on public.companies for select
  using (auth.uid() = user_id);

create policy "companies_insert_own"
  on public.companies for insert
  with check (auth.uid() = user_id);

create policy "companies_update_own"
  on public.companies for update
  using (auth.uid() = user_id);

create policy "companies_delete_own"
  on public.companies for delete
  using (auth.uid() = user_id);

-- Create index for better performance
create index if not exists companies_user_id_idx on public.companies(user_id);
create index if not exists companies_nif_idx on public.companies(nif);
