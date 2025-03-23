
import React from 'react';
import { Phone, MessageCircle, Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass shadow-sm animate-fade-in h-[20vh] flex flex-col">
      <div className="flex justify-end px-4 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Languages className="h-4 w-4" />
              <span className="text-xs capitalize">{language}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('english')}>
              {t('language_english')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('tamil')}>
              {t('language_tamil')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('hindi')}>
              {t('language_hindi')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl font-medium">Middle Shop</h1>
      </div>
      
      <div className="flex items-center justify-center px-4 py-2 space-x-6">
        <a href="https://wa.me/1234567890" className="flex items-center text-sm">
          <MessageCircle className="h-4 w-4 mr-1" />
          <span>1234567890</span>
        </a>
        
        <a href="tel:1234567890" className="flex items-center text-sm">
          <Phone className="h-4 w-4 mr-1" />
          <span>1234567890</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
