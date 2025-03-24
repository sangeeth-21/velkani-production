
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminBottomNavigation from '@/components/admin/AdminBottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { categories } from '@/components/CategorySection';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const subcategorySchema = z.object({
  title: z.string().min(2, { message: 'Subcategory name must be at least 2 characters' }),
  categoryId: z.string().min(1, { message: 'Please select a category' }),
  description: z.string().optional(),
});

type SubcategoryFormValues = z.infer<typeof subcategorySchema>;

const AdminSubcategoriesPage = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [subcategories, setSubcategories] = useState(categories[0]?.subcategories || []);
  const [editingSubcategory, setEditingSubcategory] = useState<{id: string, title: string, description?: string} | null>(null);

  const form = useForm<SubcategoryFormValues>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      title: '',
      categoryId: selectedCategory,
      description: '',
    },
  });

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

  useEffect(() => {
    if (editingSubcategory) {
      form.reset({
        title: editingSubcategory.title,
        categoryId: selectedCategory,
        description: editingSubcategory.description || '',
      });
    } else {
      form.reset({
        title: '',
        categoryId: selectedCategory,
        description: '',
      });
    }
  }, [editingSubcategory, selectedCategory, form]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleAddSubcategory = () => {
    setEditingSubcategory(null);
    setDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: {id: string, title: string, description?: string}) => {
    setEditingSubcategory({
      id: subcategory.id,
      title: subcategory.title,
      description: subcategory.description
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

  const onSubmit = (values: SubcategoryFormValues) => {
    if (editingSubcategory) {
      // Update existing subcategory
      setSubcategories(prevSubcategories => 
        prevSubcategories.map(subcat => 
          subcat.id === editingSubcategory.id 
            ? { ...subcat, title: values.title, description: values.description } 
            : subcat
        )
      );
      
      toast({
        title: t('subcategory_updated'),
        description: t('subcategory_updated_success')
      });
    } else {
      // Add new subcategory
      const newSubcategory = {
        id: `sub_${Date.now()}`,
        title: values.title,
        description: values.description,
      };
      
      setSubcategories(prev => [...prev, newSubcategory]);
      
      toast({
        title: t('subcategory_added'),
        description: t('subcategory_added_success')
      });
    }
    
    setDialogOpen(false);
    form.reset();
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
                    {subcategory.description && (
                      <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                    )}
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('subcategory_name')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('enter_subcategory_name')} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('category')}</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('select_category')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
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
                <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit">
                  {editingSubcategory ? t('update') : t('add')}
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

export default AdminSubcategoriesPage;
