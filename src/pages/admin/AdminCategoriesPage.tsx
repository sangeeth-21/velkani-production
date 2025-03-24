
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, ListPlus } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminBottomNavigation from '@/components/admin/AdminBottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/components/CategorySection';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const categorySchema = z.object({
  title: z.string().min(2, { message: 'Category name must be at least 2 characters' }),
  image: z.string().min(5, { message: 'Valid image URL is required' }),
});

const subcategorySchema = z.object({
  title: z.string().min(2, { message: 'Subcategory name must be at least 2 characters' }),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;
type SubcategoryFormValues = z.infer<typeof subcategorySchema>;

const AdminCategoriesPage = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [categoryList, setCategoryList] = useState(categories);
  const [editingCategory, setEditingCategory] = useState<{id: string, title: string, image: string} | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: '',
      image: '',
    },
  });

  const subcategoryForm = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  useEffect(() => {
    if (editingCategory) {
      categoryForm.reset({
        title: editingCategory.title,
        image: editingCategory.image,
      });
    } else {
      categoryForm.reset({
        title: '',
        image: '',
      });
    }
  }, [editingCategory, categoryForm]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: typeof categories[0]) => {
    setEditingCategory({
      id: category.id,
      title: category.title,
      image: category.image
    });
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // In a real app, you would call an API to delete the category
    setCategoryList(prevCategories => prevCategories.filter(cat => cat.id !== categoryId));
    toast({
      title: t('category_deleted'),
      description: t('category_deleted_success')
    });
  };

  const handleAddSubcategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    subcategoryForm.reset({
      title: '',
      description: '',
    });
    setSubcategoryDialogOpen(true);
  };

  const onCategorySubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      // Update existing category
      setCategoryList(prevCategories => 
        prevCategories.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, title: values.title, image: values.image } 
            : cat
        )
      );
      
      toast({
        title: t('category_updated'),
        description: t('category_updated_success')
      });
    } else {
      // Add new category
      const newCategory = {
        id: `cat_${Date.now()}`,
        title: values.title,
        image: values.image,
        subcategories: []
      };
      
      setCategoryList(prev => [...prev, newCategory]);
      
      toast({
        title: t('category_added'),
        description: t('category_added_success')
      });
    }
    
    setCategoryDialogOpen(false);
    categoryForm.reset();
  };

  const onSubcategorySubmit = (values: SubcategoryFormValues) => {
    if (selectedCategoryId) {
      const newSubcategory = {
        id: `sub_${Date.now()}`,
        title: values.title,
        description: values.description
      };
      
      setCategoryList(prevCategories => 
        prevCategories.map(cat => 
          cat.id === selectedCategoryId 
            ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] } 
            : cat
        )
      );
      
      toast({
        title: t('subcategory_added'),
        description: t('subcategory_added_success')
      });
      
      setSubcategoryDialogOpen(false);
      subcategoryForm.reset();
    }
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
                      onClick={() => handleAddSubcategory(category.id)}
                      title={t('add_subcategory')}
                    >
                      <ListPlus className="h-4 w-4" />
                    </Button>
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
      
      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? t('edit_category') : t('add_category')}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...categoryForm}>
            <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-4 py-2">
              <FormField
                control={categoryForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('category_name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('enter_category_name')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={categoryForm.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('image_url')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('enter_image_url')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setCategoryDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">
                  {editingCategory ? t('update') : t('add')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Subcategory Dialog */}
      <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('add_subcategory')}</DialogTitle>
            <DialogDescription>
              {selectedCategoryId && filteredCategories.find(cat => cat.id === selectedCategoryId)?.title}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...subcategoryForm}>
            <form onSubmit={subcategoryForm.handleSubmit(onSubcategorySubmit)} className="space-y-4 py-2">
              <FormField
                control={subcategoryForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('subcategory_name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('enter_subcategory_name')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={subcategoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('description')} ({t('optional')})</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('enter_subcategory_description')}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setSubcategoryDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">
                  {t('add')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AdminBottomNavigation />
    </div>
  );
};

export default AdminCategoriesPage;
