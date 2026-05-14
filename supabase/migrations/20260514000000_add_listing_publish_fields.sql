alter table public.listings
add column if not exists photos jsonb not null default '[]'::jsonb,
add column if not exists ai_suggested_price integer,
add column if not exists ai_confidence numeric(4, 3),
add column if not exists ai_seal boolean not null default false;

alter table public.listings
add constraint listings_photos_array_check
check (jsonb_typeof(photos) = 'array');

alter table public.listings
add constraint listings_ai_suggested_price_check
check (ai_suggested_price is null or ai_suggested_price >= 0);

alter table public.listings
add constraint listings_ai_confidence_check
check (ai_confidence is null or (ai_confidence >= 0 and ai_confidence <= 1));
