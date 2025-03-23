
import React from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import HeroSection from '../components/HeroSection';
import OfferCarousel from '../components/OfferCarousel';
import CategorySection from '../components/CategorySection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 overflow-auto">
        <HeroSection />
        <OfferCarousel />
        <CategorySection />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
