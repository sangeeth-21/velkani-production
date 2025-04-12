import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, LayoutGrid, List, Star, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import ProductListView from '../components/ProductListView';

interface ProductImage {
  id: string;
  image_url: string;
  display_order: string;
}

interface PricePoint {
  id: string;
  quantity: string;
  price: string;
  original_price?: string;
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
  is_best_seller?: boolean;
  is_organic?: boolean;
}

const AllProductsPage = () => {
  const { t } = useLanguage();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('https://srivelkanistore.site/api/?action=get_products');
        const data = await response.json();
        
        if (data.status === 'success') {
          setProducts(data.data);
        } else {
          setError(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Network error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Transform API products to match the expected format for ProductListView
  const transformedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price_points[0]?.price || '0'),
    oldPrice: product.price_points[0]?.original_price 
      ? parseFloat(product.price_points[0].original_price) 
      : null,
    unit: product.price_points[0]?.quantity || '',
    rating: 4.0,
    numReviews: 0,
    image: product.images[0]?.image_url || '',
    categoryId: product.category_id,
    subcategoryId: product.subcategory_id,
    inStock: true,
    isBestSeller: product.is_best_seller || false,
    isOrganic: product.is_organic || false,
    discount: product.price_points[0]?.original_price
      ? Math.round(
          ((parseFloat(product.price_points[0].original_price) - 
            parseFloat(product.price_points[0].price)) / 
           parseFloat(product.price_points[0].original_price)) * 100
        )
      : 0,
    weightOptions: product.price_points.map(pp => ({
      value: pp.quantity,
      price: parseFloat(pp.price),
      originalPrice: pp.original_price ? parseFloat(pp.original_price) : parseFloat(pp.price)
    })),
    allImages: product.images.map(img => img.image_url)
  }));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/category" className="p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <GlobalLanguageSwitcher />
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-medium mr-4">{t('all_products', 'All Products')}</h1>
          <CartButton />
        </div>
      </div>
      
      {/* View Controls */}
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
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{t('price_range', 'Price Range')}</h3>
                  {/* Price range filter would go here */}
                </div>
                <div>
                  <h3 className="font-medium mb-2">{t('categories', 'Categories')}</h3>
                  {/* Category filter would go here */}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 px-4 pb-24 animate-fade-in pt-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="h-40 w-full bg-gray-200 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">{t('error_loading_products', 'Error loading products')}</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              {t('try_again', 'Try Again')}
            </Button>
          </div>
        ) : transformedProducts.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">{t('no_products_found', 'No products found')}</h2>
            <p className="text-muted-foreground">{t('no_products_available', 'There are currently no products available.')}</p>
          </div>
        ) : (
          <ProductListView 
            products={transformedProducts} 
            viewType={viewType} 
            categoryId=""
          />
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default AllProductsPage;