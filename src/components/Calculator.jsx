import React, { useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import CalculatorForm from './CalculatorForm';
import CalculatorResults from './CalculatorResults';
import UnlockSchedule from './UnlockSchedule';
import MonthlyROIBreakdown from './MonthlyROIBreakdown';

const Calculator = () => {
  const [calculationResults, setCalculationResults] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [isTabChanging, setIsTabChanging] = useState(false);
  
  const handleCalculate = (results) => {
    setCalculationResults(results);
    handleTabChange('results');
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
            <Nav.Link eventKey="unlock" disabled={!calculationResults}>Unlock Schedule</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="monthly" disabled={!calculationResults}>Monthly Breakdown</Nav.Link>
          </Nav.Item>
        </Nav>
        
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
    </Container>
  );
};

export default Calculator;
