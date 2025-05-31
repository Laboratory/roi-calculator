import React, { useContext } from 'react';
import { Container, Card } from 'react-bootstrap';
import SEO from './SEO';
import { seoConfig } from '../config/seo';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Privacy = () => {
  const { t } = useTranslation(['privacy', 'common']);
  const { darkMode } = useContext(ThemeContext);
  
  // Get SEO config for this page
  const { title, description, canonicalUrl, schema, pageKey } = seoConfig.privacy;

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
        <h1 className={`page-title ${darkMode ? "text-white" : ""}`}>{t('privacy:title')}</h1>
        <p className={`page-subtitle ${darkMode ? "text-white-50" : "text-muted"}`}>{t('privacy:lastUpdated')}</p>
      </div>

      <Card className="privacy-card mb-4">
        <Card.Body>
          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.introduction.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.introduction.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.informationWeCollect.title')}</h2>
          <h3 className={`subsection-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.informationWeCollect.providedInfo.title')}</h3>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.informationWeCollect.providedInfo.content')}
          </p>
          <ul className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.informationWeCollect.providedInfo.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.informationWeCollect.providedInfo.additionalContent')}
          </p>

          <h3 className={`subsection-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.informationWeCollect.automaticInfo.title')}</h3>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.informationWeCollect.automaticInfo.content')}
          </p>
          <ul className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.informationWeCollect.automaticInfo.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.howWeUseInfo.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.howWeUseInfo.content')}
          </p>
          <ul className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.howWeUseInfo.items', { returnObjects: true }).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.cookies.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.cookies.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.dataSecurity.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.dataSecurity.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.dataRetention.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.dataRetention.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.thirdParty.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.thirdParty.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.childrenPrivacy.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.childrenPrivacy.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.changes.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.changes.content')}
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>{t('privacy:sections.contactUs.title')}</h2>
          <p className={darkMode ? "text-white" : ""}>
            {t('privacy:sections.contactUs.content')}
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Privacy;
