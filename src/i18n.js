import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Load translations using http backend
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    fallbackLng: 'en', // Default language
    supportedLngs: ['en', 'ru', 'es', 'tr'], // Supported languages
    
    // Debug mode in development environment
    debug: process.env.NODE_ENV === 'development',
    
    // Namespaces configuration
    ns: ['common', 'calculator', 'about', 'education', 'faq', 'footer', 'language'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false, // Not needed for React as it escapes by default
    },
    
    react: {
      useSuspense: true,
    },
    
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'],
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

export default i18n;
