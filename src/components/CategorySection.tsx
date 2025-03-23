
import React from 'react';
import { ChevronRight, Smartphone, ShoppingBag, ShoppingCart, Home as HomeIcon, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Sample category data
const categories = [
  {
    id: 'electronics',
    title: 'category_electronics',
    icon: Smartphone,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'fashion',
    title: 'category_fashion',
    icon: ShoppingBag,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'grocery',
    title: 'category_grocery',
    icon: ShoppingCart,
    color: 'text-green-500',
    bgColor: 'bg-green-50'
  },
  {
    id: 'home',
    title: 'category_home',
    icon: HomeIcon,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50'
  },
  {
    id: 'beauty',
    title: 'category_beauty',
    icon: Palette,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50'
  }
];

const CategorySection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-4 px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">{t('category_title')}</h2>
        <Link to="/category" className="flex items-center text-sm text-muted-foreground hover-scale">
          <span>{t('see_all')}</span>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className={`flex flex-col items-center rounded-lg p-4 transition-all hover-scale shadow-sm animate-scale-in ${category.bgColor}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={`rounded-full p-3 mb-2 ${category.bgColor} ${category.color}`}>
              <category.icon className="h-6 w-6" />
            </div>
            <span className="text-sm">{t(category.title)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
