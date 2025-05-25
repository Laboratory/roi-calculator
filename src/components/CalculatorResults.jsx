import React from 'react';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

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
  
  return (
    <div className="calculator-results">
      <h3 className="section-title">ROI Scenarios</h3>
      
      {fdvWarnings.length > 0 && (
        <Alert variant="warning" className="fdv-warning mb-4">
          <div className="d-flex align-items-center">
            <FaExclamationTriangle className="me-2" />
            <strong>FDV Warning:</strong>
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
              <Card className={`scenario-card ${scenario.toLowerCase()}-case flex-fill`}>
                <Card.Body className="d-flex flex-column">
                  <h4 className="scenario-name">{scenario} Case</h4>
                  <div className={`scenario-roi ${roiClass}`}>
                    {roi >= 0 ? '+' : ''}{formatPercentage(roi)}
                  </div>
                  <div className="scenario-details flex-grow-1">
                    <div className="detail-row">
                      <span>Initial:</span>
                      <span>{formatCurrency(initialInvestment)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Final:</span>
                      <span>{formatCurrency(finalValue)}</span>
                    </div>
                    {breakEvenMonths[scenario] !== null && (
                      <div className="detail-row breakeven">
                        <span>Break even:</span>
                        <span>Month {breakEvenMonths[scenario]}</span>
                      </div>
                    )}
                    {totalSupply && fdvValues && fdvValues[scenario] && (
                      <div className="detail-row fdv">
                        <span>Implied FDV:</span>
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
        <h3 className="section-title">Token Information</h3>
        <Card className="token-info-card">
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="info-item">
                  <span className="info-label">Token Amount:</span>
                  <span className="info-value">{Number(results.tokenAmount).toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Purchase Price:</span>
                  <span className="info-value">${Number(results.tokenPrice).toLocaleString(undefined, { minimumFractionDigits: results.tokenPrice < 0.01 ? 6 : 2 })}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Initial Investment:</span>
                  <span className="info-value">{formatCurrency(results.initialInvestment)}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="info-item">
                  <span className="info-label">TGE Date:</span>
                  <span className="info-value">{results.tgeDate ? new Date(results.tgeDate).toLocaleDateString() : 'Not specified'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">TGE Unlock:</span>
                  <span className="info-value">{results.tgeUnlock}%</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Unlock Periods:</span>
                  <span className="info-value">{results.unlockPeriods.length}</span>
                </div>
                {results.totalSupply && (
                  <div className="info-item">
                    <span className="info-label">Total Supply:</span>
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
