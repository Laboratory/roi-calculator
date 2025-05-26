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
      <div className="chart-section">
        <Card className="chart-card">
          <Card.Body>
            <div className="chart-header">
              <h3 className={`section-title ${darkMode ? "text-white" : ""}`}>
                ROI Over Time
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="tooltip-roi-chart">
                      This chart shows how your investment's ROI changes over time as tokens are unlocked. The lines represent different price scenarios.
                    </Tooltip>
                  }
                >
                  <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                </OverlayTrigger>
              </h3>
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
              />
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="table-section">
        <h3 className={`section-title monthly-breakdown-section-title ${darkMode ? "text-white" : ""}`}>
          Monthly Breakdown
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-monthly-breakdown">
                This table shows a detailed month-by-month breakdown of your investment's performance, including token unlocks, revenue, and cumulative ROI for each scenario.
              </Tooltip>
            }
          >
            <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
          </OverlayTrigger>
        </h3>
        <div className="table-responsive">
          <Table striped bordered hover className="monthly-breakdown-table">
            <thead>
              <tr>
                <th className={darkMode ? "text-white" : ""}>
                  Month
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-month-column">
                        The month number after TGE (Token Generation Event). If a TGE date was provided, actual calendar dates are shown in parentheses.
                      </Tooltip>
                    }
                  >
                    <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                  </OverlayTrigger>
                </th>
                <th className={darkMode ? "text-white" : ""}>
                  Tokens Unlocked
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-tokens-unlocked">
                        The number of tokens that become available in this specific month according to your vesting schedule.
                      </Tooltip>
                    }
                  >
                    <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                  </OverlayTrigger>
                </th>
                {selectedScenarios.map(scenario => (
                  <React.Fragment key={scenario}>
                    <th className={darkMode ? "text-white" : ""}>
                      {scenario} Revenue
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-revenue-${scenario}`}>
                            The estimated USD value of tokens unlocked this month based on the {scenario.toLowerCase()} case price scenario.
                          </Tooltip>
                        }
                      >
                        <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                      </OverlayTrigger>
                    </th>
                    <th className={darkMode ? "text-white" : ""}>
                      {scenario} Cumulative ROI
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-cumulative-roi-${scenario}`}>
                            The total return on investment up to this month in the {scenario.toLowerCase()} case scenario. Highlighted green when positive, red when negative.
                          </Tooltip>
                        }
                      >
                        <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
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
                  <td className={darkMode ? "text-white" : ""}>{formatMonth(month)}</td>
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
