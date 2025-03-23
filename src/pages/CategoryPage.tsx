
import React from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { ArrowLeft, Leaf, Apple, ShoppingCart, Box, Home as HomeIcon, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';

// Categories data (matching with CategorySection)
const categories = [
  {
    id: 'offers',
    title: 'category_offers',
    icon: Tag,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true
  },
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

const CategoryPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <GlobalLanguageSwitcher />
        </div>
        <div className="flex items-center">
          <h1 className="text-xl font-medium mr-4">{t('category_all')}</h1>
          <CartButton />
        </div>
      </div>
      
      <main className="flex-1 py-4 px-4 content-container">
        {/* Featured offers category at the top */}
        {categories.filter(cat => cat.featured).map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className={`flex items-center justify-between p-4 mb-6 rounded-lg shadow-md animate-fade-in ${category.bgColor}`}
          >
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                <img 
                  src={category.image} 
                  alt={t(category.title)} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{t(category.title)}</h3>
                <p className="text-sm text-muted-foreground">{t('offer_limited')}</p>
              </div>
            </div>
            <Tag className={`h-6 w-6 ${category.color}`} />
          </Link>
        ))}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.filter(cat => !cat.featured).map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={`flex flex-col items-center rounded-lg p-4 transition-all hover-scale shadow-sm animate-scale-in ${category.bgColor}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="rounded-lg overflow-hidden mb-3 w-full aspect-square">
                <img 
                  src={category.image} 
                  alt={t(category.title)} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium">{t(category.title)}</span>
            </Link>
          ))}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default CategoryPage;
