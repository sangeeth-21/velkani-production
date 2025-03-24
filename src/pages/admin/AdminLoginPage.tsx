
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import GlobalLanguageSwitcher from '@/components/GlobalLanguageSwitcher';

const formSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const AdminLoginPage = () => {
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const success = await adminLogin(values.username, values.password);
      if (success) {
        toast({
          title: t('login_success'),
          description: t('welcome_admin'),
        });
        navigate('/admin/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: t('login_failed'),
          description: t('invalid_credentials'),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('login_error'),
        description: t('try_again_later'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <GlobalLanguageSwitcher />
        </div>
        <h1 className="text-xl font-medium">{t('admin_login')}</h1>
        <div className="w-8"></div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-6 text-2xl font-bold">{t('admin_login')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t('admin_login_desc')}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('username')}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t('username_placeholder')} 
                        {...field} 
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('password')}</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={t('password_placeholder')} 
                        {...field} 
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? t('logging_in') : t('login')}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              {t('demo_credentials')}:<br />
              username: admin, password: admin123
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLoginPage;
