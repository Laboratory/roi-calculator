import React, { useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCalculator } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SEO from './SEO';
import { seoConfig } from '../config/seo';
import { trackError } from '../utils/analytics';

const NotFound = () => {
  const { t } = useTranslation(['notfound', 'common']);
  // Get SEO config for this page
  const { title, description, canonicalUrl, schema, pageKey } = seoConfig.notFound;
  const location = useLocation();
  
  // Track 404 error when component mounts
  useEffect(() => {
    // Track the 404 error with the attempted URL
    trackError('404', `Page not found: ${location.pathname}`, 'NotFound component');
  }, [location.pathname]);
  
  return (
    <Container className="py-5 text-center">
      <SEO 
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
        pageKey={pageKey}
      />
      
      <div className="mb-5">
        <h1 className="display-1 fw-bold">{t('notfound:heading')}</h1>
        <h2 className="mb-4">{t('notfound:subheading')}</h2>
        <p className="lead mb-4">
          {t('notfound:message')}
        </p>
        
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button 
            as={Link} 
            to="/"
            variant="primary" 
            size="lg"
            className="d-flex align-items-center"
          >
            <FaCalculator className="me-2" />
            {t('notfound:buttons.calculator')}
          </Button>
          
          <Button 
            onClick={() => window.history.back()} 
            variant="outline-secondary"
            size="lg"
            className="d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" />
            {t('notfound:buttons.back')}
          </Button>
        </div>
      </div>
      
      <div className="mt-5">
        <h3>{t('notfound:help.title')}</h3>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-4 mt-3">
          <div>
            <h5>{t('notfound:help.sections.learn.title')}</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-decoration-none">{t('notfound:help.sections.learn.links.about')}</Link></li>
              <li><Link to="/faq" className="text-decoration-none">{t('notfound:help.sections.learn.links.faq')}</Link></li>
            </ul>
          </div>
          <div>
            <h5>{t('notfound:help.sections.legal.title')}</h5>
            <ul className="list-unstyled">
              <li><Link to="/terms" className="text-decoration-none">{t('notfound:help.sections.legal.links.terms')}</Link></li>
              <li><Link to="/privacy" className="text-decoration-none">{t('notfound:help.sections.legal.links.privacy')}</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
