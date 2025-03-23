import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import ProductListView from '../components/ProductListView';
import { useLanguage } from '../context/LanguageContext';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';

// Mock products data
const mockProducts = {
  vegetables: [
    {
      id: 'v1',
      name: 'Fresh Carrots',
      brand: 'FARM FRESH',
      ratings: 4.3,
      totalRatings: 1205,
      weight: '500 g',
      price: 40,
      image: 'https://images.unsplash.com/photo-1598170845058-33f9a5052f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'v2',
      name: 'Organic Tomatoes',
      brand: 'ORGANIC',
      ratings: 4.5,
      totalRatings: 932,
      weight: '1 kg',
      price: 60,
      image: 'https://images.unsplash.com/photo-1546470427-227df1e3c848?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'v3',
      name: 'Green Spinach',
      brand: 'FARM FRESH',
      ratings: 4.1,
      totalRatings: 756,
      weight: '250 g',
      price: 30,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  fruits: [
    {
      id: 'f1',
      name: 'Red Apples',
      brand: 'PREMIUM',
      ratings: 4.7,
      totalRatings: 2411,
      weight: '1 kg',
      price: 120,
      image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'f2',
      name: 'Bananas',
      brand: 'LOCAL',
      ratings: 4.2,
      totalRatings: 1876,
      weight: '1 kg',
      price: 80,
      image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  grocery: [
    {
      id: 'g1',
      name: 'Instant Coffee',
      brand: 'BRU',
      ratings: 4.1,
      totalRatings: 1522,
      weight: '200 g - Pouch',
      price: 420,
      image: 'https://m.media-amazon.com/images/I/61+xUO7opQL._SX522_.jpg'
    },
    {
      id: 'g2',
      name: 'Tea',
      brand: 'TAJ MAHAL',
      ratings: 4,
      totalRatings: 6477,
      weight: '500 g',
      price: 335,
      image: 'https://m.media-amazon.com/images/I/61z-vdTl8QL._SX522_.jpg'
    },
    {
      id: 'g3',
      name: 'Instant Soluble Coffee',
      brand: 'NESCAFE',
      ratings: 4.3,
      totalRatings: 3256,
      weight: '200 g - Jar',
      price: 625,
      image: 'https://m.media-amazon.com/images/I/71W7D4O5+FL._SX522_.jpg'
    }
  ],
  plastic: [
    {
      id: 'p1',
      name: 'Storage Containers',
      brand: 'TUPPERWARE',
      ratings: 4.4,
      totalRatings: 845,
      weight: '3 piece set',
      price: 299,
      image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  living: [
    {
      id: 'l1',
      name: 'Hand Towels',
      brand: 'HOME BASICS',
      ratings: 4.2,
      totalRatings: 632,
      weight: '2 pieces',
      price: 249,
      image: 'https://images.unsplash.com/photo-1583845112227-29639ad3c285?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  offers: [
    {
      id: 'o1',
      name: 'Monthly Grocery Package',
      brand: 'SPECIAL OFFER',
      ratings: 4.8,
      totalRatings: 324,
      weight: 'Various products',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'o2',
      name: 'Fruits Combo Pack',
      brand: 'DISCOUNT DEAL',
      ratings: 4.6,
      totalRatings: 187,
      weight: '5 kg mix',
      price: 450,
      image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ]
};

// Category titles mapping
const categoryTitles: Record<string, string> = {
  vegetables: 'category_vegetables',
  fruits: 'category_fruits',
  grocery: 'category_grocery',
  plastic: 'category_plastic',
  living: 'category_living',
  offers: 'category_offers'
};

const CategoryProductsPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useLanguage();
  
  // Default to 'vegetables' if categoryId is undefined
  const safeCategory = categoryId && categoryId in mockProducts ? categoryId : 'vegetables';
  const products = mockProducts[safeCategory as keyof typeof mockProducts];
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/category" className="mr-2 p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-medium">{t(categoryTitles[safeCategory])}</h1>
        </div>
        <div className="flex items-center">
          <GlobalLanguageSwitcher />
          <CartButton />
        </div>
      </div>
      
      <main className="flex-1 px-4 py-4 pb-16">
        <ProductListView categoryId={safeCategory} products={products} />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CategoryProductsPage;
