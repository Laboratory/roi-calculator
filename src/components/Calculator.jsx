import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Container, Nav, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import SEO from './SEO';
import { seoConfig } from '../config/seo';
import { trackEvent, trackTabChange } from '../utils/analytics';

// Lazy load components
const SimulatorForm = lazy(() => import('./CalculatorForm'));
const UnlockSchedule = lazy(() => import('./UnlockSchedule'));
const MonthlyROIBreakdown = lazy(() => import('./MonthlyROIBreakdown'));

// Loading component for suspense fallback
const ComponentLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="p-4 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{t('general.loading')}</span>
      </div>
      <p className="mt-2">{t('general.loading')}</p>
    </div>
  );
};

const Simulator = () => {
  const [calculationData, setCalculationData] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [isTabChanging, setIsTabChanging] = useState(false);
  const { t } = useTranslation(['common', 'calculator']);

  // Get SEO config for this page
  const {title, description, canonicalUrl, schema, pageKey} = seoConfig.home;

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

  const handleTabChange = (tabKey) => {
    setIsTabChanging(true);
    setActiveTab(tabKey);

    // Track tab change
    trackTabChange('calculator_tab', tabKey);

    // Prevent focus issues during tab transition
    setTimeout(() => {
      setIsTabChanging(false);
    }, 50);
  };

  // Transition to unlock schedule tab after calculations are done
  useEffect(() => {
    if (calculationData && activeTab === 'input') {
      setActiveTab('monthly');
    }
  }, [calculationData, activeTab]);

  return (
    <Container className="simulator-container p-0">
      <SEO
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
        pageKey={pageKey}
      />

      <div className="simulator-header p-1">
        <h1>{t('calculator:title')}</h1>
        <p className="subtitle">{t('calculator:subtitle')}</p>
        <p className="description">{t('calculator:description')}</p>
      </div>

      <div className="simulator-body">
        <Tab.Container activeKey={activeTab} onSelect={handleTabChange} className="p-0">
          <Nav className="simulator-tabs" variant="tabs">
            <Nav.Item>
              <Nav.Link eventKey="input">{t('calculator:form.sections.projectDetails')}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="monthly" disabled={!calculationData}>{t('calculator:results.title')}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="unlock" disabled={!calculationData}>{t('calculator:form.unlockSchedule.title')}</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content className="p-0">
            <Tab.Pane eventKey="input"
                      className={`tab-pane p-0 ${activeTab === 'input' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
              {activeTab === 'input' && (
                <Suspense fallback={<ComponentLoader />}>
                  <SimulatorForm onCalculate={handleCalculate} calculationData={calculationData} />
                </Suspense>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="monthly"
                      className={`tab-pane p-0 ${activeTab === 'monthly' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
              {activeTab === 'monthly' && calculationData && (
                <Suspense fallback={<ComponentLoader />}>
                  <MonthlyROIBreakdown data={calculationData} />
                </Suspense>
              )}
            </Tab.Pane>

            <Tab.Pane eventKey="unlock"
                      className={`tab-pane p-0 ${activeTab === 'unlock' ? 'active fade-in' : ''} ${isTabChanging ? 'fade-out' : ''}`}>
              {activeTab === 'unlock' && calculationData && (
                <Suspense fallback={<ComponentLoader />}>
                  <UnlockSchedule data={calculationData} />
                </Suspense>
              )}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </Container>
  );
};

export default Simulator;
