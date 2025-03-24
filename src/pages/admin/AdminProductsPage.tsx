
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminBottomNavigation from '@/components/admin/AdminBottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Reuse products data from CategoryProductsPage
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
}];

const AdminProductsPage = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productList, setProductList] = useState(products);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const form = useForm();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleAddProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    // In a real app, you would call an API to delete the product
    setProductList(prevProducts => prevProducts.filter(prod => prod.id !== productId));
    toast({
      title: t('product_deleted'),
      description: t('product_deleted_success')
    });
  };

  const filteredProducts = productList.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader title={t('products')} showBackButton backTo="/admin/dashboard" />
      
      <main className="flex-1 p-4 pb-20 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_products')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{t('filter_products')}</SheetTitle>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">{t('categories')}</h3>
                    {/* Filter options would go here */}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">{t('price_range')}</h3>
                    {/* Price range filter would go here */}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">{t('availability')}</h3>
                    {/* Availability filter would go here */}
                  </div>
                  <div className="pt-4">
                    <Button className="w-full">{t('apply_filters')}</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-1" />
              {t('add')}
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-24 w-24 object-cover" 
                  />
                  <div className="flex-1 p-3">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-baseline">
                        <span className="font-medium">₹{product.price}</span>
                        {product.oldPrice && (
                          <span className="ml-2 text-xs line-through text-muted-foreground">
                            ₹{product.oldPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {product.isOrganic && (
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                            {t('organic')}
                          </Badge>
                        )}
                        {product.isBestSeller && (
                          <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                            {t('best_seller')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('no_products_found')}</p>
            </div>
          )}
        </div>
      </main>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? t('edit_product') : t('add_product')}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('product_name')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('enter_product_name')} 
                        defaultValue={editingProduct?.name || ''}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('price')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        defaultValue={editingProduct?.price || ''}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('category')}</FormLabel>
                      <Select 
                        defaultValue={editingProduct?.categoryId || ''}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('select_category')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="vegetables">{t('vegetables')}</SelectItem>
                          <SelectItem value="fruits">{t('fruits')}</SelectItem>
                          <SelectItem value="dairy">{t('dairy')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('subcategory')}</FormLabel>
                      <Select 
                        defaultValue={editingProduct?.subcategoryId || ''}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('select_subcategory')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="leafy-vegetables">{t('leafy_vegetables')}</SelectItem>
                          <SelectItem value="root-vegetables">{t('root_vegetables')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('description')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('enter_description')} 
                        defaultValue={editingProduct?.description || ''}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={() => {
              toast({
                title: editingProduct ? t('product_updated') : t('product_added'),
                description: editingProduct ? t('product_updated_success') : t('product_added_success')
              });
              setDialogOpen(false);
            }}>
              {editingProduct ? t('update') : t('add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AdminBottomNavigation />
    </div>
  );
};

export default AdminProductsPage;
