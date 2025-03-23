
import React from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import OfferCarousel from '../components/OfferCarousel';
import CategorySection from '../components/CategorySection';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <GlobalLanguageSwitcher />
        <CartButton />
      </div>
      
      <main className="flex-1 pt-[20vh] pb-16 overflow-auto">
        <OfferCarousel />
        <CategorySection />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
