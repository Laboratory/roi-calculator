import React, { useState, useContext } from 'react';
import { Table, Form, Row, Col, Card, Alert } from 'react-bootstrap';
import ROIChart from './ROIChart';
import { format } from 'date-fns';
import { ThemeContext } from '../context/ThemeContext';

const MonthlyROIBreakdown = ({ results }) => {
  const { darkMode } = useContext(ThemeContext);
  const [selectedScenarios, setSelectedScenarios] = useState(
    results.priceScenarios.map(s => s.name)
  );
  
  const handleScenarioToggle = (scenario) => {
    if (selectedScenarios.includes(scenario)) {
      if (selectedScenarios.length > 1) { // Ensure at least one scenario is selected
        setSelectedScenarios(selectedScenarios.filter(s => s !== scenario));
      }
    } else {
      setSelectedScenarios([...selectedScenarios, scenario]);
    }
  };
  
  const formatMonth = (month) => {
    if (!results.tgeDate) return `Month ${month}`;
    
    const date = new Date(results.tgeDate);
    date.setMonth(date.getMonth() + parseInt(month));
    return `Month ${month} (${format(date, 'MMM yyyy')})`;
  };
  
  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Get all months from the data
  const months = Object.keys(results.cumulativeROI[results.priceScenarios[0].name]).map(Number);
  
  // Find break-even months for each scenario
  const breakEvenMonths = {};
  selectedScenarios.forEach(scenario => {
    const breakEvenMonth = results.breakEvenMonths[scenario];
    if (breakEvenMonth !== null) {
      breakEvenMonths[scenario] = breakEvenMonth;
    }
  });
  
  // Calculate total revenue for each scenario
  const getTotalRevenue = (scenario) => {
    return Object.values(results.monthlyRevenue[scenario]).reduce((sum, value) => sum + value, 0);
  };
  
  return (
    <div className="monthly-roi-breakdown">
      <div className="chart-section">
        <h3 className="section-title">ROI Over Time</h3>
        <Alert variant="info" className="chart-explanation-alert mb-3">
          This chart shows your cumulative ROI over time for each selected price scenario. The break-even point (0% ROI) is where you recover your initial investment.
        </Alert>
        <Card className="chart-card mb-4">
          <Card.Body>
            <div className="scenario-toggles mb-3">
              <Row>
                {results.priceScenarios.map(scenario => (
                  <Col key={scenario.name} xs={4} md={3} lg={2}>
                    <Form.Check 
                      type="checkbox"
                      id={`scenario-${scenario.name}`}
                      label={`${scenario.name} Case`}
                      checked={selectedScenarios.includes(scenario.name)}
                      onChange={() => handleScenarioToggle(scenario.name)}
                      className={`scenario-toggle ${scenario.name.toLowerCase()}-toggle`}
                    />
                  </Col>
                ))}
              </Row>
            </div>
            
            <div className="chart-container" style={{ height: '400px' }}>
              <ROIChart 
                data={results.cumulativeROI} 
                scenarios={selectedScenarios}
                tgeDate={results.tgeDate}
              />
            </div>
          </Card.Body>
        </Card>
      </div>
      
      <div className="table-section">
        <h3 className="section-title">Monthly Breakdown</h3>
        <div className="table-responsive">
          <Table striped bordered hover className="monthly-breakdown-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Tokens Unlocked</th>
                {selectedScenarios.map(scenario => (
                  <React.Fragment key={scenario}>
                    <th>{scenario} Revenue</th>
                    <th>{scenario} Cumulative ROI</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map(month => (
                <tr key={month} className={Object.entries(breakEvenMonths).some(([scenario, breakMonth]) => 
                  selectedScenarios.includes(scenario) && breakMonth === month) ? 'break-even-row' : ''}>
                  <td>{formatMonth(month)}</td>
                  <td>{results.monthlyUnlocks[month].toLocaleString(undefined, { maximumFractionDigits: 2 })} {results.tokenName}</td>
                  {selectedScenarios.map(scenario => (
                    <React.Fragment key={scenario}>
                      <td>{formatCurrency(results.monthlyRevenue[scenario][month])}</td>
                      <td className={results.cumulativeROI[scenario][month] >= 0 ? 'positive-roi' : 'negative-roi'}>
                        {formatPercentage(results.cumulativeROI[scenario][month])}
                        {breakEvenMonths[scenario] === month && (
                          <span className="break-even-badge">Break-even</span>
                        )}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        
        {/* Total Revenue and ROI Summary */}
        <div className="total-summary mt-4">
          <h4 className="subsection-title">Total Summary</h4>
          <div className="summary-cards">
            <Row>
              {selectedScenarios.map(scenario => {
                const totalRevenue = getTotalRevenue(scenario);
                const finalROI = results.totalROI[scenario];
                const roiClass = finalROI >= 0 ? 'positive-roi' : 'negative-roi';
                
                return (
                  <Col md={4} key={scenario} className="mb-3">
                    <div className={`summary-card ${scenario.toLowerCase()}-summary`}>
                      <div className="summary-title">{scenario} Case</div>
                      <div className="summary-content">
                        <div className="summary-item">
                          <span>Total Revenue:</span>
                          <span>{formatCurrency(totalRevenue)}</span>
                        </div>
                        <div className="summary-item">
                          <span>Final ROI:</span>
                          <span className={roiClass}>{formatPercentage(finalROI)}</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
        
        {/* Advanced Mode Teaser */}
        <div className="advanced-mode-teaser mt-4">
          <Alert variant="info" className="teaser-alert">
            <strong>Advanced mode coming soon:</strong> partial exit strategy, VC unlock pressure, dynamic sell plans.
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default MonthlyROIBreakdown;
