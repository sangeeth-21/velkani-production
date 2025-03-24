
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, ArrowLeft } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminSubcategoriesPage = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [subcategories, setSubcategories] = useState(categories[0]?.subcategories || []);
  const [editingSubcategory, setEditingSubcategory] = useState<{id: string, title: string} | null>(null);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  useEffect(() => {
    const category = categories.find(cat => cat.id === selectedCategory);
    if (category) {
      setSubcategories(category.subcategories);
    }
  }, [selectedCategory]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleAddSubcategory = () => {
    setEditingSubcategory(null);
    setDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: {id: string, title: string}) => {
    setEditingSubcategory({
      id: subcategory.id,
      title: subcategory.title
    });
    setDialogOpen(true);
  };

  const handleDeleteSubcategory = (subcategoryId: string) => {
    // In a real app, you would call an API to delete the subcategory
    setSubcategories(prevSubcategories => prevSubcategories.filter(subcat => subcat.id !== subcategoryId));
    toast({
      title: t('subcategory_deleted'),
      description: t('subcategory_deleted_success')
    });
  };

  const filteredSubcategories = subcategories.filter(subcategory => 
    subcategory.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader title={t('subcategories')} showBackButton backTo="/admin/categories" />
      
      <main className="flex-1 p-4 pb-20 animate-fade-in">
        <div className="mb-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('select_category')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_subcategories')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={handleAddSubcategory} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            {t('add')}
          </Button>
        </div>
        
        <div className="space-y-4">
          {filteredSubcategories.map((subcategory) => (
            <Card key={subcategory.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{subcategory.title}</h3>
                    <p className="text-xs text-muted-foreground">ID: {subcategory.id}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditSubcategory(subcategory)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteSubcategory(subcategory.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredSubcategories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t('no_subcategories_found')}</p>
            </div>
          )}
        </div>
      </main>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSubcategory ? t('edit_subcategory') : t('add_subcategory')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('subcategory_name')}</label>
              <Input 
                placeholder={t('enter_subcategory_name')}
                defaultValue={editingSubcategory?.title || ''}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('category')}</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('select_category')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={() => {
              toast({
                title: editingSubcategory ? t('subcategory_updated') : t('subcategory_added'),
                description: editingSubcategory ? t('subcategory_updated_success') : t('subcategory_added_success')
              });
              setDialogOpen(false);
            }}>
              {editingSubcategory ? t('update') : t('add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AdminBottomNavigation />
    </div>
  );
};

export default AdminSubcategoriesPage;
