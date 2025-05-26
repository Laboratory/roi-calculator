import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaInfoCircle } from 'react-icons/fa';
import { calculateResults } from '../utils/calculator';

const DEFAULT_UNLOCK_PERIODS = [{month: 1, percentage: 15}, {month: 3, percentage: 25}, {
  month: 6, percentage: 25
}, {month: 12, percentage: 25}];

const CalculatorForm = ({onCalculate}) => {
  const [formData, setFormData] = useState({
    investmentAmount: '1000',
    tokenPrice: '0.1',
    tokenName: 'TOKEN',
    tgeUnlock: 10,
    tgeDate: null,
    totalSupply: '',
    tokenAmount: '',
    cliff: 3,
    vestingDuration: 9,
    unlockFrequency: 'monthly',
    supplyOption: 'custom'
  });

  const [priceScenarios, setPriceScenarios] = useState([{name: 'Bear', roi: '-90', price: '0.05'}, {
    name: 'Base', roi: '0', price: '0.2'
  }, {name: 'Bull', roi: '300', price: '0.5'}]);

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
          ...prev, tokenAmount: calculatedAmount.toString()
        }));
      }
    } else {
      setIsTokenAmountCalculated(false);
    }
  }, [formData.investmentAmount, formData.tokenPrice]);

  // Initialize unlock schedule with default values
  useEffect(() => {
    const generatedSchedule = generateUnlockSchedule();
    setUnlockPeriods(generatedSchedule);
  }, []);

  // Update unlock schedule when relevant parameters change
  useEffect(() => {
    const generatedSchedule = generateUnlockSchedule();
    setUnlockPeriods(generatedSchedule);
  }, [formData.tgeUnlock, formData.cliff, formData.vestingDuration, formData.unlockFrequency]);

  const generateUnlockSchedule = () => {
    const {tgeUnlock, cliff, vestingDuration, unlockFrequency} = formData;

    // Calculate remaining percentage after TGE
    const remainingPercentage = 100 - Number(tgeUnlock);

    // Generate unlock periods based on frequency
    const generatedPeriods = [];

    if (unlockFrequency === 'monthly') {
      // Monthly unlocks
      const numberOfUnlocks = Number(vestingDuration);
      const percentagePerUnlock = remainingPercentage / numberOfUnlocks;

      // Start from cliff month
      for (let i = 0; i < numberOfUnlocks; i++) {
        generatedPeriods.push({
          month: Number(cliff) + i + 1, percentage: parseFloat(percentagePerUnlock.toFixed(2))
        });
      }
    } else if (unlockFrequency === 'weekly') {
      // Weekly unlocks
      // Calculate total weeks in vesting duration (approx 4.33 weeks per month)
      const totalWeeks = Math.floor(Number(vestingDuration) * 4.33);
      const percentagePerUnlock = parseFloat((remainingPercentage / totalWeeks).toFixed(4));

      // Start from cliff
      const cliffInWeeks = Math.floor(Number(cliff) * 4.33);

      // Generate weekly unlock periods
      for (let i = 0; i < totalWeeks; i++) {
        // Calculate month equivalent for this week (for display)
        const weekNumber = i + 1;
        const monthEquivalent = Number(cliff) + (weekNumber / 4.33);

        generatedPeriods.push({
          month: parseFloat(monthEquivalent.toFixed(2)),
          percentage: percentagePerUnlock,
          weekNumber: cliffInWeeks + i + 1 // Store the actual week number
        });
      }
    }

    return generatedPeriods;
  };

  // Calculate scenario prices based on ROI inputs
  const calculateScenarioPrices = () => {
    const basePrice = Number(formData.tokenPrice);
    const updatedScenarios = priceScenarios.map(scenario => {
      const roi = Number(scenario.roi);
      const calculatedPrice = basePrice * (1 + (roi / 100));
      return {
        ...scenario, price: calculatedPrice.toString()
      };
    });

    setPriceScenarios(updatedScenarios);
  };

  // Update scenario prices when token price or ROI values change
  useEffect(() => {
    if (formData.tokenPrice) {
      calculateScenarioPrices();
    }
  }, [formData.tokenPrice]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;

    // Handle supply option changes
    if (name === 'supplyOption') {
      let totalSupply = '';

      switch (value) {
        case '10billion':
          totalSupply = '10000000000';
          break;
        case '1billion':
          totalSupply = '1000000000';
          break;
        case '100million':
          totalSupply = '100000000';
          break;
        default:
          // Keep existing value for custom
          totalSupply = formData.totalSupply;
      }

      setFormData(prev => ({
        ...prev, supplyOption: value, totalSupply
      }));
      return;
    }

    setFormData(prev => ({
      ...prev, [name]: value
    }));

    // Clear related errors
    if (errors[name]) {
      setErrors({
        ...errors, [name]: null
      });
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev, tgeDate: date
    }));
  };

  const handleScenarioChange = (index, field, value) => {
    const updatedScenarios = [...priceScenarios];
    updatedScenarios[index][field] = value;
    setPriceScenarios(updatedScenarios);

    // If ROI is changed, recalculate the price
    if (field === 'roi' && formData.tokenPrice) {
      const roi = Number(value);
      const basePrice = Number(formData.tokenPrice);
      const calculatedPrice = basePrice * (1 + (roi / 100));
      updatedScenarios[index].price = calculatedPrice.toString();
      setPriceScenarios(updatedScenarios);
    }

    // Clear scenario errors
    if (errors.scenarios) {
      setErrors({
        ...errors, scenarios: null
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
        ...errors, unlockPeriods: null
      });
    }
  };

  const handleAddUnlockPeriod = () => {
    const lastPeriod = unlockPeriods[unlockPeriods.length - 1] || {month: 0};
    const newPeriod = {
      month: lastPeriod.month + 1, percentage: 10
    };
    setUnlockPeriods([...unlockPeriods, newPeriod]);
  };

  const handleRemoveUnlockPeriod = (index) => {
    const updatedPeriods = [...unlockPeriods];
    updatedPeriods.splice(index, 1);
    setUnlockPeriods(updatedPeriods);
  };

  const getEstimatedTokenAmount = () => {
    if (formData.investmentAmount && formData.tokenPrice) {
      return Number(formData.investmentAmount) / Number(formData.tokenPrice);
    }
    return 0;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate investment amount
    if (!formData.investmentAmount || Number(formData.investmentAmount) <= 0) {
      newErrors.investmentAmount = 'Investment amount is required and must be greater than 0';
    }

    // Validate token price
    if (!formData.tokenPrice || Number(formData.tokenPrice) <= 0) {
      newErrors.tokenPrice = 'Token price is required and must be greater than 0';
    }

    // Validate token name
    if (!formData.tokenName) {
      newErrors.tokenName = 'Token name is required';
    }

    // Validate token amount
    if (!formData.tokenAmount || Number(formData.tokenAmount) <= 0) {
      newErrors.tokenAmount = 'Token amount is required and must be greater than 0';
    }

    // Validate TGE unlock
    if (formData.tgeUnlock === '' || Number(formData.tgeUnlock) < 0 || Number(formData.tgeUnlock) > 100) {
      newErrors.tgeUnlock = 'TGE unlock must be between 0 and 100';
    }

    // Validate scenarios
    const hasValidScenarios = priceScenarios.every(scenario => scenario.name && scenario.roi !== '' && parseFloat(scenario.roi) >= -100);

    if (!hasValidScenarios) {
      newErrors.scenarios = 'All scenarios must have a name and valid ROI';
    }

    // Validate unlock periods
    const hasValidUnlockPeriods = unlockPeriods.every(period => period.month > 0 && period.percentage >= 0 && period.percentage <= 100);

    if (!hasValidUnlockPeriods) {
      newErrors.unlockPeriods = 'All unlock periods must have a valid month and percentage';
    }

    // Validate total percentage
    const totalPercentage = Number(formData.tgeUnlock) + unlockPeriods.reduce((sum, period) => sum + Number(period.percentage), 0);

    if (Math.abs(totalPercentage - 100) > 0.1) { // Allow small rounding errors
      newErrors.totalPercentage = `Total unlock percentage must equal 100%. Current total: ${totalPercentage.toFixed(2)}%`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (validateForm()) {
      const results = calculateResults({
        ...formData, priceScenarios, unlockPeriods, unlockFrequency: formData.unlockFrequency
      });
      onCalculate(results);
    }
  };

  const getUnlockPeriodLabel = () => {
    if (formData.unlockFrequency === 'weekly') {
      return 'Week #';
    } else {
      return 'Month';
    }
  };

  // Format date for unlock schedule based on frequency
  const formatUnlockDate = (timeUnit) => {
    if (!formData.tgeDate) return null;

    const date = new Date(formData.tgeDate);

    if (formData.unlockFrequency === 'weekly') {
      // Add weeks (approximately 7 days per week)
      date.setDate(date.getDate() + (timeUnit * 7));
    } else {
      // Add months
      date.setMonth(date.getMonth() + parseInt(timeUnit));
    }

    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  return (<div className="calculator-form">
    <div className="form-section">
      <h3 className="section-title">Investment Details</h3>
      <div className="section-content">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-investment-amount">
                  The amount of money you invested in USD.
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  Investment Amount (USD)
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 1000"
                  step="0.01"
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
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-token-price">
                  The price per token in USD at the time of your investment.
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  Token Price (USD)
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
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
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-token-name">
                  The name or ticker of the token you invested in.
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  Token Name/Ticker
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
              <Form.Control
                type="text"
                name="tokenName"
                value={formData.tokenName}
                onChange={handleInputChange}
                placeholder="e.g., ETH"
                isInvalid={!!errors.tokenName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.tokenName}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-token-amount">
                  The number of tokens you purchased. This is automatically calculated based on your investment
                  amount and token price, but you can override it if needed.
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  Token Amount
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
              <Form.Control
                type="number"
                name="tokenAmount"
                value={formData.tokenAmount}
                onChange={handleInputChange}
                placeholder="e.g., 10000"
                step="0.01"
                isInvalid={!!errors.tokenAmount}
              />
              {isTokenAmountCalculated && (<Form.Text className="text-muted">
                Estimated: {Number(getEstimatedTokenAmount()).toLocaleString(undefined, {maximumFractionDigits: 2})} tokens
              </Form.Text>)}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-tge-date">
                  Token Generation Event date - when your tokens were first created and the vesting schedule
                  began.
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  TGE Date
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
              <DatePicker
                selected={formData.tgeDate}
                onChange={handleDateChange}
                className="form-control"
                placeholderText="dd.mm.yyyy"
                dateFormat="dd.MM.yyyy"
              />
              <div>
                <Form.Text className="text-muted">
                  If provided, results will show actual calendar dates
                </Form.Text>
              </div>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-total-supply">
                  The total number of tokens that will ever exist for this project. Used to calculate the Fully
                  Diluted Valuation (FDV).
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  Total Token Supply (Optional)
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
              <Form.Group>
                <Form.Select
                  name="supplyOption"
                  value={formData.supplyOption}
                  onChange={handleInputChange}
                  className="mb-2"
                >
                  <option value="10billion">10 Billion (10,000,000,000)</option>
                  <option value="1billion">1 Billion (1,000,000,000)</option>
                  <option value="100million">100 Million (100,000,000)</option>
                  <option value="custom">Custom</option>
                </Form.Select>

                {formData.supplyOption === 'custom' && (<Form.Control
                  type="number"
                  name="totalSupply"
                  value={formData.totalSupply}
                  onChange={handleInputChange}
                  placeholder="e.g., 100000000"
                />)}
              </Form.Group>

              <Form.Text className="text-muted">
                Used to calculate FDV and provide warnings
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <div className="form-section mt-4">
          <h3 className="section-title">Investment Details</h3>
          <div className="section-content">
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-investment-amount">
                      The amount of money you invested in USD.
                    </Tooltip>}
                  >
                    <Form.Label className="tooltip-label">
                      Investment Amount (USD)
                      <FaInfoCircle className="ms-2 text-primary info-icon"/>
                    </Form.Label>
                  </OverlayTrigger>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="investmentAmount"
                      value={formData.investmentAmount}
                      onChange={handleInputChange}
                      placeholder="e.g., 1000"
                      step="0.01"
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
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-token-price">
                      The price per token in USD at the time of your investment.
                    </Tooltip>}
                  >
                    <Form.Label className="tooltip-label">
                      Token Price (USD)
                      <FaInfoCircle className="ms-2 text-primary info-icon"/>
                    </Form.Label>
                  </OverlayTrigger>
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
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-token-name">
                      The name or ticker of the token you invested in.
                    </Tooltip>}
                  >
                    <Form.Label className="tooltip-label">
                      Token Name/Ticker
                      <FaInfoCircle className="ms-2 text-primary info-icon"/>
                    </Form.Label>
                  </OverlayTrigger>
                  <Form.Control
                    type="text"
                    name="tokenName"
                    value={formData.tokenName}
                    onChange={handleInputChange}
                    placeholder="e.g., ETH"
                    isInvalid={!!errors.tokenName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.tokenName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-token-amount">
                      The number of tokens you purchased. This is automatically calculated based on your investment
                      amount and token price, but you can override it if needed.
                    </Tooltip>}
                  >
                    <Form.Label className="tooltip-label">
                      Token Amount
                      <FaInfoCircle className="ms-2 text-primary info-icon"/>
                    </Form.Label>
                  </OverlayTrigger>
                  <Form.Control
                    type="number"
                    name="tokenAmount"
                    value={formData.tokenAmount}
                    onChange={handleInputChange}
                    placeholder="e.g., 10000"
                    step="0.01"
                    isInvalid={!!errors.tokenAmount}
                  />
                  {isTokenAmountCalculated && (<Form.Text className="text-muted">
                    Estimated: {Number(getEstimatedTokenAmount()).toLocaleString(undefined, {maximumFractionDigits: 2})} tokens
                  </Form.Text>)}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-tge-date">
                      Token Generation Event date - when your tokens were first created and the vesting schedule
                      began.
                    </Tooltip>}
                  >
                    <Form.Label className="tooltip-label">
                      TGE Date
                      <FaInfoCircle className="ms-2 text-primary info-icon"/>
                    </Form.Label>
                  </OverlayTrigger>
                  <DatePicker
                    selected={formData.tgeDate}
                    onChange={handleDateChange}
                    className="form-control"
                    placeholderText="dd.mm.yyyy"
                    dateFormat="dd.MM.yyyy"
                  />
                  <div>
                    <Form.Text className="text-muted">
                      If provided, results will show actual calendar dates
                    </Form.Text>
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-total-supply">
                      The total number of tokens that will ever exist for this project. Used to calculate the Fully
                      Diluted Valuation (FDV).
                    </Tooltip>}
                  >
                    <Form.Label className="tooltip-label">
                      Total Token Supply (Optional)
                      <FaInfoCircle className="ms-2 text-primary info-icon"/>
                    </Form.Label>
                  </OverlayTrigger>
                  <Form.Group>
                    <Form.Select
                      name="supplyOption"
                      value={formData.supplyOption}
                      onChange={handleInputChange}
                      className="mb-2"
                    >
                      <option value="10billion">10 Billion (10,000,000,000)</option>
                      <option value="1billion">1 Billion (1,000,000,000)</option>
                      <option value="100million">100 Million (100,000,000)</option>
                      <option value="custom">Custom</option>
                    </Form.Select>

                    {formData.supplyOption === 'custom' && (<Form.Control
                      type="number"
                      name="totalSupply"
                      value={formData.totalSupply}
                      onChange={handleInputChange}
                      placeholder="e.g., 100000000"
                    />)}
                  </Form.Group>

                  <Form.Text className="text-muted">
                    Used to calculate FDV and provide warnings
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="form-section mt-4">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-price-scenarios">
                  Define different market scenarios to see potential returns in various market conditions.
                </Tooltip>}
              >
                <h3 className="section-title tooltip-label">
                  Market ROI Scenarios
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </h3>
              </OverlayTrigger>
              <div className="section-content">
                {priceScenarios.map((scenario, index) => (<Row key={index} className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-scenario-${index}`}>
                          {scenario.name === 'Bear' && 'We assume your token trades at 90% below your presale price during your entire vesting period.'}
                          {scenario.name === 'Base' && 'No major price change. Token price stays near your purchase level.'}
                          {scenario.name === 'Bull' && 'Market surges. We assume Token trades at a multiple of your presale price over your vesting period.'}
                        </Tooltip>}
                      >
                        <Form.Label className="tooltip-label">
                          {scenario.name} Market Return
                          <FaInfoCircle className="ms-2 text-primary info-icon"/>
                        </Form.Label>
                      </OverlayTrigger>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          value={scenario.roi}
                          onChange={(e) => handleScenarioChange(index, 'roi', e.target.value)}
                          placeholder="Return percentage"
                          step="1"
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Calculated price: ${parseFloat(scenario.price).toFixed(6)}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>))}
              </div>
            </div>

            <div className="form-section mt-4">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-unlock-schedule">
                  Define how your tokens will be released over time. Most token investments have vesting periods
                  where
                  tokens are gradually unlocked. This significantly impacts your ROI timeline.
                </Tooltip>}
              >
                <h3 className="section-title tooltip-label">
                  Unlock Schedule
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </h3>
              </OverlayTrigger>
              <div className="section-content">
                {errors.totalPercentage && (<Alert variant="danger">{errors.totalPercentage}</Alert>)}

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-tge-unlock">
                          The percentage of your tokens that were immediately available at the Token Generation
                          Event.
                        </Tooltip>}
                      >
                        <Form.Label className="tooltip-label">
                          TGE Unlock (%)
                          <FaInfoCircle className="ms-2 text-primary info-icon"/>
                        </Form.Label>
                      </OverlayTrigger>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          name="tgeUnlock"
                          value={formData.tgeUnlock}
                          onChange={handleInputChange}
                          placeholder="e.g., 10"
                          min="0"
                          max="100"
                          step="0.1"
                          isInvalid={!!errors.tgeUnlock}
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        {errors.tgeUnlock}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-cliff">
                          The number of months after TGE before tokens start to unlock.
                        </Tooltip>}
                      >
                        <Form.Label className="tooltip-label">
                          Cliff (months)
                          <FaInfoCircle className="ms-2 text-primary info-icon"/>
                        </Form.Label>
                      </OverlayTrigger>
                      <Form.Control
                        type="number"
                        name="cliff"
                        value={formData.cliff}
                        onChange={handleInputChange}
                        min="0"
                        step="1"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-vesting-duration">
                          The total duration in months over which tokens will vest after the cliff period.
                        </Tooltip>}
                      >
                        <Form.Label className="tooltip-label">
                          Vesting Duration (months)
                          <FaInfoCircle className="ms-2 text-primary info-icon"/>
                        </Form.Label>
                      </OverlayTrigger>
                      <Form.Control
                        type="number"
                        name="vestingDuration"
                        value={formData.vestingDuration}
                        onChange={handleInputChange}
                        min="1"
                        step="1"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-unlock-frequency">
                          How frequently tokens unlock during the vesting period.
                        </Tooltip>}
                      >
                        <Form.Label className="tooltip-label">
                          Unlock Frequency
                          <FaInfoCircle className="ms-2 text-primary info-icon"/>
                        </Form.Label>
                      </OverlayTrigger>
                      <Form.Select
                        name="unlockFrequency"
                        value={formData.unlockFrequency}
                        onChange={handleInputChange}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="generated-schedule mt-4">
                  <h5>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-generated-schedule">
                        This table shows the
                        detailed {formData.unlockFrequency === 'weekly' ? 'weekly' : 'monthly'} unlock schedule for
                        your tokens.
                      </Tooltip>}
                    >
                        <span className="tooltip-label">
                          Generated Unlock Schedule
                          <FaInfoCircle className="ms-2 text-primary info-icon"/>
                        </span>
                    </OverlayTrigger>
                  </h5>

                  <div className="table-responsive">
                    <table className="table table-sm table-striped">
                      <thead>
                      <tr>
                        <th>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-period">
                              The {formData.unlockFrequency === 'weekly' ? 'week' : 'month'} number after TGE (Token
                              Generation Event).
                            </Tooltip>}
                          >
                                <span className="tooltip-label">
                                  {formData.tgeDate ? "Time" : "Period"}
                                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                                </span>
                          </OverlayTrigger>
                        </th>
                        <th>
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-percentage">
                              The percentage of your total tokens that will unlock during this period.
                            </Tooltip>}
                          >
                                <span className="tooltip-label">
                                  Percentage (%)
                                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                                </span>
                          </OverlayTrigger>
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>
                          {formData.tgeDate ? (<div>Month 0 — {new Date(formData.tgeDate).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}</div>) : (
                            <div>{formData.unlockFrequency === 'weekly' ? 'Week (0)' : 'Month 0 (TGE)'}</div>)}
                        </td>
                        <td>{formData.tgeUnlock}%</td>
                      </tr>
                      {unlockPeriods.map((period, index) => {
                        // Determine which value to display as the primary time unit
                        const monthValue = period.month;
                        const weekValue = formData.unlockFrequency === 'weekly' ? (period.weekNumber || Math.round((period.month - Number(formData.cliff)) * 4.33) + 1) : null;

                        return (<tr key={index}>
                          <td>
                            {formData.tgeDate ? (<div>
                              {formData.unlockFrequency === 'weekly' ? `Week ${weekValue} — ${formatUnlockDate(weekValue)}` : `Month ${monthValue} — ${formatUnlockDate(monthValue)}`}
                            </div>) : (<div>
                              {formData.unlockFrequency === 'weekly' ? `Week ${weekValue}` : `Month ${monthValue}`}
                            </div>)}
                          </td>
                          <td>{period.percentage}%</td>
                        </tr>);
                      })}
                      </tbody>
                    </table>
                  </div>

                  {formData.unlockFrequency === 'weekly' && !formData.tgeDate && (<div className="mt-2">
                    <small className="text-muted">
                      * Week numbers are calculated from TGE date
                    </small>
                  </div>)}
                </div>
              </div>
            </div>

            <div className="d-grid gap-2 mt-4">
              <Button variant="primary" size="lg" onClick={handleCalculate}>
                Calculate Results
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>);
};

export default CalculatorForm;
