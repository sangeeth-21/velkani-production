
import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const GlobalLanguageSwitcher = () => {
  const { t, language, setLanguage, toggleLanguage } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Languages className="h-4 w-4" />
          <span className="text-xs capitalize">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setLanguage('english')}>
          {t('language_english')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('tamil')}>
          {t('language_tamil')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('hindi')}>
          {t('language_hindi')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleLanguage}>
          {t('cycle_next_language')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GlobalLanguageSwitcher;
