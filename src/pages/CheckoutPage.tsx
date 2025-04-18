import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '../hooks/use-toast';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '../components/ui/separator';
import { Card, CardContent } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Label } from '../components/ui/label';
import Cookies from 'js-cookie';

// Extended type definitions to resolve TypeScript errors
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight: number;
  image: string;
  // Added missing properties
  productId: string;
  type: string;
  mrp: number;
  discountPercent: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  // Added missing property
  totalSavings: number;
}

// Extend the useCart hook return type
interface CartContextType {
  cartState: CartState;
  clearCart: () => void;
}

type DeliveryMethod = 'pickup' | 'delivery';

const CheckoutPage = () => {
  const { cartState, clearCart } = useCart() as CartContextType;
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [canDeliver, setCanDeliver] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  // Check for user authentication on mount
  useEffect(() => {
    const userToken = Cookies.get('userToken');
    if (!userToken) {
      toast({
        title: t('Authentication Required'),
        description: t('Please login to continue with checkout'),
        variant: 'destructive',
      });
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [navigate, toast, t]);

  useEffect(() => {
    // Minimum order amount for delivery is 2000
    if (cartState.totalAmount >= 2000) {
      setCanDeliver(true);
    } else {
      setCanDeliver(false);
      setDeliveryMethod('pickup');
    }
  }, [cartState.totalAmount]);

  const formSchema = z.object({
    name: z.string().min(3, { message: t('name_required') }),
    phone: z.string().min(10, { message: t('valid_phone_required') }).max(15),
    address: deliveryMethod === 'delivery' ? z.string().min(1, { message: t('address_required') }) : z.string().optional(),
    pincode: deliveryMethod === 'delivery' ? z.string().min(6, { message: t('valid_pincode_required') }).max(6) : z.string().optional(),
    paymentMethod: z.enum(['cod', 'online']),
  });

  type CheckoutFormValues = z.infer<typeof formSchema>;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      pincode: '',
      paymentMethod: 'cod',
    }
  });

  useEffect(() => {
    form.trigger();
  }, [deliveryMethod, form]);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartState.items.length === 0) {
      toast({
        title: t('error'),
        description: t('cart_empty_error'),
        variant: 'destructive',
      });
      return;
    }

    const userToken = Cookies.get('userToken');
    if (!userToken) {
      toast({
        title: t('error'),
        description: t('Please login to continue'),
        variant: 'destructive',
      });
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = cartState.items.map(item => ({
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        weight: item.weight,
        type: item.type,
        price: item.price,
        mrp: item.mrp,
        discount_percent: item.discountPercent
      }));

      const orderData = {
        action: 'create_order',
        user_id: userToken,
        items: orderItems,
        delivery_type: deliveryMethod,
        payment_method: data.paymentMethod,
        customer_name: data.name,
        customer_phone: data.phone,
        total_amount: cartState.totalAmount,
        total_savings: cartState.totalSavings,
        ...(deliveryMethod === 'delivery' && {
          delivery_address: data.address,
          delivery_pincode: data.pincode
        })
      };

      const response = await fetch('https://srivelkanistore.site/api/user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.status === 'success') {
        setOrderSuccess(true);
        clearCart();

        toast({
          title: t('order_success'),
          description: deliveryMethod === 'pickup' 
            ? t('order_pickup_success') 
            : t('order_delivery_success'),
          action: (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/orders')}
            >
              {t('view_order')}
            </Button>
          ),
        });

        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        throw new Error(result.message || t('order_failed'));
      }
    } catch (error) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('order_failed'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="pt-4 px-4 flex items-center justify-between">
          <Link to="/" className="p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-medium">{t('order_placed')}</h1>
          <GlobalLanguageSwitcher />
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-md text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('thank_you')}</h2>
            <p className="text-muted-foreground mb-6">
              {deliveryMethod === 'pickup'
                ? t('order_pickup_success')
                : t('order_delivery_success')}
            </p>
            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link to="/orders">{t('view_orders')}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">{t('continue_shopping')}</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="pt-4 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="p-1 rounded-full bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <GlobalLanguageSwitcher />
          </div>
          <div className="flex items-center">
            <h1 className="text-xl font-medium mr-4">{t('checkout')}</h1>
            <CartButton />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-lg font-medium mb-2">{t('cart_empty')}</h2>
          <p className="text-muted-foreground mb-4">{t('add_items')}</p>
          <Button asChild>
            <Link to="/category">{t('continue_shopping')}</Link>
          </Button>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <GlobalLanguageSwitcher />
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-medium mr-4">{t('checkout')}</h1>
          <CartButton />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4 py-4 pb-16">
        <div className="mb-6">
          <h2 className="font-medium mb-2">{t('order_summary')}</h2>
          <Card className="overflow-hidden">
            <CardContent className="p-3">
              {cartState.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-md bg-muted flex-shrink-0 mr-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {item.weight}{item.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    {item.discountPercent > 0 && (
                      <p className="text-xs text-muted-foreground line-through">
                        ₹{(item.mrp * item.quantity).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              <Separator className="my-3" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t('subtotal')}</span>
                  <span className="text-sm">₹{cartState.totalAmount.toFixed(2)}</span>
                </div>
                
                {cartState.totalSavings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">{t('you_save')}</span>
                    <span className="text-sm text-green-600">
                      -₹{cartState.totalSavings.toFixed(2)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between pt-2">
                  <span className="font-medium">{t('total')}</span>
                  <span className="font-medium">₹{cartState.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <h2 className="font-medium mb-2">{t('delivery_method')}</h2>
          <Card>
            <CardContent className="p-3">
              <RadioGroup 
                value={deliveryMethod}
                onValueChange={(value) => setDeliveryMethod(value as DeliveryMethod)}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="flex items-center cursor-pointer">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    <div>
                      <p>{t('shop_pickup')}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('pickup_from_our_store')}
                      </p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <RadioGroupItem 
                    value="delivery" 
                    id="delivery" 
                    disabled={!canDeliver} 
                  />
                  <Label 
                    htmlFor="delivery" 
                    className={`flex items-center cursor-pointer ${!canDeliver ? 'opacity-60' : ''}`}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    <div>
                      <p>{t('door_delivery')}</p>
                      {!canDeliver ? (
                        <p className="text-xs text-muted-foreground">
                          {t('available_above_2000')}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {t('delivery_within_3_days')}
                        </p>
                      )}
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <h2 className="font-medium mb-2">{t('delivery_details')}</h2>
          <Card>
            <CardContent className="p-3">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('name')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('enter_name')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('phone')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t('enter_phone')}
                            type="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {deliveryMethod === 'delivery' && (
                    <>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('address')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('enter_address')}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('pincode')}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('enter_pincode')}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-3">{t('payment_method')}</h3>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <RadioGroup 
                            value={field.value} 
                            onValueChange={field.onChange}
                            className="flex flex-col space-y-3"
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="cod" id="cod" />
                              <Label htmlFor="cod" className="cursor-pointer">
                                <div>
                                  <p>{t('cash_on_delivery')}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {t('pay_when_you_receive')}
                                  </p>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="online" id="online" />
                              <Label htmlFor="online" className="flex items-center cursor-pointer">
                                <div>
                                  <p className="flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    {t('online_payment')}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {t('credit_debit_upi')}
                                  </p>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('placing_order')}
                      </span>
                    ) : (
                      t('place_order')
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      
      <BottomNavigation />
    </div>
  );
};

export default CheckoutPage;