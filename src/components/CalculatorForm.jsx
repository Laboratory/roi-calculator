import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaTrash } from 'react-icons/fa';
import { calculateResults } from '../utils/calculator';

const DEFAULT_UNLOCK_PERIODS = [
  { month: 1, percentage: 15 },
  { month: 3, percentage: 25 },
  { month: 6, percentage: 25 },
  { month: 12, percentage: 25 }
];

const CalculatorForm = ({ onCalculate }) => {
  const [formData, setFormData] = useState({
    investmentAmount: '1000',
    tokenPrice: '0.1',
    tokenName: 'TOKEN',
    tgeUnlock: 10,
    tgeDate: null,
    totalSupply: '',
    tokenAmount: ''
  });
  
  const [priceScenarios, setPriceScenarios] = useState([
    { name: 'Bear', price: '0.05' },
    { name: 'Base', price: '0.2' },
    { name: 'Bull', price: '0.5' }
  ]);
  
  const [unlockPeriods, setUnlockPeriods] = useState(DEFAULT_UNLOCK_PERIODS);
  const [errors, setErrors] = useState({});
  const [isTokenAmountCalculated, setIsTokenAmountCalculated] = useState(false);
  
  // Auto-calculate token amount when investment and price are provided
  useEffect(() => {
    if (formData.investmentAmount && formData.tokenPrice) {
      const calculatedAmount = Number(formData.investmentAmount) / Number(formData.tokenPrice);
      setIsTokenAmountCalculated(true);
      
      // Only update if user hasn't manually entered a value
      if (!formData.tokenAmount) {
        setFormData(prev => ({
          ...prev,
          tokenAmount: calculatedAmount.toString()
        }));
      }
    } else {
      setIsTokenAmountCalculated(false);
    }
  }, [formData.investmentAmount, formData.tokenPrice]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If user is manually entering token amount, disable auto-calculation
    if (name === 'tokenAmount' && value) {
      setIsTokenAmountCalculated(false);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      tgeDate: date
    });
  };
  
  const handleScenarioChange = (index, field, value) => {
    const updatedScenarios = [...priceScenarios];
    updatedScenarios[index][field] = value;
    setPriceScenarios(updatedScenarios);
    
    // Clear scenario errors
    if (errors.scenarios) {
      setErrors({
        ...errors,
        scenarios: null
      });
    }
  };
  
  const handleUnlockPeriodChange = (index, field, value) => {
    const updatedPeriods = [...unlockPeriods];
    updatedPeriods[index][field] = Number(value);
    setUnlockPeriods(updatedPeriods);
    
    // Clear unlock period errors
    if (errors.unlockPeriods) {
      setErrors({
        ...errors,
        unlockPeriods: null
      });
    }
  };
  
  const addUnlockPeriod = () => {
    setUnlockPeriods([
      ...unlockPeriods,
      { month: unlockPeriods.length > 0 ? unlockPeriods[unlockPeriods.length - 1].month + 3 : 1, percentage: 10 }
    ]);
  };
  
  const removeUnlockPeriod = (index) => {
    if (unlockPeriods.length <= 1) return;
    const updatedPeriods = unlockPeriods.filter((_, i) => i !== index);
    setUnlockPeriods(updatedPeriods);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.investmentAmount) newErrors.investmentAmount = 'Investment amount is required';
    if (!formData.tokenPrice) newErrors.tokenPrice = 'Token price is required';
    if (!formData.tokenName) newErrors.tokenName = 'Token name is required';
    if (formData.tgeUnlock < 0 || formData.tgeUnlock > 100) newErrors.tgeUnlock = 'TGE unlock must be between 0 and 100';
    
    // Validate scenarios
    const hasValidScenarios = priceScenarios.every(scenario => 
      scenario.name && scenario.price !== '' && parseFloat(scenario.price) >= 0
    );
    
    if (!hasValidScenarios) {
      newErrors.scenarios = 'All scenarios must have a name and valid price';
    }
    
    // Validate unlock periods
    const hasValidUnlockPeriods = unlockPeriods.every(period => 
      period.month >= 0 && period.percentage >= 0 && period.percentage <= 100
    );
    
    if (!hasValidUnlockPeriods) {
      newErrors.unlockPeriods = 'All unlock periods must have valid month and percentage values';
    }
    
    // Check if total percentage (including TGE) equals 100%
    const totalPercentage = Number(formData.tgeUnlock) + unlockPeriods.reduce((sum, period) => sum + Number(period.percentage), 0);
    if (totalPercentage !== 100) {
      newErrors.totalPercentage = `Total unlock percentage must equal 100%. Current total: ${totalPercentage}%`;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Calculate token amount if not provided
      let tokenAmount = formData.tokenAmount;
      if (!tokenAmount && formData.investmentAmount && formData.tokenPrice) {
        tokenAmount = formData.investmentAmount / formData.tokenPrice;
      }
      
      const results = calculateResults({
        ...formData,
        tokenAmount,
        priceScenarios,
        unlockPeriods
      });
      
      onCalculate(results);
    }
  };
  
  // Calculate estimated token amount for display
  const getEstimatedTokenAmount = () => {
    if (formData.investmentAmount && formData.tokenPrice) {
      return Number(formData.investmentAmount) / Number(formData.tokenPrice);
    }
    return null;
  };
  
  return (
    <div className="calculator-form">
      <div className="form-section">
        <h3 className="section-title">Investment Details</h3>
        <div className="section-content">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Initial Investment (USD)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="investmentAmount"
                      value={formData.investmentAmount}
                      onChange={handleInputChange}
                      placeholder="e.g., 1000"
                      isInvalid={!!errors.investmentAmount}
                    />
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    {errors.investmentAmount}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Token Price at Purchase (USD)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="tokenPrice"
                      value={formData.tokenPrice}
                      onChange={handleInputChange}
                      placeholder="e.g., 0.1"
                      step="0.0000001"
                      isInvalid={!!errors.tokenPrice}
                    />
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    {errors.tokenPrice}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Token Name/Ticker</Form.Label>
                  <Form.Control
                    type="text"
                    name="tokenName"
                    value={formData.tokenName}
                    onChange={handleInputChange}
                    placeholder="e.g., BTC"
                    isInvalid={!!errors.tokenName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.tokenName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Token Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="tokenAmount"
                    value={formData.tokenAmount}
                    onChange={handleInputChange}
                    placeholder="Enter manually or auto-calculate"
                    disabled={isTokenAmountCalculated}
                  />
                  {isTokenAmountCalculated && (
                    <Form.Text className="text-muted">
                      Estimated: {Number(getEstimatedTokenAmount()).toLocaleString(undefined, { maximumFractionDigits: 2 })} tokens
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>TGE Date (Optional)</Form.Label>
                  <DatePicker
                    selected={formData.tgeDate}
                    onChange={handleDateChange}
                    className="form-control"
                    placeholderText="dd.mm.yyyy"
                    dateFormat="dd.MM.yyyy"
                  />
                  <Form.Text className="text-muted">
                    If provided, results will show actual calendar dates
                  </Form.Text>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Token Supply (Optional)</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalSupply"
                    value={formData.totalSupply}
                    onChange={handleInputChange}
                    placeholder="e.g., 100000000"
                  />
                  <Form.Text className="text-muted">
                    Used to calculate FDV and provide warnings
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="form-section mt-4">
              <h3 className="section-title">Price Scenarios</h3>
              <div className="section-content">
                {priceScenarios.map((scenario, index) => (
                  <Row key={index} className="mb-3">
                    <Col md={6}>
                      <Form.Label>{scenario.name} Case Price (USD)</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          value={scenario.price}
                          onChange={(e) => handleScenarioChange(index, 'price', e.target.value)}
                          placeholder="Token price"
                          step="0.0000001"
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                ))}
              </div>
            </div>
            
            <div className="form-section mt-4">
              <h3 className="section-title">Unlock Schedule</h3>
              <div className="section-content">
                {errors.totalPercentage && (
                  <Alert variant="danger">{errors.totalPercentage}</Alert>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Label>TGE Unlock Percentage (%)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      name="tgeUnlock"
                      value={formData.tgeUnlock}
                      onChange={handleInputChange}
                      placeholder="e.g., 10"
                      min="0"
                      max="100"
                      isInvalid={!!errors.tgeUnlock}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                  <Form.Control.Feedback type="invalid">
                    {errors.tgeUnlock}
                  </Form.Control.Feedback>
                </Form.Group>
                
                {unlockPeriods.map((period, index) => (
                  <Row key={index} className="mb-3 align-items-end">
                    <Col md={5}>
                      <Form.Label>Month</Form.Label>
                      <Form.Control
                        type="number"
                        value={period.month}
                        onChange={(e) => handleUnlockPeriodChange(index, 'month', e.target.value)}
                        min="1"
                      />
                    </Col>
                    <Col md={5}>
                      <Form.Label>Percentage (%)</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          value={period.percentage}
                          onChange={(e) => handleUnlockPeriodChange(index, 'percentage', e.target.value)}
                          min="0"
                          max="100"
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                    </Col>
                    <Col md={2}>
                      <Button 
                        variant="danger" 
                        onClick={() => removeUnlockPeriod(index)}
                        disabled={unlockPeriods.length <= 1}
                        className="w-100"
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                
                <Button variant="outline-primary" onClick={addUnlockPeriod} className="mt-2">
                  Add Unlock Period
                </Button>
              </div>
            </div>
            
            <div className="d-grid mt-4">
              <Button variant="primary" type="submit" size="lg">
                Calculate ROI
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CalculatorForm;
