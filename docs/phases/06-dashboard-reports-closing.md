# Phase 6 — Dashboard, Report Center, Month Closing
Read CLAUDE.md.
Scope: Dashboard (greeting, KPIs, attendance, alerts, revenue trend 7d/30d/month, recent activity, Quick Add by permission) aggregating source records only; Report Center (categories, filters, print/PDF/CSV, calculated from source); Month Closing (validate -> review -> confirm -> snapshot; reopen with reason + audit; closed-month enforcement in DB, not only UI).
Optimize queries, add indexes after checking real query patterns, paginate.
Done when: report totals match source records and a closed month rejects edits at the database level.
