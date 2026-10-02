# Phase 0 — Read-only audit (DO NOT modify any files)

Read CLAUDE.md and docs/P2B_SPEC.md first. Inspect the whole repository: package.json, structure, src/ (pages, components, hooks, services, contexts, routes), Supabase config and schema, auth, permissions, branch logic, Telegram integration, env variable usage (never print values), Git history for committed secrets.

Return a report with:
1. Architecture summary and current tech stack
2. All .ts/.tsx files and dependencies affected by conversion
3. Existing Supabase schema (tables, RLS, functions, storage) mapped to the target entities in the spec
4. Existing modules; duplicates; dead code (verify before calling it dead); fake/demo data; frontend-only features; broken or incomplete features
5. Security concerns (missing RLS, missing branch isolation, scattered DB calls, hard-coded values, exposed secrets)
6. KEEP / IMPROVE / MERGE / REMOVE / CONVERT / CREATE lists
7. Proposed JavaScript project structure
8. Required database changes, migration risks, rollback ideas
9. Recommended phase plan adjusted to what you found

Stop after the report and wait for my approval.
