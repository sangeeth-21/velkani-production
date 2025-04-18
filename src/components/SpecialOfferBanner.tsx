import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Tag, Box, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const DualBanner = () => {
  const { t } = useLanguage();

  return (
    <div className="px-4 py-3 mb-4 animate-fade-in">
      {/* Changed grid layout to flex for better mobile support */}
      <div className="flex flex-row flex-wrap gap-4">
        {/* Left Banner - Special Offer (Green) - Now 50% width on all screens */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white min-h-[140px] flex-1 basis-2/5">
          <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-xl" />
          <div className="absolute right-10 bottom-0 h-20 w-20 bg-white/10 rounded-full blur-lg" />

          <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Tag className="h-4 w-4 md:h-5 md:w-5" />
                <span className="font-semibold text-sm md:text-base">{t('special_offer')}</span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">
                {t('offer_discount').replace('{discount}', '30')}
              </h3>
              <p className="text-xs md:text-sm text-white/80 hidden sm:block">
                Limited time offer!
              </p>
            </div>

            <Link to="/offer" className="self-start mt-2 md:mt-4">
              <Button
                variant="secondary"
                className="group whitespace-nowrap flex items-center gap-1 md:gap-2 bg-white text-green-600 hover:bg-white/90 text-xs md:text-sm py-1 h-8 md:h-10"
              >
                <span>{t('see_all')}</span>
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Banner - All Products (Blue) - Now 50% width on all screens */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 text-white min-h-[140px] flex-1 basis-2/5">
          <div className="absolute -left-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-xl" />
          <div className="absolute left-10 bottom-0 h-20 w-20 bg-white/10 rounded-full blur-lg" />

          <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Box className="h-4 w-4 md:h-5 md:w-5" />
                <span className="font-semibold text-sm md:text-base">{t('all_All products')}</span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">
                {t('explore_All collection')}
              </h3>
              <p className="text-xs md:text-sm text-white/80 hidden sm:block">
                Browse our catalog!
              </p>
            </div>

            <Link to="/allproducts" className="self-start mt-2 md:mt-4">
              <Button
                variant="secondary"
                className="group whitespace-nowrap flex items-center gap-1 md:gap-2 bg-white text-blue-600 hover:bg-white/90 text-xs md:text-sm py-1 h-8 md:h-10"
              >
                <span>{t('shop_Shop now')}</span>
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualBanner;