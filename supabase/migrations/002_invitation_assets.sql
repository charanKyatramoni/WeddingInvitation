insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('invitation-assets', 'invitation-assets', true, 15728640,
  array['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/ogg'])
on conflict (id) do nothing;

create policy "Admins upload invitation assets"
on storage.objects for insert to authenticated
with check (bucket_id = 'invitation-assets' and public.is_admin());

create policy "Admins update invitation assets"
on storage.objects for update to authenticated
using (bucket_id = 'invitation-assets' and public.is_admin())
with check (bucket_id = 'invitation-assets' and public.is_admin());

create policy "Admins delete invitation assets"
on storage.objects for delete to authenticated
using (bucket_id = 'invitation-assets' and public.is_admin());

create policy "Invitation assets are publicly readable"
on storage.objects for select to public
using (bucket_id = 'invitation-assets');
