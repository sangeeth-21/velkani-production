
import React from 'react';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useLanguage } from '../context/LanguageContext';
import { User, Settings, ShoppingBag, Languages, HelpCircle, Info } from 'lucide-react';

const ProfilePage = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 pt-16 pb-16 content-container">
        <h1 className="text-xl font-medium mb-4">{t('profile_title')}</h1>
        
        {/* Profile content */}
        <div className="bg-card rounded-lg shadow-sm p-4 mb-4 animate-fade-in">
          <div className="flex items-center">
            <div className="bg-primary/10 rounded-full p-4 mr-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-medium">John Doe</h2>
              <p className="text-sm text-muted-foreground">john.doe@example.com</p>
            </div>
          </div>
        </div>
        
        {/* Profile menu */}
        <div className="space-y-2 animate-fade-in">
          <div className="bg-card rounded-lg shadow-sm">
            <button className="w-full flex items-center p-4 hover:bg-secondary/50 transition-colors">
              <Settings className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>{t('profile_edit')}</span>
            </button>
            
            <div className="w-full flex items-center p-4 hover:bg-secondary/50 transition-colors border-t">
              <Languages className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>{t('profile_language')}</span>
              
              <div className="ml-auto flex space-x-2">
                <button 
                  onClick={() => setLanguage('english')} 
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${language === 'english' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLanguage('tamil')} 
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${language === 'tamil' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                >
                  TA
                </button>
                <button 
                  onClick={() => setLanguage('hindi')} 
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${language === 'hindi' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}
                >
                  HI
                </button>
              </div>
            </div>
            
            <button className="w-full flex items-center p-4 hover:bg-secondary/50 transition-colors border-t">
              <ShoppingBag className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>{t('profile_orders')}</span>
            </button>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm">
            <button className="w-full flex items-center p-4 hover:bg-secondary/50 transition-colors">
              <HelpCircle className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>{t('profile_help')}</span>
            </button>
            
            <button className="w-full flex items-center p-4 hover:bg-secondary/50 transition-colors border-t">
              <Info className="h-5 w-5 mr-3 text-muted-foreground" />
              <span>{t('profile_about')}</span>
            </button>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
