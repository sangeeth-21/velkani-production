import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Filter, LayoutGrid, List, SlidersHorizontal, Star, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { useLanguage } from '../context/LanguageContext';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ProductListView from '../components/ProductListView';
import { useIsMobile } from '../hooks/use-mobile';

interface ProductImage {
  id: string;
  image_url: string;
  display_order: string;
}

interface PricePoint {
  id: string;
  quantity: string;
  price: string;
}

interface Product {
  id: string;
  category_id: string;
  subcategory_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  price_points: PricePoint[];
}

interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
}

const CategoryProductsPage = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const { t } = useLanguage();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsRes = await fetch(`https://srivelkanistore.site/api/index.php?action=get_products&subcategory_id=${subcategoryId}`);
        const productsJson = await productsRes.json();
        
        if (productsJson.status === 'success') {
          setProducts(productsJson.data);
        }

        // Fetch category and subcategory details
        const categoryRes = await fetch('https://srivelkanistore.site/api/index.php?action=get_categories');
        const categoryJson = await categoryRes.json();

        if (categoryJson.status === 'success') {
          const foundCategory = categoryJson.data.find((c: Category) => c.id === categoryId);
          if (foundCategory) {
            setCategory(foundCategory);
            
            // Fetch subcategories for that category
            const subRes = await fetch(`https://srivelkanistore.site/api/index.php?action=get_subcategories&category_id=${categoryId}`);
            const subJson = await subRes.json();

            if (subJson.status === 'success') {
              const foundSubcategory = subJson.data.find((s: Subcategory) => s.id === subcategoryId);
              setSubcategory(foundSubcategory || null);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId && subcategoryId) {
      fetchData();
    }
  }, [categoryId, subcategoryId]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

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

  // Transform API products to match the expected format for ProductListView
  const transformedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price_points[0]?.price || '0'),
    oldPrice: null,
    unit: product.price_points[0]?.quantity || '',
    rating: 4.0, // Default rating since API doesn't provide
    numReviews: 0, // Default since API doesn't provide
    image: product.images[0]?.image_url || '', // Use first image's URL
    categoryId: product.category_id,
    subcategoryId: product.subcategory_id,
    inStock: true, // Assume in stock
    isBestSeller: false, // Default
    isOrganic: false, // Default
    weightOptions: product.price_points.map(pp => ({
      value: pp.quantity,
      price: parseFloat(pp.price)
    })),
    // Add all images for product details view
    allImages: product.images.map(img => img.image_url)
  }));

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
          <h1 className="text-xl font-medium mr-4">{t(`subcategory_${subcategory.id}`, subcategory.name)}</h1>
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
        {transformedProducts.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">{t('no_products_found', 'No products found')}</h2>
            <p className="text-muted-foreground">{t('no_products_in_category', 'There are no products in this category yet.')}</p>
          </div>
        ) : (
          <ProductListView 
            products={transformedProducts} 
            viewType={viewType} 
            categoryId={categoryId || ''} 
          />
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CategoryProductsPage;