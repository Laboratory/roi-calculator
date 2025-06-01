import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaDiscord, FaInfoCircle, FaPaperPlane, FaTelegram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { calculateResults } from '../utils/calculator';
import { subscribeToBrevo } from '../api/brevoService';
import { trackEvent, trackFormSubmission, trackInputChange, trackLinkClick } from '../utils/analytics';
import { useTranslation } from 'react-i18next';

const DEFAULT_UNLOCK_PERIODS = [{month: 1, percentage: 15}, {month: 3, percentage: 25}, {
  month: 6, percentage: 25
}, {month: 12, percentage: 25}];

const SimulatorForm = ({onCalculate}) => {
  const { t } = useTranslation(['calculator']);
  const [formData, setFormData] = useState({
    investmentAmount: '1000',
    tokenPrice: '0.1',
    tokenName: '$MYTOKEN',
    tgeUnlock: 10,
    tgeDate: null,
    totalSupply: '',
    tokenAmount: '',
    cliff: 3,
    vestingDuration: 9,
    unlockFrequency: 'monthly',
    supplyOption: 'custom',
    expectedListingPrice: ''
  });

  const [priceScenarios, setPriceScenarios] = useState([{name: 'Bear', roi: '-90', price: '0.05'}, {
    name: 'Base', roi: '0', price: '0.2'
  }, {name: 'Bull', roi: '300', price: '0.5'}]);

  const [unlockPeriods, setUnlockPeriods] = useState(DEFAULT_UNLOCK_PERIODS);
  const [errors, setErrors] = useState({});
  const [isTokenAmountCalculated, setIsTokenAmountCalculated] = useState(false);

  const [email, setEmail] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  const [trackingTimeouts, setTrackingTimeouts] = useState({});

  // Auto-calculate token amount when investment and price are provided
  useEffect(() => {
    if (formData.investmentAmount && formData.tokenPrice) {
      const calculatedAmount = Number(formData.investmentAmount) / Number(formData.tokenPrice);
      setIsTokenAmountCalculated(true);

      // Always update the token amount based on investment/price
      setFormData(prev => ({
        ...prev, tokenAmount: calculatedAmount.toString()
      }));
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
    // Use expected listing price if provided, otherwise use purchase price
    const basePrice = formData.expectedListingPrice && Number(formData.expectedListingPrice) > 0 ? Number(formData.expectedListingPrice) : Number(formData.tokenPrice);

    const updatedScenarios = priceScenarios.map(scenario => {
      const roi = Number(scenario.roi);
      const calculatedPrice = basePrice * (1 + (roi / 100));
      return {
        ...scenario, price: calculatedPrice.toString()
      };
    });

    setPriceScenarios(updatedScenarios);
  };

  // Update scenario prices when token price, expected listing price, or ROI values change
  useEffect(() => {
    if (formData.tokenPrice) {
      calculateScenarioPrices();
    }
  }, [formData.tokenPrice, formData.expectedListingPrice]);

  // Input change handler with debounced tracking
  const handleInputChange = (e) => {
    const {name, value} = e.target;

    // Track input change (with debounce to prevent excessive events)
    if (!trackingTimeouts[name]) {
      trackingTimeouts[name] = setTimeout(() => {
        trackInputChange(name, 'calculator_form');
        trackingTimeouts[name] = null;
      }, 1000);
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

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form inputs
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      // Track successful form submission
      trackFormSubmission('roi_calculator', 'calculator_page', {
        token_name: formData.tokenName, investment_amount: formData.investmentAmount,
      });

      // Calculate results
      const results = calculateResults({
        ...formData, priceScenarios, unlockPeriods, unlockFrequency: formData.unlockFrequency
      });
      onCalculate(results);
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
      // Use expected listing price if provided, otherwise use purchase price
      const basePrice = formData.expectedListingPrice && Number(formData.expectedListingPrice) > 0 ? Number(formData.expectedListingPrice) : Number(formData.tokenPrice);
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
      newErrors.investmentAmount = t('calculator:form.errors.investmentAmount');
    }

    // Validate token price
    if (!formData.tokenPrice || Number(formData.tokenPrice) <= 0) {
      newErrors.tokenPrice = t('calculator:form.errors.tokenPrice');
    }

    // Validate token name
    if (!formData.tokenName) {
      newErrors.tokenName = t('calculator:form.errors.tokenName');
    }

    // Validate token amount
    if (!formData.tokenAmount || Number(formData.tokenAmount) <= 0) {
      newErrors.tokenAmount = t('calculator:form.errors.tokenAmount');
    }

    // Validate TGE unlock
    if (formData.tgeUnlock === '' || Number(formData.tgeUnlock) < 0 || Number(formData.tgeUnlock) > 100) {
      newErrors.tgeUnlock = t('calculator:form.errors.tgeUnlock');
    }

    // Validate scenarios
    const hasValidScenarios = priceScenarios.every(scenario => scenario.name && scenario.roi !== '' && parseFloat(scenario.roi) >= -100);

    if (!hasValidScenarios) {
      newErrors.scenarios = t('calculator:form.errors.scenarios');
    }

    // Validate unlock periods
    const hasValidUnlockPeriods = unlockPeriods.every(period => period.month > 0 && period.percentage >= 0 && period.percentage <= 100);

    if (!hasValidUnlockPeriods) {
      newErrors.unlockPeriods = t('calculator:form.errors.unlockPeriods');
    }

    // Validate total percentage
    const totalPercentage = Number(formData.tgeUnlock) + unlockPeriods.reduce((sum, period) => sum + Number(period.percentage), 0);

    if (Math.abs(totalPercentage - 100) > 0.1) { // Allow small rounding errors
      newErrors.totalPercentage = t('calculator:form.errors.totalPercentage');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Email subscription handler
  const handleEmailSubscribe = (e) => {
    e.preventDefault();
    setEmailError('');

    if (email && email.includes('@') && email.includes('.')) {
      setIsSubmittingEmail(true);

      // Track email subscription attempt
      trackFormSubmission('email_subscription', 'calculator_footer', {
        email_provided: true
      });

      subscribeToBrevo(email)
        .then(data => {
          setEmailSuccess(true);
          setEmail('');

          // Track successful subscription
          trackEvent('email_subscription_success', {
            location: 'calculator_footer'
          });

          // Hide success message after 5 seconds
          setTimeout(() => {
            setEmailSuccess(false);
          }, 5000);

          console.log('Email submitted successfully:', data);
        })
        .catch(error => {
          console.error('Error submitting email:', error);
          setEmailError(error.message);

          // Track failed subscription
          trackEvent('email_subscription_error', {
            location: 'calculator_footer', error_message: error.message
          });
        })
        .finally(() => {
          setIsSubmittingEmail(false);
        });
    } else {
      setEmailError(t('calculator:form.errors.email'));

      // Track validation error
      trackEvent('email_subscription_validation_error', {
        location: 'calculator_footer'
      });
    }
  };

  const getUnlockPeriodLabel = () => {
    if (formData.unlockFrequency === 'weekly') {
      return t('calculator:form.unlockSchedule.periodLabel.weekly');
    } else {
      return t('calculator:form.unlockSchedule.periodLabel.monthly');
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

  return (<div className="simulator-form p-1">
    <div className="form-section">
      <h2>{t('calculator:form.sections.presaleSetup')}</h2>
      <div className="section-content ps-2 pe-2">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-investment-amount">
                  {t('calculator:form.tooltips.investmentAmount')}
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  {t('calculator:form.investmentAmount.label')}
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
              <InputGroup className="price-input-group">
                <InputGroup.Text className="currency-icon">$</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="investmentAmount"
                  value={formData.investmentAmount}
                  onChange={handleInputChange}
                  placeholder={t('calculator:form.investmentAmount.placeholder')}
                  step="0.01"
                  isInvalid={!!errors.investmentAmount}
                />
              </InputGroup>
              {errors.investmentAmount && <Form.Control.Feedback type="invalid">
                {errors.investmentAmount}
              </Form.Control.Feedback>}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-token-price">
                  {t('calculator:form.tooltips.tokenPrice')}
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  {t('calculator:form.tokenPrice.label')}
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
              <InputGroup className="price-input-group">
                <InputGroup.Text className="currency-icon">$</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="tokenPrice"
                  value={formData.tokenPrice}
                  onChange={handleInputChange}
                  placeholder={t('calculator:form.tokenPrice.placeholder')}
                  step="0.0000001"
                  isInvalid={!!errors.tokenPrice}
                />
              </InputGroup>
              {errors.tokenPrice && <Form.Control.Feedback type="invalid">
                {errors.tokenPrice}
              </Form.Control.Feedback>}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-token-name">
                  {t('calculator:form.tooltips.tokenName')}
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  {t('calculator:form.tokenSymbol.label')}
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
              <Form.Control
                type="text"
                name="tokenName"
                value={formData.tokenName}
                onChange={handleInputChange}
                placeholder={t('calculator:form.tokenSymbol.placeholder')}
                isInvalid={!!errors.tokenName}
              />
              {errors.tokenName && <Form.Control.Feedback type="invalid">
                {errors.tokenName}
              </Form.Control.Feedback>}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-token-amount">
                  {t('calculator:form.tooltips.tokenAmount')}
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  {t('calculator:form.tokenAmount.label', 'Token Amount')}
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="tokenAmount"
                  value={formData.tokenAmount}
                  onChange={isTokenAmountCalculated ? null : handleInputChange}
                  readOnly={isTokenAmountCalculated}
                  placeholder={t('calculator:form.tokenAmount.placeholder')}
                  isInvalid={!!errors.tokenAmount}
                />
                {errors.tokenAmount && <Form.Control.Feedback type="invalid">
                  {errors.tokenAmount}
                </Form.Control.Feedback>}
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-expected-listing-price">
                  {t('calculator:form.tooltips.expectedListingPrice')}
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  {t('calculator:form.expectedListingPrice.label')}
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
              <InputGroup className="price-input-group">
                <InputGroup.Text className="currency-icon">$</InputGroup.Text>
                <Form.Control
                  type="number"
                  name="expectedListingPrice"
                  value={formData.expectedListingPrice}
                  onChange={handleInputChange}
                  placeholder={t('calculator:form.expectedListingPrice.placeholder')}
                  step="0.0000001"
                />
              </InputGroup>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-tge-date">
                  {t('calculator:form.tooltips.tgeDate')}
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  {t('calculator:form.tgeDate.label')}
                  <FaInfoCircle className="ms-2 text-primary info-icon"/>
                </Form.Label>
              </OverlayTrigger>
              <DatePicker
                selected={formData.tgeDate}
                onChange={handleDateChange}
                className="form-control"
                placeholderText={t('calculator:form.tgeDate.placeholder')}
                dateFormat="dd.MM.yyyy"
              />
              <div>
                <Form.Text className="text-muted">
                  {t('calculator:form.tgeDate.note')}
                </Form.Text>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="tooltip-total-supply">
                  {t('calculator:form.tooltips.totalSupply')}
                </Tooltip>}
              >
                <Form.Label className="tooltip-label">
                  {t('calculator:form.totalSupply.label')}
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
                  <option value="10billion">{t('calculator:form.totalSupply.options.10billion')}</option>
                  <option value="1billion">{t('calculator:form.totalSupply.options.1billion')}</option>
                  <option value="100million">{t('calculator:form.totalSupply.options.100million')}</option>
                  <option value="custom">{t('calculator:form.totalSupply.options.custom')}</option>
                </Form.Select>

                {formData.supplyOption === 'custom' && (<Form.Control
                  type="number"
                  name="totalSupply"
                  value={formData.totalSupply}
                  onChange={handleInputChange}
                  placeholder={t('calculator:form.totalSupply.placeholder')}
                />)}
              </Form.Group>

              <Form.Text className="text-muted">
                {t('calculator:form.totalSupply.note')}
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        {/* Side-by-side sections for Market ROI Scenarios and Unlock Schedule */}
        <Row className="mt-4">
          {/* Market ROI Scenarios Column */}
          <Col md={6}>
            <div className="form-section h-100">
              <h3 className="section-title">{t('calculator:form.marketScenarios.title')}</h3>
              <div className="section-content border-0 ps-2 pe-2">
                {priceScenarios.map((scenario, index) => (<Row key={index} className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-scenario-${index}`}>
                          {scenario.name === 'Bear' && t('calculator:form.tooltips.bearScenario')}
                          {scenario.name === 'Base' && t('calculator:form.tooltips.baseScenario')}
                          {scenario.name === 'Bull' && t('calculator:form.tooltips.bullScenario')}
                        </Tooltip>}
                      >
                        <Form.Label className="tooltip-label">
                          {scenario.name} {t('calculator:form.marketScenarios.scenarioLabel')}
                          <FaInfoCircle className="ms-2 text-primary info-icon"/>
                        </Form.Label>
                      </OverlayTrigger>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          value={scenario.roi}
                          onChange={(e) => handleScenarioChange(index, 'roi', e.target.value)}
                          placeholder={t('calculator:form.marketScenarios.roiPlaceholder')}
                          step="1"
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                      <Form.Text className="text-muted">
                        {t('calculator:form.marketScenarios.calculatedPrice')} ${parseFloat(scenario.price).toFixed(6)}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>))}
              </div>
            </div>
          </Col>

          {/* Unlock Schedule Column */}
          <Col md={6}>
            <div className="form-section h-100">
              <h3 className="section-title">{t('calculator:form.unlockSchedule.title')}</h3>
              <div className="section-content border-0 ps-2 pe-2">
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-tge-unlock">
                          {t('calculator:form.tooltips.tgeUnlock')}
                        </Tooltip>}
                      >
                        <Form.Label className="tooltip-label">
                          {t('calculator:form.unlockSchedule.tgePercentage.label')}
                          <FaInfoCircle className="ms-2 text-primary info-icon"/>
                        </Form.Label>
                      </OverlayTrigger>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          name="tgeUnlock"
                          value={formData.tgeUnlock}
                          onChange={handleInputChange}
                          placeholder={t('calculator:form.unlockSchedule.tgePercentage.placeholder')}
                          min="0"
                          max="100"
                          step="0.1"
                          isInvalid={!!errors.tgeUnlock}
                        />
                        <InputGroup.Text>%</InputGroup.Text>
                      </InputGroup>
                      {errors.tgeUnlock && <Form.Control.Feedback type="invalid">
                        {errors.tgeUnlock}
                      </Form.Control.Feedback>}
                    </Form.Group>
                  </Col>
                </Row>

                {/* Separate row for Cliff, Vesting Duration, and Unlock Frequency */}
                <Row className="mt-3">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-cliff">
                          {t('calculator:form.tooltips.cliff')}
                        </Tooltip>}
                      >
                        <Form.Label className="tooltip-label">
                          {t('calculator:form.unlockSchedule.cliffPeriod.label')}
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
                </Row>

                <Row className="mt-3">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-vesting-duration">
                          {t('calculator:form.tooltips.vestingDuration')}
                        </Tooltip>}
                      >
                        <Form.Label className="tooltip-label">
                          {t('calculator:form.vestingPeriod.label')}
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
                </Row>

                <Row className="mt-3">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-unlock-frequency">
                          {t('calculator:form.tooltips.unlockFrequency')}
                        </Tooltip>}
                      >
                        <Form.Label className="tooltip-label">
                          {t('calculator:form.unlockSchedule.unlockFrequency.label')}
                          <FaInfoCircle className="ms-2 text-primary info-icon"/>
                        </Form.Label>
                      </OverlayTrigger>
                      <Form.Select
                        name="unlockFrequency"
                        value={formData.unlockFrequency}
                        onChange={handleInputChange}
                      >
                        <option value="monthly">{t('calculator:form.unlockSchedule.unlockFrequency.options.monthly')}</option>
                        <option value="weekly">{t('calculator:form.unlockSchedule.unlockFrequency.options.weekly')}</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>

        {/* Generated Unlock Schedule */}
        <Row className="mt-4">
          <Col md={12}>
            <div className="generated-schedule ps-2 pe-2">
              <h5>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="tooltip-generated-schedule">
                    {t('calculator:form.tooltips.generatedSchedule')}
                  </Tooltip>}
                >
                  <span className="tooltip-label">
                    {t('calculator:form.generatedSchedule.title')}
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
                          {t('calculator:form.tooltips.period')}
                        </Tooltip>}
                      >
                        <span className="tooltip-label">
                          {formData.tgeDate ? t('calculator:form.generatedSchedule.time') : t('calculator:form.generatedSchedule.period')}
                          <FaInfoCircle className="ms-2 text-primary info-icon"/>
                        </span>
                      </OverlayTrigger>
                    </th>
                    <th>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="tooltip-percentage">
                          {t('calculator:form.tooltips.percentage')}
                        </Tooltip>}
                      >
                        <span className="tooltip-label">
                          {t('calculator:form.generatedSchedule.percentage')}
                          <FaInfoCircle className="ms-2 text-primary info-icon"/>
                        </span>
                      </OverlayTrigger>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>
                      {formData.tgeDate ? (<div>{t('calculator:form.generatedSchedule.tgeDate')} — {new Date(formData.tgeDate).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}</div>) : (<div>{formData.unlockFrequency === 'weekly' ? t('calculator:form.generatedSchedule.week0') : t('calculator:form.generatedSchedule.month0')}</div>)}
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
                          {formData.unlockFrequency === 'weekly' ? `${t('calculator:form.generatedSchedule.week')} ${weekValue} — ${formatUnlockDate(weekValue)}` : `${t('calculator:form.generatedSchedule.month')} ${monthValue} — ${formatUnlockDate(monthValue)}`}
                        </div>) : (<div>
                          {formData.unlockFrequency === 'weekly' ? `${t('calculator:form.generatedSchedule.week')} ${weekValue}` : `${t('calculator:form.generatedSchedule.month')} ${monthValue}`}
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
                  * {t('calculator:form.generatedSchedule.weekNote')}
                </small>
              </div>)}
            </div>
          </Col>
        </Row>

        <div className="d-grid gap-2 mt-4">
          <p className="text-center mb-3">{t('calculator:form.actions.simulateRoi')}</p>
          <Button variant="primary" size="lg" onClick={handleSubmit}>
            {t('calculator:form.actions.calculate')}
          </Button>

          <div className="cta-section mt-4 p-4 border rounded bg-light">
            <h5 className="text-center mb-3">{t('calculator:form.cta.title')}</h5>
            <p className="text-center mb-4">{t('calculator:form.cta.note')}</p>

            <Row className="mb-4">
              <Col md={8}>
                <Form onSubmit={handleEmailSubscribe}>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      placeholder={t('calculator:form.cta.emailPlaceholder')}
                      aria-label={t('calculator:form.cta.emailLabel')}
                      className="py-2"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                      variant="outline-primary"
                      className="px-3 py-2 h-100"
                      type="submit"
                      disabled={isSubmittingEmail}
                    >
                      <FaPaperPlane className="me-2"/>
                      {isSubmittingEmail ? t('calculator:form.cta.submitting') : t('calculator:form.cta.subscribe')}
                    </Button>
                  </InputGroup>
                  {emailError && (<Alert variant="danger" className="mt-2 mb-0 py-2 small">
                    {emailError}
                  </Alert>)}
                  {emailSuccess && (<Alert variant="success" className="mt-2 mb-0 py-2 small">
                    {t('calculator:form.cta.success')}
                  </Alert>)}
                </Form>
              </Col>
              <Col md={4}>
                <Button
                  variant="outline-info"
                  className="w-100 py-2 h-100"
                  href="https://t.me/AlphaIDO_bot?start"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick('https://t.me/AlphaIDO_bot?start', 'Telegram Bot', 'calculator_footer')}
                >
                  <FaTelegram className="me-2"/>
                  {t('calculator:form.cta.telegram')}
                </Button>
              </Col>
            </Row>

            <hr className="my-4"/>

            <p className="text-center mb-3">{t('calculator:form.cta.joinCommunity')}</p>
            <p className="text-center mb-4">{t('calculator:form.cta.communityNote')}</p>

            <Row>
              <Col md={6}>
                <Button variant="outline-primary" className="w-100 py-2 h-100" href="https://discord.gg/NB4hhuXkWz"
                        target="_blank" rel="noopener noreferrer">
                  <FaDiscord className="me-2"/>
                  {t('calculator:form.cta.discord')}
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-info" className="w-100 py-2 h-100" href="https://t.me/alphamind_official"
                        target="_blank" rel="noopener noreferrer">
                  <FaTelegram className="me-2"/>
                  {t('calculator:form.cta.telegramGroup')}
                </Button>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={6}>
                <Button variant="outline-dark" className="w-100 py-2 h-100" href="https://twitter.com/alphamind_labs"
                        target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="me-2"/>
                  {t('calculator:form.cta.twitter')}
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-danger" className="w-100 py-2 h-100"
                        href="https://www.youtube.com/@AlphaMind_labs" target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="me-2"/>
                  {t('calculator:form.cta.youtube')}
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
    <div className="social-links d-flex justify-content-center gap-3 mt-4">
      <a
        href="https://t.me/alphamind_official"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
        onClick={() => trackLinkClick('https://t.me/alphamind_official', 'Telegram Group', 'calculator_footer')}
      >
        <FaTelegram size={24}/>
      </a>
      <a
        href="https://discord.gg/NB4hhuXkWz"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
        onClick={() => trackLinkClick('https://discord.gg/NB4hhuXkWz', 'Discord', 'calculator_footer')}
      >
        <FaDiscord size={24}/>
      </a>
      <a
        href="https://twitter.com/alphamind_labs"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
        onClick={() => trackLinkClick('https://twitter.com/alphamind_labs', 'Twitter', 'calculator_footer')}
      >
        <FaTwitter size={24}/>
      </a>
      <a
        href="https://www.youtube.com/@AlphaMind_labs"
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
        onClick={() => trackLinkClick('https://www.youtube.com/@AlphaMind_labs', 'YouTube', 'calculator_footer')}
      >
        <FaYoutube size={24}/>
      </a>
    </div>
  </div>);
};

export default SimulatorForm;
