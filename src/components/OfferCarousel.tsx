
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';

const OfferCarousel = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-4 px-4 animate-fade-in">
      <h2 className="text-xl font-medium mb-3">{t('offer_title')}</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <Card className="overflow-hidden border-none shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="relative w-full md:w-2/5 bg-purple-50 p-4">
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -25%
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Special Offer" 
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center text-purple-500 gap-1 mb-2">
                    <Tag size={16} />
                    <span className="text-sm font-medium">{t('special_offer')}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Monthly Grocery Package</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Get all essential grocery items at a discounted price. Limited time offer!
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold">₹1200</span>
                    <span className="text-sm text-muted-foreground line-through ml-2">₹1600</span>
                  </div>
                  <Button asChild>
                    <Link to="/category/offers">View Details</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OfferCarousel;
