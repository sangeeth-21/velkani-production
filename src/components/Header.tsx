
import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useLanguage();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass shadow-sm animate-fade-in">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center space-x-4">
          <a href="https://wa.me/1234567890" className="flex items-center text-sm">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline mr-1">{t('contact_whatsapp')}</span>
            <span>1234567890</span>
          </a>
        </div>
        
        <div className="flex items-center">
          <h1 className="text-xl font-medium">Middle Shop</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <a href="tel:1234567890" className="flex items-center text-sm">
            <Phone className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline mr-1">{t('contact_phone')}</span>
            <span>1234567890</span>
          </a>
        </div>
      </div>
      
      <div className="flex justify-end px-4 py-1 bg-secondary/40">
        <LanguageSelector />
      </div>
    </header>
  );
};

export default Header;
