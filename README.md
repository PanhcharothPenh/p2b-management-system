# P2B Management System

React + JavaScript (no TypeScript) + Vite + Tailwind + Supabase. Multi-branch business management.

## What is in this starter (Phase 1 foundation)
- Login (Supabase Auth), session handling
- Roles, permissions and branch access loaded from the database (RLS is the real enforcement)
- Responsive layout: collapsible sidebar, branch selector, English/Khmer switch
- Sidebar and routes generated from `src/config/navigation.js`, filtered by permission
- Service layer (`src/services`), no DB calls in UI components
- `supabase/migrations/001_*` : roles, permissions, branches, RLS (DRAFT, review before running)
- `CLAUDE.md` + `docs/phases/` : prompts for building the remaining phases

Every module page except the dashboard is a placeholder until its phase is built.

## Run
1. `npm install`
2. Copy `.env.example` to `.env`, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Run `supabase/migrations/001_phase1_rbac_branches.sql` on a NEW or STAGING Supabase project first
4. In Supabase, create your first user, then in SQL: insert a `profiles` row with `role_id` of `owner`
   (`select id from roles where code='owner'`), e.g. `insert into profiles (id, full_name, role_id) values ('<auth-user-uuid>', 'Your Name', '<owner-role-uuid>');`
5. `npm run dev`

## Next
Put your original master spec in `docs/P2B_SPEC.md`, then follow `docs/phases/00-audit.md` onward with Claude Code.
Never commit `.env`. Never put the service-role key or Telegram bot token in frontend code.
