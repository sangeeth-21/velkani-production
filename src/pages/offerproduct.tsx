import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, List, Filter, Zap, Tag, Clock, Leaf, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useLanguage } from '../context/LanguageContext';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import ProductListView from '../components/ProductListView';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';

const SpecialOffersPage = () => {
  const { t } = useLanguage();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 2,
    hours: 12,
    minutes: 45
  });

  useEffect(() => {
    // Simulate countdown timer for offers
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        let { days, hours, minutes } = prev;
        
        if (minutes === 0) {
          if (hours === 0) {
            if (days === 0) {
              clearInterval(timer);
              return { days: 0, hours: 0, minutes: 0 };
            }
            days--;
            hours = 23;
          } else {
            hours--;
          }
          minutes = 59;
        } else {
          minutes--;
        }
        
        return { days, hours, minutes };
      });
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://srivelkanistore.site/api/index.php?action=get_products&offer=1');
        const json = await res.json();
        if (json.status === 'success') {
          setProducts(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch special offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const transformedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: parseFloat(product.price_points[0]?.price || '0'),
    oldPrice: parseFloat(product.price_points[0]?.original_price || product.price_points[0]?.price || '0'),
    unit: product.price_points[0]?.quantity || '',
    rating: 4.0,
    numReviews: 0,
    image: product.images[0]?.image_url || '',
    categoryId: product.category_id,
    subcategoryId: product.subcategory_id,
    inStock: true,
    isBestSeller: product.is_best_seller || false,
    isOrganic: product.is_organic || false,
    discount: Math.round(((parseFloat(product.price_points[0]?.original_price || product.price_points[0]?.price) - 
                          parseFloat(product.price_points[0]?.price)) / 
                          parseFloat(product.price_points[0]?.original_price || product.price_points[0]?.price)) * 100),
    weightOptions: product.price_points.map(pp => ({
      value: pp.quantity,
      price: parseFloat(pp.price),
      originalPrice: parseFloat(pp.original_price || pp.price)
    })),
    allImages: product.images.map(img => img.image_url)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header with offer countdown */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <span className="font-medium">{t('flash_sale', 'Flash Sale')}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" />
              <span>{t('ends_in', 'Ends in')}:</span>
              <span className="font-bold">
                {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/category" className="p-1 rounded-full bg-white shadow-sm">
            <ArrowLeft className="h-5 w-5 text-green-600" />
          </Link>
          <GlobalLanguageSwitcher />
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-bold mr-4 text-green-600">{t('special_offers', 'Special Offers')}</h1>
          <CartButton />
        </div>
      </div>

      {/* Offer stats */}
      <div className="px-4 py-3">
        <div className="bg-white rounded-lg shadow-sm p-3 flex items-center justify-around border border-green-100">
          <div className="text-center">
            <div className="text-sm text-gray-500">{t('offers', 'Offers')}</div>
            <div className="font-bold text-green-600">{products.length}</div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="text-center">
            <div className="text-sm text-gray-500">{t('discounts_up_to', 'Discounts up to')}</div>
            <div className="font-bold text-green-600">
              {transformedProducts.length > 0 ? 
                Math.max(...transformedProducts.map(p => p.discount)) + '%' : '0%'}
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="text-center">
            <div className="text-sm text-gray-500">{t('eco_friendly', 'Eco-Friendly')}</div>
            <div className="font-bold text-green-600">
              {transformedProducts.filter(p => p.isOrganic).length}
            </div>
          </div>
        </div>
      </div>

      {/* View controls */}
      <div className="px-4 pt-2 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <Button 
            variant={viewType === 'grid' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewType('grid')}
            className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-800 border-green-200"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden md:inline">{t('grid_view', 'Grid')}</span>
          </Button>
          <Button 
            variant={viewType === 'list' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewType('list')}
            className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-800 border-green-200"
          >
            <List className="h-4 w-4" />
            <span className="hidden md:inline">{t('list_view', 'List')}</span>
          </Button>
        </div>

        <div className="flex-grow"></div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 bg-white border-green-300 text-green-600 hover:bg-green-50"
              >
                <Filter className="h-4 w-4" />
                <span>{t('filter', 'Filter')}</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-green-600">{t('filter_products', 'Filter Products')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{t('discount_range', 'Discount Range')}</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-green-300">0-20%</Button>
                    <Button variant="outline" size="sm" className="border-green-300">20-40%</Button>
                    <Button variant="outline" size="sm" className="border-green-300">40%+</Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">{t('categories', 'Categories')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="border-green-300">Organic</Button>
                    <Button variant="outline" size="sm" className="border-green-300">Home</Button>
                    <Button variant="outline" size="sm" className="border-green-300">Garden</Button>
                    <Button variant="outline" size="sm" className="border-green-300">Wellness</Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">{t('special_features', 'Special Features')}</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-green-300 flex items-center gap-1">
                      <Leaf className="h-4 w-4" /> Eco-Friendly
                    </Button>
                    <Button variant="outline" size="sm" className="border-green-300 flex items-center gap-1">
                      <Award className="h-4 w-4" /> Best Seller
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 px-4 pb-24 pt-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden border border-green-50">
                <Skeleton className="h-40 w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : transformedProducts.length === 0 ? (
          <div className="text-center py-10">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Tag className="h-12 w-12 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{t('no_special_offers', 'No special offers available')}</h2>
            <p className="text-muted-foreground mb-4">{t('please_check_back_later', 'Please check back later for new deals.')}</p>
            <Link to="/category">
              <Button variant="default" className="bg-green-600 hover:bg-green-700">
                {t('browse_categories', 'Browse Categories')}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Green deals section */}
            {transformedProducts.filter(p => p.isOrganic).length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="h-5 w-5 text-green-500" />
                  <h2 className="font-bold text-lg text-green-600">{t('eco_deals', 'Eco-Friendly Deals')}</h2>
                </div>
                <div className="relative">
                  <div className="overflow-x-auto pb-2">
                    <div className="flex space-x-3">
                      {transformedProducts
                        .filter(p => p.isOrganic)
                        .map(product => (
                          <div key={product.id} className="flex-none w-64 bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                            <div className="relative">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-40 object-cover"
                              />
                              <div className="absolute top-0 right-0 flex flex-col gap-1">
                                {product.isOrganic && (
                                  <Badge className="bg-green-600 hover:bg-green-700">
                                    <Leaf className="h-3 w-3 mr-1" /> Organic
                                  </Badge>
                                )}
                                <Badge className="bg-green-800 hover:bg-green-900">
                                  -{product.discount}%
                                </Badge>
                              </div>
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium line-clamp-1">{product.name}</h3>
                              <div className="flex items-center mt-1">
                                <span className="text-lg font-bold text-green-600">
                                  ${product.price.toFixed(2)}
                                </span>
                                {product.oldPrice && product.oldPrice > product.price && (
                                  <span className="ml-2 text-sm text-gray-500 line-through">
                                    ${product.oldPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="w-full mt-3 bg-green-600 hover:bg-green-700"
                              >
                                {t('add_to_cart', 'Add to Cart')}
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Best seller deals */}
            {transformedProducts.filter(p => p.isBestSeller).length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-amber-500" />
                  <h2 className="font-bold text-lg text-green-700">{t('best_sellers', 'Best Sellers')}</h2>
                </div>
                <div className="relative">
                  <div className="overflow-x-auto pb-2">
                    <div className="flex space-x-3">
                      {transformedProducts
                        .filter(p => p.isBestSeller)
                        .map(product => (
                          <div key={product.id} className="flex-none w-64 bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                            <div className="relative">
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-40 object-cover"
                              />
                              <div className="absolute top-0 right-0 flex flex-col gap-1">
                                <Badge className="bg-amber-600 hover:bg-amber-700">
                                  <Award className="h-3 w-3 mr-1" /> Best Seller
                                </Badge>
                                <Badge className="bg-green-800 hover:bg-green-900">
                                  -{product.discount}%
                                </Badge>
                              </div>
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium line-clamp-1">{product.name}</h3>
                              <div className="flex items-center mt-1">
                                <span className="text-lg font-bold text-green-600">
                                  ${product.price.toFixed(2)}
                                </span>
                                {product.oldPrice && product.oldPrice > product.price && (
                                  <span className="ml-2 text-sm text-gray-500 line-through">
                                    ${product.oldPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="w-full mt-3 bg-green-600 hover:bg-green-700"
                              >
                                {t('add_to_cart', 'Add to Cart')}
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All offers */}
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold text-lg text-gray-800">{t('all_offers', 'All Offers')}</h2>
              <span className="text-sm text-green-600">
                {transformedProducts.length} {t('items', 'items')}
              </span>
            </div>
            
            <ProductListView 
              products={transformedProducts} 
              viewType={viewType} 
              categoryId=""
              showDiscountBadge={true}
              theme="green"
            />
          </>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
};

export default SpecialOffersPage;