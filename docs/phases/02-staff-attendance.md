# Phase 2 — Staff, Shift, Attendance, Telegram Mini App
Read CLAUDE.md.
Scope: Staff list/profile (filters, statuses Active/Inactive/Resigned/Terminated, no hard delete), Add Staff in sections (Personal/Employment/Salary/Telegram), Shift (daily/weekly/monthly views, assign shift), ONE attendance table used by web and Telegram, check-in/check-out via server-side functions (block duplicate check-in, checkout without check-in, duplicate checkout; compute work duration, late, OT), mobile-first Telegram attendance Mini App ("Account Not Linked" state), optional GPS/photo hooks that can be disabled.
Each action: permission check, branch check, audit entry, optional notification event.
Done when: web and Telegram check-ins appear in the same records, scheduled vs actual shown, all validations enforced server-side.
