import React, { useContext } from 'react';
import { Container, Button, Navbar, Nav } from 'react-bootstrap';
import { FaSun, FaMoon, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from './context/ThemeContext';
import Calculator from './components/Calculator';
import About from './components/About';
import FAQ from './components/FAQ';
import Terms from './components/Terms';
import Privacy from './components/Privacy';

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
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/about" element={<About onNavigateToCalculator={() => navigate('/')} />} />
          <Route path="/faq" element={<FAQ onNavigateToCalculator={() => navigate('/')} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </main>
      
      <div className="container-fluid">
        <footer className={`d-flex flex-wrap justify-content-between align-items-center py-3 border-top ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
          <div className="col-md-4 d-flex align-items-center">
            <Link to="/" className="mb-3 me-2 mb-md-0 text-decoration-none lh-1">
              <img src="/logo.svg" alt="TokenCalculator" width="48" height="48" />
            </Link>
            <span className={`mb-3 mb-md-0 ${darkMode ? 'text-light' : 'text-body-secondary'}`}>© 2025 TokenCalculator</span>
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
        </footer>
      </div>
    </div>
  );
}

export default AppRouter;
