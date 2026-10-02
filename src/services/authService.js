import { supabase } from '../lib/supabase.js';

export const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
export const signOut = () => supabase.auth.signOut();
export const getSession = () => supabase.auth.getSession();
export const onAuthChange = (callback) => supabase.auth.onAuthStateChange((_event, session) => callback(session));

// Profile, permissions and branches are all protected by RLS in the database.
export async function loadAccess(userId) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, status, role_id, language, roles(code, name, all_branches)')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!profile || profile.status !== 'active' || !profile.role_id) return { profile: null, permissions: [], branches: [] };

  const [perms, branches] = await Promise.all([
    supabase.from('role_permissions').select('permissions(code)').eq('role_id', profile.role_id),
    supabase.from('branches').select('id, name, code').eq('status', 'active').order('name'),
  ]);
  if (perms.error) throw perms.error;
  if (branches.error) throw branches.error;

  return {
    profile,
    permissions: perms.data.map((row) => row.permissions.code),
    branches: branches.data,
  };
}
