import React, { useState } from 'react';
import { Alert, Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { FaPaperPlane, FaTelegram } from 'react-icons/fa';
import { subscribeToBrevo } from '../api/brevoService';
import { trackEvent, trackLinkClick } from '../utils/analytics';
import { useTranslation } from 'react-i18next';

const SubscriptionForm = () => {
  const { t } = useTranslation(['calculator']);
  const [email, setEmail] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);

  const handleEmailSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setEmailError(t('calculator:form.cta.emailError'));
      return;
    }

    setIsSubmittingEmail(true);
    setEmailError('');
    setEmailSuccess(false);

    try {
      await subscribeToBrevo(email);
      setEmailSuccess(true);
      setEmail('');
      
      // Track successful subscription
      trackEvent('email_subscription', {
        email: email,
        source: 'investment_results'
      });
    } catch (error) {
      console.error('Subscription error:', error);
      setEmailError(t('calculator:form.cta.subscriptionError'));
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  return (
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
                variant="primary"
                className="px-3 py-2"
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
            onClick={() => trackLinkClick('https://t.me/AlphaIDO_bot?start', 'Telegram Bot', 'investment_results')}
          >
            <FaTelegram className="me-2"/>
            {t('calculator:form.cta.telegram')}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default SubscriptionForm;
