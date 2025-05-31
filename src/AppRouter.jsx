import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';
import { trackPageView, trackError } from './utils/analytics';
import { seoConfig } from './config/seo';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './components/LanguageSelector';
import Footer from './components/Footer';

// Lazy load page components
const Simulator = lazy(() => import('./components/Calculator'));
const HowItWorks = lazy(() => import('./components/About'));
const Education = lazy(() => import('./components/Education'));
const FAQ = lazy(() => import('./components/FAQ'));
const Terms = lazy(() => import('./components/Terms'));
const Privacy = lazy(() => import('./components/Privacy'));
const NotFound = lazy(() => import('./components/NotFound'));

// Fallback loading component
const LoadingFallback = () => {
  const { t } = useTranslation('pageloader');
  
  return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <Spinner animation="border" role="status" variant="primary">
        <span className="visually-hidden">{t('loading')}</span>
      </Spinner>
    </div>
  );
};

function AppRouter () {
  const {darkMode, toggleTheme} = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Track page views when location changes
  useEffect(() => {
    // Get the path
    const path = location.pathname;
    
    // Find the matching SEO config for the current path
    let configKey = 'home'; // Default to home
    let isPathFound = false;
    
    // Loop through all SEO config entries to find matching canonicalUrl
    Object.entries(seoConfig).forEach(([key, value]) => {
      if (key !== 'baseUrl' && value.canonicalUrl === path) {
        configKey = key;
        isPathFound = true;
      }
    });
    
    // Get the title from the SEO config
    const pageTitle = seoConfig[configKey]?.title || 'IDO ROI Calculator';
    
    // Track the page view
    trackPageView(path, pageTitle);
    
    // Track 404 errors for unknown pages
    if (!isPathFound && path !== '/404' && path !== '/') {
      trackError('404', `Page not found: ${path}`, 'navigation');
      // Note: We don't automatically redirect to 404 here, as React Router will handle that
    }
  }, [location]);

  return (<div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
    <header className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} shadow-sm py-2 w-100`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/logo.svg" alt="Logo" height="30" className="me-2" />
          <span className="d-none d-md-inline">{t('navigation.home')}</span>
        </Link>
        <div className="d-flex align-items-center">
          <nav className="navbar-nav me-auto mb-0 mb-lg-0 flex-row">
            <Link to="/" className="nav-link px-2">{t('navigation.calculator')}</Link>
            <Link to="/about" className="nav-link px-2">{t('navigation.about')}</Link>
            <Link to="/education" className="nav-link px-2">{t('navigation.education')}</Link>
            <Link to="/faq" className="nav-link px-2">{t('navigation.faq')}</Link>
          </nav>
          <div className="d-flex align-items-center ms-3">
            <LanguageSelector />
            <Button 
              variant="link" 
              className={`p-1 ms-2 ${darkMode ? 'text-light' : ''}`}
              onClick={toggleTheme} 
              aria-label={darkMode ? t('theme.light') : t('theme.dark')}
            >
              {darkMode ? <FaSun className="text-warning" /> : <FaMoon className="text-dark" />}
            </Button>
          </div>
        </div>
      </div>
    </header>

    <main>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Simulator />} />
          <Route path="/about" element={<HowItWorks onNavigateToSimulator={() => navigate('/')}/>}/>
          <Route path="/education" element={<Education onNavigateToSimulator={() => navigate('/')}/>}/>
          <Route path="/faq" element={<FAQ onNavigateToSimulator={() => navigate('/')}/>}/>
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>

    <Footer />
  </div>);
}

export default AppRouter;
