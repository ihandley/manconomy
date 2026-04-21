-- Initial RLS and privilege setup for Manconomy

alter table public.users enable row level security;
alter table public.neighborhoods enable row level security;
alter table public.listings enable row level security;
alter table public.trades enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.credits_ledger enable row level security;

create policy "users are viewable by everyone"
on public.users
for select
using (true);

create policy "users can insert their own profile"
on public.users
for insert
to authenticated
with check (auth.uid() = id);

create policy "users can update their own profile"
on public.users
for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id
  and credits_balance = (select u.credits_balance from public.users u where u.id = auth.uid())
);

create policy "neighborhoods are viewable by everyone"
on public.neighborhoods
for select
using (true);

create policy "authenticated users can create neighborhoods"
on public.neighborhoods
for insert
to authenticated
with check (auth.uid() = created_by);

create policy "neighborhood creators can update neighborhoods"
on public.neighborhoods
for update
to authenticated
using (auth.uid() = created_by)
with check (auth.uid() = created_by);

create policy "listings are viewable by everyone"
on public.listings
for select
using (status <> 'draft' or auth.uid() = seller_id);

create policy "users can create their own listings"
on public.listings
for insert
to authenticated
with check (auth.uid() = seller_id);

create policy "users can update their own listings"
on public.listings
for update
to authenticated
using (auth.uid() = seller_id)
with check (auth.uid() = seller_id);

create policy "trade participants can view trades"
on public.trades
for select
to authenticated
using (auth.uid() in (buyer_id, seller_id));

create policy "buyers can create trades"
on public.trades
for insert
to authenticated
with check (auth.uid() = buyer_id);

create policy "trade participants can update trades"
on public.trades
for update
to authenticated
using (auth.uid() in (buyer_id, seller_id))
with check (auth.uid() in (buyer_id, seller_id));

create policy "message participants can view messages"
on public.messages
for select
to authenticated
using (auth.uid() in (sender_id, recipient_id));

create policy "users can send messages they authored"
on public.messages
for insert
to authenticated
with check (auth.uid() = sender_id);

create policy "message recipients can update messages"
on public.messages
for update
to authenticated
using (auth.uid() = recipient_id)
with check (
  auth.uid() = recipient_id
  and sender_id = (select m.sender_id from public.messages m where m.id = public.messages.id)
  and recipient_id = auth.uid()
  and body = (select m.body from public.messages m where m.id = public.messages.id)
  and trade_id is not distinct from (select m.trade_id from public.messages m where m.id = public.messages.id)
);

create policy "users can view their notifications"
on public.notifications
for select
to authenticated
using (auth.uid() = user_id);

create policy "users can update their notifications"
on public.notifications
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and type = (select n.type from public.notifications n where n.id = public.notifications.id)
  and title = (select n.title from public.notifications n where n.id = public.notifications.id)
  and body is not distinct from (select n.body from public.notifications n where n.id = public.notifications.id)
  and data = (select n.data from public.notifications n where n.id = public.notifications.id)
);

create policy "users can view their credits ledger"
on public.credits_ledger
for select
to authenticated
using (auth.uid() = user_id);

revoke insert, update, delete on public.credits_ledger from anon, authenticated;
revoke insert, update, delete on public.notifications from anon, authenticated;