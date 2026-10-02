import { useState } from 'react';
import { signIn } from '../services/authService.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import Logo from '../components/Logo.jsx';

export default function Login() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    const { error: err } = await signIn(email.trim(), password);
    if (err) setError(t('loginFailed'));
    setBusy(false);
  };

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <Logo />
        <h1 className="text-lg font-semibold">{t('app')}</h1>
        <label className="block text-sm">{t('email')}
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3" />
        </label>
        <label className="block text-sm">{t('password')}
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-1 min-h-[42px] w-full rounded-lg border border-slate-300 px-3" />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={busy} className="min-h-[44px] w-full rounded-lg bg-brand font-semibold text-white disabled:opacity-60">{t('signIn')}</button>
      </form>
    </div>
  );
}
