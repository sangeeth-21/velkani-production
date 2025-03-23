
import React from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CategoryPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 pb-16 content-container">
        <div className="flex items-center mb-4">
          <Link to="/" className="mr-2 p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-medium">{t('category_all')}</h1>
        </div>
        
        {/* Category content will go here */}
        <div className="h-96 flex items-center justify-center bg-secondary rounded-lg animate-fade-in">
          <p className="text-muted-foreground">{t('category_title')}</p>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CategoryPage;
