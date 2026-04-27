import { createContext, useState, useContext, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('appLanguage') || 'en');

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage: setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
