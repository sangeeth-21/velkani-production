
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Tag, Percent } from 'lucide-react';
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
    <div className="py-4 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">{t('offer_title')}</h2>
        <Link to="/category/offers" className="text-sm text-muted-foreground flex items-center">
          {t('see_all')} →
        </Link>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent>
          {specialOffers.map((offer) => (
            <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
              <Link to={`/category/${offer.category}/subcategory/${offer.subcategory}`}>
                <Card className="overflow-hidden shadow-sm">
                  <CardContent className="p-0">
                    <div className="relative">
                      <img 
                        src={offer.image} 
                        alt={offer.title}
                        className="w-full h-40 object-cover" 
                      />
                      <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-bl-lg flex items-center">
                        <Percent className="h-3 w-3 mr-1" /> {offer.discount}% OFF
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-1">{offer.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{offer.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-muted-foreground line-through text-sm">₹{offer.originalPrice}</span>
                          <span className="text-lg font-bold ml-2">₹{offer.discountedPrice}</span>
                        </div>
                        <Button variant="destructive" size="sm">
                          {t('see_all')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 top-1/2" />
        <CarouselNext className="right-1 top-1/2" />
      </Carousel>
    </div>
  );
};

export default OfferCarousel;
