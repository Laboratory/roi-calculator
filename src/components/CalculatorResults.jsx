import React from 'react';
import { Row, Col, Card, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const CalculatorResults = ({ results }) => {
  const { t } = useTranslation(['calculator', 'common']);
  const {
    tokenName,
    totalROI,
    breakEvenMonths,
    initialInvestment,
    fdvWarnings,
    fdvValues,
    totalSupply
  } = results;

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

  const formatFDV = (value) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else {
      return formatCurrency(value);
    }
  };

  const calculateFinalValue = (roi) => {
    return initialInvestment * (1 + roi / 100);
  };

  const getScenarioClass = (scenario) => {
    return `${scenario.toLowerCase()}-case`;
  };

  return (
    <div className="calculator-results" id="calculator-results">
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="tooltip-roi-scenarios">
            {t('calculator:results.roiScenariosTooltip')}
          </Tooltip>
        }
      >
        <h3 className="section-title tooltip-label">
          {t('calculator:results.roiScenarios')}
          <FaInfoCircle className="ms-2 text-primary info-icon" />
        </h3>
      </OverlayTrigger>

      {fdvWarnings.length > 0 && (
        <Alert variant="warning" className="fdv-warning mb-4">
          <div className="d-flex align-items-center">
            <FaExclamationTriangle className="me-2" />
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="tooltip-fdv-warning">
                  {t('common:warnings.fdvWarning')}
                </Tooltip>
              }
            >
              <strong className="tooltip-label">
                {t('calculator:results.fdvWarning')}
                <FaInfoCircle className="ms-2 text-primary info-icon" />
              </strong>
            </OverlayTrigger>
          </div>
          <ul className="mb-0 mt-2">
            {fdvWarnings.map((warning, index) => (
              <li key={index}>{warning.message}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Row className="scenario-cards">
        {Object.keys(totalROI).map(scenario => {
          const roi = totalROI[scenario];
          const finalValue = calculateFinalValue(roi);
          const roiClass = roi < 0 ? 'negative-roi' : 'positive-roi';

          return (
            <Col md={4} key={scenario} className="d-flex">
              <Card className={`scenario-card ${getScenarioClass(scenario)} flex-fill`}>
                <Card.Body className="d-flex flex-column">
                  <h4 className="scenario-name">{scenario === 'Bear' ? t('calculator:results.scenarios.bearish') :
                   scenario === 'Base' ? t('calculator:results.scenarios.neutral') :
                   scenario === 'Bull' ? t('calculator:results.scenarios.bullish') : scenario}</h4>
                  <div className={`scenario-roi ${roiClass}`}>
                    {roi >= 0 ? '+' : ''}{formatPercentage(roi)}
                  </div>
                  <div className="scenario-details flex-grow-1">
                    <div className="detail-row">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-initial-${scenario}`}>
                            {t('calculator:results.initialInvestmentTooltip')}
                          </Tooltip>
                        }
                      >
                        <span className="tooltip-label">
                          {t('calculator:results.initialInvestment')}
                          <FaInfoCircle className="ms-2 text-primary info-icon" />
                        </span>
                      </OverlayTrigger>
                      <span>{formatCurrency(initialInvestment)}</span>
                    </div>
                    <div className="detail-row">
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={`tooltip-final-${scenario}`}>
                            {t('calculator:results.finalValueTooltip')}
                          </Tooltip>
                        }
                      >
                        <span className="tooltip-label">
                          {t('calculator:results.finalValue')}
                          <FaInfoCircle className="ms-2 text-primary info-icon" />
                        </span>
                      </OverlayTrigger>
                      <span>{formatCurrency(finalValue)}</span>
                    </div>
                    {breakEvenMonths[scenario] !== null && (
                      <div className="detail-row breakeven">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-breakeven-${scenario}`}>
                              {t('calculator:results.breakEvenTooltip')}
                            </Tooltip>
                          }
                        >
                          <span className="tooltip-label">
                            {t('calculator:results.breakEven')}
                            <FaInfoCircle className="ms-2 text-primary info-icon" />
                          </span>
                        </OverlayTrigger>
                        <span>{t('calculator:results.month')} {breakEvenMonths[scenario]}</span>
                      </div>
                    )}
                    {totalSupply && fdvValues && fdvValues[scenario] && (
                      <div className="detail-row fdv">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-fdv-${scenario}`}>
                              {t('common:tooltips.fdvWarning', {
                                scenario: scenario === 'Bear' ? t('calculator:results.scenarios.bearish') :
                                          scenario === 'Base' ? t('calculator:results.scenarios.neutral') :
                                          scenario === 'Bull' ? t('calculator:results.scenarios.bullish') : scenario,
                                fdv: formatFDV(fdvValues[scenario])
                              })}
                            </Tooltip>
                          }
                        >
                          <span className="tooltip-label">
                            {t('calculator:results.impliedFDV')}
                            <FaInfoCircle className="ms-2 text-primary info-icon" />
                          </span>
                        </OverlayTrigger>
                        <span className={fdvValues[scenario] > 500000000 ? 'text-warning' : ''}>
                          {formatFDV(fdvValues[scenario])}
                        </span>
                      </div>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <div className="token-info-section">
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip-token-info">
              {t('calculator:results.tokenInfoTooltip')}
            </Tooltip>
          }
        >
          <h3 className="section-title tooltip-label mt-3">
            {t('calculator:results.tokenInfo')}
            <FaInfoCircle className="ms-2 text-primary info-icon" />
          </h3>
        </OverlayTrigger>
        <Card className="token-info-card">
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="info-item">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-token-amount-result">
                        {t('calculator:results.tokenAmountTooltip')}
                      </Tooltip>
                    }
                  >
                    <span className="info-label tooltip-label">
                      {t('calculator:results.tokenAmount')}
                      <FaInfoCircle className="ms-2 text-primary info-icon" />
                    </span>
                  </OverlayTrigger>
                  <span className="info-value">{Number(results.tokenAmount).toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-purchase-price">
                        {t('calculator:results.purchasePriceTooltip')}
                      </Tooltip>
                    }
                  >
                    <span className="info-label tooltip-label">
                      {t('calculator:results.purchasePrice')}
                      <FaInfoCircle className="ms-2 text-primary info-icon" />
                    </span>
                  </OverlayTrigger>
                  <span className="info-value">${Number(results.tokenPrice).toLocaleString(undefined, { minimumFractionDigits: results.tokenPrice < 0.01 ? 6 : 2 })}</span>
                </div>
                <div className="info-item">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-initial-investment">
                        {t('calculator:results.initialInvestmentTooltip')}
                      </Tooltip>
                    }
                  >
                    <span className="info-label tooltip-label">
                      {t('calculator:results.initialInvestment')}
                      <FaInfoCircle className="ms-2 text-primary info-icon" />
                    </span>
                  </OverlayTrigger>
                  <span className="info-value">{formatCurrency(results.initialInvestment)}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="info-item">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-tge-date-result">
                        {t('calculator:results.tgeDateTooltip')}
                      </Tooltip>
                    }
                  >
                    <span className="info-label tooltip-label">
                      {t('calculator:results.tgeDate')}
                      <FaInfoCircle className="ms-2 text-primary info-icon" />
                    </span>
                  </OverlayTrigger>
                  <span className="info-value">{results.tgeDate ? new Date(results.tgeDate).toLocaleDateString() : 'Not specified'}</span>
                </div>
                <div className="info-item">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-tge-unlock-result">
                        {t('calculator:results.tgeUnlockTooltip')}
                      </Tooltip>
                    }
                  >
                    <span className="info-label tooltip-label">
                      {t('calculator:results.tgeUnlock')}
                      <FaInfoCircle className="ms-2 text-primary info-icon" />
                    </span>
                  </OverlayTrigger>
                  <span className="info-value">{results.tgeUnlock}%</span>
                </div>
                <div className="info-item">
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id="tooltip-unlock-periods">
                        {t('calculator:results.unlockPeriodsTooltip')}
                      </Tooltip>
                    }
                  >
                    <span className="info-label tooltip-label">
                      {t('calculator:results.unlockPeriods')}
                      <FaInfoCircle className="ms-2 text-primary info-icon" />
                    </span>
                  </OverlayTrigger>
                  <span className="info-value">{results.unlockPeriods.length}</span>
                </div>
                {results.totalSupply && (
                  <div className="info-item">
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-total-supply-result">
                          {t('common:tokenomics.totalSupplyTooltip')}
                        </Tooltip>
                      }
                    >
                      <span className="info-label tooltip-label">
                        {t('common:tokenomics.totalSupply')}
                        <FaInfoCircle className="ms-2 text-primary info-icon" />
                      </span>
                    </OverlayTrigger>
                    <span className="info-value">{Number(results.totalSupply).toLocaleString()}</span>
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CalculatorResults;
