
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminBottomNavigation from '@/components/admin/AdminBottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/components/CategorySection';
import { useToast } from '@/components/ui/use-toast';

const AdminCategoriesPage = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryList, setCategoryList] = useState(categories);
  const [editingCategory, setEditingCategory] = useState<{id: string, title: string, image: string} | null>(null);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleAddCategory = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  const handleEditCategory = (category: typeof categories[0]) => {
    setEditingCategory({
      id: category.id,
      title: category.title,
      image: category.image
    });
    setDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // In a real app, you would call an API to delete the category
    setCategoryList(prevCategories => prevCategories.filter(cat => cat.id !== categoryId));
    toast({
      title: t('category_deleted'),
      description: t('category_deleted_success')
    });
  };

  const filteredCategories = categoryList.filter(category => 
    category.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader title={t('categories')} showBackButton backTo="/admin/dashboard" />
      
      <main className="flex-1 p-4 pb-20 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_categories')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={handleAddCategory} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {t('add')}
          </Button>
        </div>
        
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="h-16 w-16 object-cover" 
                  />
                  <div className="flex-1 p-3">
                    <h3 className="font-medium">{category.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {category.subcategories.length} {t('subcategories')}
                    </p>
                  </div>
                  <div className="flex space-x-1 p-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('no_categories_found')}</p>
            </div>
          )}
        </div>
      </main>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? t('edit_category') : t('add_category')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('category_name')}</label>
              <Input 
                placeholder={t('enter_category_name')}
                defaultValue={editingCategory?.title || ''}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('image_url')}</label>
              <Input 
                placeholder={t('enter_image_url')}
                defaultValue={editingCategory?.image || ''}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={() => {
              toast({
                title: editingCategory ? t('category_updated') : t('category_added'),
                description: editingCategory ? t('category_updated_success') : t('category_added_success')
              });
              setDialogOpen(false);
            }}>
              {editingCategory ? t('update') : t('add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AdminBottomNavigation />
    </div>
  );
};

export default AdminCategoriesPage;
