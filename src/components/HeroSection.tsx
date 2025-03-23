
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="pt-20 pb-6 px-4 bg-gradient-to-b from-secondary to-background animate-fade-in">
      <div className="space-y-2 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-medium tracking-tight animate-slide-in">{t('hero_title')}</h2>
        <p className="text-muted-foreground text-sm animate-slide-in animation-delay-150">{t('hero_subtitle')}</p>
        
        {/* Language Selector */}
        <LanguageSelector />
      </div>
    </section>
  );
};

// Language selector component
const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div className="flex justify-center mt-4 space-x-2 animate-slide-up">
      <button 
        onClick={() => setLanguage('english')} 
        className={`px-3 py-1 text-xs rounded-full transition-all ${language === 'english' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
      >
        {t('language_english')}
      </button>
      <button 
        onClick={() => setLanguage('tamil')} 
        className={`px-3 py-1 text-xs rounded-full transition-all ${language === 'tamil' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
      >
        {t('language_tamil')}
      </button>
      <button 
        onClick={() => setLanguage('hindi')} 
        className={`px-3 py-1 text-xs rounded-full transition-all ${language === 'hindi' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}
      >
        {t('language_hindi')}
      </button>
    </div>
  );
};

export default HeroSection;
