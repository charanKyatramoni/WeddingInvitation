# Vowcraft

A reusable Next.js wedding invitation platform. An administrator manages invitations, while every published invitation is rendered at `/invitation/[slug]` using its selected theme.

## Current state

The application foundation, normalized Supabase schema, theme contract, and starter UI are in place. Authentication, dashboard CRUD, storage integration, and the public invitation renderer are the next modules.

## Local development

1. Copy `.env.example` to `.env.local` and add a Supabase project URL and publishable key from the Connect dialog.
2. Run the SQL migration in `supabase/migrations/001_initial_schema.sql` using Supabase SQL Editor or the Supabase CLI.
3. Run `npm run dev`.

Use `npm run typecheck` and `npm run build` before deployment.
