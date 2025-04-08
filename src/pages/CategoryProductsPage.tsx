
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, LayoutGrid, List, SlidersHorizontal, Star, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { useLanguage } from '../context/LanguageContext';
import { categories } from '../components/CategorySection';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ProductListView from '../components/ProductListView';
import { useIsMobile } from '../hooks/use-mobile';

// Products data with all required properties
const products = [{
  id: 'p1',
  name: 'Fresh Organic Tomatoes',
  description: 'Locally grown organic tomatoes, perfect for salads and cooking.',
  price: 35,
  oldPrice: 40,
  unit: '500g',
  rating: 4.5,
  numReviews: 128,
  image: 'https://images.unsplash.com/photo-1546470427-227df1e3c8ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  categoryId: 'vegetables',
  subcategoryId: 'leafy-vegetables',
  inStock: true,
  isBestSeller: true,
  isOrganic: true,
  brand: 'Organic Farms',
  ratings: 4.5,
  totalRatings: 128,
  weight: '500g',
  weightOptions: [{
    value: '500g',
    price: 35
  }, {
    value: '1 kg',
    price: 65
  }, {
    value: '2 kg',
    price: 120
  }]
}, {
  id: 'p2',
  name: 'Red Bell Peppers',
  description: 'Sweet and crunchy red bell peppers, rich in vitamins.',
  price: 30,
  oldPrice: null,
  unit: '250g',
  rating: 4.3,
  numReviews: 54,
  image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  categoryId: 'vegetables',
  subcategoryId: 'leafy-vegetables',
  inStock: true,
  isBestSeller: false,
  isOrganic: true
}, {
  id: 'p3',
  name: 'Baby Spinach',
  description: 'Tender baby spinach leaves, perfect for salads and smoothies.',
  price: 45,
  oldPrice: 50,
  unit: '200g',
  rating: 4.8,
  numReviews: 92,
  image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  categoryId: 'vegetables',
  subcategoryId: 'leafy-vegetables',
  inStock: true,
  isBestSeller: true,
  isOrganic: true
}, {
  id: 'p4',
  name: 'Fresh Carrots',
  description: 'Sweet and crunchy carrots, great for snacking and cooking.',
  price: 20,
  oldPrice: null,
  unit: '500g',
  rating: 4.2,
  numReviews: 73,
  image: 'https://images.unsplash.com/photo-1550081699-79c1c2e48a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  categoryId: 'vegetables',
  subcategoryId: 'root-vegetables',
  inStock: true,
  isBestSeller: false,
  isOrganic: false
}, {
  id: 'p5',
  name: 'Sweet Potatoes',
  description: 'Nutritious sweet potatoes, great for roasting and baking.',
  price: 40,
  oldPrice: 45,
  unit: '1kg',
  rating: 4.6,
  numReviews: 48,
  image: 'https://images.unsplash.com/photo-1596124579928-354bb83d5da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  categoryId: 'vegetables',
  subcategoryId: 'root-vegetables',
  inStock: true,
  isBestSeller: true,
  isOrganic: true
}, {
  id: 'p6',
  name: 'Fresh Ginger Root',
  description: 'Spicy and aromatic ginger root for cooking and tea.',
  price: 25,
  oldPrice: null,
  unit: '100g',
  rating: 4.4,
  numReviews: 36,
  image: 'https://images.unsplash.com/photo-1615485500704-8e990f9921eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  categoryId: 'vegetables',
  subcategoryId: 'root-vegetables',
  inStock: true,
  isBestSeller: false,
  isOrganic: false
}, {
  id: 'p7',
  name: 'Organic Bitter Gourd',
  description: 'Nutritious bitter gourd, great for stir-fries and curries.',
  price: 30,
  oldPrice: 35,
  unit: '250g',
  rating: 4.1,
  numReviews: 28,
  image: 'https://images.unsplash.com/photo-1591342986627-a5adadb099c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  categoryId: 'vegetables',
  subcategoryId: 'gourds',
  inStock: true,
  isBestSeller: false,
  isOrganic: true
}, {
  id: 'p8',
  name: 'Bottle Gourd',
  description: 'Fresh bottle gourd, perfect for soups and curries.',
  price: 35,
  oldPrice: null,
  unit: '1 piece',
  rating: 4.3,
  numReviews: 19,
  image: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  categoryId: 'vegetables',
  subcategoryId: 'gourds',
  inStock: true,
  isBestSeller: false,
  isOrganic: false
}];

const CategoryProductsPage = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const { t } = useLanguage();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const isMobile = useIsMobile();

  // Find the current category and subcategory
  const category = categories.find(c => c.id === categoryId);
  const subcategory = category?.subcategories.find(s => s.id === subcategoryId);

  // Get the filtered products for the current subcategory
  const filteredProducts = products.filter(product => 
    product.categoryId === categoryId && 
    product.subcategoryId === subcategoryId
  );
  
  if (!category || !subcategory) {
    return (
      <div className="p-4">
        <Link to="/category" className="flex items-center gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold">{t('category_subcategory_not_found', 'Category or subcategory not found')}</h2>
          <p className="mt-2 text-muted-foreground">{t('category_subcategory_not_exist', 'The category or subcategory you\'re looking for doesn\'t exist.')}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/category/${categoryId}`} className="p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <GlobalLanguageSwitcher />
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-medium mr-4">{t(`subcategory_${subcategory.id}`, subcategory.title)}</h1>
          <CartButton />
        </div>
      </div>
      
      <div className="px-4 pt-2 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <Button 
            variant={viewType === 'grid' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewType('grid')}
            className="flex items-center gap-1"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden md:inline">{t('grid_view', 'Grid')}</span>
          </Button>
          <Button 
            variant={viewType === 'list' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewType('list')}
            className="flex items-center gap-1"
          >
            <List className="h-4 w-4" />
            <span className="hidden md:inline">{t('list_view', 'List')}</span>
          </Button>
        </div>
        
        <div className="flex-grow"></div>
        
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>{t('filter', 'Filter')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('filter_products', 'Filter Products')}</DialogTitle>
              </DialogHeader>
              {/* Filter content would go here */}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <main className="flex-1 px-4 pb-24 animate-fade-in pt-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">{t('no_products_found', 'No products found')}</h2>
            <p className="text-muted-foreground">{t('no_products_in_category', 'There are no products in this category yet.')}</p>
          </div>
        ) : (
          <ProductListView products={filteredProducts} viewType={viewType} categoryId={categoryId || ''} />
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CategoryProductsPage;
