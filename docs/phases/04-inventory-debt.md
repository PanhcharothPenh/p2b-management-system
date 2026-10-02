# Phase 4 — Inventory, Stock, Consumables, Suppliers, Debt
Read CLAUDE.md.
Scope: Inventory with computed status (In/Low/Out of Stock), no direct quantity edits, stock movements (in/out/adjustment/transfer with linked movements sharing a transfer reference), ONE Consumables module (Detergent/Softener/Gas/Other) on top of inventory, Suppliers (Inactive instead of delete), Debt + separate Debt Payments (outstanding = original - valid payments; statuses Outstanding/Partial/Paid/Overdue/Cancelled).
Atomic RPCs: consumable purchase (stock in + supplier + optional expense), stock transfer, debt payment (+ optional cash transaction).
Merge existing detergent/softener/general inventory logic carefully; migrate data, don't discard it.
