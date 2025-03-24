
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations, Language } from '../translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
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
    
    // Store in localStorage for persistence
    localStorage.setItem('preferredLanguage', detectedLanguage);
  }, []);

  // Toggle between languages in a cycle: tamil -> hindi -> english -> tamil
  const toggleLanguage = () => {
    let newLanguage: Language;
    if (language === 'tamil') {
      newLanguage = 'hindi';
    } else if (language === 'hindi') {
      newLanguage = 'english';
    } else {
      newLanguage = 'tamil';
    }
    
    setLanguage(newLanguage);
    localStorage.setItem('preferredLanguage', newLanguage);
  };

  // Enhanced translation function with fallback support for new content
  const t = (key: string, fallback?: string): string => {
    // Check if the key exists in the current language
    if (translations[language][key]) {
      return translations[language][key];
    }
    
    // If key doesn't exist but a fallback is provided, use the fallback
    if (fallback) {
      return fallback;
    }
    
    // Try English as a fallback for untranslated keys
    if (language !== 'english' && translations.english[key]) {
      return translations.english[key];
    }
    
    // Return the key itself as last resort
    return key;
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
