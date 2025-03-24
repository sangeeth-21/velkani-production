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

type DeliveryMethod = 'pickup' | 'delivery';

const CheckoutPage = () => {
  const { cartState, clearCart } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [canDeliver, setCanDeliver] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();
  
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
    deliveryTime: deliveryMethod === 'pickup' ? z.string().min(1, { message: t('pickup_time_required') }) : z.string().optional(),
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
      deliveryTime: '',
      paymentMethod: 'cod',
    }
  });
  
  // Update form validation when delivery method changes
  useEffect(() => {
    form.trigger();
  }, [deliveryMethod, form]);
  
  const onSubmit = (data: CheckoutFormValues) => {
    if (cartState.items.length === 0) {
      toast({
        title: t('error'),
        description: t('cart_empty_error'),
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      
      toast({
        title: t('order_success'),
        description: deliveryMethod === 'pickup' 
          ? t('order_pickup_success') 
          : t('order_delivery_success'),
      });
      
      clearCart();
      
      // Redirect after short delay to show success message
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    }, 1500);
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

                  {deliveryMethod === 'pickup' && (
                    <FormField
                      control={form.control}
                      name="deliveryTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('pickup_time')}</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
