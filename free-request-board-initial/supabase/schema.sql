-- free-request-board schema
create extension if not exists pgcrypto;

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  area text not null,
  body text not null,
  reward text,
  desired_time text,
  skills text,
  risk_notes text,
  nickname text,
  owner_contact text not null,
  owner_token text not null unique,
  status text not null default 'open' check (status in ('open','closed')),
  created_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  applicant_name text not null,
  applicant_contact text not null,
  message text not null,
  applicant_token text not null unique,
  status text not null default 'pending' check (status in ('pending','accepted','closed')),
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references requests(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  sender_role text not null check (sender_role in ('owner','applicant')),
  body text not null,
  created_at timestamptz not null default now()
);

alter table requests enable row level security;
alter table applications enable row level security;
alter table messages enable row level security;

-- ブラウザから直接Supabaseへアクセスせず、Next.jsのサーバー側APIだけで操作します。
-- そのため一般公開用のRLSポリシーは作りません。
-- service_role key はRLSを迂回できます。Vercelのサーバー側だけで使います。
