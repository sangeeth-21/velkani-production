
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Sample offer data
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
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useLanguage();
  
  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % offers.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % offers.length);
  };
  
  const prevSlide = () => {
    setActiveIndex((current) => (current - 1 + offers.length) % offers.length);
  };
  
  return (
    <section className="py-4 px-4 animate-fade-in">
      <h2 className="text-xl font-medium mb-3">{t('offer_title')}</h2>
      
      <div className="relative overflow-hidden rounded-lg">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {offers.map((offer) => (
            <div 
              key={offer.id} 
              className={`w-full flex-shrink-0 rounded-lg overflow-hidden shadow-sm animate-scale-in ${offer.bgColor}`}
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
        
        {/* Navigation arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover-scale"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover-scale"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        
        {/* Indicator dots */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {offers.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                activeIndex === index ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OfferCarousel;
