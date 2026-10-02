import { createContext, useContext, useState, useMemo } from 'react';
import en from '../locales/en.js';
import km from '../locales/km.js';

const dictionaries = { en, km };
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('p2b_lang') || 'en');
  const value = useMemo(() => ({
    lang,
    setLang: (next) => { localStorage.setItem('p2b_lang', next); setLangState(next); },
    t: (key) => dictionaries[lang][key] || dictionaries.en[key] || key,
  }), [lang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
