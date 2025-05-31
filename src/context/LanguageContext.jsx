import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Create the language context
export const LanguageContext = createContext();

// Available languages with their display names
export const AVAILABLE_LANGUAGES = {
  en: { name: 'English', nativeName: 'English' },
  ru: { name: 'Russian', nativeName: 'Русский' },
  es: { name: 'Spanish', nativeName: 'Español' },
  tr: { name: 'Turkish', nativeName: 'Türkçe' }
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  // Function to change the language
  const changeLanguage = (lng) => {
    void i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
    // Store the selected language in localStorage
    localStorage.setItem('userLanguage', lng);
  };

  // Effect to initialize language from localStorage or browser settings
  useEffect(() => {
    // Get language from localStorage if available
    const storedLanguage = localStorage.getItem('userLanguage');

    if (storedLanguage && Object.keys(AVAILABLE_LANGUAGES).includes(storedLanguage)) {
      changeLanguage(storedLanguage);
    } else {
      // Otherwise use browser language if it's in our supported languages
      const browserLang = navigator.language.split('-')[0];
      const defaultLang = Object.keys(AVAILABLE_LANGUAGES).includes(browserLang) ? browserLang : 'en';
      changeLanguage(defaultLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages: AVAILABLE_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
