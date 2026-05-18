create or replace function public.prevent_locked_listing_trade_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'requested'
    and exists (
      select 1
      from public.trades
      where listing_id = new.listing_id
        and status in ('accepted', 'completed')
    )
  then
    raise exception 'This listing is unavailable.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_locked_listing_trade_request on public.trades;

create trigger prevent_locked_listing_trade_request
before insert on public.trades
for each row
execute function public.prevent_locked_listing_trade_request();
