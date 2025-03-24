
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Globe, Bell, Shield, Key, HelpCircle, Info } from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminBottomNavigation from '@/components/admin/AdminBottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import GlobalLanguageSwitcher from '@/components/GlobalLanguageSwitcher';

const AdminSettingsPage = () => {
  const { isAdminAuthenticated, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    adminLogout();
    toast({
      title: t('logged_out'),
      description: t('admin_logged_out_success')
    });
    navigate('/admin/login');
  };

  const settingsGroups = [
    {
      title: t('account'),
      items: [
        {
          icon: User,
          label: t('profile_information'),
          onClick: () => {
            toast({
              title: t('profile_info'),
              description: t('profile_info_desc')
            });
          }
        },
        {
          icon: Key,
          label: t('change_password'),
          onClick: () => setPasswordDialogOpen(true)
        },
        {
          icon: LogOut,
          label: t('logout'),
          onClick: handleLogout,
          danger: true
        }
      ]
    },
    {
      title: t('preferences'),
      items: [
        {
          icon: Globe,
          label: t('language'),
          component: <GlobalLanguageSwitcher />
        },
        {
          icon: Bell,
          label: t('notifications'),
          component: (
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          )
        },
        {
          icon: Shield,
          label: t('privacy_security'),
          onClick: () => {
            toast({
              title: t('privacy_settings'),
              description: t('privacy_settings_desc')
            });
          }
        }
      ]
    },
    {
      title: t('help_support'),
      items: [
        {
          icon: HelpCircle,
          label: t('help_center'),
          onClick: () => {
            toast({
              title: t('help_center'),
              description: t('help_center_desc')
            });
          }
        },
        {
          icon: Info,
          label: t('about'),
          onClick: () => {
            toast({
              title: t('app_info'),
              description: 'Multilingual Mall App v1.0'
            });
          }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader title={t('settings')} showBackButton backTo="/admin/dashboard" />
      
      <main className="flex-1 p-4 pb-20 animate-fade-in">
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h2 className="text-lg font-semibold mb-2">{group.title}</h2>
              <Card>
                <CardContent className="p-0">
                  {group.items.map((item, itemIndex) => (
                    <div 
                      key={itemIndex}
                      className={`flex items-center justify-between p-4 ${
                        itemIndex !== group.items.length - 1 ? 'border-b' : ''
                      }`}
                      onClick={item.onClick}
                    >
                      <div className="flex items-center">
                        <item.icon className={`h-5 w-5 mr-3 ${item.danger ? 'text-destructive' : 'text-muted-foreground'}`} />
                        <span className={item.danger ? 'text-destructive' : ''}>{item.label}</span>
                      </div>
                      {item.component && (
                        <div>{item.component}</div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}

          <div className="text-center text-xs text-muted-foreground mt-6">
            <p>Mall Mate Admin v1.0</p>
            <p>&copy; 2023 Mall Mate. All rights reserved.</p>
          </div>
        </div>
      </main>
      
      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('change_password')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="current-password">{t('current_password')}</Label>
              <Input 
                id="current-password"
                type="password" 
                placeholder="••••••••" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">{t('new_password')}</Label>
              <Input 
                id="new-password"
                type="password" 
                placeholder="••••••••" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t('confirm_password')}</Label>
              <Input 
                id="confirm-password"
                type="password" 
                placeholder="••••••••" 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={() => {
              toast({
                title: t('password_updated'),
                description: t('password_updated_success')
              });
              setPasswordDialogOpen(false);
            }}>
              {t('update')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AdminBottomNavigation />
    </div>
  );
};

export default AdminSettingsPage;
