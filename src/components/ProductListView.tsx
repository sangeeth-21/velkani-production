
import React from 'react';
import { Star, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

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
  const { addToCart } = useCart();
  
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      image: product.image,
      quantity: 1
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {products.length} {t('items')}
        </span>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-xs">
            <ArrowUpDown className="h-3 w-3 mr-1" />
            {t('sort')}
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Filter className="h-3 w-3 mr-1" />
            {t('filter')}
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-card rounded-lg shadow-sm overflow-hidden flex animate-fade-in"
          >
            <Link 
              to={`/product/${product.id}`}
              className="w-1/3 aspect-square bg-muted relative"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="h-full w-full object-cover"
              />
            </Link>
            
            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                <Link to={`/product/${product.id}`}>
                  <span className="text-xs text-muted-foreground">{product.brand}</span>
                  <h3 className="font-medium line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-xs">
                      {product.ratings} ({product.totalRatings})
                    </span>
                  </div>
                </Link>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="font-medium">₹{product.price.toFixed(2)}</span>
                <Button 
                  size="sm" 
                  className="h-8"
                  onClick={() => handleAddToCart(product)}
                >
                  {t('add')}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListView;
