
import React from 'react';
import { ChevronRight, Leaf, Apple, ShoppingCart, Box, Home as HomeIcon, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

// Updated category data with subcategories
const categories = [
  {
    id: 'offers',
    title: 'category_offers',
    icon: Tag,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    featured: true,
    subcategories: [
      {
        id: 'monthly-offers',
        title: 'Monthly Offers',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'seasonal-offers',
        title: 'Seasonal Offers',
        image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'vegetables',
    title: 'category_vegetables',
    icon: Leaf,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    subcategories: [
      {
        id: 'leafy-vegetables',
        title: 'Leafy Vegetables',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'root-vegetables',
        title: 'Root Vegetables',
        image: 'https://images.unsplash.com/photo-1598170845058-33f9a5052f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'gourds',
        title: 'Gourds & Squashes',
        image: 'https://images.unsplash.com/photo-1546470427-227df1e3c848?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'fruits',
    title: 'category_fruits',
    icon: Apple,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    subcategories: [
      {
        id: 'seasonal-fruits',
        title: 'Seasonal Fruits',
        image: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'exotic-fruits',
        title: 'Exotic Fruits',
        image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'grocery',
    title: 'category_grocery',
    icon: ShoppingCart,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    image: 'https://images.unsplash.com/photo-1588964895597-cfccd35c2b78?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    subcategories: [
      {
        id: 'beverages',
        title: 'Beverages',
        image: 'https://m.media-amazon.com/images/I/61+xUO7opQL._SX522_.jpg'
      },
      {
        id: 'dry-goods',
        title: 'Dry Goods',
        image: 'https://m.media-amazon.com/images/I/61z-vdTl8QL._SX522_.jpg'
      }
    ]
  },
  {
    id: 'plastic',
    title: 'category_plastic',
    icon: Box,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    image: 'https://images.unsplash.com/photo-1591193686104-fddba4cb7cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    subcategories: [
      {
        id: 'storage',
        title: 'Storage Containers',
        image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'kitchenware',
        title: 'Kitchen Ware',
        image: 'https://images.unsplash.com/photo-1583845112227-29639ad3c285?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'living',
    title: 'category_living',
    icon: HomeIcon,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    subcategories: [
      {
        id: 'home-textiles',
        title: 'Home Textiles',
        image: 'https://images.unsplash.com/photo-1583845112227-29639ad3c285?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'cleaning',
        title: 'Cleaning Supplies',
        image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

// Export categories for use in other components
export { categories };

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
        {categories.filter(category => !category.featured).slice(0, 5).map((category, index) => (
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
