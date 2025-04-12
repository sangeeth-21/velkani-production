import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Tag, Box, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const DualBanner = () => {
  const { t } = useLanguage();

  return (
    <div className="px-4 py-3 mb-4 animate-fade-in">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2">
        {/* Left Banner - Special Offer (Green) */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white min-h-[180px] h-full">
          <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-xl" />
          <div className="absolute right-10 bottom-0 h-20 w-20 bg-white/10 rounded-full blur-lg" />

          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-5 w-5" />
                <span className="font-semibold">{t('special_offer')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                {t('offer_discount').replace('{discount}', '30')}
              </h3>
              <p className="text-sm text-white/80 max-w-sm hidden sm:block">
                Limited time offer on selected categories. Shop our best deals now!
              </p>
            </div>

            <Link to="/offer" className="self-start mt-4">
              <Button
                variant="secondary"
                className="group whitespace-nowrap flex items-center gap-2 bg-white text-green-600 hover:bg-white/90"
              >
                <span>{t('see_all')}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Banner - All Products (Blue) */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 text-white min-h-[180px] h-full">
          <div className="absolute -left-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-xl" />
          <div className="absolute left-10 bottom-0 h-20 w-20 bg-white/10 rounded-full blur-lg" />

          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Box className="h-5 w-5" />
                <span className="font-semibold">{t('all_All products')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                {t('explore_All collection')}
              </h3>
              <p className="text-sm text-white/80 max-w-sm hidden sm:block">
                Browse our complete catalog of high-quality products for every need.
              </p>
            </div>

            <Link to="/allproducts" className="self-start mt-4">
              <Button
                variant="secondary"
                className="group whitespace-nowrap flex items-center gap-2 bg-white text-blue-600 hover:bg-white/90"
              >
                <span>{t('shop_now')}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualBanner;
