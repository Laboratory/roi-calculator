import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { FaEnvelope, FaGift, FaPaperPlane, FaTelegram } from 'react-icons/fa';
import { subscribeToBrevo } from '../api/brevoService';
import { trackEvent, trackLinkClick } from '../utils/analytics';
import { useTranslation } from 'react-i18next';

const InlineLeadCapture = ({ 
  title, 
  subtitle, 
  trigger = 'inline_capture',
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const { t } = useTranslation(['calculator']);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Check if this capture has been shown before
  const [hasBeenShown, setHasBeenShown] = useState(() => {
    const shown = localStorage.getItem(`lead_capture_${trigger}`);
    return shown === 'true';
  });

  // Don't render if already shown and dismissed
  if (hasBeenShown && dismissed) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError(t('calculator:form.cta.emailError'));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await subscribeToBrevo(email, {
        LIST_IDS: [2], // Inline capture list
        ATTRIBUTES: {
          LEAD_SOURCE: trigger,
          SIGNUP_DATE: new Date().toISOString()
        }
      });
      
      setSuccess(true);
      
      // Track successful inline capture
      trackEvent('inline_lead_capture', {
        email: email,
        trigger: trigger,
        source: 'calculator_results'
      });

      // Auto-hide after success
      setTimeout(() => {
        setDismissed(true);
      }, 3000);
      
    } catch (error) {
      console.error('Inline capture error:', error);
      setError(t('calculator:form.cta.subscriptionError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    trackEvent('inline_lead_capture_dismiss', {
      trigger: trigger,
      source: 'calculator_results'
    });
    localStorage.setItem(`lead_capture_${trigger}`, 'true');
  };

  useEffect(() => {
    if (!hasBeenShown) {
      localStorage.setItem(`lead_capture_${trigger}`, 'true');
    }
  }, [hasBeenShown, trigger]);

  return (
    <Card className={`inline-lead-capture ${className}`} bg={variant === 'primary' ? 'primary' : 'light'}>
      <Card.Body className="text-center">
        {!success ? (
          <>
            <div className="mb-3">
              <FaGift size={32} className={variant === 'primary' ? 'text-white' : 'text-primary'} />
            </div>
            <h5 className={variant === 'primary' ? 'text-white' : 'text-dark'}>
              {title || t('calculator:leadCapture.title')}
            </h5>
            <p className={`mb-4 ${variant === 'primary' ? 'text-white-50' : 'text-muted'}`}>
              {subtitle || t('calculator:leadCapture.subtitle')}
            </p>

            <Form onSubmit={handleSubmit}>
              <Row className="justify-content-center">
                <Col md={8}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>
                      <FaEnvelope />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder={t('calculator:form.cta.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size={size}
                    />
                    <Button
                      variant={variant === 'primary' ? 'light' : 'primary'}
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <FaPaperPlane className="me-1" />
                      {isSubmitting ? '...' : t('calculator:leadCapture.getAccess')}
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
              
              {error && (
                <Alert variant="danger" className="py-2 small">
                  {error}
                </Alert>
              )}

              <Row className="justify-content-center">
                <Col md={6}>
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleDismiss}
                    >
                      {t('calculator:leadCapture.skip')}
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      href="https://t.me/AlphaIDO_bot?start"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackLinkClick('https://t.me/AlphaIDO_bot?start', 'Telegram Bot', trigger)}
                    >
                      <FaTelegram className="me-1" />
                      {t('calculator:leadCapture.telegram')}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>

            <div className="mt-3">
              <small className={variant === 'primary' ? 'text-white-50' : 'text-muted'}>
                {t('calculator:leadCapture.benefits')}
              </small>
            </div>
          </>
        ) : (
          <div className="py-3">
            <FaGift size={48} className="text-success mb-3" />
            <h5 className="text-success mb-3">{t('calculator:leadCapture.success')}</h5>
            <p className="text-muted">
              {t('calculator:leadCapture.successMessage')}
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default InlineLeadCapture;
