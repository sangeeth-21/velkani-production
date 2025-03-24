
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the language from localStorage or set default
const savedLanguage = localStorage.getItem('preferredLanguage');
if (!savedLanguage || !['tamil', 'hindi', 'english'].includes(savedLanguage)) {
  // Function to detect browser language and map to supported languages
  const detectBrowserLanguage = () => {
    const browserLang = navigator.language.toLowerCase();
    
    if (browserLang.startsWith('ta')) return 'tamil';
    if (browserLang.startsWith('hi')) return 'hindi';
    
    // Default to tamil as requested
    return 'tamil';
  };
  
  // Set detected language
  localStorage.setItem('preferredLanguage', detectBrowserLanguage());
}

createRoot(document.getElementById("root")!).render(<App />);
