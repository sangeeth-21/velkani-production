
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Star, ChevronDown, Filter, ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type Product = {
  id: string;
  name: string;
  brand: string;
  ratings: number;
  totalRatings: number;
  weight: string;
  price: number;
  image: string;
};

type ProductListViewProps = {
  categoryId: string;
  products: Product[];
};

const ProductListView = ({ categoryId, products }: ProductListViewProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-background z-10 py-2">
        <div className="text-sm text-muted-foreground">
          {products.length} {t('items')}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowUpDown size={16} />
            <span>{t('sort')}</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter size={16} />
            <span>{t('filter')}</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden shadow-sm">
            <CardContent className="p-0">
              <div className="flex">
                <div className="w-24 h-24 sm:w-32 sm:h-32 p-2 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{product.brand}</div>
                    <h3 className="font-medium mb-1">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="text-xs bg-green-100 text-green-700 px-1 rounded flex items-center">
                        <span className="mr-1">{product.ratings}</span>
                        <Star size={12} fill="currentColor" />
                      </div>
                      <span className="text-xs text-muted-foreground">{product.totalRatings} {t('ratings')}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span>{product.weight}</span>
                      <ChevronDown size={16} className="ml-1" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-bold">₹{product.price}</div>
                    <Button variant="destructive" size="sm">
                      {t('add')}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductListView;
