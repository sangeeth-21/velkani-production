import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Filter,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Star,
  Truck
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { useLanguage } from '../context/LanguageContext';
import { categories } from '../components/CategorySection';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Separator } from '../components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import ProductListView from '../components/ProductListView';

// Products data
const products = [
  {
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
  },
  {
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
    isOrganic: true,
  },
  {
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
    isOrganic: true,
  },
  {
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
    isOrganic: false,
  },
  {
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
    isOrganic: true,
  },
  {
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
    isOrganic: false,
  },
  {
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
    isOrganic: true,
  },
  {
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
    isOrganic: false,
  },
];

const CategoryProductsPage = () => {
  const { categoryId, subcategoryId } = useParams();
  const { t } = useLanguage();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
  // Find the current category and subcategory
  const category = categories.find(c => c.id === categoryId);
  const subcategory = category?.subcategories.find(s => s.id === subcategoryId);
  
  // Get the filtered products for the current subcategory
  const filteredProducts = products.filter(
    product => product.categoryId === categoryId && product.subcategoryId === subcategoryId
  );
  
  if (!category || !subcategory) {
    return (
      <div className="p-4">
        <Link to="/category" className="flex items-center gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold">Category or subcategory not found</h2>
          <p className="mt-2 text-muted-foreground">The category or subcategory you're looking for doesn't exist.</p>
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
          <h1 className="text-xl font-medium mr-4">{subcategory.title}</h1>
          <CartButton />
        </div>
      </div>
      
      <div className="px-4 mt-4">
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" size="sm" className="rounded-full">All</Button>
          <Button variant="outline" size="sm" className="rounded-full">Popular</Button>
          <Button variant="outline" size="sm" className="rounded-full">Organic</Button>
          <Button variant="outline" size="sm" className="rounded-full">Local</Button>
          <Button variant="outline" size="sm" className="rounded-full">Imported</Button>
        </div>
      </div>
      
      <div className="px-4 flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full py-2 flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            4.5+
          </Badge>
          <Badge variant="outline" className="rounded-full py-2 flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Free Delivery
          </Badge>
        </div>
        
        <div className="flex items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Filter className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('filter')}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] mt-4">
                <Tabs defaultValue="category">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="category">Category</TabsTrigger>
                    <TabsTrigger value="price">Price</TabsTrigger>
                    <TabsTrigger value="rating">Rating</TabsTrigger>
                  </TabsList>
                  <TabsContent value="category">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Vegetables</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Link to="/category/vegetables/subcategory/leafy-vegetables" className="px-3 py-2 border rounded-md text-sm">
                            Leafy Vegetables
                          </Link>
                          <Link to="/category/vegetables/subcategory/root-vegetables" className="px-3 py-2 border rounded-md text-sm">
                            Root Vegetables
                          </Link>
                          <Link to="/category/vegetables/subcategory/gourds" className="px-3 py-2 border rounded-md text-sm">
                            Gourds & Squashes
                          </Link>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium mb-2">Fruits</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm">Seasonal Fruits</Button>
                          <Button variant="outline" size="sm">Exotic Fruits</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="price">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">Under ₹50</Button>
                        <Button variant="outline" size="sm">₹50 - ₹100</Button>
                        <Button variant="outline" size="sm">₹100 - ₹200</Button>
                        <Button variant="outline" size="sm">Above ₹200</Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="rating">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="flex items-center justify-start">
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <Star className="h-4 w-4" />
                          </div>
                          <span className="ml-2">& Up</span>
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center justify-start">
                          <div className="flex">
                            {[...Array(3)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            {[...Array(2)].map((_, i) => (
                              <Star key={i} className="h-4 w-4" />
                            ))}
                          </div>
                          <span className="ml-2">& Up</span>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('sort')}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 space-y-2">
                <Button variant="outline" className="w-full justify-start">Popularity</Button>
                <Button variant="outline" className="w-full justify-start">Price: Low to High</Button>
                <Button variant="outline" className="w-full justify-start">Price: High to Low</Button>
                <Button variant="outline" className="w-full justify-start">Discount</Button>
                <Button variant="outline" className="w-full justify-start">Newest First</Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setViewType('grid')}
          >
            <LayoutGrid 
              className={`h-5 w-5 ${viewType === 'grid' ? 'text-primary' : 'text-muted-foreground'}`} 
            />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setViewType('list')}
          >
            <List 
              className={`h-5 w-5 ${viewType === 'list' ? 'text-primary' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>
      </div>
      
      <main className="flex-1 px-4 pb-24 animate-fade-in">
        <ProductListView 
          products={filteredProducts}
          viewType={viewType}
          categoryId={categoryId}
        />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CategoryProductsPage;
