# Multilingual Support Documentation

This document provides information on how to use, maintain, and extend the multilingual support in the ROI Calculator application.

## Available Languages

The application currently supports the following languages:

- English (en)
- Russian (ru)
- Spanish (es)
- Turkish (tr)

## Translation Structure

All translations are stored in JSON files in the `public/locales` directory, organized by language code and namespace:

```
public/locales/
├── en/                  # English translations
│   ├── common.json      # Common application texts
│   ├── calculator.json  # Calculator component texts
│   ├── footer.json      # Footer component texts
│   └── language.json    # Language selection texts
├── ru/                  # Russian translations
├── es/                  # Spanish translations
└── tr/                  # Turkish translations
```

## How Translations Are Used

The application uses [react-i18next](https://react.i18next.com/) for internationalization. Translations are accessed through the `useTranslation` hook:

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation(['namespace1', 'namespace2']);
  
  return (
    <div>
      <h1>{t('namespace1:title')}</h1>
      <p>{t('namespace2:description')}</p>
    </div>
  );
}
```

## Language Selection

The application uses a single `LanguageSelector` component that appears in both the application header and footer. This component:

- Displays the current language with its flag emoji
- Provides a dropdown to select other available languages
- Can be styled differently based on its location using props:
  ```jsx
  // In header (default style)
  <LanguageSelector />
  
  // In footer (custom style)
  <LanguageSelector size="sm" variant="outline-secondary" />
  ```

## Adding New Translations

1. Add new text in the English translation files first (e.g., `en/common.json`)
2. Run the translation generator script to update all other language files:

```bash
node scripts/generate-translations.js --merge
```

3. Translate the new text in each language file

## Adding a New Language

1. Add the new language code to the `AVAILABLE_LANGUAGES` object in `src/context/LanguageContext.jsx`
2. Run the translation generator to create initial translation files:

```bash
node scripts/generate-translations.js
```

3. Update the language flag mapping in the `LanguageSelector` component
4. Translate the content in the generated language files

## Translation Maintenance

The application includes a utility script to help maintain translations:

- `generate-translations.js`: Copies or merges translation files

### Using the Translation Generator

- Create initial translation files:
  ```bash
  node scripts/generate-translations.js
  ```

- Update existing files with missing keys:
  ```bash
  node scripts/generate-translations.js --merge
  ```

## Best Practices

1. **Use Namespaces**: Group related translations into namespaces (separate JSON files) to keep translation files manageable
2. **Use Nested Structure**: Organize translations in a hierarchical structure for better readability
3. **Include Placeholders**: Use placeholders for dynamic content like `{{value}}` in translations
4. **Keep Keys Consistent**: Use consistent naming conventions for translation keys
5. **Document Context**: Add comments in the translation files to provide context for translators

## Debugging Translations

To verify translations are loaded correctly, you can use the test script:

```bash
node --experimental-json-modules test-i18n.js
```

## SEO and Multilingual Support

The application includes multilingual SEO support through:

1. Language-specific meta tags
2. Alternate language links for search engines
3. Proper language attributes on HTML elements

See the `SEO.jsx` component for implementation details.

## Changing the Default Language

The default language is set in `src/i18n.js`. To change it, modify the `lng` parameter in the i18next configuration.
