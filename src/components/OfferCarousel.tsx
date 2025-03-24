
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Tag, Percent } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

// Special offers data
const specialOffers = [
  {
    id: 'offer1',
    title: 'Monthly Grocery Package',
    description: 'Get all essential grocery items at a discounted price. Limited time offer!',
    discount: 25,
    originalPrice: 1600,
    discountedPrice: 1200,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'grocery'
  },
  {
    id: 'offer2',
    title: 'Fresh Fruits Combo',
    description: 'Seasonal fruits selection with special discount. Buy now!',
    discount: 20,
    originalPrice: 550,
    discountedPrice: 440,
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'fruits'
  },
  {
    id: 'offer3',
    title: 'Premium Vegetables Box',
    description: 'Organic vegetable box with farm fresh produce at special price.',
    discount: 15,
    originalPrice: 400,
    discountedPrice: 340,
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'vegetables'
  }
];

const OfferCarousel = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-4 px-4 animate-fade-in">
      <h2 className="text-xl font-medium mb-3">{t('offer_title')}</h2>
      
      <Carousel className="w-full">
        <CarouselContent>
          {specialOffers.map((offer) => (
            <CarouselItem key={offer.id}>
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-2/5 bg-purple-50 p-4">
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Percent size={12} />
                        {offer.discount}%
                      </div>
                      <img 
                        src={offer.image} 
                        alt={offer.title} 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center text-purple-500 gap-1 mb-2">
                          <Tag size={16} />
                          <span className="text-sm font-medium">{t('special_offer')}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{offer.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                          {offer.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold">₹{offer.discountedPrice}</span>
                          <span className="text-sm text-muted-foreground line-through ml-2">₹{offer.originalPrice}</span>
                        </div>
                        <Button asChild>
                          <Link to={`/category/${offer.category}`}>View Category</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:flex">
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </div>
      </Carousel>
    </section>
  );
};

export default OfferCarousel;
