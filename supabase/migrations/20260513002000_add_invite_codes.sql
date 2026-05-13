create table public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  issued_by_user_id uuid references auth.users (id) on delete set null,
  neighborhood_id uuid references public.neighborhoods (id) on delete set null,
  used_by_user_id uuid references auth.users (id) on delete set null,
  issued_at timestamptz not null default timezone('utc', now()),
  used_at timestamptz,
  expires_at timestamptz,
  constraint invite_codes_code_not_blank check (length(trim(code)) > 0),
  constraint invite_codes_used_together check (
    (used_by_user_id is null and used_at is null)
    or (used_by_user_id is not null and used_at is not null)
  )
);

create unique index invite_codes_code_key
on public.invite_codes (lower(code));

create index invite_codes_neighborhood_id_idx
on public.invite_codes (neighborhood_id);

create index invite_codes_unused_idx
on public.invite_codes (lower(code))
where used_by_user_id is null;

alter table public.invite_codes enable row level security;

revoke insert, update, delete on public.invite_codes from anon, authenticated;

create or replace function public.validate_and_redeem_invite_code(invite_code text)
returns table (
  id uuid,
  neighborhood_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  authenticated_user_id uuid := auth.uid();
  normalized_code text := lower(trim(invite_code));
  redeemed_invite public.invite_codes%rowtype;
begin
  if authenticated_user_id is null then
    raise exception 'You must be signed in to use an invite code.';
  end if;

  if normalized_code is null or normalized_code = '' then
    raise exception 'Enter an invite code.';
  end if;

  select *
  into redeemed_invite
  from public.invite_codes
  where lower(code) = normalized_code
  for update;

  if not found then
    raise exception 'Invite code not found.';
  end if;

  if redeemed_invite.expires_at is not null
    and redeemed_invite.expires_at <= timezone('utc', now()) then
    raise exception 'Invite code has expired.';
  end if;

  if redeemed_invite.used_by_user_id is not null
    and redeemed_invite.used_by_user_id <> authenticated_user_id then
    raise exception 'Invite code has already been used.';
  end if;

  if redeemed_invite.used_by_user_id is null then
    update public.invite_codes
    set
      used_by_user_id = authenticated_user_id,
      used_at = timezone('utc', now())
    where public.invite_codes.id = redeemed_invite.id
    returning *
    into redeemed_invite;
  end if;

  if redeemed_invite.neighborhood_id is not null then
    update public.profiles
    set
      neighborhood_id = redeemed_invite.neighborhood_id,
      updated_at = timezone('utc', now())
    where public.profiles.id = authenticated_user_id;
  end if;

  return query
  select redeemed_invite.id, redeemed_invite.neighborhood_id;
end;
$$;

revoke execute on function public.validate_and_redeem_invite_code(text) from public;
revoke execute on function public.validate_and_redeem_invite_code(text) from anon;
grant execute on function public.validate_and_redeem_invite_code(text) to authenticated;
