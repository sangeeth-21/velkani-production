import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, LayoutGrid, List, ChevronDown, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ui/use-toast';

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
  type: string;
  stock: string;
  discount_percent: number;
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
  offer?: string;
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

interface TransformedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  unit: string;
  type: string;
  rating: number;
  numReviews: number;
  image: string;
  categoryId: string;
  subcategoryId: string;
  inStock: boolean;
  isBestSeller: boolean;
  isOrganic: boolean;
  weightOptions: { 
    value: string; 
    price: number; 
    mrp: number; 
    type: string;
    stock: number;
    discountPercent: number;
  }[];
  allImages: string[];
  selectedWeight?: { 
    value: string; 
    price: number; 
    mrp: number; 
    type: string;
    stock: number;
    discountPercent: number;
  };
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
  type: string;
}

const CategoryProductsPage = () => {
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const productsRes = await fetch(`https://srivelkanistore.site/api/index.php?action=get_products&subcategory_id=${subcategoryId}`);
        const productsJson = await productsRes.json();
        
        if (productsJson.status === 'success') {
          const transformed = productsJson.data.map((product: Product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: parseFloat(product.price_points[0]?.price || '0'),
            mrp: parseFloat(product.price_points[0]?.mrp || '0'),
            unit: product.price_points[0]?.quantity || '',
            type: product.price_points[0]?.type || '',
            rating: 4.0,
            numReviews: 0,
            image: product.images[0]?.image_url || '',
            categoryId: product.category_id,
            subcategoryId: product.subcategory_id,
            inStock: product.price_points.some(pp => parseInt(pp.stock) > 0),
            isBestSeller: product.is_best_seller || false,
            isOrganic: product.is_organic || false,
            weightOptions: product.price_points.map(pp => ({
              value: pp.quantity,
              price: parseFloat(pp.price),
              mrp: parseFloat(pp.mrp),
              type: pp.type,
              stock: parseInt(pp.stock),
              discountPercent: pp.discount_percent
            })),
            allImages: product.images.map(img => img.image_url),
            selectedWeight: product.price_points[0] ? {
              value: product.price_points[0].quantity,
              price: parseFloat(product.price_points[0].price),
              mrp: parseFloat(product.price_points[0].mrp),
              type: product.price_points[0].type,
              stock: parseInt(product.price_points[0].stock),
              discountPercent: product.price_points[0].discount_percent
            } : undefined
          }));
          setProducts(transformed);
        }

        const categoryRes = await fetch('https://srivelkanistore.site/api/index.php?action=get_categories');
        const categoryJson = await categoryRes.json();

        if (categoryJson.status === 'success') {
          const foundCategory = categoryJson.data.find((c: Category) => c.id === categoryId);
          if (foundCategory) {
            setCategory(foundCategory);
            
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

  const handleWeightChange = (productId: string, value: string) => {
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === productId) {
          const selected = product.weightOptions.find(opt => opt.value === value);
          return {
            ...product,
            selectedWeight: selected,
            price: selected ? selected.price : product.price,
            mrp: selected ? selected.mrp : product.mrp,
            type: selected ? selected.type : product.type
          };
        }
        return product;
      })
    );
  };

  const handleAddToCart = (product: TransformedProduct) => {
    if (!product.selectedWeight) return;
    if (product.selectedWeight.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} (${product.selectedWeight.value}${product.selectedWeight.type}) is currently out of stock`,
        variant: "destructive"
      });
      return;
    }
    
    const cartItem: CartItem = {
      id: `${product.id}-${product.selectedWeight.value}`,
      productId: product.id,
      name: product.name,
      price: product.selectedWeight.price,
      mrp: product.selectedWeight.mrp,
      quantity: 1,
      image: product.image,
      weight: product.selectedWeight.value,
      type: product.selectedWeight.type
    };
    
    addToCart(cartItem);
    
    toast({
      title: "Added to cart",
      description: `${product.name} (${product.selectedWeight.value}${product.selectedWeight.type})`,
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

  const calculateDiscountPercentage = (mrp: number, price: number) => {
    if (mrp <= 0 || price >= mrp) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
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
        <BottomNavigation />
      </div>
    );
  }

  if (!category || !subcategory) {
    return (
      <div className="min-h-screen bg-background flex flex-col p-4">
        <Link to="/category" className="flex items-center gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>
        <div className="mt-8 text-center flex-1">
          <h2 className="text-xl font-semibold">{t('category_subcategory_not_found')}</h2>
          <p className="mt-2 text-muted-foreground">{t('category_subcategory_not_exist')}</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/category/${categoryId}`} className="p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <GlobalLanguageSwitcher />
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-medium mr-4 line-clamp-1 max-w-[150px] sm:max-w-none">
            {t(`subcategory_${subcategory.id}`, subcategory.name)}
          </h1>
          <CartButton />
        </div>
      </div>
      
      {/* View Controls */}
      <div className="px-4 pt-2 flex items-center justify-between">
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
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">{t('filter')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('filter_products')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Filter options would go here */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 px-4 pb-24 pt-4">
        {products.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">{t('no_products_found')}</h2>
            <p className="text-muted-foreground">{t('no_products_in_category')}</p>
          </div>
        ) : viewType === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {product.isBestSeller && (
                      <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
                        Best Seller
                      </Badge>
                    )}
                    {product.selectedWeight && product.selectedWeight.discountPercent > 0 && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        {product.selectedWeight.discountPercent}% OFF
                      </Badge>
                    )}
                    {product.selectedWeight && product.selectedWeight.stock <= 0 && (
                      <Badge variant="outline" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-medium line-clamp-2 mb-1">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        {product.selectedWeight && product.selectedWeight.discountPercent > 0 ? (
                          <>
                            <div className="flex flex-col">
                              <span className="font-bold text-lg text-primary">
                                ₹{product.selectedWeight.price.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500">
                                MRP ₹<span className="line-through">{product.selectedWeight.mrp.toFixed(2)}</span>
                              </span>
                            </div>
                          </>
                        ) : (
                          <span className="font-bold text-lg text-primary">
                            ₹{product.selectedWeight?.price.toFixed(2) || product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {product.selectedWeight && (
                        <span className="text-xs text-gray-500 mt-1">
                          {product.selectedWeight.value}{product.selectedWeight.type}
                        </span>
                      )}
                    </div>
                    {product.rating > 0 && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 space-y-2">
                    <Select
                      value={product.selectedWeight?.value}
                      onValueChange={(value) => handleWeightChange(product.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.weightOptions.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            disabled={option.stock <= 0}
                          >
                            {option.value}{option.type} - 
                            {option.discountPercent > 0 ? (
                              <>
                                <span className="text-primary ml-1">₹{option.price.toFixed(2)}</span>
                                <span className="text-xs text-gray-500 line-through ml-1">
                                  ₹{option.mrp.toFixed(2)}
                                </span>
                                <span className="text-xs text-red-500 ml-1">
                                  ({option.discountPercent}% OFF)
                                </span>
                              </>
                            ) : (
                              <span className="text-primary ml-1">₹{option.price.toFixed(2)}</span>
                            )}
                            {option.stock <= 0 && (
                              <span className="text-xs text-red-500 ml-1">(Out of Stock)</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="w-full flex items-center gap-2"
                      disabled={!product.selectedWeight || product.selectedWeight.stock <= 0}
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
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex hover:shadow-md transition-shadow">
                <Link to={`/product/${product.id}`} className="block w-1/3">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.isBestSeller && (
                      <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600">
                        Best Seller
                      </Badge>
                    )}
                    {product.selectedWeight && product.selectedWeight.discountPercent > 0 && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        {product.selectedWeight.discountPercent}% OFF
                      </Badge>
                    )}
                    {product.selectedWeight && product.selectedWeight.stock <= 0 && (
                      <Badge variant="outline" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </Link>
                <div className="p-4 flex-1 flex flex-col">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-medium line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="mt-2 flex flex-col">
                    <div className="flex items-center">
                      {product.selectedWeight && product.selectedWeight.discountPercent > 0 ? (
                        <>
                          <div className="flex flex-col">
                            <span className="font-bold text-lg text-primary">
                              ₹{product.selectedWeight.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              MRP ₹{product.selectedWeight.mrp.toFixed(2)}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="font-bold text-lg text-primary">
                          ₹{product.selectedWeight?.price.toFixed(2) || product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.selectedWeight && (
                      <span className="text-xs text-gray-500 mt-1">
                        {product.selectedWeight.value}{product.selectedWeight.type}
                      </span>
                    )}
                  </div>
                  <div className="mt-auto pt-4 space-y-2">
                    <Select
                      value={product.selectedWeight?.value}
                      onValueChange={(value) => handleWeightChange(product.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {product.weightOptions.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            disabled={option.stock <= 0}
                          >
                            {option.value}{option.type} - 
                            {option.discountPercent > 0 ? (
                              <>
                                <span className="text-primary ml-1">₹{option.price.toFixed(2)}</span>
                                <span className="text-xs text-gray-500 line-through ml-1">
                                  ₹{option.mrp.toFixed(2)}
                                </span>
                                <span className="text-xs text-red-500 ml-1">
                                  ({option.discountPercent}% OFF)
                                </span>
                              </>
                            ) : (
                              <span className="text-primary ml-1">₹{option.price.toFixed(2)}</span>
                            )}
                            {option.stock <= 0 && (
                              <span className="text-xs text-red-500 ml-1">(Out of Stock)</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="w-full flex items-center gap-2"
                      disabled={!product.selectedWeight || product.selectedWeight.stock <= 0}
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

export default CategoryProductsPage;