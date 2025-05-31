import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { LanguageContext, AVAILABLE_LANGUAGES } from '../context/LanguageContext';

/**
 * SEO component for managing meta tags across the application
 * This component uses react-helmet-async for better SEO in static HTML generation
 * and supports multilingual meta tags
 */
const SEO = ({ title, description, canonicalUrl, imageUrl, schema, pageKey = '' }) => {
  const { t, i18n } = useTranslation(['seo']);
  const { currentLanguage } = useContext(LanguageContext);
  
  // Base URL for the site
  const siteUrl = 'https://roi.alphamind.co/';
  
  // Default image if none provided
  const defaultImage = `${siteUrl}logo.svg`;

  // Use translated title and description if a pageKey is provided
  const translatedTitle = pageKey ? t(`${pageKey}.title`, { defaultValue: title }) : title;
  const translatedDescription = pageKey ? t(`${pageKey}.description`, { defaultValue: description }) : description;
  
  // Generate alternate language links
  const alternateLanguageLinks = Object.keys(AVAILABLE_LANGUAGES).map(langCode => ({
    language: langCode,
    url: `${siteUrl}${langCode}${canonicalUrl}`
  }));
  
  // Get translated Open Graph values if a pageKey is provided
  const ogTitle = pageKey ? t(`${pageKey}.ogTitle`, { defaultValue: translatedTitle }) : translatedTitle;
  const ogDescription = pageKey ? t(`${pageKey}.ogDescription`, { defaultValue: translatedDescription }) : translatedDescription;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{translatedTitle}</title>
      <meta name="description" content={translatedDescription} />
      <link rel="canonical" href={`${siteUrl}${canonicalUrl}`} />
      
      {/* Language meta tags */}
      <html lang={currentLanguage} />
      <meta property="og:locale" content={currentLanguage} />
      
      {/* Alternate language links for SEO */}
      {alternateLanguageLinks.map(({ language, url }) => (
        language !== currentLanguage && (
          <link 
            key={language} 
            rel="alternate" 
            hrefLang={language} 
            href={url} 
          />
        )
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${canonicalUrl}`} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${siteUrl}${canonicalUrl}`} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={imageUrl || defaultImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={`${siteUrl}${canonicalUrl}`} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={imageUrl || defaultImage} />
      
      {/* JSON-LD structured data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  canonicalUrl: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  schema: PropTypes.object,
  pageKey: PropTypes.string
};

export default SEO;
