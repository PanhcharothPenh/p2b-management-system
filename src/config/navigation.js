// Single source for the sidebar AND the routes. `perm` is a UI convenience;
// the database (RLS) is what really enforces access.
export const NAV_GROUPS = [
  { label: 'overview', items: [{ label: 'dashboard', path: '/', perm: 'dashboard.view' }] },
  { label: 'operations', items: [
    { label: 'dailyOps', path: '/operations', perm: 'revenue.view' },
    { label: 'revenue', path: '/revenue', perm: 'revenue.view' },
    { label: 'coins', path: '/coins', perm: 'revenue.view' },
    { label: 'machines', path: '/machines', perm: 'inventory.view' },
  ] },
  { label: 'staffPayroll', items: [
    { label: 'staff', path: '/staff', perm: 'staff.view' },
    { label: 'shifts', path: '/shifts', perm: 'attendance.view' },
    { label: 'attendance', path: '/attendance', perm: 'attendance.view' },
    { label: 'overtime', path: '/overtime', perm: 'payroll.view' },
    { label: 'advance', path: '/advance', perm: 'payroll.view' },
    { label: 'payroll', path: '/payroll', perm: 'payroll.view' },
    { label: 'payslips', path: '/payslips', perm: 'payroll.view' },
  ] },
  { label: 'inventory', items: [
    { label: 'inventory', path: '/inventory', perm: 'inventory.view' },
    { label: 'stock', path: '/stock', perm: 'inventory.view' },
    { label: 'consumables', path: '/consumables', perm: 'inventory.view' },
    { label: 'suppliers', path: '/suppliers', perm: 'inventory.view' },
  ] },
  { label: 'finance', items: [
    { label: 'expenses', path: '/expenses', perm: 'expense.view' },
    { label: 'cash', path: '/cash', perm: 'expense.view' },
    { label: 'debt', path: '/debt', perm: 'expense.view' },
    { label: 'supplierPay', path: '/supplier-payments', perm: 'expense.view' },
    { label: 'closing', path: '/closing', perm: 'month.close' },
  ] },
  { label: 'reports', items: [{ label: 'reports', path: '/reports', perm: 'reports.view' }] },
  { label: 'telegram', items: [{ label: 'telegramCenter', path: '/telegram', perm: 'telegram.manage' }] },
  { label: 'administration', items: [
    { label: 'branches', path: '/branches', perm: 'branch.manage' },
    { label: 'users', path: '/users', perm: 'users.manage' },
    { label: 'roles', path: '/roles', perm: 'users.manage' },
    { label: 'audit', path: '/audit', perm: 'audit.view' },
    { label: 'settings', path: '/settings', perm: 'settings.manage' },
  ] },
];
