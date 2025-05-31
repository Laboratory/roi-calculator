import React, { useContext, useState } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Badge, Card, Accordion } from 'react-bootstrap';
import { FaSearch, FaQuestionCircle, FaCalculator, FaChartLine, FaLock, FaShieldAlt, FaUsers, FaArrowRight } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import SEO from './SEO';
import { seoConfig } from '../config/seo';
import { useTranslation } from 'react-i18next';

const FAQ = ({ onNavigateToSimulator }) => {
  const { darkMode } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { t } = useTranslation(['faq', 'common']);
  
  // Get SEO config for this page
  const { title, description, canonicalUrl, schema } = seoConfig.faq;

  const faqs = [
    {
      id: 1,
      category: 'simulator',
      question: t('faq:categories.simulator.questions.q1.question'),
      answer: t('faq:categories.simulator.questions.q1.answer'),
      popular: true
    },
    {
      id: 2,
      category: 'simulator',
      question: t('faq:categories.simulator.questions.q2.question'),
      answer: t('faq:categories.simulator.questions.q2.answer'),
      popular: true
    },
    {
      id: 3,
      category: 'roi',
      question: t('faq:categories.roi.questions.q1.question'),
      answer: t('faq:categories.roi.questions.q1.answer'),
      popular: true
    },
    {
      id: 4,
      category: 'unlock',
      question: t('faq:categories.unlock.questions.q1.question'),
      answer: t('faq:categories.unlock.questions.q1.answer'),
      popular: false
    },
    {
      id: 5,
      category: 'unlock',
      question: t('faq:categories.unlock.questions.q2.question'),
      answer: t('faq:categories.unlock.questions.q2.answer'),
      popular: false
    },
    {
      id: 6,
      category: 'security',
      question: t('faq:categories.security.questions.q1.question'),
      answer: t('faq:categories.security.questions.q1.answer'),
      popular: true
    },
    {
      id: 7,
      category: 'security',
      question: t('faq:categories.security.questions.q2.question'),
      answer: t('faq:categories.security.questions.q2.answer'),
      popular: false
    },
    {
      id: 8,
      category: 'roi',
      question: t('faq:categories.roi.questions.q2.question'),
      answer: t('faq:categories.roi.questions.q2.answer'),
      popular: false
    },
    {
      id: 9,
      category: 'simulator',
      question: t('faq:categories.simulator.questions.q3.question'),
      answer: t('faq:categories.simulator.questions.q3.answer'),
      popular: false
    },
    {
      id: 10,
      category: 'general',
      question: t('faq:categories.general.questions.q1.question'),
      answer: t('faq:categories.general.questions.q1.answer'),
      popular: true
    },
    {
      id: 11,
      category: 'simulator',
      question: t('faq:categories.simulator.questions.q4.question'),
      answer: t('faq:categories.simulator.questions.q4.answer'),
      popular: false
    },
    {
      id: 12,
      category: 'roi',
      question: t('faq:categories.roi.questions.q3.question'),
      answer: t('faq:categories.roi.questions.q3.answer'),
      popular: false
    },
    {
      id: 13,
      category: 'unlock',
      question: t('faq:categories.unlock.questions.q3.question'),
      answer: t('faq:categories.unlock.questions.q3.answer'),
      popular: false
    },
    {
      id: 14,
      category: 'simulator',
      question: t('faq:categories.simulator.questions.q5.question'),
      answer: t('faq:categories.simulator.questions.q5.answer'),
      popular: false
    },
    {
      id: 15,
      category: 'security',
      question: t('faq:categories.security.questions.q3.question'),
      answer: t('faq:categories.security.questions.q3.answer'),
      popular: false
    },
    {
      id: 16,
      category: 'general',
      question: t('faq:categories.general.questions.q2.question'),
      answer: t('faq:categories.general.questions.q2.answer'),
      popular: false
    },
    {
      id: 17,
      category: 'simulator',
      question: t('faq:categories.simulator.questions.q6.question'),
      answer: t('faq:categories.simulator.questions.q6.answer'),
      popular: false
    },
    {
      id: 18,
      category: 'roi',
      question: t('faq:categories.roi.questions.q4.question'),
      answer: t('faq:categories.roi.questions.q4.answer'),
      popular: false
    }
  ];

  const categories = [
    { id: 'all', name: t('faq:categories.all.title'), icon: <FaQuestionCircle />, count: 18 },
    { id: 'simulator', name: t('faq:categories.simulator.title'), icon: <FaCalculator />, count: 6 },
    { id: 'roi', name: t('faq:categories.roi.title'), icon: <FaChartLine />, count: 4 },
    { id: 'unlock', name: t('faq:categories.unlock.title'), icon: <FaLock />, count: 3 },
    { id: 'security', name: t('faq:categories.security.title'), icon: <FaShieldAlt />, count: 3 },
    { id: 'general', name: t('faq:categories.general.title'), icon: <FaUsers />, count: 2 }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFAQs = faqs.filter(faq => faq.popular);

  const handleStartSimulating = () => {
    if (onNavigateToSimulator) {
      onNavigateToSimulator();
    }
  };

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
                {t('faq:helpCenter')}
              </Badge>
              <h1 className="display-4 fw-bold mb-4">
                {t('faq:title')} <span className="text-primary">{t('faq:questions')}</span>
              </h1>
              <p className="lead text-muted mb-4">
                {t('faq:subtitle')}
              </p>
              
              {/* Search Bar */}
              <div className="mb-4">
                <InputGroup size="lg" className="mx-auto" style={{ maxWidth: '500px' }}>
                  <InputGroup.Text>
                    <FaSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={t('common:general.search')}
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
                  onClick={handleStartSimulating}
                >
                  {t('faq:trySimulator')}
                  <FaArrowRight className="ms-2" />
                </Button>
                <Button variant="outline-secondary" size="lg" className="px-4">
                  {t('faq:contactSupport')}
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
                <span className="text-primary">{t('faq:popular')}</span> {t('faq:questions')}
              </h2>
              <p className="text-muted">{t('faq:mostFrequentlyAsked')}</p>
            </Col>
          </Row>
          <Row className="g-4">
            {popularFAQs.slice(0, 3).map((faq) => (
              <Col md={4} key={faq.id}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start mb-3">
                      <Badge bg="primary" className="me-2">{t('faq:popular')}</Badge>
                      <Badge bg="light" text="dark" className="text-capitalize">
                        {t(`faq:categories.${faq.category}.title`)}
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
                  <h5 className="mb-0 fw-bold">{t('faq:categories.title')}</h5>
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
                  {selectedCategory === 'all' ? t('faq:categories.all.title') : 
                   categories.find(c => c.id === selectedCategory)?.name}
                </h3>
                <Badge bg="secondary" className="px-3 py-2">
                  {filteredFAQs.length} {filteredFAQs.length === 1 ? t('faq:question') : t('faq:questions')}
                </Badge>
              </div>

              {filteredFAQs.length === 0 ? (
                <Card className="border-0 shadow-sm text-center py-5">
                  <Card.Body>
                    <FaSearch className="text-muted mb-3" style={{ fontSize: '3rem' }} />
                    <h4 className="fw-bold mb-3">{t('faq:noResultsFound')}</h4>
                    <p className="text-muted mb-4">
                      {t('faq:tryAnotherSearch')}
                    </p>
                    <Button 
                      variant="outline-primary" 
                      onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                    >
                      {t('faq:clearFilters')}
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
                            {faq.popular && <Badge bg="warning" text="dark" className="me-2">{t('faq:popular')}</Badge>}
                            <Badge bg="light" text="dark" className="text-capitalize">
                              {t(`faq:categories.${faq.category}.title`)}
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
                {t('faq:stillHaveQuestions.title')} <span className="text-primary">{t('faq:questions')}</span>?
              </h2>
              <p className="lead text-muted mb-4">
                {t('faq:stillHaveQuestions.subtitle')}
              </p>
              
              <Row className="g-4 mb-5">
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center p-4">
                      <FaArrowRight className="text-primary mb-3" style={{ fontSize: '2rem' }} />
                      <h5 className="fw-bold">{t('faq:quickStart.title')}</h5>
                      <p className="text-muted small mb-3">{t('faq:quickStart.description')}</p>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={handleStartSimulating}
                      >
                        {t('faq:quickStart.button')}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center p-4">
                      <FaUsers className="text-success mb-3" style={{ fontSize: '2rem' }} />
                      <h5 className="fw-bold">{t('faq:community.title')}</h5>
                      <p className="text-muted small mb-3">{t('faq:community.description')}</p>
                      <Button variant="outline-success" size="sm">
                        {t('faq:community.button')}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center p-4">
                      <FaShieldAlt className="text-info mb-3" style={{ fontSize: '2rem' }} />
                      <h5 className="fw-bold">{t('faq:support.title')}</h5>
                      <p className="text-muted small mb-3">{t('faq:support.description')}</p>
                      <Button variant="outline-info" size="sm">
                        {t('faq:support.button')}
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <div className="bg-primary text-white rounded-3 p-4">
                <h4 className="fw-bold mb-2">{t('faq:proTip.title')}</h4>
                <p className="mb-0">
                  {t('faq:proTip.text')}
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
