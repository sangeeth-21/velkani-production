
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '../hooks/use-toast';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type DeliveryMethod = 'pickup' | 'delivery';

const CheckoutPage = () => {
  const { cartState, clearCart } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [canDeliver, setCanDeliver] = useState(false);
  
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
    address: z.string().min(1, { message: t('address_required') }),
    pincode: z.string().min(6, { message: t('valid_pincode_required') }).max(6),
    deliveryTime: z.string().optional(),
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
    }
  });
  
  const onSubmit = (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: t('order_success'),
        description: deliveryMethod === 'pickup' 
          ? t('order_pickup_success') 
          : t('order_delivery_success'),
      });
      clearCart();
      // Here you would typically redirect to an order confirmation page
    }, 1500);
  };
  
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
      
      <main className="flex-1 px-4 py-4 pb-16">
        <div className="mb-6">
          <h2 className="font-medium mb-2">{t('order_summary')}</h2>
          <div className="bg-muted p-3 rounded-md">
            {cartState.items.map((item) => (
              <div key={`${item.id}-${item.weight}`} className="flex justify-between mb-2">
                <span className="text-sm">
                  {item.quantity} x {item.name} ({item.weight})
                </span>
                <span className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between font-medium">
              <span>{t('total')}</span>
              <span>₹{cartState.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="font-medium mb-2">{t('delivery_method')}</h2>
          <div className="bg-muted p-3 rounded-md">
            <RadioGroup 
              defaultValue="pickup" 
              value={deliveryMethod}
              onValueChange={(value) => setDeliveryMethod(value as DeliveryMethod)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pickup" id="pickup" />
                <FormLabel htmlFor="pickup" className="cursor-pointer">
                  {t('shop_pickup')}
                </FormLabel>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="delivery" 
                  id="delivery" 
                  disabled={!canDeliver} 
                />
                <FormLabel 
                  htmlFor="delivery" 
                  className={`cursor-pointer ${!canDeliver ? 'text-muted-foreground' : ''}`}
                >
                  {t('door_delivery')}
                  {!canDeliver && (
                    <span className="block text-xs text-muted-foreground">
                      {t('available_above_2000')}
                    </span>
                  )}
                </FormLabel>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="font-medium mb-2">{t('delivery_details')}</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">{t('name')}</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
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
                    <FormLabel htmlFor="phone">{t('phone')}</FormLabel>
                    <FormControl>
                      <Input
                        id="phone"
                        placeholder={t('enter_phone')}
                        type="tel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="address">{t('address')}</FormLabel>
                    <FormControl>
                      <Input
                        id="address"
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
                    <FormLabel htmlFor="pincode">{t('pincode')}</FormLabel>
                    <FormControl>
                      <Input
                        id="pincode"
                        placeholder={t('enter_pincode')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {deliveryMethod === 'pickup' && (
                <FormField
                  control={form.control}
                  name="deliveryTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="deliveryTime">{t('pickup_time')}</FormLabel>
                      <FormControl>
                        <Input
                          id="deliveryTime"
                          type="datetime-local"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? t('placing_order') : t('place_order')}
              </Button>
            </form>
          </Form>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CheckoutPage;
