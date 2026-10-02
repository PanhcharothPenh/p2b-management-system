# Phase 1 — Foundation
Read CLAUDE.md. Approved audit is in docs/audit.md.
Scope: TS -> JS conversion (module by module, build after each), project cleanup, authentication, AppLayout (collapsible sidebar, topbar with branch selector/language/notifications/profile), grouped sidebar filtered by permission, roles + configurable permissions, branches + user_branches, RLS for branch isolation, Logo component, en/km locale setup.
Out of scope: staff, finance, inventory, payroll features.
Rules: migrations only, no data loss; commit per logical step.
Done when: app builds with zero TS files, login works, a Manager cannot reach another branch's data via URL or API, menu respects permissions, language switch works.
Report what changed, risks, and what you tested.
