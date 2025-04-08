
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

// Initialize Google Translate
const initGoogleTranslate = (lang: string) => {
  // Skip initialization if element already exists
  if (document.getElementById('google_translate_element')) {
    // Just change the language
    const googleTranslateSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleTranslateSelect) {
      let translateCode = 'en';
      
      // Map our language codes to Google Translate codes
      if (lang === 'tamil') translateCode = 'ta';
      else if (lang === 'hindi') translateCode = 'hi';
      else if (lang === 'english') translateCode = 'en';
      
      googleTranslateSelect.value = translateCode;
      googleTranslateSelect.dispatchEvent(new Event('change'));
    }
    return;
  }
  
  // Create the script element and add Google Translate script
  const script = document.createElement('script');
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  
  // Create Google Translate initialization function
  window.googleTranslateElementInit = () => {
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,ta,hi',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      },
      'google_translate_element'
    );
    
    // Set the initial language after initialization
    setTimeout(() => {
      const googleTranslateSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (googleTranslateSelect) {
        let translateCode = 'en';
        
        // Map our language codes to Google Translate codes
        if (lang === 'tamil') translateCode = 'ta';
        else if (lang === 'hindi') translateCode = 'hi';
        else if (lang === 'english') translateCode = 'en';
        
        googleTranslateSelect.value = translateCode;
        googleTranslateSelect.dispatchEvent(new Event('change'));
      }
    }, 1000);
  };
  
  // Add script to document
  document.head.appendChild(script);
};

// Add types for the Google Translate global function
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Get stored language preference or detect browser language
  const getInitialLanguage = (): Language => {
    const storedLanguage = localStorage.getItem('preferredLanguage') as Language | null;
    if (storedLanguage && ['tamil', 'hindi', 'english'].includes(storedLanguage)) {
      return storedLanguage;
    }
    return detectBrowserLanguage();
  };
  
  const [language, setLanguage] = useState<Language>(getInitialLanguage());
  
  // Initialize Google Translate when component mounts
  useEffect(() => {
    initGoogleTranslate(language);
  }, []);
  
  // Set language preference when changed
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    
    // Update Google Translate language
    initGoogleTranslate(language);
  }, [language]);

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

  // Enhanced translation function with better fallback support and dynamic key handling
  const t = (key: string, fallback?: string): string => {
    // First try exact match in current language
    if (translations[language][key]) {
      return translations[language][key];
    }
    
    // For dynamic keys like subcategory_xyz or product_xyz, try to construct a generic version
    // This helps with keys that might not be predefined in translation files
    const keyParts = key.split('_');
    if (keyParts.length > 1) {
      const genericKey = keyParts[0]; // e.g. 'subcategory' or 'product'
      
      // If we have a generic translation for this type, use it
      if (translations[language][genericKey]) {
        return fallback || key.split('_').slice(1).join(' ');
      }
    }
    
    // If fallback is provided, use it
    if (fallback) {
      return fallback;
    }
    
    // Try English as a fallback for untranslated keys
    if (language !== 'english' && translations.english[key]) {
      return translations.english[key];
    }
    
    // Return the key itself or the part after the underscore for dynamic keys
    return keyParts.length > 1 ? keyParts.slice(1).join(' ') : key;
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
