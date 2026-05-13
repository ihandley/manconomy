alter table public.profiles
add column neighborhood_id uuid references public.neighborhoods (id) on delete set null,
add column onboarding_completed_at timestamptz;

insert into public.neighborhoods (name, city, state, country, slug, description)
values (
  'Pilot Neighborhood',
  'Denver',
  'CO',
  'US',
  'pilot-neighborhood',
  'Placeholder neighborhood for first-run onboarding.'
)
on conflict (slug) do nothing;
