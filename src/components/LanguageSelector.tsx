
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';
import { Languages } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage, t, toggleLanguage } = useLanguage();
  
  return (
    <div className="flex flex-col space-y-2 animate-slide-up">
      <div className="flex space-x-2">
        <button 
          onClick={() => setLanguage('english')} 
          className={`px-3 py-1 text-sm rounded-full transition-all ${language === 'english' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
        >
          {t('language_english')}
        </button>
        <button 
          onClick={() => setLanguage('tamil')} 
          className={`px-3 py-1 text-sm rounded-full transition-all ${language === 'tamil' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
        >
          {t('language_tamil')}
        </button>
        <button 
          onClick={() => setLanguage('hindi')} 
          className={`px-3 py-1 text-sm rounded-full transition-all ${language === 'hindi' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
        >
          {t('language_hindi')}
        </button>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleLanguage}
        className="flex items-center gap-2"
      >
        <Languages className="h-4 w-4" />
        <span>{t('toggle_language')}</span>
      </Button>
    </div>
  );
};

export default LanguageSelector;
