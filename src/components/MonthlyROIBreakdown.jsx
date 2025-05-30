import React, { useState, useContext } from 'react';
import { Table, Form, Row, Col, Card, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ROIChart from './ROIChart';
import { format } from 'date-fns';
import { ThemeContext } from '../context/ThemeContext';
import { FaInfoCircle } from 'react-icons/fa';

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

  const formatTimeUnit = (timeUnit) => {
    const isWeekly = results.unlockFrequency === 'weekly';
    
    if (!results.tgeDate) {
      return isWeekly ? `Week ${timeUnit}` : `Month ${timeUnit}`;
    }

    const date = new Date(results.tgeDate);
    if (isWeekly) {
      // Add weeks (approximately 7 days per week)
      date.setDate(date.getDate() + (timeUnit * 7));
    } else {
      // Add months
      date.setMonth(date.getMonth() + parseInt(timeUnit));
    }
    
    return isWeekly ? `Week ${timeUnit}` : `Month ${timeUnit}`;
  };

  const formatDate = (timeUnit) => {
    if (!results.tgeDate) return null;

    const date = new Date(results.tgeDate);
    
    if (results.unlockFrequency === 'weekly') {
      // Add weeks (approximately 7 days per week)
      date.setDate(date.getDate() + (timeUnit * 7));
    } else {
      // Add months
      date.setMonth(date.getMonth() + parseInt(timeUnit));
    }
    
    return format(date, 'MMM dd, yyyy');
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

  // For weekly frequency, we need to map the actual week numbers
  const getWeekNumber = (timeUnit) => {
    if (results.unlockFrequency === 'weekly') {
      return timeUnit; // The timeUnit is already the week number
    }
    return timeUnit; // For monthly, return as is
  };

  // Find break-even months for each scenario
  const breakEvenMonths = {};
  selectedScenarios.forEach(scenario => {
    const breakEvenMonth = results.breakEvenMonths[scenario];
    if (breakEvenMonth !== null) {
      // For weekly frequency, we need to convert the month value back to weeks
      if (results.unlockFrequency === 'weekly') {
        // Find the closest matching week
        const weekIndex = months.findIndex(month => 
          Math.abs(month / 4.33 - breakEvenMonth) < 0.1
        );
        breakEvenMonths[scenario] = weekIndex !== -1 ? months[weekIndex] : null;
      } else {
        breakEvenMonths[scenario] = breakEvenMonth;
      }
    }
  });

  // Calculate total revenue for each scenario
  const getTotalRevenue = (scenario) => {
    return Object.values(results.monthlyRevenue[scenario]).reduce((sum, value) => sum + value, 0);
  };

  const getScenarioStyle = (scenario) => {
    const colors = {
      'Bear': '#dc3545', // Bootstrap danger color
      'Base': '#0d6efd', // Bootstrap primary color
      'Bull': '#198754'  // Bootstrap success color
    };

    return {
      borderLeft: `5px solid ${colors[scenario] || '#dee2e6'}`
    };
  };

  return (
    <div className="monthly-roi-breakdown">
      <h2>ROI Over Time</h2>
      <div className="chart-section">
        <Card className="chart-card">
          <Card.Body>
            <div className="chart-header">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-roi-chart">
                    This chart shows how your investment's ROI changes over time as tokens are unlocked. The lines represent different price scenarios.
                  </Tooltip>
                }
              >
                <h3 className={`section-title tooltip-label ${darkMode ? "text-white" : ""}`}>
                  ROI Over Time
                  <FaInfoCircle className="ms-2 text-primary info-icon" />
                </h3>
              </OverlayTrigger>
              <div className="scenario-toggles">
                <Form>
                  <div className="d-flex flex-wrap gap-3">
                    {results.priceScenarios.map(scenario => (
                      <Form.Check
                        key={scenario.name}
                        type="checkbox"
                        id={`scenario-${scenario.name}`}
                        label={`${scenario.name} Case`}
                        checked={selectedScenarios.includes(scenario.name)}
                        onChange={() => handleScenarioToggle(scenario.name)}
                        className={`scenario-toggle ${scenario.name.toLowerCase()}-toggle`}
                      />
                    ))}
                  </div>
                </Form>
              </div>
            </div>

            <div className="chart-container">
              <ROIChart
                data={results.cumulativeROI}
                scenarios={selectedScenarios}
                tgeDate={results.tgeDate}
                unlockFrequency={results.unlockFrequency}
              />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="table-section">
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip-monthly-breakdown">
              This table shows a detailed {results.unlockFrequency === 'weekly' ? 'week-by-week' : 'month-by-month'} breakdown of your investment's performance, including token unlocks, revenue, and cumulative ROI for each scenario.
            </Tooltip>
          }
        >
          <h3 className={`section-title tooltip-label monthly-breakdown-section-title ${darkMode ? "text-white" : ""}`}>
            {results.unlockFrequency === 'weekly' ? 'Weekly' : 'Monthly'} Breakdown
            <FaInfoCircle className="ms-2 text-primary info-icon" />
          </h3>
        </OverlayTrigger>
        <div className="table-responsive">
          <Table striped bordered hover className="monthly-breakdown-table">
            <thead>
              <tr>
                <th className={darkMode ? "text-white" : ""}>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-month-column">
                        {results.unlockFrequency === 'weekly' 
                          ? 'The week number after TGE (Token Generation Event). If a TGE date was provided, actual calendar dates are shown in parentheses.'
                          : 'The month number after TGE (Token Generation Event). If a TGE date was provided, actual calendar dates are shown in parentheses.'}
                      </Tooltip>
                    }
                  >
                    <span className="tooltip-label">
                      {results.unlockFrequency === 'weekly' ? 'Week' : 'Month'}
                      <FaInfoCircle className="ms-2 text-primary info-icon" />
                    </span>
                  </OverlayTrigger>
                </th>
                <th className={darkMode ? "text-white" : ""}>
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-tokens-unlocked">
                        The number of tokens that become available in this {results.unlockFrequency === 'weekly' ? 'week' : 'month'} according to your vesting schedule.
                      </Tooltip>
                    }
                  >
                    <span className="tooltip-label">
                      Tokens Unlocked
                      <FaInfoCircle className="ms-2 text-primary info-icon" />
                    </span>
                  </OverlayTrigger>
                </th>
                {selectedScenarios.map(scenario => (
                  <React.Fragment key={`${scenario}-headers`}>
                    <th className={darkMode ? "text-white" : ""} style={getScenarioStyle(scenario)}>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-monthly-revenue-${scenario}`}>
                            The USD value of tokens unlocked in this {results.unlockFrequency === 'weekly' ? 'week' : 'month'}, calculated using the {scenario} Case price.
                          </Tooltip>
                        }
                      >
                        <span className="tooltip-label">
                          {scenario} Case Revenue
                          <FaInfoCircle className="ms-2 text-primary info-icon" />
                        </span>
                      </OverlayTrigger>
                    </th>
                    <th className={darkMode ? "text-white" : ""} style={getScenarioStyle(scenario)}>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-cumulative-roi-${scenario}`}>
                            Your total return on investment up to this {results.unlockFrequency === 'weekly' ? 'week' : 'month'}, calculated using the {scenario} Case price.
                          </Tooltip>
                        }
                      >
                        <span className="tooltip-label">
                          {scenario} Case ROI
                          <FaInfoCircle className="ms-2 text-primary info-icon" />
                        </span>
                      </OverlayTrigger>
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map(month => (
                <tr key={month} className={Object.entries(breakEvenMonths).some(([scenario, breakMonth]) =>
                  selectedScenarios.includes(scenario) && breakMonth === month) ? 'break-even-row' : ''}>
                  <td className={darkMode ? "text-white" : ""}>
                    {results.unlockFrequency === 'weekly' 
                      ? (formatDate(month) 
                          ? `Week ${getWeekNumber(month)} - ${formatDate(month)}` 
                          : `Week ${getWeekNumber(month)}`)
                      : formatTimeUnit(month)}
                    {results.unlockFrequency !== 'weekly' && formatDate(month) && 
                      <div className="calendar-date">{formatDate(month)}</div>}
                  </td>
                  <td className={darkMode ? "text-white" : ""}>{results.monthlyUnlocks[month].toLocaleString(undefined, { maximumFractionDigits: 2 })} {results.tokenName}</td>
                  {selectedScenarios.map(scenario => (
                    <React.Fragment key={scenario}>
                      <td className={darkMode ? "text-white" : ""}>{formatCurrency(results.monthlyRevenue[scenario][month])}</td>
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
          <h4 className={`subsection-title ${darkMode ? "text-white" : ""}`}>Total Summary</h4>
          <Row className="summary-cards">
            {selectedScenarios.map(scenario => {
              const totalRevenue = getTotalRevenue(scenario);
              const finalROI = results.totalROI[scenario];
              const roiClass = finalROI >= 0 ? 'positive-roi' : 'negative-roi';

              return (
                <Col md={4} key={scenario} className="mb-3 d-flex">
                  <Card className={`summary-card ${scenario.toLowerCase()}-summary flex-fill`} style={getScenarioStyle(scenario)}>
                    <Card.Body className="d-flex flex-column">
                      <div className={`summary-title ${darkMode ? "text-white" : ""}`}>{scenario} Case</div>
                      <div className="summary-content flex-grow-1">
                        <div className="summary-item">
                          <span className={darkMode ? "text-white" : ""}>Total Revenue:</span>
                          <span className={darkMode ? "text-white" : ""}>{formatCurrency(totalRevenue)}</span>
                        </div>
                        <div className="summary-item">
                          <span className={darkMode ? "text-white" : ""}>Final ROI:</span>
                          <span className={roiClass}>{formatPercentage(finalROI)}</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
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
