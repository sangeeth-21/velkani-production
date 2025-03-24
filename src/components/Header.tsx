
import React from 'react';
import { Phone, MessageCircle, Store } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';
import GlobalLanguageSwitcher from './GlobalLanguageSwitcher';

const Header = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <>
      {isHomePage && (
        <header className="fixed top-0 left-0 right-0 z-50 glass shadow-sm animate-fade-in h-[20vh] flex flex-col">
          <div className="flex-1 flex items-center justify-between px-4">
            <div className="w-1/3">
              <GlobalLanguageSwitcher />
            </div>
            <div className="w-1/3"></div>
          </div>
          
          <div className="flex items-center justify-center px-4">
            <div className="flex items-center justify-center">
              <Store className="h-6 w-6 mr-2 text-primary" />
              <h1 className="text-2xl font-medium">Middle Shop</h1>
            </div>
          </div>
          
          <div className="flex items-center justify-center px-4 py-2">
            <div className="flex items-center justify-center space-x-6">
              <a href="https://wa.me/1234567890" className="flex items-center text-sm">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span>{t('contact_whatsapp')} 1234567890</span>
              </a>
              
              <a href="tel:1234567890" className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-1" />
                <span>{t('contact_phone')} 1234567890</span>
              </a>
            </div>
          </div>
        </header>
      )}
      
      {!isHomePage && (
        <div className="absolute top-4 right-4 z-50">
          <GlobalLanguageSwitcher />
        </div>
      )}
    </>
  );
};

export default Header;
