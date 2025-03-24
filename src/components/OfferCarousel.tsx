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
  const {
    t
  } = useLanguage();
  return;
};
export default OfferCarousel;