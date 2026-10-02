import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { isSupabaseConfigured } from '../lib/supabase.js';
import { getSession, onAuthChange, loadAccess, signOut } from '../services/authService.js';

const AuthContext = createContext(null);
const EMPTY = { profile: null, permissions: [], branches: [] };

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [access, setAccess] = useState(EMPTY);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const refresh = useCallback(async (nextSession) => {
    setSession(nextSession);
    if (!nextSession) { setAccess(EMPTY); setLoading(false); return; }
    try { setAccess(await loadAccess(nextSession.user.id)); }
    catch (err) { console.error('Failed to load access', err); setAccess(EMPTY); }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    getSession().then(({ data }) => refresh(data.session));
    const { data } = onAuthChange(refresh);
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  // UI convenience only. The database (RLS) is what actually enforces permissions.
  const can = (code) => access.permissions.includes(code);

  return (
    <AuthContext.Provider value={{ session, ...access, loading, can, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
