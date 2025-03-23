
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const OfferCarousel = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-4 px-4 animate-fade-in">
      <h2 className="text-xl font-medium mb-3">{t('offer_title')}</h2>
      
      {/* Empty carousel section as requested */}
    </section>
  );
};

export default OfferCarousel;
