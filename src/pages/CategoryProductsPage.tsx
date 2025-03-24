
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import ProductListView from '../components/ProductListView';
import { useLanguage } from '../context/LanguageContext';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import { categories } from '../components/CategorySection';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "../components/ui/breadcrumb";

// Mock products data - this could be enhanced to be more specific to subcategories
const mockProducts = {
  'leafy-vegetables': [
    {
      id: 'v1',
      name: 'Fresh Spinach',
      brand: 'FARM FRESH',
      ratings: 4.1,
      totalRatings: 756,
      weight: '250 g',
      price: 30,
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'v2',
      name: 'Lettuce',
      brand: 'ORGANIC',
      ratings: 4.3,
      totalRatings: 512,
      weight: '200 g',
      price: 35,
      image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  'root-vegetables': [
    {
      id: 'v3',
      name: 'Fresh Carrots',
      brand: 'FARM FRESH',
      ratings: 4.3,
      totalRatings: 1205,
      weight: '500 g',
      price: 40,
      image: 'https://images.unsplash.com/photo-1598170845058-33f9a5052f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'v4',
      name: 'Radish',
      brand: 'LOCAL',
      ratings: 4.0,
      totalRatings: 342,
      weight: '300 g',
      price: 25,
      image: 'https://images.unsplash.com/photo-1584653605963-5c5aa5d22883?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  'gourds': [
    {
      id: 'v5',
      name: 'Organic Tomatoes',
      brand: 'ORGANIC',
      ratings: 4.5,
      totalRatings: 932,
      weight: '1 kg',
      price: 60,
      image: 'https://images.unsplash.com/photo-1546470427-227df1e3c848?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'v6',
      name: 'Cucumber',
      brand: 'FARM FRESH',
      ratings: 4.2,
      totalRatings: 487,
      weight: '500 g',
      price: 30,
      image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  'seasonal-fruits': [
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
      name: 'Strawberries',
      brand: 'PREMIUM',
      ratings: 4.8,
      totalRatings: 1345,
      weight: '250 g',
      price: 150,
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  'exotic-fruits': [
    {
      id: 'f3',
      name: 'Bananas',
      brand: 'LOCAL',
      ratings: 4.2,
      totalRatings: 1876,
      weight: '1 kg',
      price: 80,
      image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'f4',
      name: 'Dragon Fruit',
      brand: 'EXOTIC',
      ratings: 4.5,
      totalRatings: 628,
      weight: '1 piece',
      price: 95,
      image: 'https://images.unsplash.com/photo-1605029499216-54366c29e0c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  'beverages': [
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
  'dry-goods': [
    {
      id: 'g2',
      name: 'Tea',
      brand: 'TAJ MAHAL',
      ratings: 4,
      totalRatings: 6477,
      weight: '500 g',
      price: 335,
      image: 'https://m.media-amazon.com/images/I/61z-vdTl8QL._SX522_.jpg'
    }
  ],
  'storage': [
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
  'kitchenware': [
    {
      id: 'p2',
      name: 'Kitchen Utensils',
      brand: 'KITCHENAID',
      ratings: 4.3,
      totalRatings: 562,
      weight: '5 piece set',
      price: 450,
      image: 'https://images.unsplash.com/photo-1590332763497-0e0dc12c9cc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  'home-textiles': [
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
  'cleaning': [
    {
      id: 'l2',
      name: 'All-Purpose Cleaner',
      brand: 'CLEAN MASTER',
      ratings: 4.1,
      totalRatings: 423,
      weight: '500 ml',
      price: 120,
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  'monthly-offers': [
    {
      id: 'o1',
      name: 'Monthly Grocery Package',
      brand: 'SPECIAL OFFER',
      ratings: 4.8,
      totalRatings: 324,
      weight: 'Various products',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ],
  'seasonal-offers': [
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

const CategoryProductsPage = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const { t } = useLanguage();
  
  // Find the current category and subcategory
  const currentCategory = categories.find(cat => cat.id === categoryId);
  const currentSubcategory = currentCategory?.subcategories?.find(sub => sub.id === subcategoryId);
  
  // Get products for the subcategory
  const products = subcategoryId && subcategoryId in mockProducts 
    ? mockProducts[subcategoryId as keyof typeof mockProducts] 
    : [];
  
  if (!currentCategory || !currentSubcategory) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl">Subcategory not found</h2>
        <Link to={categoryId ? `/category/${categoryId}` : "/category"} className="text-primary underline mt-4 block">
          Back to {categoryId ? t(currentCategory?.title || '') : 'Categories'}
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to={`/category/${categoryId}`} className="mr-2 p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-medium">{currentSubcategory.title}</h1>
        </div>
        <div className="flex items-center">
          <GlobalLanguageSwitcher />
          <CartButton />
        </div>
      </div>
      
      <div className="px-4 pt-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/category">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to={`/category/${categoryId}`}>{t(currentCategory.title)}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentSubcategory.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <main className="flex-1 px-4 py-4 pb-16">
        <ProductListView categoryId={subcategoryId || ''} products={products} />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CategoryProductsPage;
