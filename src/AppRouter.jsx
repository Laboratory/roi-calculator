import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';
import { trackPageView, trackError } from './utils/analytics';
import { seoConfig } from './config/seo';

// Lazy load page components
const Simulator = lazy(() => import('./components/Calculator'));
const HowItWorks = lazy(() => import('./components/About'));
const Education = lazy(() => import('./components/Education'));
const FAQ = lazy(() => import('./components/FAQ'));
const Terms = lazy(() => import('./components/Terms'));
const Privacy = lazy(() => import('./components/Privacy'));
const NotFound = lazy(() => import('./components/NotFound'));

// Loading component for suspense fallback
const PageLoader = () => (<div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}>
  <div className="spinner-border text-primary" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
</div>);

function AppRouter () {
  const {darkMode, toggleTheme} = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

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
    <header className="app-header">
      <div className="brand">
        <Link to="/" className="text-decoration-none">
          <img src="/logo.svg" alt="TokenSimulator" className="brand-logo"/>
          <span className="brand-title">TokenSimulator</span>
        </Link>
      </div>
      <div className="nav-links">
        <Link
          to="/"
          className={location.pathname === '/' ? 'active' : ''}
        >
          Simulate ROI
        </Link>
        <Link
          to="/about"
          className={location.pathname === '/about' ? 'active' : ''}
        >
          How It Works
        </Link>
        <Link
          to="/education"
          className={location.pathname === '/education' ? 'active' : ''}
        >
          Education
        </Link>
        <Link
          to="/faq"
          className={location.pathname === '/faq' ? 'active' : ''}
        >
          FAQ
        </Link>
      </div>
      <Button
        variant={darkMode ? "light" : "dark"}
        onClick={toggleTheme}
        className="theme-toggle"
      >
        {darkMode ? <FaSun/> : <FaMoon/>}
      </Button>
    </header>

    <main>
      <Suspense fallback={<PageLoader/>}>
        <Routes>
          <Route path="/" element={<Simulator/>}/>
          <Route path="/about" element={<HowItWorks onNavigateToSimulator={() => navigate('/')}/>}/>
          <Route path="/education" element={<Education onNavigateToSimulator={() => navigate('/')}/>}/>
          <Route path="/faq" element={<FAQ onNavigateToSimulator={() => navigate('/')}/>}/>
          <Route path="/terms" element={<Terms/>}/>
          <Route path="/privacy" element={<Privacy/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Suspense>
    </main>

    <div className="container-fluid">
      <footer
        className={`d-flex flex-wrap justify-content-between align-items-center py-3 border-top ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
        <div className="col-md-4 d-flex align-items-center">
          <Link to="/" className="mb-3 me-2 mb-md-0 text-decoration-none lh-1">
            <img src="/logo.svg" alt="TokenSimulator" width="48" height="48"/>
          </Link>
          <span
            className={`mb-3 mb-md-0 ${darkMode ? 'text-light' : 'text-body-secondary'}`}> {new Date().getFullYear()} TokenSimulator</span>
        </div>

        <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li className="nav-item">
            <Link
              to="/"
              className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
            >
              Simulate ROI
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/about"
              className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
            >
              How It Works
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/education"
              className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
            >
              Education
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/faq"
              className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
            >
              FAQ
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/terms"
              className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
            >
              Terms
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/privacy"
              className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
            >
              Privacy
            </Link>
          </li>
        </ul>
        <div className="disclaimer mt-4 mb-3 small text-muted col-12">
          <div className="container bg-transparent">
            <div className="row">
              <div className="col-12"/>
              <p className={`text-center ${darkMode ? 'text-light-emphasis' : 'text-dark-emphasis'}`}>
                This tool is for informational and educational purposes only. All simulations and ROI projections are
                hypothetical and do not constitute financial advice, investment guidance, or guarantees of future
                performance. Always do your own research (DYOR) and consult with licensed professionals before making
                any investment decisions. AlphaMind and its affiliates are not liable for any actions taken based on
                this simulator.
              </p>
              <p className={`text-center ${darkMode ? 'text-light-emphasis' : 'text-dark-emphasis'}`}>
                Remember: Simulations are not predictions. Markets are wild — especially in crypto.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>);
}

export default AppRouter;
