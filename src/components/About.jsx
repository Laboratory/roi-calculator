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

const HowItWorks = ({onNavigateToSimulator}) => {
  const {darkMode} = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  return (<div className="how-it-works-page">
    <SEO
      title={title}
      description={description}
      canonicalUrl={canonicalUrl}
      schema={schema}
    />

    {/* Hero Section */}
    <section className="hero-section py-5 bg-light">
      <Container>
        <Row className="align-items-center py-5">
          <Col lg={8} className="mx-auto text-center">
            <h1 className="display-4 fw-bold mb-4">
              Understand Your IDO ROI Before You Ape In
            </h1>
            <p className="lead mb-5">
              This free simulator shows you how token unlocks, FDV, vesting, and market conditions
              affect your actual returns — not just hype projections.
            </p>

            <div className="d-flex justify-content-center gap-3 flex-wrap mb-5">
              <Button
                variant="primary"
                size="lg"
                className="px-4"
                onClick={handleStartSimulating}
              >
                Try the Simulator
              </Button>
              <Button
                variant="outline-info"
                size="lg"
                className="px-4"
                href="https://t.me/AlphaIDO_bot?start"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegram className="me-2"/>
                Join Telegram Bot
              </Button>
            </div>

            {!emailSubmitted && (<Card className="shadow-sm border-0 p-2 bg-white">
              <Card.Body>
                <h5 className="fw-bold mb-3">Get notified of advanced features</h5>
                <p className="text-muted mb-3">
                  Be the first to know when we launch powerful new features
                </p>
                <form onSubmit={handleEmailSubmit}>
                  <InputGroup className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="py-2"
                    />
                    <Button variant="primary" type="submit" className="px-3 py-2" disabled={isSubmitting}>
                      <FaPaperPlane className="me-2"/>
                      {isSubmitting ? 'Subscribing...' : 'Notify Me'}
                    </Button>
                  </InputGroup>
                  {errorMessage && (<Alert variant="danger" className="mt-2 mb-0 py-2">
                    {errorMessage}
                  </Alert>)}
                  {showSuccessMessage && (<Alert variant="success" className="mt-2 mb-0 py-2">
                    Thanks for subscribing! We'll keep you updated.
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
              What is the IDO ROI Simulator?
            </h2>
            <p className="lead mb-5">
              The IDO ROI Simulator is a free, privacy-first tool that helps crypto investors understand
              their actual return potential from presale token investments. It models your real ROI timeline
              based on TGE %, cliff, vesting schedule, market direction, and FDV.
            </p>

            <div className="card border-0 shadow-sm p-4 mb-4">
              <h5 className="fw-bold mb-3">The IDO ROI Simulator helps you:</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex align-items-center border-0 ps-0">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                       style={{width: "32px", height: "32px", minWidth: "32px"}}>
                    <FaCheck className="text-white" style={{fontSize: '14px'}}/>
                  </div>
                  <span className="fw-medium">Know your break-even point based on token price, vesting schedule, and market conditions</span>
                </li>
                <li className="list-group-item d-flex align-items-center border-0 ps-0">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                       style={{width: "32px", height: "32px", minWidth: "32px"}}>
                    <FaCheck className="text-white" style={{fontSize: '14px'}}/>
                  </div>
                  <span className="fw-medium">Spot dangerous unlock schedules that could create selling pressure and tank your investment</span>
                </li>
                <li className="list-group-item d-flex align-items-center border-0 ps-0">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                       style={{width: "32px", height: "32px", minWidth: "32px"}}>
                    <FaCheck className="text-white" style={{fontSize: '14px'}}/>
                  </div>
                  <span
                    className="fw-medium">Understand how the market affects your exit timing and potential profits</span>
                </li>
                <li className="list-group-item d-flex align-items-center border-0 ps-0">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                       style={{width: "32px", height: "32px", minWidth: "32px"}}>
                    <FaCheck className="text-white" style={{fontSize: '14px'}}/>
                  </div>
                  <span className="fw-medium">Visualize month-by-month token unlocks and their impact on your investment value</span>
                </li>
                <li className="list-group-item d-flex align-items-center border-0 ps-0">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                       style={{width: "32px", height: "32px", minWidth: "32px"}}>
                    <FaCheck className="text-white" style={{fontSize: '14px'}}/>
                  </div>
                  <span className="fw-medium">Compare bear, base, and bull market scenarios to plan your investment strategy</span>
                </li>
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
              Who It's For
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
                      <h5 className="fw-bold mb-0">First-time token investors</h5>
                    </div>
                    <p className="text-muted ms-5 ps-2">
                      Coming from platforms like AngelList, Kickstarter, Seedrs
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
                      <h5 className="fw-bold mb-0">Crypto-native IDO participants</h5>
                    </div>
                    <p className="text-muted ms-5 ps-2">
                      Who want more clarity and timing
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
                      <h5 className="fw-bold mb-0">Early-stage alpha hunters</h5>
                    </div>
                    <p className="text-muted ms-5 ps-2">
                      Looking to simulate exit paths
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
                      <h5 className="fw-bold mb-0">Influencers, analysts, and VCs</h5>
                    </div>
                    <p className="text-muted ms-5 ps-2">
                      Who publish presale content
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
              How It Works
            </h2>
          </Col>
        </Row>

        <Row className="g-4 justify-content-center">
          <Col md={4}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{width: '80px', height: '80px', fontSize: '1.75rem', fontWeight: 'bold'}}>
                  1
                </div>
                <h4 className="fw-bold mb-3">Input Your Investment</h4>
                <p className="text-muted">
                  Enter your presale token price, amount, TGE %, vesting, and cliff.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{width: '80px', height: '80px', fontSize: '1.75rem', fontWeight: 'bold'}}>
                  2
                </div>
                <h4 className="fw-bold mb-3">Simulate Market Scenarios</h4>
                <p className="text-muted">
                  Model outcomes in bear, base, or bull markets.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 text-center border-0 shadow-sm">
              <Card.Body className="p-4">
                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{width: '80px', height: '80px', fontSize: '1.75rem', fontWeight: 'bold'}}>
                  3
                </div>
                <h4 className="fw-bold mb-3">Visualize Results</h4>
                <p className="text-muted">
                  See month-by-month unlocks, break-even point, and ROI progression.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>

    {/* Why It Matters Section */}
    <section className="py-5 bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <h2 className="display-5 fw-bold mb-4 text-center">
              Why Most Retail Investors Get IDOs Wrong
            </h2>

            <div className="d-flex flex-column gap-4 mt-5">
              <div className="d-flex">
                <div
                  className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3 mt-1"
                  style={{width: "24px", height: "24px", minWidth: "24px"}}>
                  <FaInfoCircle className="text-white" style={{fontSize: '14px'}}/>
                </div>
                <p className="fs-5">
                  FDV is often misunderstood — you're buying at a $500M valuation without knowing it
                </p>
              </div>

              <div className="d-flex">
                <div
                  className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3 mt-1"
                  style={{width: "24px", height: "24px", minWidth: "24px"}}>
                  <FaInfoCircle className="text-white" style={{fontSize: '14px'}}/>
                </div>
                <p className="fs-5">
                  Token unlock schedules are buried in whitepapers
                </p>
              </div>

              <div className="d-flex">
                <div
                  className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3 mt-1"
                  style={{width: "24px", height: "24px", minWidth: "24px"}}>
                  <FaInfoCircle className="text-white" style={{fontSize: '14px'}}/>
                </div>
                <p className="fs-5">
                  You expect a 10x, but don't realize your tokens unlock slowly while the market dumps
                </p>
              </div>
            </div>

            <div className="alert alert-primary mt-4 fs-5 text-center">
              <strong>This tool gives you the full picture — before it's too late.</strong>
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
              What's Coming in the Advanced Version
            </h2>

            <div className="row row-cols-1 row-cols-md-2 g-4 text-start mt-4">
              <div className="col">
                <div className="d-flex align-items-start">
                  <div className="me-3 fs-3">📈</div>
                  <div>
                    <h5 className="fw-bold">Partial exit strategy modeling</h5>
                    <p className="text-muted">Optimize when to take profits</p>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="d-flex align-items-start">
                  <div className="me-3 fs-3">📊</div>
                  <div>
                    <h5 className="fw-bold">Dynamic price tracking across months</h5>
                    <p className="text-muted">See how prices evolve over time</p>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="d-flex align-items-start">
                  <div className="me-3 fs-3">⚠️</div>
                  <div>
                    <h5 className="fw-bold">Dump pressure alerts</h5>
                    <p className="text-muted">From VCs, teams, unlock schedules</p>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="d-flex align-items-start">
                  <div className="me-3 fs-3">📥</div>
                  <div>
                    <h5 className="fw-bold">CSV export and PDF sharing</h5>
                    <p className="text-muted">Save and share your analysis</p>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="d-flex align-items-start">
                  <div className="me-3 fs-3">🔔</div>
                  <div>
                    <h5 className="fw-bold">Unlock reminders via Telegram bot</h5>
                    <p className="text-muted">Never miss an unlock event</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="fs-5 fw-medium">Want early access when we release these?</p>
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
                  Join Telegram
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
                  Leave Your Email
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
                  Join Discord
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
                  Follow on X
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
                  YouTube
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
              Explore Real Token Sales on AlphaMind
            </h2>

            <Card className="border-0 shadow text-center p-4 mb-4">
              <Card.Body>
                <h3 className="fw-bold mb-4">Want to see actual live IDOs?</h3>
                <p className="mb-4">Check out AlphaMind's launchpad platform for active presales and opportunities</p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button
                    variant="primary"
                    href="https://app.alphamind.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4"
                    onClick={() => trackLinkClick('https://app.alphamind.co/', 'See Active Presales', 'about_page')}
                  >
                    See Active Presales
                  </Button>
                  <Button
                    variant="outline-primary"
                    href="https://app.alphamind.co/build_karma/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4"
                    onClick={() => trackLinkClick('https://app.alphamind.co/build_karma/', 'Join IDO Quests', 'about_page')}
                  >
                    Join IDO Quests
                  </Button>
                  <Button
                    variant="outline-secondary"
                    href="https://alphamind.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4"
                    onClick={() => trackLinkClick('https://alphamind.co/', 'About AlphaMind', 'about_page')}
                  >
                    About AlphaMind
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
              Privacy-First by Design
            </h2>

            <Row className="g-4 mt-3">
              <Col sm={6} lg={3}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <FaShieldAlt className="text-primary mb-3" style={{fontSize: '2.5rem'}}/>
                    <h5 className="fw-bold">No Tracking</h5>
                    <p className="text-muted small">We don't track or store anything</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6} lg={3}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <FaLock className="text-primary mb-3" style={{fontSize: '2.5rem'}}/>
                    <h5 className="fw-bold">No Wallet</h5>
                    <p className="text-muted small">No wallet connection required</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6} lg={3}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <FaUser className="text-primary mb-3" style={{fontSize: '2.5rem'}}/>
                    <h5 className="fw-bold">No Account</h5>
                    <p className="text-muted small">No account needed</p>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6} lg={3}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4 text-center">
                    <FaRocket className="text-primary mb-3" style={{fontSize: '2.5rem'}}/>
                    <h5 className="fw-bold">Browser-Only</h5>
                    <p className="text-muted small">Everything runs in your browser</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <p className="text-muted mt-4">
              Some advanced features may require $MIND tokens in the future.
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
            <div className="text-muted small text-center">
              <p className="mb-0">
                <strong>Disclaimer:</strong> This simulator is for educational purposes only. ROI outputs are
                hypothetical and not financial advice. Always DYOR. AlphaMind assumes no liability.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* CTA Section */}
    <section className="py-5 bg-primary text-white">
      <Container>
        <Row>
          <Col lg={8} className="mx-auto text-center">
            <h2 className="display-5 fw-bold mb-4">
              Ready to Simulate Your IDO Returns?
            </h2>
            <p className="lead mb-4">
              Start using our free tool now to see your real ROI potential.
            </p>
            <Button
              variant="light"
              size="lg"
              className="px-5 py-3 fw-bold"
              onClick={() => {
                trackButtonClick('try_simulator', 'Try the Simulator', 'about_page');
                onNavigateToSimulator();
              }}
            >
              Try the Simulator
              <FaArrowRight className="ms-2"/>
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
