
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
    <div className="px-4 mb-8">
      <h2 className="text-xl font-bold mb-4">{t('special_offers')}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {specialOffers.map((offer) => (
            <CarouselItem key={offer.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <Card className="overflow-hidden shadow-md h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
                        <Percent className="h-3 w-3 mr-1" />
                        {offer.discount}% {t('off')}
                      </div>
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-semibold text-base mb-1">{offer.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 flex-1">
                        {offer.description}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-muted-foreground line-through text-sm">₹{offer.originalPrice}</span>
                          <span className="font-bold text-lg ml-2">₹{offer.discountedPrice}</span>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" className="w-full mt-auto">
                        {t('shop_now')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -right-4 top-1/2 -translate-y-1/2">
          <CarouselNext />
        </div>
        <div className="absolute -left-4 top-1/2 -translate-y-1/2">
          <CarouselPrevious />
        </div>
      </Carousel>
    </div>
  );
};

export default OfferCarousel;
