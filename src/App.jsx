import { Routes, Route, Navigate } from 'react-router-dom';
import { isSupabaseConfigured } from './lib/supabase.js';
import { useAuth } from './context/AuthContext.jsx';
import { useLanguage } from './context/LanguageContext.jsx';
import { NAV_GROUPS } from './config/navigation.js';
import AppLayout from './components/AppLayout.jsx';
import PermissionGuard from './components/PermissionGuard.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ComingSoon from './pages/ComingSoon.jsx';

const Message = ({ text, onSignOut, signOutLabel }) => (
  <div className="grid min-h-screen place-items-center p-4">
    <div className="max-w-md space-y-3 rounded-2xl border border-slate-200 bg-white p-6 text-center">
      <p>{text}</p>
      {onSignOut && <button className="rounded-lg border border-slate-300 px-4 py-2" onClick={onSignOut}>{signOutLabel}</button>}
    </div>
  </div>
);

export default function App() {
  const { session, profile, loading, signOut } = useAuth();
  const { t } = useLanguage();

  if (!isSupabaseConfigured) return <Message text={t('notConfigured')} />;
  if (loading) return <Message text="..." />;
  if (!session) return <Login />;
  if (!profile) return <Message text={t('noProfile')} onSignOut={signOut} signOutLabel={t('signOut')} />;

  const pages = NAV_GROUPS.flatMap((g) => g.items).filter((i) => i.path !== '/');
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<PermissionGuard perm="dashboard.view"><Dashboard /></PermissionGuard>} />
        {pages.map((p) => (
          <Route key={p.path} path={p.path} element={<PermissionGuard perm={p.perm}><ComingSoon /></PermissionGuard>} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
