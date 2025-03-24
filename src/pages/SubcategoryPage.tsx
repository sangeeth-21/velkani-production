
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import BottomNavigation from '../components/BottomNavigation';
import { useLanguage } from '../context/LanguageContext';
import GlobalLanguageSwitcher from '../components/GlobalLanguageSwitcher';
import CartButton from '../components/CartButton';
import { categories } from '../components/CategorySection';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "../components/ui/breadcrumb";

const SubcategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { t } = useLanguage();
  
  // Find the current category
  const currentCategory = categories.find(cat => cat.id === categoryId);
  
  if (!currentCategory) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl">Category not found</h2>
        <Link to="/category" className="text-primary underline mt-4 block">
          Back to Categories
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/category" className="mr-2 p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-medium">{t(currentCategory.title)}</h1>
        </div>
        <div className="flex items-center">
          <GlobalLanguageSwitcher />
          <CartButton />
        </div>
      </div>
      
      <div className="px-4 pt-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} to="/category">Categories</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t(currentCategory.title)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <main className="flex-1 py-4 px-4 content-container">
        <h2 className="text-lg font-medium mb-4">Select a Subcategory</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {currentCategory.subcategories?.map((subcategory, index) => (
            <Link
              key={subcategory.id}
              to={`/category/${categoryId}/subcategory/${subcategory.id}`}
              className="flex flex-col rounded-lg shadow-sm overflow-hidden animate-scale-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-full aspect-square overflow-hidden">
                <img 
                  src={subcategory.image} 
                  alt={subcategory.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm font-medium">{subcategory.title}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default SubcategoryPage;
