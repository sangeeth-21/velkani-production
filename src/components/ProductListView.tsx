
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Star, ChevronDown, Filter, ArrowUpDown, ShoppingCart } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { useCart } from '../context/CartContext';

// Updated Product type to match the actual data structure
type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  oldPrice?: number | null;
  unit?: string;
  weight?: string;
  rating?: number;
  ratings?: number;
  numReviews?: number;
  totalRatings?: number;
  image: string;
  categoryId?: string;
  subcategoryId?: string;
  inStock?: boolean;
  isBestSeller?: boolean;
  isOrganic?: boolean;
  brand?: string;
  weightOptions?: Array<{value: string, price: number}>
};

type ProductListViewProps = {
  products: Product[];
  viewType?: 'grid' | 'list';
  categoryId?: string;
};

const ProductListView = ({ categoryId, products, viewType = 'grid' }: ProductListViewProps) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  
  // Enhance products with weight options if they don't have them
  const enhancedProducts = products.map(product => {
    if (!product.weightOptions) {
      // Create default weight options based on the unit or weight provided
      const baseWeight = product.unit || product.weight || '500g';
      const basePrice = product.price;
      return {
        ...product,
        brand: product.brand || t('fresh_produce', 'Fresh Produce'),
        ratings: product.ratings || product.rating || 4.0,
        totalRatings: product.totalRatings || product.numReviews || 0,
        weight: product.weight || product.unit || '500g',
        weightOptions: [
          { value: baseWeight, price: basePrice },
          { value: '1 kg', price: basePrice * 2 },
          { value: '2 kg', price: basePrice * 3.5 },
        ]
      };
    }
    return {
      ...product,
      brand: product.brand || t('fresh_produce', 'Fresh Produce'),
      ratings: product.ratings || product.rating || 4.0,
      totalRatings: product.totalRatings || product.numReviews || 0,
      weight: product.weight || product.unit || '500g',
    };
  });
  
  const handleAddToCart = (product: Product, selectedWeight?: string) => {
    const weightToUse = selectedWeight || product.weight || product.unit || '500g';
    const weightOption = product.weightOptions?.find(opt => opt.value === weightToUse);
    const priceToUse = weightOption ? weightOption.price : product.price;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: priceToUse,
      weight: weightToUse,
      image: product.image,
      quantity: 1
    });
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-background z-10 py-2">
        <div className="text-sm text-muted-foreground">
          {enhancedProducts.length} {t('items')}
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
      
      {/* For grid view on larger screens, show single column on mobile */}
      <div className={viewType === 'grid' 
        ? 'grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4' 
        : 'space-y-4'}>
        {enhancedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden shadow-sm">
            <CardContent className="p-0">
              {/* On mobile, always show items in a row layout for better visibility */}
              <div className="flex">
                <div className="w-1/3 h-24 p-2 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={t(`product_${product.id}_name`, product.name)} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="w-2/3 p-2 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {t(`brand_${product.brand?.toLowerCase().replace(/\s+/g, '_')}`, product.brand || '')}
                    </div>
                    <h3 className="font-medium mb-1 text-sm line-clamp-2">
                      {t(`product_${product.id}_name`, product.name)}
                    </h3>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="text-xs bg-green-100 text-green-700 px-1 rounded flex items-center">
                        <span className="mr-1">{product.ratings}</span>
                        <Star size={12} fill="currentColor" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {product.totalRatings} {t('ratings')}
                      </span>
                    </div>
                    
                    <Select defaultValue={product.weightOptions?.[0].value}>
                      <SelectTrigger className="flex items-center text-xs h-6 w-24">
                        <SelectValue placeholder={product.weight} />
                      </SelectTrigger>
                      <SelectContent>
                        {product.weightOptions?.map((option, idx) => (
                          <SelectItem key={idx} value={option.value}>
                            {option.value} - ₹{option.price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="font-bold text-sm">₹{product.price}</div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleAddToCart(product)}
                    >
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
