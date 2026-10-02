import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { NAV_GROUPS } from '../config/navigation.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useBranch } from '../context/BranchContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import Logo from './Logo.jsx';

export default function AppLayout() {
  const { can, profile, signOut } = useAuth();
  const { branches, branchId, setBranchId } = useBranch();
  const { t, lang, setLang } = useLanguage();
  const [collapsed, setCollapsed] = useState(false); // desktop
  const [open, setOpen] = useState(false); // mobile drawer
  const { pathname } = useLocation();

  const groups = NAV_GROUPS
    .map((g) => ({ ...g, items: g.items.filter((i) => can(i.perm)) }))
    .filter((g) => g.items.length > 0);
  const current = NAV_GROUPS.flatMap((g) => g.items).find((i) => i.path === pathname);
  const canPickAll = branches.length > 1;

  return (
    <div className="flex h-screen">
      {open && <div className="fixed inset-0 z-10 bg-black/40 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed z-20 flex h-full flex-col border-r border-slate-200 bg-white transition-all md:static
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${collapsed ? 'md:w-16' : 'md:w-64'} w-64`}>
        <div className="p-4"><Logo mark={collapsed} /></div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {groups.map((g) => (
            <div key={g.label}>
              {!collapsed && <div className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{t(g.label)}</div>}
              {g.items.map((i) => (
                <NavLink key={i.path} to={i.path} end onClick={() => setOpen(false)}
                  className={({ isActive }) => `flex min-h-[40px] items-center gap-3 rounded-lg px-3 text-sm
                    ${isActive ? 'bg-brand-soft font-semibold text-brand' : 'text-slate-700 hover:bg-slate-100'}`}>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-current opacity-50" />
                  {!collapsed && <span className="truncate">{t(i.label)}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        {!collapsed && <div className="p-3 text-[11px] text-slate-400">{t('powered')}</div>}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-4 py-2">
          <button className="min-h-[38px] rounded-lg border border-slate-200 px-3"
            onClick={() => (window.innerWidth < 768 ? setOpen(!open) : setCollapsed(!collapsed))} aria-label="Menu">&#9776;</button>
          <h1 className="text-base font-semibold">{t(current ? current.label : 'dashboard')}</h1>
          <div className="flex-1" />
          <select className="min-h-[38px] rounded-lg border border-slate-200 bg-white px-2 text-sm"
            value={branchId} onChange={(e) => setBranchId(e.target.value)}>
            {canPickAll && <option value="all">{t('allBranches')}</option>}
            {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select className="min-h-[38px] rounded-lg border border-slate-200 bg-white px-2 text-sm"
            value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="km">ខ្មែរ</option>
          </select>
          <span className="hidden text-sm text-slate-600 sm:inline">{profile && profile.full_name}</span>
          <button className="min-h-[38px] rounded-lg border border-slate-200 px-3 text-sm" onClick={signOut}>{t('signOut')}</button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
