import { useLanguage } from '../context/LanguageContext.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function ComingSoon() {
  const { t } = useLanguage();
  return <EmptyState message={t('comingSoon')} />;
}
