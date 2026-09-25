-- AKBS CRM 2.0 additive compatibility migration.
-- Existing AKBS tables are preserved; no destructive cutover is performed here.

alter table akbs_crm.users add column if not exists auth_user_id uuid unique;
alter table akbs_crm.users add column if not exists email text;

create table if not exists akbs_crm.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references akbs_crm.users(id),
  application_id text unique,
  full_name text not null,
  phone text not null,
  email text,
  location text,
  project_type text,
  project_capacity integer,
  land_status text,
  loan_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists akbs_crm.projects (
  id uuid primary key default gen_random_uuid(),
  project_code text unique not null,
  customer_id uuid not null references akbs_crm.customers(id),
  lead_id uuid references akbs_crm.leads(id),
  project_type text,
  capacity integer,
  project_value numeric(16,2),
  location text,
  land_status text,
  stage text not null default 'PLANNING',
  dpr_status text,
  proposal_status text,
  loan_status text,
  assigned_to uuid references akbs_crm.users(id),
  manager_id uuid references akbs_crm.users(id),
  expected_completion date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists akbs_crm.follow_ups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references akbs_crm.leads(id),
  employee_id uuid references akbs_crm.users(id),
  due_at timestamptz not null,
  type text not null check(type in ('CALL','WHATSAPP','EMAIL','MEETING','SITE_VISIT','OTHER')),
  purpose text,
  notes text,
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);
create index if not exists crm2_followups_due_idx on akbs_crm.follow_ups(due_at);

create table if not exists akbs_crm.site_visits (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references akbs_crm.leads(id),
  employee_id uuid references akbs_crm.users(id),
  scheduled_at timestamptz not null,
  location text,
  purpose text,
  status text not null default 'SCHEDULED',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists akbs_crm.partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references akbs_crm.users(id),
  name text not null,
  mobile text not null,
  email text,
  address text,
  pan text,
  bank_details jsonb not null default '{}'::jsonb,
  business_details jsonb not null default '{}'::jsonb,
  kyc_status text not null default 'PENDING',
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists akbs_crm.commission_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  percentage numeric(6,3) not null check(percentage>=0 and percentage<=100),
  active boolean not null default true,
  effective_from date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists akbs_crm.audit_logs (
  id bigserial primary key,
  user_id uuid references akbs_crm.users(id),
  action text not null,
  module text not null,
  record_id text,
  old_value jsonb,
  new_value jsonb,
  ip inet,
  created_at timestamptz not null default now()
);
create index if not exists crm2_audit_created_idx on akbs_crm.audit_logs(created_at desc);

alter table akbs_crm.customers enable row level security;
alter table akbs_crm.projects enable row level security;
alter table akbs_crm.follow_ups enable row level security;
alter table akbs_crm.site_visits enable row level security;
alter table akbs_crm.partners enable row level security;
alter table akbs_crm.commission_rules enable row level security;
alter table akbs_crm.audit_logs enable row level security;

revoke all on akbs_crm.customers,akbs_crm.projects,akbs_crm.follow_ups,akbs_crm.site_visits,akbs_crm.partners,akbs_crm.commission_rules,akbs_crm.audit_logs from anon,authenticated;
