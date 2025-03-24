
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { useLanguage } from '../context/LanguageContext';
import { categories } from '../components/CategorySection';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';

const SubcategoryPage = () => {
  const { categoryId } = useParams();
  const { t } = useLanguage();
  
  // Find the current category
  const category = categories.find(c => c.id === categoryId);
  
  if (!category) {
    return (
      <div className="p-4">
        <Link to="/category" className="flex items-center gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold">Category not found</h2>
          <p className="mt-2 text-muted-foreground">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/category" className="p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <GlobalLanguageSwitcher />
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-medium mr-4">{t(category.title)}</h1>
          <CartButton />
        </div>
      </div>
      
      <ScrollArea className="flex-1 py-4 px-4">
        <div className="grid grid-cols-2 gap-4 pb-20">
          {category.subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              to={`/category/${category.id}/subcategory/${subcategory.id}`}
              className="flex flex-col rounded-lg overflow-hidden shadow-sm border bg-card hover:shadow-md transition-shadow animate-scale-in"
            >
              <div className="h-36 overflow-hidden">
                <img 
                  src={subcategory.image} 
                  alt={subcategory.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium">{subcategory.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
      
      <BottomNavigation />
    </div>
  );
};

export default SubcategoryPage;
