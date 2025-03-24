
import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Define the window interface with Google Translate properties
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages?: string; layout?: any; autoDisplay?: boolean },
          elementId: string
        ) => void;
      };
    };
  }
}

const GoogleTranslate = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    };

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en', // Default page language
          includedLanguages: 'en,ta,hi', // Languages to include in the dropdown
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google-translate-element'
      );
    };

    const cleanup = addScript();
    
    return () => {
      if (cleanup) cleanup();
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <div 
      id="google-translate-element" 
      className="google-translate-container"
    ></div>
  );
};

export default GoogleTranslate;
