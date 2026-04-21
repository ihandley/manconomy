-- Initial schema for Manconomy
-- Core tables, enums, constraints, indexes, and generic triggers

create extension if not exists pgcrypto;

create schema if not exists private;

create type public.listing_type as enum ('item', 'service', 'request');
create type public.listing_status as enum ('draft', 'active', 'paused', 'completed', 'archived', 'cancelled');
create type public.trade_status as enum ('proposed', 'accepted', 'declined', 'cancelled', 'completed', 'disputed');
create type public.credit_entry_type as enum ('earn', 'spend', 'refund', 'adjustment', 'hold', 'release');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.neighborhoods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  state text,
  country text,
  slug text not null unique,
  description text,
  is_active boolean not null default true,
  created_by uuid,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint neighborhoods_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  neighborhood_id uuid references public.neighborhoods (id) on delete set null,
  credits_balance integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint users_username_format check (
    username is null or username ~ '^[a-zA-Z0-9_]{3,32}$'
  ),
  constraint users_credits_balance_nonnegative check (credits_balance >= 0)
);

alter table public.neighborhoods
  add constraint neighborhoods_created_by_fkey
  foreign key (created_by)
  references public.users (id)
  on delete set null;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.users (id) on delete cascade,
  neighborhood_id uuid references public.neighborhoods (id) on delete set null,
  title text not null,
  description text,
  category text,
  listing_type public.listing_type not null default 'item',
  status public.listing_status not null default 'draft',
  condition text,
  asking_credits integer,
  quantity integer not null default 1,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint listings_title_not_blank check (length(trim(title)) > 0),
  constraint listings_quantity_check check (quantity > 0),
  constraint listings_asking_credits_check check (asking_credits is null or asking_credits >= 0),
  constraint listings_expiration_order check (expires_at is null or published_at is null or expires_at > published_at)
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  buyer_id uuid not null references public.users (id) on delete cascade,
  seller_id uuid not null references public.users (id) on delete cascade,
  status public.trade_status not null default 'proposed',
  offered_credits integer not null default 0,
  note text,
  accepted_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint trades_offered_credits_check check (offered_credits >= 0),
  constraint trades_distinct_participants_check check (buyer_id <> seller_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  trade_id uuid references public.trades (id) on delete cascade,
  sender_id uuid not null references public.users (id) on delete cascade,
  recipient_id uuid not null references public.users (id) on delete cascade,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint messages_distinct_participants_check check (sender_id <> recipient_id),
  constraint messages_body_not_blank check (length(trim(body)) > 0)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint notifications_type_not_blank check (length(trim(type)) > 0),
  constraint notifications_title_not_blank check (length(trim(title)) > 0)
);

create table if not exists public.credits_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  trade_id uuid references public.trades (id) on delete set null,
  entry_type public.credit_entry_type not null,
  amount integer not null,
  balance_after integer not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  constraint credits_ledger_amount_nonzero check (amount <> 0),
  constraint credits_ledger_balance_after_nonnegative check (balance_after >= 0)
);

create index if not exists idx_users_neighborhood_id on public.users (neighborhood_id);
create index if not exists idx_neighborhoods_slug on public.neighborhoods (slug);
create index if not exists idx_listings_seller_id on public.listings (seller_id);
create index if not exists idx_listings_neighborhood_id on public.listings (neighborhood_id);
create index if not exists idx_listings_status on public.listings (status);
create index if not exists idx_listings_category on public.listings (category);
create index if not exists idx_listings_published_at on public.listings (published_at desc);
create index if not exists idx_trades_listing_id on public.trades (listing_id);
create index if not exists idx_trades_buyer_id on public.trades (buyer_id);
create index if not exists idx_trades_seller_id on public.trades (seller_id);
create index if not exists idx_trades_status on public.trades (status);
create index if not exists idx_messages_trade_id on public.messages (trade_id);
create index if not exists idx_messages_sender_id on public.messages (sender_id);
create index if not exists idx_messages_recipient_id on public.messages (recipient_id);
create index if not exists idx_messages_created_at on public.messages (created_at desc);
create index if not exists idx_notifications_user_id on public.notifications (user_id);
create index if not exists idx_notifications_user_unread on public.notifications (user_id, read_at) where read_at is null;
create index if not exists idx_credits_ledger_user_id on public.credits_ledger (user_id);
create index if not exists idx_credits_ledger_trade_id on public.credits_ledger (trade_id);
create index if not exists idx_credits_ledger_created_at on public.credits_ledger (created_at desc);

create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create trigger set_neighborhoods_updated_at
before update on public.neighborhoods
for each row
execute function public.set_updated_at();

create trigger set_listings_updated_at
before update on public.listings
for each row
execute function public.set_updated_at();

create trigger set_trades_updated_at
before update on public.trades
for each row
execute function public.set_updated_at();

create trigger set_messages_updated_at
before update on public.messages
for each row
execute function public.set_updated_at();

create trigger set_notifications_updated_at
before update on public.notifications
for each row
execute function public.set_updated_at();

comment on table public.users is 'Application user profiles linked 1:1 with auth.users.';
comment on table public.neighborhoods is 'Neighborhoods or local communities where users and listings belong.';
comment on table public.listings is 'Items, services, or requests users publish for barter or credits.';
comment on table public.trades is 'Trade negotiations and transactions between a buyer and seller for a listing.';
comment on table public.messages is 'Direct messages between trade participants, optionally attached to a trade.';
comment on table public.notifications is 'In-app notifications delivered to a user. Client writes are intentionally restricted.';
comment on table public.credits_ledger is 'Ledger entries for user credit balance changes. Writes are restricted to trusted server/database paths.';