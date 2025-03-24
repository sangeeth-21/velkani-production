
import React, { useState } from 'react';
import { Languages, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import GoogleTranslate from './GoogleTranslate';

const GlobalLanguageSwitcher = () => {
  const { t, language, setLanguage, toggleLanguage } = useLanguage();
  const [useGoogleTranslate, setUseGoogleTranslate] = useState(false);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          {useGoogleTranslate ? 
            <Globe className="h-4 w-4" /> : 
            <Languages className="h-4 w-4" />
          }
          <span className="text-xs capitalize">
            {useGoogleTranslate ? 'Google' : language}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => {
          setUseGoogleTranslate(false);
          setLanguage('english');
        }}>
          {t('language_english')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setUseGoogleTranslate(false);
          setLanguage('tamil');
        }}>
          {t('language_tamil')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setUseGoogleTranslate(false);
          setLanguage('hindi');
        }}>
          {t('language_hindi')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          setUseGoogleTranslate(false);
          toggleLanguage();
        }}>
          {t('cycle_next_language')}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => setUseGoogleTranslate(true)}>
          <Globe className="h-4 w-4 mr-2" />
          Google Translate
        </DropdownMenuItem>
        
        {useGoogleTranslate && (
          <div className="p-2">
            <GoogleTranslate />
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GlobalLanguageSwitcher;
