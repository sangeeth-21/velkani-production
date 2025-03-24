
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Tag, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';

const SpecialOfferBanner = () => {
  const { t } = useLanguage();
  
  return (
    <div className="px-4 py-3 mb-4 animate-fade-in">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-xl" />
        <div className="absolute right-10 bottom-0 h-20 w-20 bg-white/10 rounded-full blur-lg" />
        
        <div className="relative z-10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-5 w-5" />
              <span className="font-semibold">{t('special_offer')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              {t('offer_discount').replace('{discount}', '30')}
            </h3>
            <p className="text-sm text-white/80 max-w-sm">
              Limited time offer on selected categories. Shop our best deals now!
            </p>
          </div>
          
          <Link to="/category/offers">
            <Button variant="secondary" className="group whitespace-nowrap flex items-center gap-2">
              <span>{t('see_all')}</span>
              <ShoppingBag className="h-4 w-4 transition-transform group-hover:scale-110" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SpecialOfferBanner;
