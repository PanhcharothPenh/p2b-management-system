import { useAuth } from '../context/AuthContext.jsx';
import { useBranch } from '../context/BranchContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import StatCard from '../components/StatCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Dashboard() {
  const { profile } = useAuth();
  const { branches, branchId } = useBranch();
  const { t, lang } = useLanguage();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const branchName = branchId === 'all' ? t('allBranches') : (branches.find((b) => b.id === branchId) || {}).name;
  const today = new Date().toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-GB',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // Phase 6 will replace this with real aggregated KPIs from source records.
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{t(greeting)}, {profile && profile.full_name}</h2>
        <p className="text-slate-500">{branchName} · {today}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label={t('branchCount')} value={branches.length} />
        <StatCard label={t('yourRole')} value={profile && profile.roles ? profile.roles.name : '-'} />
      </div>
      <EmptyState message={t('emptyDash')} />
    </div>
  );
}
