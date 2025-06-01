import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { Button, Spinner, Navbar, Nav, Container } from 'react-bootstrap';
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
  const [expanded, setExpanded] = useState(false);

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

    // Close mobile menu when navigating
    setExpanded(false);
  }, [location]);

  const handleNavLinkClick = () => {
    setExpanded(false);
  };

  return (<div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
    <Navbar
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      className={`shadow-sm py-2 w-100 ${darkMode ? 'navbar-dark dark-card-bg' : 'navbar-light bg-light'}`}
    >
      <Container className="px-3 px-sm-4">
        <Navbar.Brand as={Link} to="/" onClick={handleNavLinkClick}>
          <img src="/logo.svg" alt="Logo" height="30" className="me-2" />
          <span className="d-none d-md-inline">{t('navigation.home')}</span>
        </Navbar.Brand>

        <div className="d-flex align-items-center order-lg-2 ms-auto">
          <LanguageSelector />
          <Button
            variant="link"
            className={`p-1 ms-2 ${darkMode ? 'text-light' : ''}`}
            onClick={toggleTheme}
            aria-label={darkMode ? t('theme.light') : t('theme.dark')}
          >
            {darkMode ? <FaSun className="text-warning" /> : <FaMoon className="text-dark" />}
          </Button>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-2 border-0" />
        </div>

        <Navbar.Collapse id="basic-navbar-nav" className="order-lg-1">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={handleNavLinkClick}>{t('navigation.calculator')}</Nav.Link>
            <Nav.Link as={Link} to="/about" onClick={handleNavLinkClick}>{t('navigation.about')}</Nav.Link>
            <Nav.Link as={Link} to="/education" onClick={handleNavLinkClick}>{t('navigation.education')}</Nav.Link>
            <Nav.Link as={Link} to="/faq" onClick={handleNavLinkClick}>{t('navigation.faq')}</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <main className="mb-2 p-2">
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
