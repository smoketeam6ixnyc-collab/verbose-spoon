create table if not exists public.botshield_releases (id uuid primary key default gen_random_uuid(), name text not null, starts_at timestamptz, inventory integer not null default 0, active boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.botshield_sessions (id uuid primary key default gen_random_uuid(), release_id uuid references public.botshield_releases(id), risk_score integer not null default 0, decision text not null default 'PASS' check (decision in ('PASS','VERIFY','QUEUE','BLOCK')), expires_at timestamptz not null, created_at timestamptz not null default now());
create table if not exists public.botshield_events (id bigint generated always as identity primary key, session_id uuid references public.botshield_sessions(id), event_type text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now());
create table if not exists public.botshield_queue (id bigint generated always as identity primary key, release_id uuid not null references public.botshield_releases(id), session_id uuid not null references public.botshield_sessions(id), position bigint not null, status text not null default 'waiting' check(status in ('waiting','admitted','expired')), created_at timestamptz not null default now(), unique(release_id,session_id));
create index if not exists botshield_events_session_idx on public.botshield_events(session_id,created_at desc);
create index if not exists botshield_queue_release_idx on public.botshield_queue(release_id,status,position);

alter table public.botshield_releases enable row level security;
alter table public.botshield_sessions enable row level security;
alter table public.botshield_events enable row level security;
alter table public.botshield_queue enable row level security;
