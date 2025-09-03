-- Create activities table
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null, -- call, email, meeting, task, note
  status text default 'pending', -- pending, completed, cancelled
  priority text default 'medium', -- low, medium, high
  due_date timestamp with time zone,
  completed_at timestamp with time zone,
  company_id uuid references public.companies(id) on delete set null,
  contact_id uuid references public.contacts(id) on delete set null,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.activities enable row level security;

-- Create policies for activities
create policy "activities_select_own"
  on public.activities for select
  using (auth.uid() = user_id);

create policy "activities_insert_own"
  on public.activities for insert
  with check (auth.uid() = user_id);

create policy "activities_update_own"
  on public.activities for update
  using (auth.uid() = user_id);

create policy "activities_delete_own"
  on public.activities for delete
  using (auth.uid() = user_id);

-- Create indexes
create index if not exists activities_user_id_idx on public.activities(user_id);
create index if not exists activities_type_idx on public.activities(type);
create index if not exists activities_status_idx on public.activities(status);
create index if not exists activities_due_date_idx on public.activities(due_date);
