# Phase 3 — Daily Operations, Revenue, Expenses, Cash, Machines
Read CLAUDE.md.
Scope: Daily Operations as source transaction feeding Revenue (traceable via source_type/source_id), Expenses (optional cash-out link), Cash Drawer (open, in/out, close with expected/actual/difference, full history), Machines + maintenance history (cost linkable to Expenses). Merge any duplicate Daily Income/Sales/Revenue modules after verifying current behavior.
Rules: cash-linked expense is one atomic RPC; voids not deletes; check month-closed status before every financial write; audit everything.
Done when: one operation creates traceable revenue and cash effects, voiding recalculates totals, closed-month edits are blocked.
