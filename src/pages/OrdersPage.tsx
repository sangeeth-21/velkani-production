
import React from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const OrdersPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 pb-16 content-container">
        <h1 className="text-xl font-medium mb-4">{t('orders_title')}</h1>
        
        {/* Orders content - empty state for now */}
        <div className="h-96 flex flex-col items-center justify-center bg-secondary rounded-lg animate-fade-in">
          <Package className="h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">{t('orders_empty')}</p>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default OrdersPage;
