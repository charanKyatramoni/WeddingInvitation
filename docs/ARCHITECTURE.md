# Vowcraft architecture

## Product boundary

One authenticated owner manages many invitations. The public site is available only for invitations whose status is `published`. There is no customer-facing multi-tenancy in the first release; a future `organizations` layer can be introduced without changing invitation content.

## Delivery sequence

1. Foundation and relational schema (current)
2. Supabase clients, authentication, and route protection
3. Dashboard invitation CRUD
4. Asset uploads and repeatable content editors
5. Public renderer and the first complete theme
6. RSVP workflow, SEO, quality checks, and deployment

## Domain decisions

- `invitations` holds a concise core record; repeatable content has child tables.
- A theme receives one normalized invitation view model. Themes never query the database.
- Theme choices use a stable key and a JSON settings object, so new themes do not require a schema migration.
- Asset paths, rather than externally supplied URLs, are the source of truth for managed uploads.
- Admin ownership is enforced by Row Level Security, never solely by frontend route checks.

## Initial MVP

The first complete release includes a single administrator, invitation CRUD, Classic and Royal themes, image/music uploads, events, family, gallery, RSVPs, and publishing. Video hosting, rich drag-and-drop reordering, additional themes, and analytics are intentional follow-on work.
