alter table public.invitations
  add column if not exists rsvp_email text,
  add column if not exists whatsapp_number text;
