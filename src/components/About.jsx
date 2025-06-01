import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import {
  FaArrowRight,
  FaChartLine,
  FaCheck,
  FaDiscord,
  FaInfoCircle,
  FaLock,
  FaPaperPlane,
  FaRocket,
  FaShieldAlt,
  FaTelegram,
  FaTwitter,
  FaUser,
  FaUsers,
  FaYoutube
} from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import SEO from './SEO';
import { seoConfig } from '../config/seo';
import { subscribeToBrevo } from '../api/brevoService';
import { trackButtonClick, trackEvent, trackFormSubmission, trackLinkClick } from '../utils/analytics';
import { useTranslation } from 'react-i18next';

const HowItWorks = ({onNavigateToSimulator}) => {
  const {darkMode} = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Инициализируем useTranslation с явным указанием namespace 'about'
  const { t, i18n } = useTranslation('about');

  // Get SEO config for this page
  const {title, description, canonicalUrl, schema} = seoConfig.about;

  useEffect(() => {
    // Check if user has already submitted email
    const hasSubmitted = localStorage.getItem('emailSubmitted') === 'true';
    setEmailSubmitted(hasSubmitted);
  }, []);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (email && email.includes('@') && email.includes('.')) {
      setIsSubmitting(true);

      // Track email submission attempt
      trackFormSubmission('email_subscription', 'about_page', {
        email_provided: true
      });

      subscribeToBrevo(email)
        .then(data => {
          // Store in local storage that user has submitted email
          localStorage.setItem('emailSubmitted', 'true');
          setEmailSubmitted(true);
          setShowSuccessMessage(true);

          // Reset form
          setEmail('');

          // Track successful subscription
          trackEvent('email_subscription_success', {
            location: 'about_page'
          });

          // Hide success message after 5 seconds
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 5000);

          console.log('Email submitted successfully:', data);
        })
        .catch(error => {
          console.error('Error submitting email:', error);
          setErrorMessage(error.message);

          // Track error
          trackEvent('email_subscription_error', {
            location: 'about_page', error_message: error.message
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  const handleStartSimulating = () => {
    trackButtonClick('simulate_now', 'Simulate Now', 'about_page');
    onNavigateToSimulator();

    // Scroll to top of simulator
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  return (<div className="how-it-works-page about-page">
    <SEO
      title={title}
      description={description}
      canonicalUrl={canonicalUrl}
      schema={schema}
    />

    {/* Hero Section */}
    <section className="hero-section py-4 py-md-5 bg-light">
      <Container>
        <Row className="align-items-center py-3 py-md-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className="display-4 fw-bold mb-3 mb-md-4">
              {t('hero.title')}
            </h1>
            <p className="lead mb-4 mb-md-5">
              {t('hero.description')}
            </p>

            <div className="d-flex justify-content-center gap-2 gap-md-3 flex-wrap mb-4 mb-md-5">
              <Button
                variant="primary"
                size="lg"
                className="px-3 px-md-4"
                onClick={handleStartSimulating}
              >
                {t('hero.trySimulator')}
              </Button>
              <Button
                variant="outline-info"
                size="lg"
                className="px-3 px-md-4"
                href="https://t.me/AlphaIDO_bot?start"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegram className="me-2"/>
                {t('hero.joinTelegram')}
              </Button>
            </div>

            {!emailSubmitted && (<Card className="shadow-sm border-0 p-2 bg-white">
              <Card.Body className="p-2 p-md-3">
                <h5 className="fw-bold mb-2 mb-md-3">{t('hero.notificationCard.title')}</h5>
                <p className="text-muted mb-2 mb-md-3">
                  {t('hero.notificationCard.description')}
                </p>
                <form onSubmit={handleEmailSubmit}>
                  <InputGroup className="mb-2 mb-md-3">
                    <Form.Control
                      type="email"
                      placeholder={t('hero.notificationCard.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="py-2"
                    />
                    <Button variant="primary" type="submit" className="px-3 px-md-4" disabled={isSubmitting}>
                      <FaPaperPlane className="me-2"/>
                      {isSubmitting ? t('hero.notificationCard.subscribing') : t('hero.notificationCard.subscribeButton')}
                    </Button>
                  </InputGroup>
                  {errorMessage && (<Alert variant="danger" className="mt-2 mb-0 py-2">
                    {errorMessage}
                  </Alert>)}
                  {showSuccessMessage && (<Alert variant="success" className="mt-2 mb-0 py-2">
                    {t('hero.notificationCard.successMessage')}
                  </Alert>)}
                </form>
              </Card.Body>
            </Card>)}
          </Col>
        </Row>
      </Container>
    </section>

    {/* What This Tool Does Section */}
    <section className="py-5 bg-white">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-4">
              {t('whatIsTool.title')}
            </h2>
            <p className="lead mb-5">
              {t('whatIsTool.description')}
            </p>

            <div className="card border-0 shadow-sm p-4 mb-4">
              <h5 className="fw-bold mb-3">{t('whatIsTool.helpsList.title')}</h5>
              <ul className="list-group list-group-flush">
                {Array.isArray(t('whatIsTool.helpsList.items', { returnObjects: true })) 
                  ? t('whatIsTool.helpsList.items', { returnObjects: true }).map((item, index) => (
                  <li key={index} className="list-group-item d-flex align-items-center border-0 ps-0">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                         style={{width: "32px", height: "32px", minWidth: "32px"}}>
                      <FaCheck className="text-white" style={{fontSize: '14px'}}/>
                    </div>
                    <span className="fw-medium">{item}</span>
                  </li>
                )) : null}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* Who Should Use This Tool Section */}
    <section className="py-5 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            <h2 className="display-5 fw-bold mb-5 text-center">
              {t('whoIsFor.title')}
            </h2>

            <Row className="g-4">
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{width: "48px", height: "48px", minWidth: "48px"}}>
                        <FaUser className="text-white"/>
                      </div>
                      <h5 className="fw-bold mb-0">{t('whoIsFor.categories.firstTime.title')}</h5>
                    </div>
                    <p className="text-muted ms-5 ps-2">
                      {t('whoIsFor.categories.firstTime.description')}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{width: "48px", height: "48px", minWidth: "48px"}}>
                        <FaUsers className="text-white"/>
                      </div>
                      <h5 className="fw-bold mb-0">{t('whoIsFor.categories.cryptoNative.title')}</h5>
                    </div>
                    <p className="text-muted ms-5 ps-2">
                      {t('whoIsFor.categories.cryptoNative.description')}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{width: "48px", height: "48px", minWidth: "48px"}}>
                        <FaRocket className="text-white"/>
                      </div>
                      <h5 className="fw-bold mb-0">{t('whoIsFor.categories.alphaHunters.title')}</h5>
                    </div>
                    <p className="text-muted ms-5 ps-2">
                      {t('whoIsFor.categories.alphaHunters.description')}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{width: "48px", height: "48px", minWidth: "48px"}}>
                        <FaChartLine className="text-white"/>
                      </div>
                      <h5 className="fw-bold mb-0">{t('whoIsFor.categories.influencers.title')}</h5>
                    </div>
                    <p className="text-muted ms-5 ps-2">
                      {t('whoIsFor.categories.influencers.description')}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>

    {/* How It Works Section */}
    <section className="py-5 bg-white">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-4">
              {t('howItWorksSection.title')}
            </h2>
          </Col>
        </Row>

        <Row className="g-4 justify-content-center">
          {Array.isArray(t('howItWorksSection.steps', { returnObjects: true })) 
            ? t('howItWorksSection.steps', { returnObjects: true }).map((step, index) => (
            <Col md={4} key={index}>
              <Card className="h-100 text-center border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                    style={{width: '80px', height: '80px', fontSize: '1.75rem', fontWeight: 'bold'}}>
                    {step.number}
                  </div>
                  <h4 className="fw-bold mb-3">{step.title}</h4>
                  <p className="text-muted">
                    {step.description}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          )) : null}
        </Row>
      </Container>
    </section>

    {/* Why It Matters Section */}
    <section className="py-5 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <h2 className="display-5 fw-bold mb-4 text-center">
              {t('whyMatters.title')}
            </h2>

            <div className="d-flex flex-column gap-4 mt-5">
              {Array.isArray(t('whyMatters.reasons', { returnObjects: true })) 
                ? t('whyMatters.reasons', { returnObjects: true }).map((reason, index) => (
                <div className="d-flex" key={index}>
                  <div
                    className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3 mt-1"
                    style={{width: "24px", height: "24px", minWidth: "24px"}}>
                    <FaInfoCircle className="text-white" style={{fontSize: '14px'}}/>
                  </div>
                  <p className="fs-5">
                    {reason}
                  </p>
                </div>
              )) : null}
            </div>

            <div className="alert alert-primary mt-4 fs-5 text-center">
              <strong>{t('whyMatters.alert')}</strong>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* What's Coming Next Section */}
    <section className="py-5 bg-white">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-4">
              {t('comingNext.title')}
            </h2>

            <div className="row row-cols-1 row-cols-md-2 g-4 text-start mt-4">
              {Array.isArray(t('comingNext.features', { returnObjects: true })) 
                ? t('comingNext.features', { returnObjects: true }).map((feature, index) => (
                <div className="col" key={index}>
                  <div className="d-flex align-items-start">
                    <div className="me-3 fs-3">{feature.emoji}</div>
                    <div>
                      <h5 className="fw-bold">{feature.title}</h5>
                      <p className="text-muted">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )) : null}
            </div>

            <div className="mt-5">
              <p className="fs-5 fw-medium">{t('comingNext.earlyAccess')}</p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button
                  variant="outline-info"
                  href="https://t.me/alphamind_official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4"
                  onClick={() => trackLinkClick('https://t.me/alphamind_official', 'Telegram Group', 'about_page')}
                >
                  <FaTelegram className="me-2"/>
                  {t('comingNext.joinTelegram')}
                </Button>

                {!emailSubmitted && (<Button
                  variant="outline-primary"
                  onClick={() => {
                    trackButtonClick('leave_email', 'Leave Your Email', 'about_page');
                    // Scroll to email form in hero section
                    const heroSection = document.querySelector('.hero-section');
                    if (heroSection) {
                      heroSection.scrollIntoView({behavior: 'smooth'});
                    }
                  }}
                  className="px-4"
                >
                  <FaPaperPlane className="me-2"/>
                  {t('comingNext.leaveEmail')}
                </Button>)}
              </div>

              <div className="d-flex justify-content-center gap-3 flex-wrap mt-3">
                <Button
                  variant="outline-primary"
                  href="https://discord.gg/NB4hhuXkWz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4"
                  onClick={() => trackLinkClick('https://discord.gg/NB4hhuXkWz', 'Discord', 'about_page')}
                >
                  <FaDiscord className="me-2"/>
                  {t('comingNext.joinDiscord')}
                </Button>

                <Button
                  variant="outline-dark"
                  href="https://twitter.com/alphamind_labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4"
                  onClick={() => trackLinkClick('https://twitter.com/alphamind_labs', 'Twitter', 'about_page')}
                >
                  <FaTwitter className="me-2"/>
                  {t('comingNext.followX')}
                </Button>

                <Button
                  variant="outline-danger"
                  href="https://www.youtube.com/@AlphaMind_labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4"
                  onClick={() => trackLinkClick('https://www.youtube.com/@AlphaMind_labs', 'YouTube', 'about_page')}
                >
                  <FaYoutube className="me-2"/>
                  {t('comingNext.youtube')}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* Explore IDOs on AlphaMind Section */}
    <section className="py-5 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <h2 className="display-5 fw-bold mb-5 text-center">
              {t('exploreIDOs.title')}
            </h2>

            <Card className="border-0 shadow text-center p-4 mb-4">
              <Card.Body>
                <h3 className="fw-bold mb-4">{t('exploreIDOs.card.title')}</h3>
                <p className="mb-4">{t('exploreIDOs.card.description')}</p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button
                    variant="primary"
                    href="https://app.alphamind.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4"
                    onClick={() => trackLinkClick('https://app.alphamind.co/', 'See Active Presales', 'about_page')}
                  >
                    {t('exploreIDOs.card.seeActive')}
                  </Button>
                  <Button
                    variant="outline-primary"
                    href="https://app.alphamind.co/build_karma/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4"
                    onClick={() => trackLinkClick('https://app.alphamind.co/build_karma/', 'Join IDO Quests', 'about_page')}
                  >
                    {t('exploreIDOs.card.joinQuests')}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    href="https://alphamind.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4"
                    onClick={() => trackLinkClick('https://alphamind.co/', 'About AlphaMind', 'about_page')}
                  >
                    {t('exploreIDOs.card.aboutAlphaMind')}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>

    {/* Privacy & Trust Section */}
    <section className="py-5 bg-white">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <h2 className="display-5 fw-bold mb-4">
              {t('privacy.title')}
            </h2>

            <Row className="g-4 mt-3">
              {Array.isArray(t('privacy.features', { returnObjects: true })) 
                ? t('privacy.features', { returnObjects: true }).map((feature, index) => (
                <Col sm={6} lg={3} key={index}>
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Body className="p-4 text-center">
                      {index === 0 && <FaShieldAlt className="text-primary mb-3" style={{fontSize: '2.5rem'}}/>}
                      {index === 1 && <FaLock className="text-primary mb-3" style={{fontSize: '2.5rem'}}/>}
                      {index === 2 && <FaUser className="text-primary mb-3" style={{fontSize: '2.5rem'}}/>}
                      {index === 3 && <FaRocket className="text-primary mb-3" style={{fontSize: '2.5rem'}}/>}
                      <h5 className="fw-bold">{feature.title}</h5>
                      <p className="text-muted small">{feature.description}</p>
                    </Card.Body>
                  </Card>
                </Col>
              )) : null}
            </Row>

            <p className="text-muted mt-4">
              {t('privacy.note')}
            </p>
          </Col>
        </Row>
      </Container>
    </section>

    {/* Disclaimer Section */}
    <section className="py-4 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="alert alert-warning">
              <small>
                {t('disclaimer')}
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* CTA Section */}
    <section className="py-5 bg-primary text-white text-center">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <h2 className="display-5 fw-bold mb-3">
              {t('ctaSection.title')}
            </h2>
            <p className="lead mb-4">
              {t('ctaSection.description')}
            </p>
            <Button
              variant="light"
              size="lg"
              className="px-4 py-2 fw-bold"
              onClick={() => {
                trackButtonClick('About Page CTA Button');
                onNavigateToSimulator();
              }}
            >
              <FaArrowRight className="me-2"/>
              {t('cta.button')}
            </Button>
          </Col>
        </Row>
      </Container>
    </section>

    {/* Footer Section */}
    <section className="py-5 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <div className="social-links d-flex justify-content-center gap-3 mt-4">
              <a
                href="https://t.me/alphamind_official"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                onClick={() => trackLinkClick('https://t.me/alphamind_official', 'Telegram Group', 'about_page_footer')}
              >
                <FaTelegram size={24}/>
              </a>
              <a
                href="https://discord.gg/NB4hhuXkWz"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                onClick={() => trackLinkClick('https://discord.gg/NB4hhuXkWz', 'Discord', 'about_page_footer')}
              >
                <FaDiscord size={24}/>
              </a>
              <a
                href="https://twitter.com/alphamind_labs"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                onClick={() => trackLinkClick('https://twitter.com/alphamind_labs', 'Twitter', 'about_page_footer')}
              >
                <FaTwitter size={24}/>
              </a>
              <a
                href="https://www.youtube.com/@AlphaMind_labs"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                onClick={() => trackLinkClick('https://www.youtube.com/@AlphaMind_labs', 'YouTube', 'about_page_footer')}
              >
                <FaYoutube size={24}/>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  </div>);
};

export default HowItWorks;
