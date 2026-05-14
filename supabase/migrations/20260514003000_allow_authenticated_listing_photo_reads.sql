create policy "authenticated users can view listing photos"
on storage.objects
for select
to authenticated
using (bucket_id = 'listing-photos');
