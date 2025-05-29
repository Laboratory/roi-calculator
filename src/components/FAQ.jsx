import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Accordion, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaQuestionCircle, FaCalculator, FaChartLine, FaLock, FaShieldAlt, FaRocket, FaUsers, FaArrowRight, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import SEO from './SEO';
import { seoConfig } from '../config/seo';

const FAQ = ({ onNavigateToCalculator }) => {
  const { darkMode } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: <FaQuestionCircle />, count: 18 },
    { id: 'calculator', name: 'Calculator', icon: <FaCalculator />, count: 6 },
    { id: 'roi', name: 'ROI Analysis', icon: <FaChartLine />, count: 4 },
    { id: 'unlock', name: 'Token Unlocks', icon: <FaLock />, count: 3 },
    { id: 'security', name: 'Security & Privacy', icon: <FaShieldAlt />, count: 3 },
    { id: 'general', name: 'General', icon: <FaUsers />, count: 2 }
  ];

  const faqs = [
    {
      id: 1,
      category: 'calculator',
      question: 'How do I use the Token ROI Calculator?',
      answer: 'Simply enter your investment amount, token allocation, unlock schedule, and price scenarios (bear, base, bull). The calculator will automatically compute your potential returns, break-even points, and provide detailed monthly breakdowns.',
      popular: true
    },
    {
      id: 2,
      category: 'calculator',
      question: 'What information do I need to start calculating?',
      answer: 'You need: (1) Your investment amount in USD, (2) Number of tokens allocated, (3) Unlock schedule details (cliff period, vesting duration), and (4) Expected token prices for different market scenarios.',
      popular: true
    },
    {
      id: 3,
      category: 'roi',
      question: 'What are the three price scenarios (Bear, Base, Bull)?',
      answer: 'These represent different market conditions: Bear scenario assumes pessimistic market conditions with lower token prices, Base scenario represents realistic expectations, and Bull scenario assumes optimistic market growth with higher prices.',
      popular: true
    },
    {
      id: 4,
      category: 'unlock',
      question: 'What is a cliff period in token unlocks?',
      answer: 'A cliff period is the initial waiting time before any tokens become available for trading. For example, a 6-month cliff means you cannot access any tokens for the first 6 months after your investment.',
      popular: false
    },
    {
      id: 5,
      category: 'unlock',
      question: 'How does linear vesting work?',
      answer: 'Linear vesting means tokens are released gradually over time in equal portions. If you have 12-month linear vesting after a cliff, your tokens will unlock in equal monthly installments over that period.',
      popular: false
    },
    {
      id: 6,
      category: 'security',
      question: 'Is my investment data secure and private?',
      answer: 'Yes, absolutely. All calculations are performed locally in your browser. No data is sent to external servers, stored in databases, or tracked. Your sensitive investment information never leaves your device.',
      popular: true
    },
    {
      id: 7,
      category: 'security',
      question: 'Do I need to create an account or register?',
      answer: 'No registration required! You can start using the calculator immediately without providing any personal information, email addresses, or creating accounts.',
      popular: false
    },
    {
      id: 8,
      category: 'roi',
      question: 'How accurate are the ROI calculations?',
      answer: 'The calculations are mathematically precise based on your inputs. However, they are projections based on your price assumptions. Actual returns depend on real market conditions, which can be unpredictable.',
      popular: false
    },
    {
      id: 9,
      category: 'calculator',
      question: 'Can I save my calculations for later?',
      answer: 'Currently, calculations are session-based and not saved permanently. We recommend taking screenshots or notes of important results. Future updates may include local storage options.',
      popular: false
    },
    {
      id: 10,
      category: 'general',
      question: 'Is this calculator free to use?',
      answer: 'Yes, completely free! There are no hidden fees, subscriptions, or premium features. All functionality is available to everyone at no cost.',
      popular: true
    },
    {
      id: 11,
      category: 'calculator',
      question: 'What if I make a mistake in my inputs?',
      answer: 'You can easily modify any input field and recalculate instantly. The calculator updates results in real-time as you change parameters, making it easy to explore different scenarios.',
      popular: false
    },
    {
      id: 12,
      category: 'roi',
      question: 'What does "break-even" mean in the results?',
      answer: 'Break-even is when your total returns equal your initial investment (0% profit/loss). The calculator shows when you reach break-even in each price scenario and highlights these points in charts.',
      popular: false
    },
    {
      id: 13,
      category: 'unlock',
      question: 'Can I model partial token sales during vesting?',
      answer: 'The current version assumes you hold all tokens until they unlock. Advanced features for modeling partial sales and exit strategies are planned for future updates.',
      popular: false
    },
    {
      id: 14,
      category: 'calculator',
      question: 'How do I interpret the monthly breakdown table?',
      answer: 'The monthly breakdown shows: tokens unlocked each month, cumulative tokens available, potential value at different price scenarios, and running ROI calculations. Green indicates positive returns, red indicates losses.',
      popular: false
    },
    {
      id: 15,
      category: 'security',
      question: 'Can I use this calculator offline?',
      answer: 'The calculator requires an internet connection to load initially, but once loaded, all calculations work offline. No ongoing internet connection is needed for computations.',
      popular: false
    },
    {
      id: 16,
      category: 'general',
      question: 'Who should use this calculator?',
      answer: 'Designed for retail investors participating in token presales, private rounds, or any investment with vesting schedules. Useful for anyone wanting to model potential returns from locked token investments.',
      popular: false
    },
    {
      id: 17,
      category: 'calculator',
      question: 'What browsers are supported?',
      answer: 'Works on all modern browsers including Chrome, Firefox, Safari, and Edge. Mobile browsers are also fully supported with responsive design for smartphones and tablets.',
      popular: false
    },
    {
      id: 18,
      category: 'roi',
      question: 'Should I trust these projections for investment decisions?',
      answer: 'Use projections as one tool among many for analysis. Always do your own research, consider multiple scenarios, and never invest more than you can afford to lose. This is educational software, not financial advice.',
      popular: false
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFAQs = faqs.filter(faq => faq.popular);

  const handleStartCalculating = () => {
    if (onNavigateToCalculator) {
      onNavigateToCalculator();
    }
  };

  // Get SEO config for this page
  const { title, description, canonicalUrl, schema } = seoConfig.faq;

  return (
    <div className="faq-page">
      <SEO 
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
      />
      
      {/* Hero Section */}
      <section className="hero-section bg-light py-5">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <Badge bg="primary" className="mb-3 px-3 py-2">
                <FaQuestionCircle className="me-2" />
                Help Center
              </Badge>
              <h1 className="display-4 fw-bold mb-4">
                Frequently Asked <span className="text-primary">Questions</span>
              </h1>
              <p className="lead text-muted mb-4">
                Find answers to common questions about the Token ROI Calculator, 
                unlock schedules, and investment analysis features.
              </p>
              
              {/* Search Bar */}
              <div className="mb-4">
                <InputGroup size="lg" className="mx-auto" style={{ maxWidth: '500px' }}>
                  <InputGroup.Text>
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search for answers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                </InputGroup>
              </div>

              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="px-4"
                  onClick={handleStartCalculating}
                >
                  Try Calculator
                  <FaArrowRight className="ms-2" />
                </Button>
                <Button variant="outline-secondary" size="lg" className="px-4">
                  Contact Support
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Popular Questions */}
      <section className="py-5">
        <Container>
          <Row>
            <Col className="text-center mb-5">
              <h2 className="display-6 fw-bold mb-3">
                <span className="text-primary">Popular</span> Questions
              </h2>
              <p className="text-muted">Most frequently asked questions by our users</p>
            </Col>
          </Row>
          <Row className="g-4">
            {popularFAQs.slice(0, 3).map((faq) => (
              <Col md={4} key={faq.id}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start mb-3">
                      <Badge bg="primary" className="me-2">Popular</Badge>
                      <Badge bg="light" text="dark" className="text-capitalize">
                        {faq.category}
                      </Badge>
                    </div>
                    <h5 className="card-title fw-bold mb-3">{faq.question}</h5>
                    <p className="card-text text-muted">{faq.answer}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Main FAQ Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            {/* Categories Sidebar */}
            <Col lg={3} className="mb-4 mb-lg-0">
              <Card className="border-0 shadow-sm faq-categories-card">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0 fw-bold">Categories</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'primary' : 'light'}
                      className="w-100 text-start border-0 rounded-0 py-3 px-4 faq-category-btn"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <span className="me-3">{category.icon}</span>
                          <span className="fw-medium">{category.name}</span>
                        </div>
                        <Badge 
                          bg={selectedCategory === category.id ? 'light' : 'primary'}
                          text={selectedCategory === category.id ? 'dark' : 'white'}
                        >
                          {category.count}
                        </Badge>
                      </div>
                    </Button>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            {/* FAQ Content */}
            <Col lg={9}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold mb-0">
                  {selectedCategory === 'all' ? 'All Questions' : 
                   categories.find(c => c.id === selectedCategory)?.name}
                </h3>
                <Badge bg="secondary" className="px-3 py-2">
                  {filteredFAQs.length} {filteredFAQs.length === 1 ? 'Question' : 'Questions'}
                </Badge>
              </div>

              {filteredFAQs.length === 0 ? (
                <Card className="border-0 shadow-sm text-center py-5">
                  <Card.Body>
                    <FaSearch className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                    <h4 className="fw-bold mb-3">No Results Found</h4>
                    <p className="text-muted mb-4">
                      Try adjusting your search terms or browse different categories.
                    </p>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                    >
                      Clear Filters
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <Accordion className="shadow-sm">
                  {filteredFAQs.map((faq, index) => (
                    <Accordion.Item key={faq.id} eventKey={faq.id.toString()}>
                      <Accordion.Header>
                        <div className="d-flex align-items-center w-100">
                          <div className="me-3">
                            {faq.popular && <Badge bg="warning" text="dark" className="me-2">Popular</Badge>}
                            <Badge bg="light" text="dark" className="text-capitalize">
                              {faq.category}
                            </Badge>
                          </div>
                          <span className="fw-medium">{faq.question}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="py-4">
                        <p className="mb-0 text-muted lh-lg">{faq.answer}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Help Section */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <div className="mb-4">
                <FaQuestionCircle className="text-primary mb-3" style={{ fontSize: '4rem' }} />
              </div>
              <h2 className="display-6 fw-bold mb-4">
                Still Have <span className="text-primary">Questions</span>?
              </h2>
              <p className="lead text-muted mb-4">
                Can't find what you're looking for? Our support team is here to help you 
                get the most out of the Token ROI Calculator.
              </p>
              
              <Row className="g-4 mb-5">
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center p-4">
                      <FaRocket className="text-primary mb-3" style={{ fontSize: '2rem' }} />
                      <h5 className="fw-bold">Quick Start</h5>
                      <p className="text-muted small mb-3">Jump right into calculating your ROI</p>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={handleStartCalculating}
                      >
                        Start Now
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center p-4">
                      <FaUsers className="text-success mb-3" style={{ fontSize: '2rem' }} />
                      <h5 className="fw-bold">Community</h5>
                      <p className="text-muted small mb-3">Join our Discord community</p>
                      <Button variant="outline-success" size="sm">
                        Join Discord
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center p-4">
                      <FaShieldAlt className="text-info mb-3" style={{ fontSize: '2rem' }} />
                      <h5 className="fw-bold">Support</h5>
                      <p className="text-muted small mb-3">Get direct help from our team</p>
                      <Button variant="outline-info" size="sm">
                        Contact Us
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="bg-primary text-white rounded-3 p-4">
                <h4 className="fw-bold mb-2">💡 Pro Tip</h4>
                <p className="mb-0">
                  For the most accurate results, research realistic price targets based on 
                  comparable projects, market conditions, and tokenomics fundamentals.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default FAQ;
