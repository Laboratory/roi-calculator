import React, { useContext } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { FaCalculator, FaChartLine, FaLock, FaUsers, FaShieldAlt, FaRocket, FaArrowRight, FaCheck, FaStar } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import SEO from './SEO';
import { seoConfig } from '../config/seo';

const About = ({ onNavigateToSimulator }) => {
  const { darkMode } = useContext(ThemeContext);

  // Get SEO config for this page
  const { title, description, canonicalUrl, schema } = seoConfig.about;

  const features = [
    {
      icon: <FaCalculator />,
      title: "Advanced ROI Calculations",
      description: "Comprehensive return on investment analysis with multiple price scenarios including bear, base, and bull market conditions.",
      color: "primary"
    },
    {
      icon: <FaChartLine />,
      title: "Visual Analytics",
      description: "Interactive charts and graphs to visualize your potential returns and break-even points across different timeframes.",
      color: "success"
    },
    {
      icon: <FaLock />,
      title: "Token Unlock Schedules",
      description: "Detailed unlock timeline visualization showing when your tokens become available for trading.",
      color: "danger"
    },
    {
      icon: <FaUsers />,
      title: "Retail Investor Focused",
      description: "Designed specifically for individual investors participating in token presales and private rounds.",
      color: "warning"
    },
    {
      icon: <FaShieldAlt />,
      title: "Risk Assessment",
      description: "Built-in risk analysis tools to help you understand potential downsides and market volatility impacts.",
      color: "info"
    },
    {
      icon: <FaRocket />,
      title: "Market Scenarios",
      description: "Simulate various market conditions to prepare for different outcomes and plan your investment strategy.",
      color: "secondary"
    }
  ];

  const stats = [
    { number: "3", label: "Price Scenarios", description: "Bear, Base & Bull market analysis", icon: "📊" },
    { number: "12+", label: "Months", description: "Detailed monthly breakdown", icon: "📅" },
    { number: "100%", label: "Free", description: "No hidden fees or subscriptions", icon: "💎" },
    { number: "∞", label: "Calculations", description: "Unlimited use for all your investments", icon: "🚀" }
  ];

  const benefits = [
    "Professional-grade investment analysis tools",
    "Complete privacy with local calculations",
    "No registration or personal data required",
    "Real-time scenario modeling",
    "Mobile-responsive design",
    "Open source and transparent"
  ];

  const steps = [
    {
      number: "01",
      title: "Input Investment Details",
      description: "Enter your investment amount, token allocation, and unlock schedule parameters with our intuitive interface."
    },
    {
      number: "02", 
      title: "Define Price Scenarios",
      description: "Set bear, base, and bull market price targets based on your research and market expectations."
    },
    {
      number: "03",
      title: "Analyze & Plan",
      description: "Review comprehensive ROI analysis, monthly breakdowns, and unlock schedules to optimize your strategy."
    }
  ];

  const handleStartCalculating = () => {
    if (onNavigateToSimulator) {
      onNavigateToSimulator();
    }
  };

  return (
    <div className="about-page">
      <SEO 
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
      />
      {/* Hero Section */}
      <section className="hero-section bg-light py-5">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="mb-4 mb-lg-0">
              <Badge bg="primary" className="mb-3 px-3 py-2">
                <FaStar className="me-2" />
                Free Forever
              </Badge>
              <h1 className="display-4 fw-bold mb-4">
                Professional Token
                <span className="text-primary"> Investment Analysis</span>
              </h1>
              <p className="lead mb-4 text-muted">
                Empower your crypto investments with institutional-grade ROI calculations, 
                unlock schedules, and risk analysis tools designed for retail investors.
              </p>
              <div className="mb-4">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <FaCheck className="text-success me-3" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="d-flex gap-3 flex-wrap">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="px-4"
                  onClick={handleStartCalculating}
                >
                  Start Calculating
                  <FaArrowRight className="ms-2" />
                </Button>
                <Button variant="outline-secondary" size="lg" className="px-4">
                  Learn More
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <img 
                  src="https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                  alt="Token Simulator Analytics Dashboard" 
                  className="img-fluid rounded-3 shadow-lg"
                  style={{ maxWidth: '500px', height: '350px', objectFit: 'cover' }}
                />
                <Card className="position-absolute top-0 start-0 translate-middle-y ms-n3 shadow-sm" style={{ width: '140px' }}>
                  <Card.Body className="text-center py-2">
                    <div className="h5 text-success mb-0">+247%</div>
                    <small className="text-muted">Bull ROI</small>
                  </Card.Body>
                </Card>
                <Card className="position-absolute bottom-0 end-0 translate-middle-y me-n3 shadow-sm" style={{ width: '140px' }}>
                  <Card.Body className="text-center py-2">
                    <div className="h5 text-primary mb-0">12 Mo</div>
                    <small className="text-muted">Unlock Period</small>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col md={6} lg={3} key={index}>
                <Card className="h-100 text-center border-0 shadow-sm">
                  <Card.Body className="py-4">
                    <div className="display-6 mb-3">{stat.icon}</div>
                    <div className="display-5 fw-bold text-primary mb-2">{stat.number}</div>
                    <h5 className="card-title">{stat.label}</h5>
                    <p className="card-text text-muted small">{stat.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            <Col lg={6} className="mb-5 mb-lg-0">
              <h2 className="display-5 fw-bold mb-4">
                Why Choose <span className="text-primary">TokenSimulator</span>?
              </h2>
              <p className="lead text-muted mb-4">
                Built by investors, for investors. Every feature is designed to solve real problems 
                in the crypto investment landscape.
              </p>
              <div className="mb-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="d-flex align-items-center mb-3">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '32px', height: '32px' }}>
                      <FaCheck className="text-white" style={{ fontSize: '14px' }} />
                    </div>
                    <span className="fw-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={6}>
              <Row className="g-4">
                {features.map((feature, index) => (
                  <Col md={6} key={index}>
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body className="p-4">
                        <div className={`text-${feature.color} mb-3`} style={{ fontSize: '2rem' }}>
                          {feature.icon}
                        </div>
                        <h5 className="card-title fw-bold">{feature.title}</h5>
                        <p className="card-text text-muted">{feature.description}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col className="text-center mb-5">
              <h2 className="display-5 fw-bold mb-4">
                How It <span className="text-primary">Works</span>
              </h2>
              <p className="lead text-muted">
                Simple, powerful, and designed for real-world investment scenarios.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {steps.map((step, index) => (
              <Col md={4} key={index}>
                <Card className="h-100 text-center border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" 
                         style={{ width: '80px', height: '80px', fontSize: '1.5rem', fontWeight: 'bold' }}>
                      {step.number}
                    </div>
                    <h4 className="card-title fw-bold mb-3">{step.title}</h4>
                    <p className="card-text text-muted">{step.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col className="text-center mb-5">
              <div className="about-header">
                <h1>About the IDO ROI Simulator</h1>
                <p className="subtitle">Built by AlphaMind to protect retail investors</p>
              </div>
              <div className="about-section">
                <h2>Why We Built This</h2>
                <p>
                  The IDO ROI Simulator was created to help crypto investors make more informed decisions about token presales and IDOs. 
                  Too many retail investors fall victim to misleading marketing that focuses on fully diluted valuation (FDV) 
                  without accounting for token unlock schedules and market conditions.
                </p>
                <p>
                  Our mission is to provide a free, easy-to-use tool that lets you visualize real returns, understand token unlocks, 
                  and break free from FDV illusions. We believe that better information leads to better investment decisions.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Privacy Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 className="display-5 fw-bold mb-4">
                <span className="text-primary">Privacy</span> First Approach
              </h2>
              <p className="lead text-muted mb-4">
                Your investment data never leaves your browser. All calculations are performed locally, 
                ensuring complete privacy and security of your sensitive financial information.
              </p>
              <Row className="g-3">
                <Col sm={6}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-3">
                      <FaShieldAlt className="text-primary mb-2" style={{ fontSize: '1.5rem' }} />
                      <h6 className="fw-bold">Zero Data Collection</h6>
                      <small className="text-muted">No tracking, no analytics, no data storage</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-3">
                      <FaLock className="text-primary mb-2" style={{ fontSize: '1.5rem' }} />
                      <h6 className="fw-bold">Local Calculations</h6>
                      <small className="text-muted">All processing happens in your browser</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-3">
                      <FaUsers className="text-primary mb-2" style={{ fontSize: '1.5rem' }} />
                      <h6 className="fw-bold">No Registration</h6>
                      <small className="text-muted">Start using immediately, no sign-up required</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="p-3">
                      <FaRocket className="text-primary mb-2" style={{ fontSize: '1.5rem' }} />
                      <h6 className="fw-bold">Open Source</h6>
                      <small className="text-muted">Transparent and community-driven</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col lg={6}>
              <div className="text-center">
                <div className="bg-primary text-white rounded-3 p-5 d-inline-block shadow-lg">
                  <FaShieldAlt style={{ fontSize: '4rem' }} className="mb-3" />
                  <h3 className="fw-bold">100% Secure</h3>
                  <p className="mb-0">Your data stays private</p>
                </div>
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
                Ready to <span className="text-warning">Optimize</span> Your Investments?
              </h2>
              <p className="lead mb-4">
                Join thousands of investors who trust TokenSimulator for their crypto investment analysis.
              </p>
              <Button 
                variant="light" 
                size="lg" 
                className="px-5 py-3 fw-bold"
                onClick={handleStartCalculating}
              >
                Start Your Analysis
                <FaArrowRight className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
