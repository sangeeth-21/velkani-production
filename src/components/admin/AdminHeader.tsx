
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAdminAuth } from '@/context/AdminAuthContext';
import GlobalLanguageSwitcher from '../GlobalLanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

interface AdminHeaderProps {
  title: string;
  showBackButton?: boolean;
  backTo?: string;
}

const AdminHeader = ({ title, showBackButton = false, backTo = '/admin/dashboard' }: AdminHeaderProps) => {
  const { adminLogout } = useAdminAuth();
  const { t } = useLanguage();

  return (
    <div className="px-4 py-3 border-b flex items-center justify-between bg-background sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Link to={backTo} className="p-1 rounded-full bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        )}
        <GlobalLanguageSwitcher />
      </div>
      
      <h1 className="text-xl font-medium">{title}</h1>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={adminLogout}
        title={t('logout')}
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default AdminHeader;
