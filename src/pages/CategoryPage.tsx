import React, { useEffect, useState } from 'react';
import BottomNavigation from '../components/BottomNavigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';

const CategoryPage = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://ghost.a1h.in/api/index.php?action=get_categories');
        const json = await res.json();
        if (json.status === 'success') {
          setCategories(json.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const featuredCategories = categories.filter(cat => cat.featured === '1');
  const regularCategories = categories.filter(cat => cat.featured !== '1');

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
        {/* Featured categories */}
        {featuredCategories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className={`flex items-center justify-between p-4 mb-6 rounded-lg shadow-md animate-fade-in bg-muted`}
          >
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                <img 
                  src={category.image_url} 
                  alt={t(category.name)} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{t(`category_${category.id}`, category.name)}</h3>
                <p className="text-sm text-muted-foreground">{t('offer_limited')}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}

        {/* All other categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {regularCategories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className={`flex flex-col items-center rounded-lg p-4 transition-all hover-scale shadow-sm animate-scale-in bg-card`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="rounded-lg overflow-hidden mb-3 w-full aspect-square">
                <img 
                  src={category.image_url} 
                  alt={t(`category_${category.id}`, category.name)} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-center">{t(`category_${category.id}`, category.name)}</span>
            </Link>
          ))}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default CategoryPage;
