
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock products data
const mockProducts: Record<string, any> = {
  v1: {
    id: 'v1',
    name: 'Fresh Carrots',
    brand: 'FARM FRESH',
    ratings: 4.3,
    totalRatings: 1205,
    price: 40,
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1598170845058-33f9a5052f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Farm fresh carrots sourced directly from organic farms. Rich in beta-carotene and vitamins. Perfect for salads, cooking, and juicing.',
    availableWeights: ['250g', '500g', '1kg'],
    features: [
      'Organic certified',
      'Freshly harvested',
      'No pesticides',
      'Rich in nutrients'
    ]
  },
  v2: {
    id: 'v2',
    name: 'Organic Tomatoes',
    brand: 'ORGANIC',
    ratings: 4.5,
    totalRatings: 932,
    price: 60,
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1546470427-227df1e3c848?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Vine-ripened organic tomatoes that are juicy and full of flavor. Perfect for salads, sauces, or enjoying on their own.',
    availableWeights: ['500g', '1kg'],
    features: [
      'Vine-ripened',
      'Organic certified',
      'No GMO',
      'Sweet and juicy'
    ]
  },
  v3: {
    id: 'v3',
    name: 'Green Spinach',
    brand: 'FARM FRESH',
    ratings: 4.1,
    totalRatings: 756,
    price: 30,
    category: 'vegetables',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Fresh green spinach leaves packed with iron and vitamins. Great for salads, smoothies, and cooking.',
    availableWeights: ['250g', '500g'],
    features: [
      'Iron-rich',
      'Freshly harvested',
      'Clean and ready to use',
      'Vitamin-packed'
    ]
  },
  f1: {
    id: 'f1',
    name: 'Red Apples',
    brand: 'PREMIUM',
    ratings: 4.7,
    totalRatings: 2411,
    price: 120,
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Sweet and crunchy red apples. Picked at peak ripeness for the best flavor and texture.',
    availableWeights: ['500g', '1kg', '2kg'],
    features: [
      'Sweet and crisp',
      'Premium quality',
      'Rich in antioxidants',
      'Perfect snack fruit'
    ]
  },
  f2: {
    id: 'f2',
    name: 'Bananas',
    brand: 'LOCAL',
    ratings: 4.2,
    totalRatings: 1876,
    price: 80,
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Perfectly ripened bananas, sweet and full of energy. Great for breakfast, smoothies, or as a quick snack.',
    availableWeights: ['500g', '1kg', '2kg'],
    features: [
      'Energy-rich',
      'Naturally sweet',
      'Good source of potassium',
      'No artificial ripening'
    ]
  }
};

const ProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // Find product or redirect to 404 if not found
  const product = productId && mockProducts[productId];
  if (!product) {
    navigate('/not-found');
    return null;
  }
  
  const [selectedWeight, setSelectedWeight] = useState(product.availableWeights[0]);
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: selectedWeight,
      image: product.image,
      quantity: quantity
    });
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col pb-16">
      <div className="sticky top-0 z-10 bg-background pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to={`/category/${product.category}`} className="mr-2 p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-medium">{t('product_details')}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <GlobalLanguageSwitcher />
          <CartButton />
        </div>
      </div>
      
      <main className="flex-1 px-4 py-4">
        <div className="bg-card p-4 rounded-lg shadow-sm mb-4">
          <div className="aspect-square w-full bg-muted rounded-lg overflow-hidden mb-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">{product.brand}</span>
            <h2 className="text-xl font-semibold">{product.name}</h2>
            
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-sm">
                {product.ratings} ({product.totalRatings} {t('ratings')})
              </span>
            </div>
            
            <div className="text-xl font-bold">₹{product.price.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg shadow-sm mb-4">
          <h3 className="font-medium mb-2">{t('product_description')}</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">{t('product_features')}</h4>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {product.features.map((feature: string, index: number) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{t('select_weight')}</h3>
            <Select 
              value={selectedWeight} 
              onValueChange={setSelectedWeight}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder={t('select_weight')} />
              </SelectTrigger>
              <SelectContent>
                {product.availableWeights.map((weight: string) => (
                  <SelectItem key={weight} value={weight}>
                    {weight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{t('quantity')}</h3>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <MinusCircle className="h-5 w-5" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleAddToCart}
          >
            {t('add_to_cart')}
          </Button>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ProductPage;
