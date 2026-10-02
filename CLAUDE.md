# P2B Management System — Permanent Project Rules

Multi-branch business management web app (laundry/service). This is an EXISTING project with production data. Improve it safely; never rebuild blindly.

## Stack (fixed)
React, JavaScript/JSX, Vite, Tailwind CSS, Supabase (Postgres, Auth, RLS), Telegram Bot API / Mini App.
- NO TypeScript: no .ts/.tsx, interfaces, enums, type annotations. Use .js/.jsx only.
- When converting TS: strip types, don't just rename. Convert module by module and build after each group.
- Keep code simple and readable. Small functions, descriptive names, no giant components or services.

## User-facing name
"P2B Management System" (optional: "Powered by P2B System"). Never show "Clean-Miller" in the UI. Internal repo name may stay.

## Hard safety rules
- NEVER drop tables, delete production records, reset Supabase, change IDs, or remove columns without a migration.
- Schema changes: explain current schema -> explain change -> write migration -> preserve data -> rollback plan -> test.
- Never print secret values (.env, keys, bot token). If secrets are committed to Git, tell me and recommend rotation, without repeating them.
- Never expose service-role key or bot token in frontend code.
- Check `git status` before big refactors. Work in small logical commits (e.g. `refactor: convert authentication to JavaScript`).
- STOP and ask before: deleting production data, dropping tables, significantly changing auth architecture, removing a major working function, changing financial formulas when policy is unclear, irreversible migrations, changing production credentials.
- Otherwise don't ask about small details; inspect the code and choose the simplest safe option.

## Architecture principles
1. One business event -> one source of truth -> database -> related effects -> audit -> optional notification -> updated UI.
2. No frontend-only state changes for important actions. Never show fake success.
3. Reports, dashboard and totals are calculated from source records, never stored manually.
4. One attendance system (web + Telegram write to the same table). One consumables/inventory engine. One payroll calculation. One daily operations -> revenue flow.
5. Inventory quantity changes only via stock transactions.
6. Multi-record business actions (consumable purchase, debt payment, stock transfer, cash-linked expense, payroll finalization, month closing) run atomically server-side (Postgres function/RPC).
7. Soft-delete only (Active/Inactive/Cancelled/Voided/Archived). Voids need authorized user + reason + audit.
8. Closed months block financial edits ("This accounting period is closed."). Only authorized users can reopen, with reason + audit.
9. Finalized payroll stores a snapshot; later setting changes never alter it.
10. Use `updated_at`/versions to detect stale edits; don't silently overwrite.

## Security
- Supabase Auth + RLS on every table; branch isolation enforced in DB, not only UI.
- Hiding menu items is not authorization. Validate permission + branch server-side.
- Never trust frontend user_id, role, branch_id or permission.
- Telegram 2FA codes: hashed, expiring, single-use, attempt-limited. Never store reusable plaintext codes.

## Code structure
- `src/services/*Service.js` hold all Supabase calls and business logic. UI components must not contain DB queries.
- Reusable components only (AppLayout, Sidebar, Topbar, PageHeader, BranchSelector, StatCard, DataTable, FilterBar, StatusBadge, FormModal, ConfirmDialog, PermissionGuard, EmptyState, ErrorState, LoadingSkeleton, Logo). Don't duplicate per module.
- Translations: `src/locales/en.js`, `src/locales/km.js`. Khmer must render correctly. No `alert()`.
- Logo via one `Logo` component using /public/logo.png, logo-mark.png, favicon.png.
- Local cache is for speed only; Supabase is the source of truth. Load per module, never the whole DB.

## UI
Clean SaaS look: professional blue, light neutral background, white cards, subtle borders. Responsive (desktop/tablet/mobile), cards instead of wide tables on mobile, large touch targets. Few menu items; minimal emojis/gradients/animation.

## Before implementing any important function, answer
Who can use it / what permission / which branch / validation / which records change / effect on inventory, cash, revenue/expense, payroll, dashboard, reports / Telegram? / audit? / month closed? / failure behavior / atomic?

## When you find a problem, report
Problem, impact, recommended fix, files affected, database impact, risk. Then fix if safe and in the current phase.

## After each phase, verify
Builds; login; permissions; branch isolation; create/edit/void; data persists after refresh; mobile; Khmer + English; related modules update; audit entries; reports accurate; no console errors or broken routes.

Full spec: see docs/P2B_SPEC.md (the original master prompt). Phase prompts: docs/phases/.
