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

type DeliveryMethod = 'pickup' | 'delivery';

const CheckoutPage = () => {
  const { cartState, clearCart } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [canDeliver, setCanDeliver] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [userUuid, setUserUuid] = useState('');
  const navigate = useNavigate();
  
  // Get user details from cookies
  useEffect(() => {
    const userUuid = Cookies.get('user_uuid') || '';
    const userName = Cookies.get('user_name') || '';
    const userPhone = Cookies.get('user_phone') || '';
    
    setUserUuid(userUuid);
    
    // Set form default values from cookies if available
    form.reset({
      ...form.getValues(),
      name: userName,
      phone: userPhone,
    });
  }, []);

  // Check if order total is above 2000 to enable door delivery
  useEffect(() => {
    if (cartState.totalAmount >= 2000) {
      setCanDeliver(true);
    } else {
      setCanDeliver(false);
      setDeliveryMethod('pickup');
    }
  }, [cartState.totalAmount]);
  
  // Form validation schema
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
  
  // Update form validation when delivery method changes
  useEffect(() => {
    form.trigger();
  }, [deliveryMethod, form]);
  
  // Save checkout progress in cookies when user enters information
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value.name) Cookies.set('checkout_name', value.name, { expires: 1 });
      if (value.phone) Cookies.set('checkout_phone', value.phone, { expires: 1 });
      if (value.address) Cookies.set('checkout_address', value.address, { expires: 1 });
      if (value.pincode) Cookies.set('checkout_pincode', value.pincode, { expires: 1 });
      Cookies.set('checkout_payment', value.paymentMethod || 'cod', { expires: 1 });
    });
    
    // Load checkout progress from cookies if available
    const checkoutName = Cookies.get('checkout_name');
    const checkoutPhone = Cookies.get('checkout_phone');
    const checkoutAddress = Cookies.get('checkout_address');
    const checkoutPincode = Cookies.get('checkout_pincode');
    const checkoutPayment = Cookies.get('checkout_payment') as 'cod' | 'online';
    
    if (checkoutName || checkoutPhone || checkoutAddress || checkoutPincode || checkoutPayment) {
      form.reset({
        name: checkoutName || form.getValues().name,
        phone: checkoutPhone || form.getValues().phone,
        address: checkoutAddress || form.getValues().address,
        pincode: checkoutPincode || form.getValues().pincode,
        paymentMethod: checkoutPayment || form.getValues().paymentMethod,
      });
    }
    
    // Save delivery method in cookie
    Cookies.set('checkout_delivery_method', deliveryMethod, { expires: 1 });
    
    // Load delivery method from cookie if available
    const savedDeliveryMethod = Cookies.get('checkout_delivery_method') as DeliveryMethod;
    if (savedDeliveryMethod && (savedDeliveryMethod === 'pickup' || (savedDeliveryMethod === 'delivery' && canDeliver))) {
      setDeliveryMethod(savedDeliveryMethod);
    }
    
    return () => subscription.unsubscribe();
  }, [form, deliveryMethod, canDeliver]);
  
  const onSubmit = async (data: CheckoutFormValues) => {
    if (cartState.items.length === 0) {
      toast({
        title: t('error'),
        description: t('cart_empty_error'),
        variant: 'destructive',
      });
      return;
    }
    
    if (!userUuid) {
      toast({
        title: t('error'),
        description: t('user_not_identified'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare order items for API
      const orderItems = cartState.items.map(item => ({
        productname: item.name,
        productuid: item.id,  // Updated to match the CartItem type from CartContext
        amount: item.price,
        quantity: item.quantity,
        weight: item.weight
      }));
      
      // Prepare order data for API
      const orderData = {
        action: 'create_order',
        uiduser: userUuid,
        items: orderItems,
        delivery_type: deliveryMethod,
        payment_method: data.paymentMethod,
        customer_name: data.name,
        customer_phone: data.phone,
        ...(deliveryMethod === 'delivery' && {
          delivery_address: data.address,
          delivery_pincode: data.pincode
        })
      };
      
      // Save user details to cookies for future use
      Cookies.set('user_name', data.name, { expires: 30 });
      Cookies.set('user_phone', data.phone, { expires: 30 });
      
      // Make API call
      const response = await fetch('https://srivelkanistore.site/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        // Order successful - clear both cart and checkout data
        setOrderSuccess(true);
        clearCart();
        
        // Remove checkout cookies as order is complete
        Cookies.remove('checkout_name');
        Cookies.remove('checkout_phone');
        Cookies.remove('checkout_address');
        Cookies.remove('checkout_pincode');
        Cookies.remove('checkout_payment');
        Cookies.remove('checkout_delivery_method');
        
        toast({
          title: t('order_success'),
          description: deliveryMethod === 'pickup' 
            ? t('order_pickup_success') 
            : t('order_delivery_success'),
        });
        
        // Redirect after short delay to show success message
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
  
  // Function to resume checkout if browser was closed midway
  const resumeCheckout = () => {
    const checkoutName = Cookies.get('checkout_name');
    const checkoutPhone = Cookies.get('checkout_phone');
    
    if (checkoutName || checkoutPhone) {
      toast({
        title: t('resume_checkout'),
        description: t('previous_checkout_found'),
      });
    }
  };
  
  // Check for any previous checkout data when page loads
  useEffect(() => {
    if (cartState.items.length > 0) {
      resumeCheckout();
    }
  }, []);
  
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
              {t('order_confirmation_message')}
            </p>
            <Button asChild className="w-full mb-4">
              <Link to="/orders">{t('view_orders')}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">{t('continue_shopping')}</Link>
            </Button>
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
                <div key={`${item.id}-${item.weight}`} className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-muted flex-shrink-0 mr-2">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover rounded-md"
                      />
                    </div>
                    <span className="text-sm">
                      {item.quantity} x {item.name} ({item.weight})
                    </span>
                  </div>
                  <span className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="mt-2 pt-2 flex justify-between font-medium">
                <span>{t('total')}</span>
                <span>₹{cartState.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <h2 className="font-medium mb-2">{t('delivery_method')}</h2>
          <Card>
            <CardContent className="p-3">
              <RadioGroup 
                defaultValue="pickup" 
                value={deliveryMethod}
                onValueChange={(value) => setDeliveryMethod(value as DeliveryMethod)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="flex items-center cursor-pointer">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {t('shop_pickup')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="delivery" 
                    id="delivery" 
                    disabled={!canDeliver} 
                  />
                  <Label 
                    htmlFor="delivery" 
                    className={`flex items-center cursor-pointer ${!canDeliver ? 'text-muted-foreground' : ''}`}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    {t('door_delivery')}
                    {!canDeliver && (
                      <span className="block text-xs text-muted-foreground ml-2">
                        {t('available_above_2000')}
                      </span>
                    )}
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
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="cod" id="cod" />
                              <Label htmlFor="cod" className="cursor-pointer">
                                {t('cash_on_delivery')}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="online" id="online" />
                              <Label htmlFor="online" className="flex items-center cursor-pointer">
                                <CreditCard className="h-4 w-4 mr-2" />
                                {t('online_payment')}
                              </Label>
                            </div>
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                    {isSubmitting ? t('placing_order') : t('place_order')}
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