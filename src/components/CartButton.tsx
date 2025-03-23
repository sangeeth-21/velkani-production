
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from '../context/LanguageContext';

const CartButton = () => {
  const { cartState, removeFromCart, updateQuantity } = useCart();
  const { t } = useLanguage();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartState.totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartState.totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{t('cart')}</SheetTitle>
          <SheetDescription>
            {cartState.totalItems === 0 
              ? t('cart_empty') 
              : `${cartState.totalItems} ${t('items')} | ₹${cartState.totalAmount.toFixed(2)}`
            }
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4">
          {cartState.items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">{t('cart_empty')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartState.items.map((item) => (
                <div key={`${item.id}-${item.weight}`} className="flex items-center gap-3 border-b pb-3">
                  <div className="h-16 w-16 flex-shrink-0 rounded-md border bg-muted p-1">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.weight}</p>
                    <p className="text-sm font-medium">₹{item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-5 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 ml-1"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <span className="sr-only">Remove</span>
                      <span aria-hidden="true">×</span>
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>{t('subtotal')}</span>
                  <span>₹{cartState.totalAmount.toFixed(2)}</span>
                </div>
                <Button asChild className="w-full mt-4">
                  <Link to="/checkout">{t('checkout')}</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartButton;
