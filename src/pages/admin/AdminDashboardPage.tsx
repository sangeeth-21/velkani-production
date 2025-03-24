
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Users, TrendingUp, LayoutGrid } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminBottomNavigation from '@/components/admin/AdminBottomNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLanguage } from '@/context/LanguageContext';

const AdminDashboardPage = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const dashboardItems = [
    {
      title: t('admin_products'),
      count: 180,
      icon: Package,
      route: '/admin/products',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: t('admin_orders'),
      count: 24,
      icon: ShoppingBag,
      route: '/admin/orders',
      color: 'bg-green-100 text-green-700'
    },
    {
      title: t('admin_categories'),
      count: 8,
      icon: LayoutGrid,
      route: '/admin/categories',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      title: t('admin_users'),
      count: 543,
      icon: Users,
      route: '/admin/users',
      color: 'bg-orange-100 text-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader title={t('admin_dashboard')} />
      
      <main className="flex-1 p-4 pb-20 animate-fade-in">
        <div className="mt-2 mb-6">
          <h2 className="font-semibold text-xl">{t('admin_welcome')}</h2>
          <p className="text-muted-foreground text-sm">{t('admin_overview')}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {dashboardItems.map((item, index) => (
            <Card key={index} onClick={() => navigate(item.route)} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <CardTitle className="text-2xl font-bold">{item.count}</CardTitle>
                <CardDescription>{item.title}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t('recent_activity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <p className="font-medium">{t('new_order', 'New order')} #ORD-004</p>
                    <p className="text-sm text-muted-foreground">₹1,200.00 - 3 {t('items')}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{t('new', 'New')}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <p className="font-medium">{t('updated_inventory', 'Updated inventory')}</p>
                    <p className="text-sm text-muted-foreground">{t('fresh_tomatoes_restock', 'Fresh Tomatoes restock')}</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{t('updated', 'Updated')}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <div>
                    <p className="font-medium">{t('order_shipped', 'Order')} #ORD-002 {t('shipped', 'shipped')}</p>
                    <p className="text-sm text-muted-foreground">{t('shipped_via', 'Shipped via')} Express</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{t('shipped', 'Shipped')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <AdminBottomNavigation />
    </div>
  );
};

export default AdminDashboardPage;
