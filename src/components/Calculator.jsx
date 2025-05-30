import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import SEO from './SEO';
import { seoConfig } from '../config/seo';
import { trackEvent, trackTabChange } from '../utils/analytics';

// Lazy load components
const SimulatorForm = lazy(() => import('./CalculatorForm'));
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

const Simulator = () => {
  const [calculationData, setCalculationData] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [isTabChanging, setIsTabChanging] = useState(false);

  // Get SEO config for this page
  const {title, description, canonicalUrl, schema} = seoConfig.home;

  const handleCalculate = (data) => {
    setCalculationData(data);

    // Track calculation event
    trackEvent('roi_calculation', {
      investment_amount: data.investmentAmount,
      token_price: data.tokenPrice,
      has_vesting: data.hasVesting
    });

    setActiveTab('monthly');

    // Scroll to results after calculation
    setTimeout(() => {
      const resultsElement = document.getElementById('simulator-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({behavior: 'smooth'});
      }
    }, 100);
  };

  const handleTabChange = (newTab) => {
    if (newTab === activeTab) return;

    // Track tab change
    trackTabChange(newTab, activeTab);

    setIsTabChanging(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsTabChanging(false);
    }, 300);
  };

  return (
    <Container className="py-4 simulator-container">
      <SEO
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
      />

      <div className="simulator-header">
        <h1>Token Unlock & ROI Simulator</h1>
        <p className="subtitle">Uncover real returns. Visualize token unlocks. Break free from FDV illusions.</p>
        <p className="description">Simulate your returns from any token presale, forecast token unlocks, and plan
          smarter exits under different market scenarios. Free, fast, and privacy-safe. Built by AlphaMind to protect
          retail investors.</p>
      </div>

      <div className="simulator-body">
        <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
          <Nav className="simulator-tabs" variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="input">Presale Setup</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="unlock" disabled={!calculationData}>Unlock Schedule</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="monthly" disabled={!calculationData}>ROI Over Time</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="input"
                      className={`tab-pane ${activeTab === 'input' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
              {activeTab === 'input' && (
                <SimulatorForm onCalculate={handleCalculate}/>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="monthly"
                      className={`tab-pane ${activeTab === 'monthly' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
              {activeTab === 'monthly' && calculationData && (
                <Suspense fallback={<ComponentLoader/>}>
                  <MonthlyROIBreakdown results={calculationData}/>
                </Suspense>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="unlock"
                      className={`tab-pane ${activeTab === 'unlock' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
              {activeTab === 'unlock' && calculationData && (
                <Suspense fallback={<ComponentLoader/>}>
                  <UnlockSchedule results={calculationData}/>
                </Suspense>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </Container>
  );
}

export default Simulator;
