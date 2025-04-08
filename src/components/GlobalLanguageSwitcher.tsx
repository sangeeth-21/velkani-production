
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
    <>
      {/* Hidden div for Google Translate element */}
      <div id="google_translate_element" className="hidden"></div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Languages className="h-4 w-4" />
            <span className="text-xs capitalize">{language}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setLanguage('english')} className="flex items-center justify-between">
            {t('language_english')}
            {language === 'english' && <span className="h-2 w-2 rounded-full bg-primary ml-2"></span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('tamil')} className="flex items-center justify-between">
            {t('language_tamil')}
            {language === 'tamil' && <span className="h-2 w-2 rounded-full bg-primary ml-2"></span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('hindi')} className="flex items-center justify-between">
            {t('language_hindi')}
            {language === 'hindi' && <span className="h-2 w-2 rounded-full bg-primary ml-2"></span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleLanguage}>
            {t('cycle_next_language')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default GlobalLanguageSwitcher;
