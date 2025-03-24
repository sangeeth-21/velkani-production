
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Percent } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";

// Special offers data
const specialOffers = [{
  id: 'offer1',
  title: 'Monthly Grocery Package',
  description: 'Get all essential grocery items at a discounted price. Limited time offer!',
  discount: 25,
  originalPrice: 1600,
  discountedPrice: 1200,
  image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  category: 'offers',
  subcategory: 'monthly-offers'
}, {
  id: 'offer2',
  title: 'Fresh Fruits Combo',
  description: 'Seasonal fruits selection with special discount. Buy now!',
  discount: 20,
  originalPrice: 550,
  discountedPrice: 440,
  image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  category: 'offers',
  subcategory: 'seasonal-offers'
}, {
  id: 'offer3',
  title: 'Premium Vegetables Box',
  description: 'Organic vegetable box with farm fresh produce at special price.',
  discount: 15,
  originalPrice: 400,
  discountedPrice: 340,
  image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  category: 'vegetables',
  subcategory: 'root-vegetables'
}];

const OfferCarousel = () => {
  const { t } = useLanguage();
  
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{t('special_offers')}</h2>
        <Button variant="link" className="text-primary">{t('see_all')}</Button>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {specialOffers.map((offer) => (
            <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden border-0 shadow-sm">
                <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                  {offer.discount > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
                      <Percent className="h-3 w-3" />
                      <span>{offer.discount}% {t('off')}</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="line-clamp-1 font-medium">{offer.title}</h3>
                  <p className="line-clamp-2 text-xs text-muted-foreground mb-2">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-primary font-bold">₹{offer.discountedPrice}</span>
                      {offer.discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through">₹{offer.originalPrice}</span>
                      )}
                    </div>
                    <Button size="sm" className="h-8 px-3">
                      {t('add')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1" />
        <CarouselNext className="right-1" />
      </Carousel>
    </div>
  );
};

export default OfferCarousel;
