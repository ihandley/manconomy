revoke update on public.trades from anon, authenticated;

drop policy if exists "trade participants can update trades" on public.trades;

create unique index if not exists idx_trades_one_locked_trade_per_listing
on public.trades (listing_id)
where status in ('accepted', 'completed');

create or replace function public.respond_to_trade_request(
  trade_id uuid,
  response_status public.trade_status
)
returns public.trades
language plpgsql
security definer
set search_path = public
as $$
declare
  current_trade public.trades%rowtype;
  current_listing public.listings%rowtype;
  conflicting_trade_id uuid;
begin
  if response_status not in ('accepted', 'declined') then
    raise exception 'Use a valid trade response.'
      using errcode = '22023';
  end if;

  select *
  into current_trade
  from public.trades
  where id = trade_id
  for update;

  if not found then
    raise exception 'Trade request not found.'
      using errcode = 'P0002';
  end if;

  if auth.uid() is null or auth.uid() <> current_trade.seller_id then
    raise exception 'Only the seller can respond to this trade request.'
      using errcode = '42501';
  end if;

  if current_trade.status <> 'requested' then
    raise exception 'Only requested trades can be accepted or declined.'
      using errcode = '23514';
  end if;

  if response_status = 'accepted' then
    select *
    into current_listing
    from public.listings
    where id = current_trade.listing_id
    for update;

    if not found or current_listing.status <> 'active' then
      raise exception 'This listing is unavailable.'
        using errcode = '23514';
    end if;

    select id
    into conflicting_trade_id
    from public.trades
    where listing_id = current_trade.listing_id
      and id <> current_trade.id
      and status in ('accepted', 'completed')
    limit 1
    for update;

    if found then
      raise exception 'This listing already has an active trade.'
        using errcode = '23505';
    end if;

    update public.trades
    set
      status = 'accepted',
      accepted_at = coalesce(accepted_at, timezone('utc', now()))
    where id = current_trade.id
    returning * into current_trade;
  else
    update public.trades
    set status = 'declined'
    where id = current_trade.id
    returning * into current_trade;
  end if;

  return current_trade;
exception
  when unique_violation then
    raise exception 'This listing already has an active trade.'
      using errcode = '23505';
end;
$$;

revoke execute on function public.respond_to_trade_request(uuid, public.trade_status) from public;
grant execute on function public.respond_to_trade_request(uuid, public.trade_status) to authenticated;
