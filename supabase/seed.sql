insert into public.invite_codes (code, neighborhood_id)
select seeded_invites.code, neighborhoods.id
from (
  values
    ('E2E-INVITE-001'),
    ('E2E-INVITE-002'),
    ('E2E-INVITE-003'),
    ('E2E-INVITE-004'),
    ('E2E-INVITE-005'),
    ('E2E-INVITE-006'),
    ('E2E-INVITE-007'),
    ('E2E-INVITE-008'),
    ('E2E-INVITE-009'),
    ('E2E-INVITE-010'),
    ('E2E-INVITE-011'),
    ('E2E-INVITE-012'),
    ('E2E-INVITE-013'),
    ('E2E-INVITE-014'),
    ('E2E-INVITE-015'),
    ('E2E-INVITE-016'),
    ('E2E-INVITE-017'),
    ('E2E-INVITE-018'),
    ('E2E-INVITE-019'),
    ('E2E-INVITE-020')
) as seeded_invites(code)
cross join public.neighborhoods
where neighborhoods.slug = 'pilot-neighborhood'
  and not exists (
    select 1
    from public.invite_codes existing_invites
    where lower(existing_invites.code) = lower(seeded_invites.code)
  );
