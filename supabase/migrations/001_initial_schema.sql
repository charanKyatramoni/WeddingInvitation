create type public.invitation_status as enum ('draft', 'published', 'archived');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status public.invitation_status not null default 'draft',
  bride_name text not null,
  groom_name text not null,
  bride_image_path text,
  groom_image_path text,
  cover_image_path text,
  wedding_at timestamptz not null,
  venue_name text,
  map_url text,
  bride_parents text,
  groom_parents text,
  story text,
  invitation_message text,
  countdown_at timestamptz,
  music_path text,
  video_url text,
  thank_you_message text,
  theme_key text not null default 'classic',
  theme_settings jsonb not null default '{"primaryColor":"#6b2134","secondaryColor":"#fffaf5","headingFont":"serif","bodyFont":"sans-serif"}'::jsonb,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  venue_name text,
  description text,
  map_url text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  relationship text not null,
  name text not null,
  side text not null check (side in ('bride', 'groom')),
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  storage_path text not null,
  alt_text text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null,
  email text,
  phone text,
  attendance text not null check (attendance in ('attending', 'declined', 'undecided')),
  guest_count integer not null default 1 check (guest_count between 1 and 20),
  note text,
  created_at timestamptz not null default now()
);

create index invitations_owner_status_idx on public.invitations (owner_id, status);
create index events_invitation_position_idx on public.events (invitation_id, position);
create index family_members_invitation_position_idx on public.family_members (invitation_id, position);
create index gallery_images_invitation_position_idx on public.gallery_images (invitation_id, position);
create index rsvps_invitation_created_at_idx on public.rsvps (invitation_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger invitations_set_updated_at before update on public.invitations
for each row execute function public.set_updated_at();
create trigger events_set_updated_at before update on public.events
for each row execute function public.set_updated_at();
create trigger family_members_set_updated_at before update on public.family_members
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.events enable row level security;
alter table public.family_members enable row level security;
alter table public.gallery_images enable row level security;
alter table public.rsvps enable row level security;

create policy "Admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage invitations" on public.invitations for all using (public.is_admin()) with check (public.is_admin());
create policy "Published invitations are public" on public.invitations for select using (status = 'published');

create policy "Admins manage events" on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy "Events of published invitations are public" on public.events for select using (
  exists (select 1 from public.invitations where id = invitation_id and status = 'published')
);
create policy "Admins manage family members" on public.family_members for all using (public.is_admin()) with check (public.is_admin());
create policy "Family of published invitations is public" on public.family_members for select using (
  exists (select 1 from public.invitations where id = invitation_id and status = 'published')
);
create policy "Admins manage gallery images" on public.gallery_images for all using (public.is_admin()) with check (public.is_admin());
create policy "Gallery of published invitations is public" on public.gallery_images for select using (
  exists (select 1 from public.invitations where id = invitation_id and status = 'published')
);
create policy "Admins read RSVPs" on public.rsvps for select using (public.is_admin());
create policy "Public can submit an RSVP to a published invitation" on public.rsvps for insert with check (
  exists (select 1 from public.invitations where id = invitation_id and status = 'published')
);
