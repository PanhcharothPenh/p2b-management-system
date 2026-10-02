import { createContext, useContext, useState, useMemo } from 'react';
import { useAuth } from './AuthContext.jsx';

const BranchContext = createContext(null);

export function BranchProvider({ children }) {
  const { branches } = useAuth();
  const [selected, setSelected] = useState(() => localStorage.getItem('p2b_branch') || 'all');

  const value = useMemo(() => {
    // Fall back to "all" if the stored branch is no longer accessible to this user.
    const valid = selected === 'all' || branches.some((b) => b.id === selected);
    return {
      branches,
      branchId: valid ? selected : 'all',
      setBranchId: (id) => { localStorage.setItem('p2b_branch', id); setSelected(id); },
    };
  }, [branches, selected]);

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export const useBranch = () => useContext(BranchContext);
