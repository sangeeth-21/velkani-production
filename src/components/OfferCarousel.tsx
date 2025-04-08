
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Percent } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

// Special offers data

const OfferCarousel = () => {
  const { t } = useLanguage();
  
  return (
    <section className="pb-8 px-4">
      <h2 className="text-2xl font-semibold mt-2">{t('special_offers', 'Special Offers')}</h2>
      <Carousel className="w-full">
          <CarouselNext />
      </Carousel>
    </section>
  );
};

export default OfferCarousel;
