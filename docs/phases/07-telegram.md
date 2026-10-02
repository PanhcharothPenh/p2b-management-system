# Phase 7 — Telegram Center, Notifications, Schedules, 2FA, Logs
Read CLAUDE.md.
Scope: Telegram Center tabs (Overview, Bot Config, Attendance, Notifications, Schedules, 2FA, Logs); event-driven notifications (event -> rules -> template -> recipient -> send -> delivery log); scheduled reports; Telegram 2FA (hashed temp code, expiry, attempt limit, single use); in-app notification center linking to records.
Bot token and secrets stay server-side (Edge Functions / backend), never in frontend.
Done when: failed sends are logged and surfaced, 2FA codes can't be reused, schedules compute next run.
