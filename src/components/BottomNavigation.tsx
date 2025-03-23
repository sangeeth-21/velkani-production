
import React from 'react';
import { Home, ShoppingBag, Package, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50 bottom-safe-area animate-slide-up">
      <div className="grid grid-cols-4 h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center hover-scale ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">{t('nav_home')}</span>
        </Link>
        
        <Link 
          to="/category" 
          className={`flex flex-col items-center justify-center hover-scale ${isActive('/category') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <ShoppingBag className="h-5 w-5 mb-1" />
          <span className="text-xs">{t('nav_category')}</span>
        </Link>
        
        <Link 
          to="/orders" 
          className={`flex flex-col items-center justify-center hover-scale ${isActive('/orders') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Package className="h-5 w-5 mb-1" />
          <span className="text-xs">{t('nav_orders')}</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center justify-center hover-scale ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <User className="h-5 w-5 mb-1" />
          <span className="text-xs">{t('nav_profile')}</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
