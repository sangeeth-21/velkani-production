
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

// Updated offer data with better images
const offers = [
  {
    id: 1,
    title: 'offer_discount',
    discount: 50,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bgColor: 'bg-blue-50'
  },
  {
    id: 2,
    title: 'offer_discount',
    discount: 30,
    image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bgColor: 'bg-purple-50'
  },
  {
    id: 3,
    title: 'offer_discount',
    discount: 70,
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    bgColor: 'bg-amber-50'
  }
];

const OfferCarousel = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-4 px-4 animate-fade-in">
      <h2 className="text-xl font-medium mb-3">{t('offer_title')}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {offers.map((offer) => (
          <div 
            key={offer.id} 
            className={`rounded-lg overflow-hidden shadow-sm animate-scale-in ${offer.bgColor}`}
          >
            <div className="relative aspect-[16/9] w-full">
              <img
                src={offer.image}
                alt={t(offer.title).replace('{discount}', offer.discount.toString())}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
                <div className="p-6 text-white">
                  <h3 className="text-lg font-medium mb-1">
                    {t(offer.title).replace('{discount}', offer.discount.toString())}
                  </h3>
                  <p className="text-sm opacity-80">{t('offer_limited')}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OfferCarousel;
