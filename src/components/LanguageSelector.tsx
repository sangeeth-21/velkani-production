
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div className="flex space-x-2 animate-slide-up">
      <button 
        onClick={() => setLanguage('english')} 
        className={`px-2 py-0.5 text-xs rounded-full transition-all ${language === 'english' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
      >
        {t('language_english')}
      </button>
      <button 
        onClick={() => setLanguage('tamil')} 
        className={`px-2 py-0.5 text-xs rounded-full transition-all ${language === 'tamil' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
      >
        {t('language_tamil')}
      </button>
      <button 
        onClick={() => setLanguage('hindi')} 
        className={`px-2 py-0.5 text-xs rounded-full transition-all ${language === 'hindi' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
      >
        {t('language_hindi')}
      </button>
    </div>
  );
};

export default LanguageSelector;
