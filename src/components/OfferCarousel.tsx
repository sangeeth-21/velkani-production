
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
    <section className="w-full px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">{t('special_offers')}</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {specialOffers.map((offer) => (
            <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={offer.image} 
                    alt={offer.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full flex items-center">
                    <Percent className="h-3 w-3 mr-1" />
                    {offer.discount}% OFF
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{offer.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold">₹{offer.discountedPrice}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">₹{offer.originalPrice}</span>
                    </div>
                    <Button size="sm">
                      {t('add_to_cart')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:flex">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </section>
  );
};

export default OfferCarousel;
