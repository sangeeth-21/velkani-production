import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import Cookies from 'js-cookie';

// Define cart item type
export type CartItem = {
  id: string;
  name: string;
  price: number;
  weight: string;
  image: string;
  quantity: number;
};

// Define cart state
type CartState = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
};

// Define cart context
type CartContextType = {
  cartState: CartState;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

// Define cart actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INITIALIZE_CART'; payload: CartState };

// Create cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cookie name
const CART_COOKIE_NAME = 'shopping_cart';

// Cookie expiration in days
const COOKIE_EXPIRATION_DAYS = 30;

// Initial cart state
const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

// Calculate totals
const calculateTotals = (items: CartItem[]): { totalItems: number; totalAmount: number } => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalItems, totalAmount };
};

// Save cart to cookie
const saveCartToCookie = (cartState: CartState) => {
  Cookies.set(CART_COOKIE_NAME, JSON.stringify(cartState), { 
    expires: COOKIE_EXPIRATION_DAYS,
    sameSite: 'strict'
  });
};

// Load cart from cookie
const loadCartFromCookie = (): CartState => {
  const savedCart = Cookies.get(CART_COOKIE_NAME);
  if (savedCart) {
    try {
      return JSON.parse(savedCart);
    } catch (error) {
      console.error('Failed to parse cart from cookie:', error);
    }
  }
  return initialCartState;
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.weight === action.payload.weight
      );
      
      let updatedItems: CartItem[];
      
      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        updatedItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + action.payload.quantity } 
            : item
        );
      } else {
        // Add new item
        updatedItems = [...state.items, action.payload];
      }
      
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      newState = { items: updatedItems, totalItems, totalAmount };
      break;
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      newState = { items: updatedItems, totalItems, totalAmount };
      break;
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item => 
        item.id === action.payload.id 
          ? { ...item, quantity: action.payload.quantity } 
          : item
      );
      const { totalItems, totalAmount } = calculateTotals(updatedItems);
      newState = { items: updatedItems, totalItems, totalAmount };
      break;
    }
    
    case 'CLEAR_CART':
      newState = initialCartState;
      break;
      
    case 'INITIALIZE_CART':
      newState = action.payload;
      break;
      
    default:
      return state;
  }
  
  // Save the updated cart state to cookie
  saveCartToCookie(newState);
  return newState;
};

// Cart provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);
  const { toast } = useToast();
  
  // Load cart from cookie on initial render
  useEffect(() => {
    const savedCart = loadCartFromCookie();
    if (savedCart.items.length > 0) {
      dispatch({ type: 'INITIALIZE_CART', payload: savedCart });
    }
  }, []);
  
  const addToCart = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast({
      title: "Added to Cart",
      description: `${item.name} (${item.weight}) added to your cart`,
    });
  };
  
  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { id: itemId, quantity } 
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  return (
    <CartContext.Provider
      value={{
        cartState,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};