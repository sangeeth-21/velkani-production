
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations, Language } from '../translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Function to detect browser language and map to supported languages
const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('ta')) return 'tamil';
  if (browserLang.startsWith('hi')) return 'hindi';
  
  // Default to tamil as requested
  return 'tamil';
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initialize with detected language
  const [language, setLanguage] = useState<Language>('tamil');
  
  // Set language based on browser settings on initial render
  useEffect(() => {
    const detectedLanguage = detectBrowserLanguage();
    setLanguage(detectedLanguage);
  }, []);

  // Toggle between languages in a cycle: tamil -> hindi -> english -> tamil
  const toggleLanguage = () => {
    if (language === 'tamil') {
      setLanguage('hindi');
    } else if (language === 'hindi') {
      setLanguage('english');
    } else {
      setLanguage('tamil');
    }
  };

  const t = (key: string): string => {
    // Handle case where key doesn't exist in current language
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
