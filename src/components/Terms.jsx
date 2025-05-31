import React, { useContext } from 'react';
import { Container, Card } from 'react-bootstrap';
import SEO from './SEO';
import { seoConfig } from '../config/seo';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation(['terms', 'common']);
  const { darkMode } = useContext(ThemeContext);
  
  // Get SEO config for this page
  const { title, description, canonicalUrl, schema, pageKey } = seoConfig.terms;

  return (
    <Container className="main-content">
      <SEO 
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
        pageKey={pageKey}
      />
      
      <div className="page-header">
        <h1 className={`page-title ${darkMode ? "text-white" : ""}`}>{t('terms:title')}</h1>
        <p className={`page-subtitle ${darkMode ? "text-white-50" : "text-muted"}`}>{t('terms:lastUpdated')}</p>
      </div>

      <Card className="terms-card mb-4">
        <Card.Body>
          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('terms:sections.introduction.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('terms:sections.introduction.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('terms:sections.useOfServices.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('terms:sections.useOfServices.content')}
          </p>
          <p className={darkMode ? "text-white" : ""}>
            {t('terms:sections.useOfServices.additional')}
          </p>
          <ul className={darkMode ? "text-white" : ""}>
            {t('terms:sections.useOfServices.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('terms:sections.disclaimer.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('terms:sections.disclaimer.content')}
          </p>
          <p className={darkMode ? "text-white" : ""}>
            {t('terms:sections.disclaimer.additional')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('terms:sections.limitation.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('terms:sections.limitation.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('terms:sections.riskDisclosure.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('terms:sections.riskDisclosure.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('terms:sections.modifications.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('terms:sections.modifications.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('terms:sections.governingLaw.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('terms:sections.governingLaw.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('terms:sections.contactInfo.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('terms:sections.contactInfo.content')}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Terms;
