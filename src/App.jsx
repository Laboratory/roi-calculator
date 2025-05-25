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
  
  const handleCalculate = (results) => {
    setCalculationResults(results);
    setActiveTab('results');
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

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="app-header">
        <div className="brand">
          <span className="brand-highlight">Token</span>Calculator
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
            <Nav className="calculator-tabs" variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
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
            
            <div className="tab-content">
              {activeTab === 'input' && (
                <CalculatorForm onCalculate={handleCalculate} />
              )}
              
              {activeTab === 'results' && calculationResults && (
                <CalculatorResults results={calculationResults} />
              )}
              
              {activeTab === 'monthly' && calculationResults && (
                <MonthlyROIBreakdown results={calculationResults} />
              )}
              
              {activeTab === 'unlock' && calculationResults && (
                <UnlockSchedule results={calculationResults} />
              )}
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
        <div className="footer-brand">
          Token Unlock & ROI Calculator
        </div>
        <div className="footer-links">
          <h5>Links</h5>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); handleNavigation('calculator'); }}
          >
            Home
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
          <h5>Connect</h5>
          <a href="#">Twitter</a>
          <a href="#">GitHub</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
