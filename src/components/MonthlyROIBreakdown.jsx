import React, { useContext, useState } from 'react';
import { Alert, Card, Col, Form, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import ROIChart from './ROIChart';
import { format } from 'date-fns';
import { ThemeContext } from '../context/ThemeContext';
import { FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const MonthlyROIBreakdown = ({data}) => {
  const {darkMode} = useContext(ThemeContext);
  const {t} = useTranslation(['calculator', 'common']);

  // Add null check for data and data.priceScenarios
  const [selectedScenarios, setSelectedScenarios] = useState(data && data.priceScenarios ? data.priceScenarios.map(s => s.name) : []);

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
    const isWeekly = data.unlockFrequency === 'weekly';

    if (!data.tgeDate) {
      return isWeekly ? t('calculator:results.monthlyBreakdown.tableColumns.period.weekTitle', {number: timeUnit}) : t('calculator:results.monthlyBreakdown.tableColumns.period.title', {number: timeUnit});
    }

    const date = new Date(data.tgeDate);
    if (isWeekly) {
      // Add weeks (approximately 7 days per week)
      date.setDate(date.getDate() + (timeUnit * 7));
    } else {
      // Add months
      date.setMonth(date.getMonth() + parseInt(timeUnit));
    }

    return isWeekly ? t('calculator:results.monthlyBreakdown.tableColumns.period.weekTitle', {number: timeUnit}) : t('calculator:results.monthlyBreakdown.tableColumns.period.title', {number: timeUnit});
  };

  const formatDate = (timeUnit) => {
    if (!data.tgeDate) return null;

    const date = new Date(data.tgeDate);

    if (data.unlockFrequency === 'weekly') {
      // Add weeks (approximately 7 days per week)
      date.setDate(date.getDate() + (timeUnit * 7));
      return format(date, 'MMM dd, yyyy');
    } else {
      // Add months
      date.setMonth(date.getMonth() + parseInt(timeUnit));
      return format(date, 'MMM yyyy');
    }
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(value / 100);
  };

  const formatCurrency = (value) => {
    // Handle null, undefined, or non-numeric values
    if (value === null || value === undefined || isNaN(value)) {
      value = 0;
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(value);
  };

  // Get all months from the data
  const months = Object.keys(data.cumulativeROI[data.priceScenarios[0].name]).map(Number);

  // For weekly frequency, we need to map the actual week numbers
  const getWeekNumber = (timeUnit) => {
    if (data.unlockFrequency === 'weekly') {
      return timeUnit; // The timeUnit is already the week number
    }
    return timeUnit; // For monthly, return as is
  };

  // Find break-even months for each scenario
  const breakEvenMonths = {};
  selectedScenarios.forEach(scenario => {
    const breakEvenMonth = data.breakEvenMonths[scenario];
    if (breakEvenMonth !== null) {
      // For weekly frequency, we need to convert the month value back to weeks
      if (data.unlockFrequency === 'weekly') {
        // Find the closest matching week
        const weekIndex = months.findIndex(month => Math.abs(month / 4.33 - breakEvenMonth) < 0.1);
        breakEvenMonths[scenario] = weekIndex !== -1 ? months[weekIndex] : null;
      } else {
        breakEvenMonths[scenario] = breakEvenMonth;
      }
    }
  });

  // Calculate total revenue for each scenario
  const getTotalRevenue = (scenario) => {
    return Object.values(data.monthlyRevenue[scenario]).reduce((sum, value) => sum + value, 0);
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
      {!data ? (<Alert variant="warning">
        {t('common:general.noData')}
      </Alert>) : (<>
        <h2 className="ms-2">{t('calculator:results.title')}</h2>
        <div className="chart-section">
          <Card className="chart-card">
            <Card.Body>
              <div className="chart-header">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-roi-chart">
                    {t('calculator:results.monthlyBreakdown.chartTooltip')}
                  </Tooltip>}
                >
                  <h3 className={`section-title tooltip-label ${darkMode ? "text-white" : ""}`}>
                    {t('calculator:results.monthlyBreakdown.chartTitle')}
                    <FaInfoCircle className="ms-2 text-primary info-icon"/>
                  </h3>
                </OverlayTrigger>
                <div className="scenario-toggles">
                  <Form>
                    <div className="d-flex flex-wrap gap-3">
                      {data.priceScenarios.map(scenario => (<Form.Check
                        key={scenario.name}
                        type="checkbox"
                        id={`scenario-${scenario.name}`}
                        label={scenario.name === 'Bear' ? t('calculator:results.scenarios.bearish') : scenario.name === 'Base' ? t('calculator:results.scenarios.neutral') : scenario.name === 'Bull' ? t('calculator:results.scenarios.bullish') : scenario.name}
                        checked={selectedScenarios.includes(scenario.name)}
                        onChange={() => handleScenarioToggle(scenario.name)}
                        className={`scenario-toggle ${scenario.name.toLowerCase()}-toggle`}
                      />))}
                    </div>
                  </Form>
                </div>
              </div>

              <div className="chart-container">
                <ROIChart
                  data={data.cumulativeROI}
                  scenarios={selectedScenarios}
                  tgeDate={data.tgeDate}
                  unlockFrequency={data.unlockFrequency}
                  fdvValues={data.fdvValues}
                  totalSupply={data.totalSupply}
                />
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="table-section">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-monthly-breakdown">
              {data.unlockFrequency === 'weekly' ? t('calculator:results.monthlyBreakdown.breakdownTooltip.weekly') : t('calculator:results.monthlyBreakdown.breakdownTooltip.monthly')}
            </Tooltip>}
          >
            <h3
              className={`ms-2 section-title tooltip-label monthly-breakdown-section-title ${darkMode ? "text-white" : ""}`}>
              {data.unlockFrequency === 'weekly' ? t('calculator:results.monthlyBreakdown.breakdownTitle.weekly') : t('calculator:results.monthlyBreakdown.breakdownTitle.monthly')}
              <FaInfoCircle className="ms-2 text-primary info-icon"/>
            </h3>
          </OverlayTrigger>
          <div className="table-responsive">
            <Table striped bordered hover className="monthly-breakdown-table">
              <thead>
              <tr>
                <th className={darkMode ? "text-white" : ""}>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-month-column">
                      {data.unlockFrequency === 'weekly' ? t('calculator:results.monthlyBreakdown.tableColumns.period.weekTooltip') : t('calculator:results.monthlyBreakdown.tableColumns.period.tooltip')}
                    </Tooltip>}
                  >
                          <span className="tooltip-label">
                            {data.unlockFrequency === 'weekly' ? t('calculator:results.monthlyBreakdown.tableColumns.period.weekTitle') : t('calculator:results.monthlyBreakdown.tableColumns.period.title')}
                            <FaInfoCircle className="ms-2 text-primary info-icon"/>
                          </span>
                  </OverlayTrigger>
                </th>
                <th className={darkMode ? "text-white" : ""}>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-tokens-unlocked">
                      {data.unlockFrequency === 'weekly' ? t('calculator:results.monthlyBreakdown.tableColumns.tokensUnlocked.weekTooltip') : t('calculator:results.monthlyBreakdown.tableColumns.tokensUnlocked.tooltip')}
                    </Tooltip>}
                  >
                          <span className="tooltip-label">
                            {t('calculator:results.monthlyBreakdown.tableColumns.tokensUnlocked.title')}
                            <FaInfoCircle className="ms-2 text-primary info-icon"/>
                          </span>
                  </OverlayTrigger>
                </th>
                {selectedScenarios.map(scenario => (<React.Fragment key={`${scenario}-headers`}>
                  <th className={darkMode ? "text-white" : ""} style={getScenarioStyle(scenario)}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-monthly-revenue-${scenario}`}>
                        {data.unlockFrequency === 'weekly' ? t('calculator:results.monthlyBreakdown.tableColumns.revenue.weekTooltip') : t('calculator:results.monthlyBreakdown.tableColumns.revenue.tooltip')}
                      </Tooltip>}
                    >
                              <span className="tooltip-label">
                                {scenario === 'Bear' ? t('calculator:results.monthlyBreakdown.scenarioLabels.bear') : scenario === 'Base' ? t('calculator:results.monthlyBreakdown.scenarioLabels.base') : scenario === 'Bull' ? t('calculator:results.monthlyBreakdown.scenarioLabels.bull') : scenario} {t('calculator:results.monthlyBreakdown.tableColumns.revenue.title')}
                                <FaInfoCircle className="ms-2 text-primary info-icon"/>
                              </span>
                    </OverlayTrigger>
                  </th>
                  <th className={darkMode ? "text-white" : ""} style={getScenarioStyle(scenario)}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-cumulative-roi-${scenario}`}>
                        {data.unlockFrequency === 'weekly' ? t('calculator:results.monthlyBreakdown.tableColumns.cumulativeRoi.weekTooltip') : t('calculator:results.monthlyBreakdown.tableColumns.cumulativeRoi.tooltip')}
                      </Tooltip>}
                    >
                              <span className="tooltip-label">
                                {scenario === 'Bear' ? t('calculator:results.monthlyBreakdown.scenarioLabels.bear') : scenario === 'Base' ? t('calculator:results.monthlyBreakdown.scenarioLabels.base') : scenario === 'Bull' ? t('calculator:results.monthlyBreakdown.scenarioLabels.bull') : scenario} {t('calculator:results.monthlyBreakdown.tableColumns.cumulativeRoi.title')}
                                <FaInfoCircle className="ms-2 text-primary info-icon"/>
                              </span>
                    </OverlayTrigger>
                  </th>
                </React.Fragment>))}
              </tr>
              </thead>
              <tbody>
              {months.map(month => (<tr key={month}
                                        className={Object.entries(breakEvenMonths).some(([scenario, breakMonth]) => selectedScenarios.includes(scenario) && breakMonth === month) ? 'break-even-row' : ''}>
                <td className={darkMode ? "text-white" : ""}>
                  {data.unlockFrequency === 'weekly' ? (formatDate(month) ? t('calculator:results.monthlyBreakdown.tableColumns.period.weekTitle', {
                    number: getWeekNumber(month), date: formatDate(month)
                  }) : t('calculator:results.monthlyBreakdown.tableColumns.period.weekTitle', {number: getWeekNumber(month)})) : formatTimeUnit(month)}
                  {data.unlockFrequency !== 'weekly' && formatDate(month) &&
                    <div className="calendar-date">{formatDate(month)}</div>}
                </td>
                <td
                  className={darkMode ? "text-white" : ""}>{data.monthlyUnlocks[month].toLocaleString(undefined, {maximumFractionDigits: 2})} {data.tokenName}</td>
                {selectedScenarios.map(scenario => (<React.Fragment key={scenario}>
                  <td
                    className={darkMode ? "text-white" : ""}>{formatCurrency(data.monthlyRevenue[scenario][month])}</td>
                  <td className={data.cumulativeROI[scenario][month] >= 0 ? 'positive-roi' : 'negative-roi'}>
                    {formatPercentage(data.cumulativeROI[scenario][month])}
                    {breakEvenMonths[scenario] === month && (<span
                      className="break-even-badge"> {t('calculator:results.monthlyBreakdown.breakEven')}</span>)}
                  </td>
                </React.Fragment>))}
              </tr>))}
              </tbody>
            </Table>
          </div>

          {/* Total Revenue and ROI Summary */}
          <div className="total-summary m-4">
            <h4
              className={`subsection-title ${darkMode ? "text-white" : ""}`}>{t('calculator:results.monthlyBreakdown.totalSummary.title')}</h4>
            <Row className="summary-cards">
              {selectedScenarios.map(scenario => {
                const totalRevenue = getTotalRevenue(scenario);
                const finalROI = data.totalROI[scenario];
                const roiClass = finalROI >= 0 ? 'positive-roi' : 'negative-roi';

                return (<Col md={4} key={scenario} className="mb-3 d-flex">
                  <Card className={`summary-card ${scenario.toLowerCase()}-summary flex-fill`}
                        style={getScenarioStyle(scenario)}>
                    <Card.Body className="d-flex flex-column">
                      <div
                        className={`summary-title ${darkMode ? "text-white" : ""}`}>{scenario === 'Bear' ? t('calculator:results.monthlyBreakdown.scenarioLabels.bear') : scenario === 'Base' ? t('calculator:results.monthlyBreakdown.scenarioLabels.base') : scenario === 'Bull' ? t('calculator:results.monthlyBreakdown.scenarioLabels.bull') : scenario}</div>
                      <div className="summary-content flex-grow-1">
                        <div className="summary-item">
                                <span
                                  className={darkMode ? "text-white" : ""}>{t('calculator:results.monthlyBreakdown.totalSummary.totalRevenue')}:</span>
                          <span className={darkMode ? "text-white" : ""}>{formatCurrency(totalRevenue)}</span>
                        </div>
                        <div className="summary-item">
                                <span
                                  className={darkMode ? "text-white" : ""}>{t('calculator:results.monthlyBreakdown.totalSummary.finalRoi')}:</span>
                          <span className={roiClass}>{formatPercentage(finalROI)}</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>);
              })}
            </Row>
          </div>

          {/* Advanced Mode Teaser */}
          <div className="advanced-mode-teaser m-4">
            <Alert variant="info" className="teaser-alert">
              <strong>{t('calculator:results.monthlyBreakdown.advancedModeTeaser.title')}</strong> {t('calculator:results.monthlyBreakdown.advancedModeTeaser.features')}
            </Alert>
          </div>
        </div>
        <div className="key-metrics m-4">
          <div>
                <span
                  className="metric-label">{t('calculator:results.monthlyBreakdown.keyMetrics.initialInvestment')}:</span>
            <span
              className="metric-value">{data && data.initialInvestment ? formatCurrency(data.initialInvestment) : formatCurrency(0)}</span>
          </div>
          <div>
                <span
                  className="metric-label">{t('calculator:results.monthlyBreakdown.keyMetrics.tokenAllocation')}:</span>
            <span className="metric-value">
                  {data && data.tokenAllocation ? data.tokenAllocation.toLocaleString() : '0'} {data?.tokenName || ''}
              </span>
          </div>
        </div>
      </>)}
    </div>);
};

export default MonthlyROIBreakdown;
