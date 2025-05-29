import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import CalculatorForm from './CalculatorForm';
import SEO from './SEO';
import { seoConfig } from '../config/seo';

// Lazy load heavy components
const CalculatorResults = lazy(() => import('./CalculatorResults'));
const UnlockSchedule = lazy(() => import('./UnlockSchedule'));
const MonthlyROIBreakdown = lazy(() => import('./MonthlyROIBreakdown'));

// Loading component for suspense fallback
const ComponentLoader = () => (
  <div className="p-4 text-center">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-2">Loading component...</p>
  </div>
);

function Calculator() {
  const [calculationData, setCalculationData] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [isTabChanging, setIsTabChanging] = useState(false);
  
  // Get SEO config for this page
  const { title, description, canonicalUrl, schema } = seoConfig.home;

  const handleCalculate = (data) => {
    setCalculationData(data);
    setActiveTab('results');
    
    // Scroll to results after calculation
    setTimeout(() => {
      const resultsElement = document.getElementById('calculator-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;
    
    setIsTabChanging(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTabChanging(false);
    }, 300);
  };

  return (
    <Container className="py-4">
      <SEO 
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
      />
      
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
            <Nav.Link eventKey="results" disabled={!calculationData}>Results</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="unlock" disabled={!calculationData}>Unlock Schedule</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="monthly" disabled={!calculationData}>Monthly Breakdown</Nav.Link>
          </Nav.Item>
        </Nav>
        
        <div className="tab-content">
          <div className={`tab-pane ${activeTab === 'input' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
            {activeTab === 'input' && (
              <CalculatorForm onCalculate={handleCalculate} />
            )}
          </div>
          
          <div className={`tab-pane ${activeTab === 'results' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
            {activeTab === 'results' && calculationData && (
              <Suspense fallback={<ComponentLoader />}>
                <CalculatorResults results={calculationData} />
              </Suspense>
            )}
          </div>
          
          <div className={`tab-pane ${activeTab === 'monthly' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
            {activeTab === 'monthly' && calculationData && (
              <Suspense fallback={<ComponentLoader />}>
                <MonthlyROIBreakdown results={calculationData} />
              </Suspense>
            )}
          </div>
          
          <div className={`tab-pane ${activeTab === 'unlock' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
            {activeTab === 'unlock' && calculationData && (
              <Suspense fallback={<ComponentLoader />}>
                <UnlockSchedule results={calculationData} />
              </Suspense>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Calculator;
