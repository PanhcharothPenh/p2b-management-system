import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function PermissionGuard({ perm, children }) {
  const { can } = useAuth();
  const { t } = useLanguage();
  if (perm && !can(perm)) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">{t('noAccess')}</div>;
  }
  return children;
}
