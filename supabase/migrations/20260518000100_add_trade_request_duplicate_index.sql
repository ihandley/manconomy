create unique index if not exists idx_trades_active_request_per_buyer_listing
on public.trades (listing_id, buyer_id)
where status in ('requested', 'accepted');
