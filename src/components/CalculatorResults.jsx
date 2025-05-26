import React from 'react';
import { Row, Col, Card, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const CalculatorResults = ({ results }) => {
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
    <div className="calculator-results">
      <h3 className="section-title">
        ROI Scenarios
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip-roi-scenarios">
              These cards show your potential returns in different market scenarios (Bear, Base, Bull). Each scenario uses different token price predictions to calculate your ROI.
            </Tooltip>
          }
        >
          <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
        </OverlayTrigger>
      </h3>

      {fdvWarnings.length > 0 && (
        <Alert variant="warning" className="fdv-warning mb-4">
          <div className="d-flex align-items-center">
            <FaExclamationTriangle className="me-2" />
            <strong>
              FDV Warning:
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-fdv-warning">
                    Fully Diluted Valuation (FDV) warnings indicate when a price scenario would result in an unrealistically high market cap for the token, which may be less likely to occur.
                  </Tooltip>
                }
              >
                <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
              </OverlayTrigger>
            </strong>
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
                  <h4 className="scenario-name">{scenario} Case</h4>
                  <div className={`scenario-roi ${roiClass}`}>
                    {roi >= 0 ? '+' : ''}{formatPercentage(roi)}
                  </div>
                  <div className="scenario-details flex-grow-1">
                    <div className="detail-row">
                      <span>
                        Initial:
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-initial-${scenario}`}>
                              Your initial investment amount in USD.
                            </Tooltip>
                          }
                        >
                          <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                        </OverlayTrigger>
                      </span>
                      <span>{formatCurrency(initialInvestment)}</span>
                    </div>
                    <div className="detail-row">
                      <span>
                        Final:
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-final-${scenario}`}>
                              The estimated final value of your investment in this price scenario.
                            </Tooltip>
                          }
                        >
                          <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                        </OverlayTrigger>
                      </span>
                      <span>{formatCurrency(finalValue)}</span>
                    </div>
                    {breakEvenMonths[scenario] !== null && (
                      <div className="detail-row breakeven">
                        <span>
                          Break even:
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-breakeven-${scenario}`}>
                                The month when your investment reaches its original value, accounting for token unlocks and price changes.
                              </Tooltip>
                            }
                          >
                            <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                          </OverlayTrigger>
                        </span>
                        <span>Month {breakEvenMonths[scenario]}</span>
                      </div>
                    )}
                    {totalSupply && fdvValues && fdvValues[scenario] && (
                      <div className="detail-row fdv">
                        <span>
                          Implied FDV:
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-fdv-${scenario}`}>
                                Fully Diluted Valuation - the theoretical market cap if all tokens were in circulation at this price. Values over $500M are highlighted as potentially less realistic.
                              </Tooltip>
                            }
                          >
                            <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                          </OverlayTrigger>
                        </span>
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
        <h3 className="section-title mt-3">
          Token Information
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-token-info">
                Key details about your token investment, including amount, price, and vesting schedule information.
              </Tooltip>
            }
          >
            <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
          </OverlayTrigger>
        </h3>
        <Card className="token-info-card">
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="info-item">
                  <span className="info-label">
                    Token Amount:
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-token-amount-result">
                          The total number of tokens you purchased with your investment.
                        </Tooltip>
                      }
                    >
                      <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                    </OverlayTrigger>
                  </span>
                  <span className="info-value">{Number(results.tokenAmount).toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    Purchase Price:
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-purchase-price">
                          The price per token in USD at the time of your investment.
                        </Tooltip>
                      }
                    >
                      <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                    </OverlayTrigger>
                  </span>
                  <span className="info-value">${Number(results.tokenPrice).toLocaleString(undefined, { minimumFractionDigits: results.tokenPrice < 0.01 ? 6 : 2 })}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    Initial Investment:
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-initial-investment">
                          The total amount in USD you invested in this token.
                        </Tooltip>
                      }
                    >
                      <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                    </OverlayTrigger>
                  </span>
                  <span className="info-value">{formatCurrency(results.initialInvestment)}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="info-item">
                  <span className="info-label">
                    TGE Date:
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-tge-date-result">
                          Token Generation Event date - when your tokens were first created and the vesting schedule began.
                        </Tooltip>
                      }
                    >
                      <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                    </OverlayTrigger>
                  </span>
                  <span className="info-value">{results.tgeDate ? new Date(results.tgeDate).toLocaleDateString() : 'Not specified'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    TGE Unlock:
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-tge-unlock-result">
                          The percentage of your tokens that were immediately available at the Token Generation Event.
                        </Tooltip>
                      }
                    >
                      <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                    </OverlayTrigger>
                  </span>
                  <span className="info-value">{results.tgeUnlock}%</span>
                </div>
                <div className="info-item">
                  <span className="info-label">
                    Unlock Periods:
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id="tooltip-unlock-periods">
                          The number of vesting periods in your token's unlock schedule after the initial TGE unlock.
                        </Tooltip>
                      }
                    >
                      <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                    </OverlayTrigger>
                  </span>
                  <span className="info-value">{results.unlockPeriods.length}</span>
                </div>
                {results.totalSupply && (
                  <div className="info-item">
                    <span className="info-label">
                      Total Supply:
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id="tooltip-total-supply-result">
                            The total number of tokens that will ever exist for this project. Used to calculate the Fully Diluted Valuation (FDV).
                          </Tooltip>
                        }
                      >
                        <span className="ms-2"><FaInfoCircle className="text-primary info-icon" /></span>
                      </OverlayTrigger>
                    </span>
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
