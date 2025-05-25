import React, { useState, useContext } from 'react';
import { Container, Row, Col, Button, Nav, Image } from 'react-bootstrap';
import { FaSun, FaMoon } from 'react-icons/fa';
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
      
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">TokenCalculator</span>
            <span className="footer-tagline">Professional ROI Analysis</span>
          </div>
          <div className="footer-links">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavigation('calculator'); }}
            >
              Calculator
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavigation('about'); }}
            >
              About
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavigation('faq'); }}
            >
              FAQ
            </a>
          </div>
          <div className="footer-connect">
            <a href="#">Twitter</a>
            <a href="#">GitHub</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
