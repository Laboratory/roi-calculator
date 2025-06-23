import React, { useState } from 'react';
import { Alert, Button, Card, Col, Form, InputGroup, Modal, Row } from 'react-bootstrap';
import { FaEnvelope, FaGift, FaPaperPlane, FaRocket, FaTelegram, FaTimes } from 'react-icons/fa';
import { subscribeToBrevo } from '../api/brevoService';
import { trackEvent, trackLinkClick } from '../utils/analytics';
import { useTranslation } from 'react-i18next';

const EarlyLeadCapture = ({ show, onHide, onSuccess, trigger = 'early_interest' }) => {
  const { t } = useTranslation(['calculator']);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
        LIST_IDS: [2], // Early interest list
        ATTRIBUTES: {
          LEAD_SOURCE: trigger,
          SIGNUP_DATE: new Date().toISOString()
        }
      });
      
      setSuccess(true);
      
      // Track successful early capture
      trackEvent('early_lead_capture', {
        email: email,
        trigger: trigger,
        source: 'calculator_form'
      });

      // Call success callback after a short delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onHide();
      }, 2000);
      
    } catch (error) {
      console.error('Early capture error:', error);
      setError(t('calculator:form.cta.subscriptionError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    trackEvent('early_lead_capture_skip', {
      trigger: trigger,
      source: 'calculator_form'
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={handleSkip} centered size="md">
      <Modal.Header className="border-0 pb-0">
        <Button variant="link" onClick={handleSkip} className="ms-auto p-0 text-muted">
          <FaTimes size={16} />
        </Button>
      </Modal.Header>
      <Modal.Body className="pt-0">
        {!success ? (
          <div className="text-center">
            <div className="mb-4">
              <FaRocket size={48} className="text-primary mb-3" />
              <h4 className="mb-3">{t('calculator:leadCapture.title')}</h4>
              <p className="text-muted mb-4">
                {t('calculator:leadCapture.subtitle')}
              </p>
            </div>

            <Form onSubmit={handleSubmit}>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  placeholder={t('calculator:form.cta.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                />
              </InputGroup>
              
              {error && (
                <Alert variant="danger" className="py-2 small">
                  {error}
                </Alert>
              )}

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting}
                >
                  <FaGift className="me-2" />
                  {isSubmitting ? t('calculator:form.cta.submitting') : t('calculator:leadCapture.getAccess')}
                </Button>
                
                <Row className="mt-3">
                  <Col>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={handleSkip}
                      className="w-100"
                    >
                      {t('calculator:leadCapture.skip')}
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="outline-info"
                      size="sm"
                      href="https://t.me/AlphaIDO_bot?start"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackLinkClick('https://t.me/AlphaIDO_bot?start', 'Telegram Bot', 'early_capture')}
                      className="w-100"
                    >
                      <FaTelegram className="me-1" />
                      {t('calculator:leadCapture.telegram')}
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>

            <div className="mt-4">
              <small className="text-muted">
                {t('calculator:leadCapture.benefits')}
              </small>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <FaGift size={48} className="text-success mb-3" />
            <h4 className="text-success mb-3">{t('calculator:leadCapture.success')}</h4>
            <p className="text-muted">
              {t('calculator:leadCapture.successMessage')}
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EarlyLeadCapture;
