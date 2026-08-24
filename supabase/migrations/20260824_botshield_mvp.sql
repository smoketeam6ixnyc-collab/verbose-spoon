create extension if not exists pgcrypto;

create table if not exists public.botshield_releases (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'simulation' check (status in ('draft','scheduled','live','closed','simulation')),
  inventory integer not null default 0 check (inventory >= 0),
  starts_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.botshield_sessions (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.botshield_releases(id) on delete cascade,
  risk_score integer not null default 0 check (risk_score between 0 and 100),
  decision text not null default 'PASS' check (decision in ('PASS','VERIFY','QUEUE','BLOCK')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.botshield_events (
  id bigint generated always as identity primary key,
  session_id uuid not null references public.botshield_sessions(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.botshield_queue (
  id bigint generated always as identity primary key,
  release_id uuid not null references public.botshield_releases(id) on delete cascade,
  session_id uuid not null references public.botshield_sessions(id) on delete cascade,
  position bigint not null,
  status text not null default 'waiting' check (status in ('waiting','admitted','expired')),
  created_at timestamptz not null default now(),
  unique (release_id, session_id),
  unique (release_id, position)
);

create table if not exists public.botshield_inventory_reservations (
  id bigint generated always as identity primary key,
  release_id uuid not null references public.botshield_releases(id) on delete cascade,
  session_id uuid not null references public.botshield_sessions(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  expires_at timestamptz not null,
  status text not null default 'reserved' check (status in ('reserved','released','consumed')),
  created_at timestamptz not null default now()
);

create index if not exists botshield_events_session_idx on public.botshield_events(session_id, created_at desc);
create index if not exists botshield_queue_release_idx on public.botshield_queue(release_id, status, position);
create index if not exists botshield_reservations_release_idx on public.botshield_inventory_reservations(release_id, status);

alter table public.botshield_releases enable row level security;
alter table public.botshield_sessions enable row level security;
alter table public.botshield_events enable row level security;
alter table public.botshield_queue enable row level security;
alter table public.botshield_inventory_reservations enable row level security;

create or replace function public.botshield_join_queue(p_release_id uuid, p_session_id uuid)
returns table(position bigint, queue_status text)
language plpgsql
security definer
set search_path = public
as $$
declare next_position bigint;
begin
  if exists (select 1 from botshield_queue where release_id=p_release_id and session_id=p_session_id) then
    return query select q.position, q.status from botshield_queue q where q.release_id=p_release_id and q.session_id=p_session_id;
    return;
  end if;
  if not exists (select 1 from botshield_releases where id=p_release_id and status in ('live','simulation')) then
    raise exception 'release_not_open';
  end if;
  select coalesce(max(q.position),0)+1 into next_position from botshield_queue q where q.release_id=p_release_id;
  insert into botshield_queue(release_id,session_id,position) values(p_release_id,p_session_id,next_position);
  return query select next_position, 'waiting'::text;
end;
$$;

grant execute on function public.botshield_join_queue(uuid,uuid) to anon, authenticated;

insert into public.botshield_releases(name,status,inventory,starts_at)
select 'BotShield Test Drop','simulation',100,now()
where not exists (select 1 from public.botshield_releases where name='BotShield Test Drop');
