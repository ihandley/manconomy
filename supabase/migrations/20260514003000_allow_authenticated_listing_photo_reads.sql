create policy "authenticated users can view neighborhood active listing photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'listing-photos'
  and exists (
    select 1
    from public.listings listing
    join public.users viewer
      on viewer.id = auth.uid()
    where listing.status = 'active'
      and listing.neighborhood_id = viewer.neighborhood_id
      and listing.photos @> jsonb_build_array(
        jsonb_build_object(
          'bucket',
          'listing-photos',
          'path',
          storage.objects.name
        )
      )
  )
);
