-- Initial schema functions for Manconomy
-- Auth trigger and trusted server/database write paths

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (
    id,
    username,
    display_name,
    avatar_url,
    created_at,
    updated_at
  )
  values (
    new.id,
    null,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    timezone('utc', now()),
    timezone('utc', now())
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

create or replace function private.apply_credit_ledger_entry(
  p_user_id uuid,
  p_entry_type public.credit_entry_type,
  p_amount integer,
  p_description text default null,
  p_trade_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns public.credits_ledger
language plpgsql
security definer
set search_path = public, private
as $$
declare
  v_user public.users;
  v_new_balance integer;
  v_ledger_row public.credits_ledger;
begin
  if p_amount = 0 then
    raise exception 'Credit ledger amount cannot be zero';
  end if;

  select *
  into v_user
  from public.users
  where id = p_user_id
  for update;

  if not found then
    raise exception 'User % not found', p_user_id;
  end if;

  v_new_balance := v_user.credits_balance + p_amount;

  if v_new_balance < 0 then
    raise exception 'Insufficient credits for user %', p_user_id;
  end if;

  update public.users
  set credits_balance = v_new_balance,
      updated_at = timezone('utc', now())
  where id = p_user_id;

  insert into public.credits_ledger (
    user_id,
    trade_id,
    entry_type,
    amount,
    balance_after,
    description,
    metadata
  )
  values (
    p_user_id,
    p_trade_id,
    p_entry_type,
    p_amount,
    v_new_balance,
    p_description,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning * into v_ledger_row;

  return v_ledger_row;
end;
$$;

revoke all on schema private from public;
revoke all on function private.apply_credit_ledger_entry(uuid, public.credit_entry_type, integer, text, uuid, jsonb) from public;

grant usage on schema private to postgres, service_role;
grant execute on function private.apply_credit_ledger_entry(uuid, public.credit_entry_type, integer, text, uuid, jsonb) to postgres, service_role;