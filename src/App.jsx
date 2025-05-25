import React, { useState, useContext } from 'react';
import { Container, Row, Col, Button, Nav, Image } from 'react-bootstrap';
import { FaSun, FaMoon, FaInstagram, FaFacebookF } from 'react-icons/fa';
import { ThemeContext } from './context/ThemeContext';
import CalculatorForm from './components/CalculatorForm';
import CalculatorResults from './components/CalculatorResults';
import UnlockSchedule from './components/UnlockSchedule';
import MonthlyROIBreakdown from './components/MonthlyROIBreakdown';
import About from './components/About';
import FAQ from './components/FAQ';

function App() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const [calculationResults, setCalculationResults] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [currentPage, setCurrentPage] = useState('calculator');
  const [isTabChanging, setIsTabChanging] = useState(false);
  
  const handleCalculate = (results) => {
    setCalculationResults(results);
    handleTabChange('results');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    if (page === 'calculator') {
      setActiveTab('input');
    }
  };

  const handleNavigateToCalculator = () => {
    setCurrentPage('calculator');
    setActiveTab('input');
  };

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    
    setIsTabChanging(true);
    
    // Add a small delay to allow for smooth transition
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTabChanging(false);
    }, 150);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="app-header">
        <div className="brand">
          <img src="/logo.svg" alt="TokenCalculator" className="brand-logo" />
          <span className="brand-title">TokenCalculator</span>
        </div>
        <div className="nav-links">
          <a 
            href="#" 
            className={currentPage === 'calculator' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleNavigation('calculator'); }}
          >
            Calculator
          </a>
          <a 
            href="#" 
            className={currentPage === 'about' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleNavigation('about'); }}
          >
            About
          </a>
          <a 
            href="#" 
            className={currentPage === 'faq' ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); handleNavigation('faq'); }}
          >
            FAQ
          </a>
        </div>
        <Button 
          variant={darkMode ? "light" : "dark"} 
          onClick={toggleTheme}
          className="theme-toggle"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </Button>
      </header>
      
      {currentPage === 'calculator' && (
        <Container className="main-content">
          <div className="calculator-header">
            <h1>Token Unlock & ROI Calculator</h1>
            <p>Simulate your potential returns and visualize token unlock schedules</p>
          </div>
          
          <div className="calculator-card">
            <Nav className="calculator-tabs" variant="tabs" activeKey={activeTab} onSelect={handleTabChange}>
              <Nav.Item>
                <Nav.Link eventKey="input">Input Parameters</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="results" disabled={!calculationResults}>Results</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="monthly" disabled={!calculationResults}>Monthly Breakdown</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="unlock" disabled={!calculationResults}>Unlock Schedule</Nav.Link>
              </Nav.Item>
            </Nav>
            
            <div className="tab-content-wrapper">
              <div className="tab-content">
                <div className={`tab-pane ${activeTab === 'input' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
                  {activeTab === 'input' && (
                    <CalculatorForm onCalculate={handleCalculate} />
                  )}
                </div>
                
                <div className={`tab-pane ${activeTab === 'results' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
                  {activeTab === 'results' && calculationResults && (
                    <CalculatorResults results={calculationResults} />
                  )}
                </div>
                
                <div className={`tab-pane ${activeTab === 'monthly' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
                  {activeTab === 'monthly' && calculationResults && (
                    <MonthlyROIBreakdown results={calculationResults} />
                  )}
                </div>
                
                <div className={`tab-pane ${activeTab === 'unlock' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
                  {activeTab === 'unlock' && calculationResults && (
                    <UnlockSchedule results={calculationResults} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}

      {currentPage === 'about' && (
        <About onNavigateToCalculator={handleNavigateToCalculator} />
      )}

      {currentPage === 'faq' && (
        <FAQ onNavigateToCalculator={handleNavigateToCalculator} />
      )}
      
      <div className="container-fluid">
        <footer className={`d-flex flex-wrap justify-content-between align-items-center py-3 border-top ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
          <div className="col-md-4 d-flex align-items-center">
            <a href="#" className="mb-3 me-2 mb-md-0 text-decoration-none lh-1" onClick={(e) => { e.preventDefault(); handleNavigation('calculator'); }}>
              <img src="/logo.svg" alt="TokenCalculator" width="48" height="48" />
            </a>
            <span className={`mb-3 mb-md-0 ${darkMode ? 'text-light' : 'text-body-secondary'}`}>© 2025 TokenCalculator</span>
          </div>
          
          <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('calculator'); }}
              >
                Calculator
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('about'); }}
              >
                About
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
                onClick={(e) => { e.preventDefault(); handleNavigation('faq'); }}
              >
                FAQ
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
                onClick={(e) => { e.preventDefault(); }}
              >
                Terms
              </a>
            </li>
            <li className="nav-item">
              <a 
                href="#" 
                className={`nav-link px-2 ${darkMode ? 'text-light' : 'text-body-secondary'}`}
                onClick={(e) => { e.preventDefault(); }}
              >
                Privacy
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}

export default App;
