import React, { useContext, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { LanguageContext, AVAILABLE_LANGUAGES } from '../context/LanguageContext';
import './LanguageSelector.css';

/**
 * Language selector component that displays a dropdown with available languages
 * and allows the user to switch between them
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (e.g., 'light', 'outline-secondary')
 * @param {string} props.size - Button size (e.g., 'sm', 'md')
 */
const LanguageSelector = ({ variant = "light", size = "md" }) => {
  const { t } = useTranslation(['language']);
  const { currentLanguage, changeLanguage } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);

  // Language flag emoji mapping
  const languageFlags = {
    en: '🇬🇧',
    ru: '🇷🇺',
    es: '🇪🇸',
    tr: '🇹🇷'
  };

  return (
    <div className="language-selector">
      <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
        <Dropdown.Toggle variant={variant} size={size} id="language-dropdown">
          <span className="language-flag">{languageFlags[currentLanguage]}</span>
          <span className="d-none d-md-inline-block">{t(`language:languageNativeNames.${currentLanguage}`)}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {Object.entries(AVAILABLE_LANGUAGES).map(([code, { nativeName }]) => (
            <Dropdown.Item 
              key={code} 
              onClick={() => {
                changeLanguage(code);
                setIsOpen(false);
              }}
              active={currentLanguage === code}
            >
              <span className="language-flag">{languageFlags[code]}</span>
              {nativeName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default LanguageSelector;
