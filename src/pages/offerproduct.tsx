import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutGrid, List, ShoppingCart, Star, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ui/use-toast';
import { Skeleton } from '../components/ui/skeleton';

interface ProductImage {
  id: string;
  image_url: string;
  display_order: string;
}

interface PricePoint {
  id: string;
  quantity: string;
  price: string;
  mrp: string;
  original_price?: string;
}

interface Product {
  id: string;
  category_id: string;
  subcategory_id: string;
  name: string;
  description: string;
  images: ProductImage[];
  price_points: PricePoint[];
  is_best_seller?: boolean;
  is_organic?: boolean;
}

interface TransformedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  unit: string;
  rating: number;
  numReviews: number;
  image: string;
  categoryId: string;
  subcategoryId: string;
  inStock: boolean;
  isBestSeller: boolean;
  isOrganic: boolean;
  weightOptions: { value: string; price: number; mrp: number }[];
  allImages: string[];
  selectedWeight?: { value: string; price: number; mrp: number };
  discountPercentage: number;
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  mrp: number;
  quantity: number;
  image: string;
  weight: string;
}

const OfferPage = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'discount' | 'price-low' | 'price-high'>('discount');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch offer products
        const productsRes = await fetch(`https://srivelkanistore.site/api/index.php?action=get_products&offer=1`);
        const productsJson = await productsRes.json();
        
        if (productsJson.status === 'success') {
          const transformed = productsJson.data.map((product: Product) => {
            const pricePoint = product.price_points[0];
            const price = parseFloat(pricePoint?.price || '0');
            const mrp = parseFloat(pricePoint?.mrp || '0');
            const discountPercentage = calculateDiscountPercentage(mrp, price);

            return {
              id: product.id,
              name: product.name,
              description: product.description,
              price: price,
              mrp: mrp,
              unit: pricePoint?.quantity || '',
              rating: 4.0,
              numReviews: 0,
              image: product.images[0]?.image_url || '',
              categoryId: product.category_id,
              subcategoryId: product.subcategory_id,
              inStock: true,
              isBestSeller: product.is_best_seller || false,
              isOrganic: product.is_organic || false,
              weightOptions: product.price_points.map(pp => ({
                value: pp.quantity,
                price: parseFloat(pp.price),
                mrp: parseFloat(pp.mrp)
              })),
              allImages: product.images.map(img => img.image_url),
              selectedWeight: pricePoint ? {
                value: pricePoint.quantity,
                price: price,
                mrp: mrp
              } : undefined,
              discountPercentage: discountPercentage
            };
          });
          
          // Sort products based on selected sort option
          const sortedProducts = [...transformed].sort((a, b) => {
            if (sortBy === 'discount') {
              return b.discountPercentage - a.discountPercentage;
            } else if (sortBy === 'price-low') {
              return a.price - b.price;
            } else {
              return b.price - a.price;
            }
          });
          
          setProducts(sortedProducts);
        }
      } catch (error) {
        console.error('Error fetching offer products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortBy]);

  const calculateDiscountPercentage = (mrp: number, price: number) => {
    if (mrp <= 0 || price >= mrp) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  const handleWeightChange = (productId: string, value: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === productId) {
          const selected = product.weightOptions.find(opt => opt.value === value);
          const discountPercentage = selected ? calculateDiscountPercentage(selected.mrp, selected.price) : 0;
          
          return {
            ...product,
            selectedWeight: selected,
            price: selected ? selected.price : product.price,
            mrp: selected ? selected.mrp : product.mrp,
            discountPercentage: discountPercentage
          };
        }
        return product;
      })
    );
  };

  const handleAddToCart = (product: TransformedProduct) => {
    if (!product.selectedWeight) return;
    
    const cartItem: CartItem = {
      id: `${product.id}-${product.selectedWeight.value}`,
      productId: product.id,
      name: product.name,
      price: product.selectedWeight.price,
      mrp: product.selectedWeight.mrp,
      quantity: 1,
      image: product.image,
      weight: product.selectedWeight.value
    };
    
    addToCart(cartItem);
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${product.selectedWeight.value})`,
      action: (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/cart')}
        >
          View Cart
        </Button>
      ),
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as 'discount' | 'price-low' | 'price-high');
  };

  const formatOptionLabel = (option: { value: string; price: number; mrp: number }) => {
    return `${option.value} - ₹${option.price.toFixed(2)}${option.mrp > option.price ? ` (MRP: ₹${option.mrp.toFixed(2)})` : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header Skeleton */}
        <div className="pt-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        
        {/* Sort and View Controls Skeleton */}
        <div className="px-4 pt-4 flex items-center justify-between">
          <Skeleton className="h-10 w-32 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
        
        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
                <Skeleton className="h-10 w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background pt-4 px-4 pb-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <GlobalLanguageSwitcher />
        </div>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-medium flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            {t('special_offers')}
          </h1>
          <CartButton />
        </div>
      </div>
      
      {/* Sort and View Controls */}
      <div className="sticky top-16 z-20 bg-background px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="discount">Highest Discount</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant={viewType === 'grid' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewType('grid')}
            className="flex items-center gap-1"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">{t('grid_view')}</span>
          </Button>
          <Button 
            variant={viewType === 'list' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewType('list')}
            className="flex items-center gap-1"
          >
            <List className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">{t('list_view')}</span>
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 px-4 pb-24 pt-4">
        {products.length === 0 ? (
          <div className="text-center py-10">
            <Tag className="h-12 w-12 mx-auto text-gray-400" />
            <h2 className="text-xl font-semibold mt-4">{t('no_offers_available')}</h2>
            <p className="text-muted-foreground mt-2">{t('check_back_later_for_offers')}</p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              {t('continue_shopping')}
            </Button>
          </div>
        ) : viewType === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow relative group">
                {/* Discount Badge (redesigned) */}
                {product.discountPercentage > 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    {product.discountPercentage}% OFF
                  </div>
                )}
                
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isBestSeller && (
                      <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600">
                        <Star className="h-3 w-3 mr-1 fill-white" />
                        Best Seller
                      </Badge>
                    )}
                    {product.isOrganic && (
                      <Badge className="absolute bottom-2 left-2 bg-green-600 hover:bg-green-700">
                        Organic
                      </Badge>
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <div className="flex items-baseline mt-2">
                    <span className="font-bold text-lg text-primary">₹{product.price.toFixed(2)}</span>
                    {product.mrp > product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{product.mrp.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.selectedWeight && (
                    <span className="text-xs text-gray-500 mt-1 block">
                      {product.selectedWeight.value}
                    </span>
                  )}
                  {product.rating > 0 && (
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="mt-3 space-y-2">
                    <select
                      value={product.selectedWeight?.value}
                      onChange={(e) => handleWeightChange(product.id, e.target.value)}
                      className="w-full bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {product.weightOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.value} - ₹{option.price.toFixed(2)}{' '}
                          {option.mrp > option.price && (
                            `(MRP: ₹${option.mrp.toFixed(2)})`
                          )}
                        </option>
                      ))}
                    </select>
                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="w-full flex items-center gap-2"
                      disabled={!product.selectedWeight}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex hover:shadow-md transition-shadow relative group">
                {/* Discount Badge (redesigned) */}
                {product.discountPercentage > 0 && (
                  <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    {product.discountPercentage}% OFF
                  </div>
                )}
                
                <Link to={`/product/${product.id}`} className="block w-1/3">
                  <div className="h-full bg-gray-50 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isBestSeller && (
                      <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600">
                        <Star className="h-3 w-3 mr-1 fill-white" />
                        Best Seller
                      </Badge>
                    )}
                    {product.isOrganic && (
                      <Badge className="absolute bottom-2 left-2 bg-green-600 hover:bg-green-700">
                        Organic
                      </Badge>
                    )}
                  </div>
                </Link>
                <div className="p-4 flex-1 flex flex-col">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-medium text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                  </Link>
                  <div className="mt-3">
                    <div className="flex items-baseline">
                      <span className="font-bold text-xl text-primary">₹{product.price.toFixed(2)}</span>
                      {product.mrp > product.price && (
                        <span className="text-sm text-gray-500 line-through ml-3">
                          MRP: ₹{product.mrp.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.selectedWeight && (
                      <span className="text-sm text-gray-500 mt-1 block">
                        {product.selectedWeight.value}
                      </span>
                    )}
                  </div>
                  {product.rating > 0 && (
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground ml-1">({product.numReviews})</span>
                    </div>
                  )}
                  <div className="mt-auto pt-4 flex items-center gap-3">
                    <select
                      value={product.selectedWeight?.value}
                      onChange={(e) => handleWeightChange(product.id, e.target.value)}
                      className="flex-1 bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {product.weightOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.value} - ₹{option.price.toFixed(2)}{' '}
                          {option.mrp > option.price && (
                            `(MRP: ₹${option.mrp.toFixed(2)})`
                          )}
                        </option>
                      ))}
                    </select>
                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="flex items-center gap-2 min-w-32"
                      disabled={!product.selectedWeight}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default OfferPage;