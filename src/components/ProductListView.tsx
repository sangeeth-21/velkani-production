
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Star, ChevronDown, Filter, ArrowUpDown, ShoppingCart, LayoutGrid, List } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { useCart } from '../context/CartContext';
import { useIsMobile } from '../hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [localViewType, setLocalViewType] = useState<'grid' | 'list'>(viewType);
  
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
          <div className="hidden sm:flex gap-2 mr-2">
            <Button 
              variant={localViewType === 'grid' ? "default" : "outline"} 
              size="sm" 
              className="flex items-center"
              onClick={() => setLocalViewType('grid')}
            >
              <LayoutGrid size={16} />
            </Button>
            <Button 
              variant={localViewType === 'list' ? "default" : "outline"} 
              size="sm" 
              className="flex items-center"
              onClick={() => setLocalViewType('list')}
            >
              <List size={16} />
            </Button>
          </div>
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
      
      {localViewType === 'grid' ? (
        // Grid view - responsive layout for different screen sizes
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {enhancedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img 
                    src={product.image} 
                    alt={t(`product_${product.id}_name`, product.name)} 
                    className="w-full h-full object-cover"
                  />
                  {product.isOrganic && (
                    <div className="absolute top-2 left-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                      {t('organic')}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    {t(`brand_${product.brand?.toLowerCase().replace(/\s+/g, '_')}`, product.brand || '')}
                  </div>
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">
                    {t(`product_${product.id}_name`, product.name)}
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    <div className="text-xs bg-green-100 text-green-700 px-1 rounded flex items-center">
                      <span className="mr-1">{product.ratings}</span>
                      <Star size={12} fill="currentColor" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.totalRatings} {t('ratings')}
                    </span>
                  </div>
                  
                  <Select defaultValue={product.weightOptions?.[0].value}>
                    <SelectTrigger className="flex items-center text-xs h-6 mb-2">
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
                  
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <span className="font-bold text-sm">₹{product.price}</span>
                      {product.oldPrice && (
                        <span className="text-xs line-through text-muted-foreground ml-1">
                          ₹{product.oldPrice}
                        </span>
                      )}
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="h-8"
                      onClick={() => handleAddToCart(product)}
                    >
                      {t('add')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // List view - more horizontal layout with product details
        <div className="space-y-3">
          {enhancedProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/4 aspect-video sm:aspect-square">
                    <img 
                      src={product.image} 
                      alt={t(`product_${product.id}_name`, product.name)} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-full sm:w-3/4 p-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-xs text-muted-foreground">
                            {t(`brand_${product.brand?.toLowerCase().replace(/\s+/g, '_')}`, product.brand || '')}
                          </div>
                          {product.isOrganic && (
                            <div className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                              {t('organic')}
                            </div>
                          )}
                        </div>
                        <h3 className="font-medium mb-1">
                          {t(`product_${product.id}_name`, product.name)}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 mb-1 mt-1 sm:mt-0">
                        <div className="text-xs bg-green-100 text-green-700 px-1 rounded flex items-center">
                          <span className="mr-1">{product.ratings}</span>
                          <Star size={12} fill="currentColor" />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {product.totalRatings} {t('ratings')}
                        </span>
                      </div>
                    </div>
                    
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {t(`product_${product.id}_description`, product.description)}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center justify-between mt-2">
                      <div className="flex items-center gap-3">
                        <Select defaultValue={product.weightOptions?.[0].value}>
                          <SelectTrigger className="flex items-center text-xs h-7 w-28">
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
                        
                        <div>
                          <span className="font-bold">₹{product.price}</span>
                          {product.oldPrice && (
                            <span className="text-xs line-through text-muted-foreground ml-1">
                              ₹{product.oldPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <Button 
                        variant="destructive" 
                        className="mt-2 sm:mt-0"
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
      )}
    </div>
  );
};

export default ProductListView;
