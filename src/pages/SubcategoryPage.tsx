import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { useLanguage } from '../context/LanguageContext';
import BottomNavigation from '../components/BottomNavigation';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import { useIsMobile } from '../hooks/use-mobile';

const SubcategoryPage = () => {
  const { categoryId } = useParams();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndSubcategories = async () => {
      try {
        // Get all categories first
        const categoryRes = await fetch('https://ghost.a1h.in/api/index.php?action=get_categories');
        const categoryJson = await categoryRes.json();

        if (categoryJson.status === 'success') {
          const found = categoryJson.data.find(c => c.id === categoryId);
          setCategory(found);

          // Fetch subcategories for that category
          const subRes = await fetch(`https://ghost.a1h.in/api/index.php?action=get_subcategories&category_id=${categoryId}`);
          const subJson = await subRes.json();

          if (subJson.status === 'success') {
            setSubcategories(subJson.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryAndSubcategories();
    }
  }, [categoryId]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!category) {
    return (
      <div className="p-4">
        <Link to="/category" className="flex items-center gap-2 text-primary">
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Link>
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold">{t('category_not_found', 'Category not found')}</h2>
          <p className="mt-2 text-muted-foreground">{t('category_not_exist', 'The category you\'re looking for doesn\'t exist.')}</p>
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
          <h1 className="text-xl font-medium mr-4">{t(`category_${category.id}`, category.name)}</h1>
          <CartButton />
        </div>
      </div>
      
      <ScrollArea className="flex-1 py-4 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4 pb-20 animate-slide-in">
          {subcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              to={`/category/${category.id}/subcategory/${subcategory.id}`}
              className="flex flex-col rounded-lg overflow-hidden shadow-sm border bg-card hover:shadow-md transition-shadow animate-scale-in"
            >
              <div className="h-28 sm:h-32 md:h-36 overflow-hidden">
                <img 
                  src={subcategory.image_url} 
                  alt={t(`subcategory_${subcategory.id}`, subcategory.name)} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2 md:p-3">
                <h3 className="font-medium text-sm md:text-base line-clamp-2">
                  {t(`subcategory_${subcategory.id}`, subcategory.name)}
                </h3>
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
