
import React from 'react';
import { ChevronRight, Leaf, Apple, ShoppingCart, Box, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Updated category data
const categories = [
  {
    id: 'vegetables',
    title: 'category_vegetables',
    icon: Leaf,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fruits',
    title: 'category_fruits',
    icon: Apple,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'grocery',
    title: 'category_grocery',
    icon: ShoppingCart,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    image: 'https://images.unsplash.com/photo-1588964895597-cfccd35c2b78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'plastic',
    title: 'category_plastic',
    icon: Box,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    image: 'https://images.unsplash.com/photo-1591193686104-fddba4cb7cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'living',
    title: 'category_living',
    icon: HomeIcon,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
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
            className={`flex flex-col items-center rounded-lg p-3 transition-all hover-scale shadow-sm animate-scale-in ${category.bgColor}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="rounded-lg overflow-hidden mb-2 w-full aspect-square">
              <img 
                src={category.image} 
                alt={t(category.title)} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-center">{t(category.title)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
