
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
    <section className="pb-8 px-4">
      <h2 className="text-2xl font-semibold mb-4">{t('special_offers', 'Special Offers')}</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {specialOffers.map((offer) => (
            <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={offer.image} 
                      alt={offer.title} 
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold rounded-full p-2 flex items-center">
                      <Percent className="h-3 w-3 mr-1" />
                      {offer.discount}% OFF
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{offer.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold">₹{offer.discountedPrice}</span>
                      <span className="text-sm text-muted-foreground line-through">₹{offer.originalPrice}</span>
                    </div>
                    <Button className="w-full">Add to Cart</Button>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
    </section>
  );
};

export default OfferCarousel;
