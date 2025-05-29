import React, { lazy, Suspense, useContext } from 'react';
import { Container, Button, Navbar, Nav } from 'react-bootstrap';
import { FaSun, FaMoon, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';

// Lazy load page components
const Calculator = lazy(() => import('./components/Calculator'));
const About = lazy(() => import('./components/About'));
const FAQ = lazy(() => import('./components/FAQ'));
const Terms = lazy(() => import('./components/Terms'));
const Privacy = lazy(() => import('./components/Privacy'));
const NotFound = lazy(() => import('./components/NotFound'));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function AppRouter() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="app-header">
        <div className="brand">
          <Link to="/" className="text-decoration-none">
            <img src="/logo.svg" alt="TokenCalculator" className="brand-logo" />
            <span className="brand-title">TokenCalculator</span>
          </Link>
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Calculator
          </Link>
          <Link 
            to="/about" 
            className={location.pathname === '/about' ? 'active' : ''}
          >
            About
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
          {darkMode ? <FaSun /> : <FaMoon />}
        </Button>
      </header>
      
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Calculator />} />
            <Route path="/about" element={<About onNavigateToCalculator={() => navigate('/')} />} />
            <Route path="/faq" element={<FAQ onNavigateToCalculator={() => navigate('/')} />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      
      <div className="container-fluid">
        <footer className={`d-flex flex-wrap justify-content-between align-items-center py-3 border-top ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
          <div className="col-md-4 d-flex align-items-center">
            <Link to="/" className="mb-3 me-2 mb-md-0 text-decoration-none lh-1">
              <img src="/logo.svg" alt="TokenCalculator" width="48" height="48" />
            </Link>
            <span className={`mb-3 mb-md-0 ${darkMode ? 'text-light' : 'text-body-secondary'}`}> {new Date().getFullYear()} TokenCalculator</span>
          </div>
          
          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="nav-item">
              <Link 
                to="/" 
                className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
              >
                Calculator
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/about" 
                className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
              >
                About
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
            <p className={`text-center ${darkMode ? 'text-light-emphasis' : 'text-dark-emphasis'}`}>
              This tool is for informational and educational purposes only. All simulations and ROI projections are hypothetical and do not constitute financial advice, investment guidance, or guarantees of future performance. Always do your own research (DYOR) and consult with licensed professionals before making any investment decisions. AlphaMind and its affiliates are not liable for any actions taken based on this simulator.
            </p>
            <p className={`text-center ${darkMode ? 'text-light-emphasis' : 'text-dark-emphasis'}`}>
              <strong>Remember:</strong> Simulations are not predictions. Markets are wild — especially in crypto.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AppRouter;
