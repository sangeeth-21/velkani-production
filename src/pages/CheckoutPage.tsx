
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl } from '../components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '../hooks/use-toast';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';

type CheckoutFormValues = {
  name: string;
  phone: string;
  address: string;
  pincode: string;
};

const CheckoutPage = () => {
  const { cartState, clearCart } = useCart();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<CheckoutFormValues>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      pincode: '',
    }
  });
  
  const onSubmit = (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed successfully and will be delivered soon.",
      });
      clearCart();
      // Here you would typically redirect to an order confirmation page
    }, 1500);
  };
  
  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="pt-4 px-4 flex items-center justify-between">
          <Link to="/" className="mr-2 p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-medium">{t('checkout')}</h1>
          <div className="flex items-center">
            <GlobalLanguageSwitcher />
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
        <Link to="/" className="mr-2 p-1 rounded-full bg-secondary">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-medium">{t('checkout')}</h1>
        <div className="flex items-center">
          <GlobalLanguageSwitcher />
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
          <h2 className="font-medium mb-2">{t('delivery_details')}</h2>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel htmlFor="name">{t('name')}</FormLabel>
              <FormControl>
                <Input
                  id="name"
                  placeholder={t('enter_name')}
                  {...form.register('name', { required: true })}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel htmlFor="phone">{t('phone')}</FormLabel>
              <FormControl>
                <Input
                  id="phone"
                  placeholder={t('enter_phone')}
                  type="tel"
                  {...form.register('phone', { required: true })}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel htmlFor="address">{t('address')}</FormLabel>
              <FormControl>
                <Input
                  id="address"
                  placeholder={t('enter_address')}
                  {...form.register('address', { required: true })}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel htmlFor="pincode">{t('pincode')}</FormLabel>
              <FormControl>
                <Input
                  id="pincode"
                  placeholder={t('enter_pincode')}
                  {...form.register('pincode', { required: true })}
                />
              </FormControl>
            </FormItem>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('placing_order') : t('place_order')}
            </Button>
          </form>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CheckoutPage;
