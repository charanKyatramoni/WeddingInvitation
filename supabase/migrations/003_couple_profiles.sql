alter table public.invitations
  add column if not exists bride_occupation text,
  add column if not exists groom_occupation text,
  add column if not exists bride_bio text,
  add column if not exists groom_bio text,
  add column if not exists family_invitation_message text;
