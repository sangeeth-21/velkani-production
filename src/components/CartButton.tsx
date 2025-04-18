import React from 'react';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLanguage } from '../context/LanguageContext';
import { Badge } from './ui/badge';

interface CartItem {
  id: string;
  name: string;
  image: string;
  weight: string | number;
  type: string;
  quantity: number;
  price: number;
  mrp: number;
  discountPercent: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  totalSavings: number;
}

const CartButton = () => {
  const { cartState, removeFromCart, updateQuantity } = useCart();
  const { t } = useLanguage();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:bg-secondary/50"
          aria-label={t('cart')}
        >
          <ShoppingCart className="h-5 w-5" />
          {cartState.totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center p-0">
              {cartState.totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg">{t('your_cart')}</SheetTitle>
            <span className="text-sm text-muted-foreground">
              {cartState.totalItems} {t('items')}
            </span>
          </div>
          <SheetDescription>
            {cartState.totalItems === 0 ? t('cart_empty_description') : ''}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-4">
          {cartState.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">{t('cart_empty')}</h3>
              <p className="text-muted-foreground mb-6">{t('cart_empty_description')}</p>
              <Button asChild>
                <Link to="/category">{t('continue_shopping')}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartState.items.map((item) => (
                <div key={item.id} className="flex gap-3 border-b pb-4">
                  <div className="h-20 w-20 flex-shrink-0 rounded-md bg-muted overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <h3 className="font-medium line-clamp-1">{item.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mt-1 -mr-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {item.weight}{item.type}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        {item.discountPercent > 0 && (
                          <p className="text-xs text-muted-foreground line-through">
                            ₹{(item.mrp * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartState.items.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('subtotal')}</span>
                <span className="font-medium">₹{cartState.totalAmount.toFixed(2)}</span>
              </div>
              
              {cartState.totalSavings > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('you_save')}</span>
                  <span className="text-green-600 font-medium">
                    -₹{cartState.totalSavings.toFixed(2)}
                  </span>
                </div>
              )}
              
              <Button asChild className="w-full mt-2">
                <Link to="/checkout" className="flex items-center justify-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  {t('proceed_to_checkout')}
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                asChild 
                className="w-full"
              >
                <Link to="/category" className="text-primary">
                  {t('continue_shopping')}
                </Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartButton;