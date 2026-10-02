# Phase 5 — Salary, OT, Advance, Payroll, Payslip
Read CLAUDE.md.
Scope: salary configs, overtime (with approval), salary advances (with approval), payroll period flow (select period/branch -> calculate from attendance + OT + advances + adjustments -> review -> approve -> finalize), payslip generated only from finalized payroll, snapshot stored at finalization, block duplicate finalized payroll per staff+period unless authorized void/reopen.
If current salary formulas are unclear or conflict, STOP and ask me before choosing one.
Finalization is one atomic server-side function with audit and optional Telegram event.
Done when: changing salary settings afterward does not alter finalized payslips.
