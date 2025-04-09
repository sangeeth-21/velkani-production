import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CategorySection = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://srivelkanistore.site/api/index.php?action=get_categories');
        const json = await res.json();

        if (json.status === 'success') {
          const fetchedCategories = json.data;

          // Fetch subcategories for each category
          const categoriesWithSub = await Promise.all(
            fetchedCategories.map(async (category) => {
              try {
                const subRes = await fetch(`https://srivelkanistore.site/api/index.php?action=get_subcategories&category_id=${category.id}`);
                const subJson = await subRes.json();
                return {
                  ...category,
                  subcategories: subJson.status === 'success' ? subJson.data : [],
                };
              } catch (err) {
                console.error('Error fetching subcategories:', err);
                return {
                  ...category,
                  subcategories: [],
                };
              }
            })
          );

          setCategories(categoriesWithSub);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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
        {categories.slice(0, 5).map((category, index) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="flex flex-col items-center rounded-lg p-3 transition-all hover-scale shadow-sm animate-scale-in bg-gray-50"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="rounded-lg overflow-hidden mb-2 w-full aspect-square">
              <img 
                src={category.image_url} 
                alt={category.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm text-center">{category.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
