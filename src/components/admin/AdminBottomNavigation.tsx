
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, ShoppingBag, Package, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLanguage } from '@/context/LanguageContext';

const AdminBottomNavigation = () => {
  const location = useLocation();
  const { adminLogout } = useAdminAuth();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="grid grid-cols-5 h-16">
        <Link
          to="/admin/dashboard"
          className={cn(
            "flex flex-col items-center justify-center text-xs transition-colors",
            isActive('/admin/dashboard') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <LayoutGrid className="h-5 w-5 mb-1" />
          <span>{t('dashboard')}</span>
        </Link>
        
        <Link
          to="/admin/categories"
          className={cn(
            "flex flex-col items-center justify-center text-xs transition-colors",
            isActive('/admin/categories') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <LayoutGrid className="h-5 w-5 mb-1" />
          <span>{t('categories')}</span>
        </Link>
        
        <Link
          to="/admin/products"
          className={cn(
            "flex flex-col items-center justify-center text-xs transition-colors",
            isActive('/admin/products') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <Package className="h-5 w-5 mb-1" />
          <span>{t('products')}</span>
        </Link>
        
        <Link
          to="/admin/orders"
          className={cn(
            "flex flex-col items-center justify-center text-xs transition-colors",
            isActive('/admin/orders') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <ShoppingBag className="h-5 w-5 mb-1" />
          <span>{t('orders')}</span>
        </Link>
        
        <Link
          to="/admin/settings"
          className={cn(
            "flex flex-col items-center justify-center text-xs transition-colors",
            isActive('/admin/settings') 
              ? "text-primary" 
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <Settings className="h-5 w-5 mb-1" />
          <span>{t('settings')}</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminBottomNavigation;
