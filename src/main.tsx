
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Get the language from localStorage
const savedLanguage = localStorage.getItem('preferredLanguage');
if (!savedLanguage) {
  // Default to Tamil if no preference saved
  localStorage.setItem('preferredLanguage', 'tamil');
}

createRoot(document.getElementById("root")!).render(<App />);
