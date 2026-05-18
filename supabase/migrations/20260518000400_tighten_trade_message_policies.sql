drop policy if exists "message participants can view messages" on public.messages;
drop policy if exists "users can send messages they authored" on public.messages;

create policy "trade participants can view messages"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.trades
    where trades.id = messages.trade_id
      and trades.status = 'accepted'
      and auth.uid() in (trades.buyer_id, trades.seller_id)
  )
);

create policy "trade participants can send messages"
on public.messages
for insert
to authenticated
with check (
  auth.uid() = sender_id
  and exists (
    select 1
    from public.trades
    where trades.id = messages.trade_id
      and trades.status = 'accepted'
      and auth.uid() in (trades.buyer_id, trades.seller_id)
      and recipient_id in (trades.buyer_id, trades.seller_id)
      and recipient_id <> auth.uid()
  )
);
