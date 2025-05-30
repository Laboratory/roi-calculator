import React, { useContext } from 'react';
import { Container, Row, Col, Card, Accordion, Button, Table, Badge } from 'react-bootstrap';
import { 
  FaArrowRight,
  FaCalculator, 
  FaChartLine, 
  FaChevronDown, 
  FaClock, 
  FaCoins, 
  FaDollarSign, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaLock, 
  FaPercentage, 
  FaQuestion, 
  FaRegChartBar
} from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import SEO from './SEO';
import { seoConfig } from '../config/seo';

const Education = ({ onNavigateToSimulator }) => {
  const { darkMode } = useContext(ThemeContext);
  
  // SEO configuration
  const { title, description, canonicalUrl, schema } = seoConfig.education;

  const handleStartSimulating = () => {
    if (onNavigateToSimulator) {
      onNavigateToSimulator();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Glossary of terms for quick reference
  const glossaryTerms = [
    {
      term: "IDO",
      definition: "Initial DEX Offering - A fundraising method where new cryptocurrency projects sell tokens directly through decentralized exchanges.",
      category: "general"
    },
    {
      term: "ROI",
      definition: "Return on Investment - The profit or loss from an investment expressed as a percentage of the initial cost.",
      category: "general"
    },
    {
      term: "TGE",
      definition: "Token Generation Event - The moment when a project's tokens are created and distributed to initial investors.",
      category: "investment"
    },
    {
      term: "TGE %",
      definition: "The percentage of your total token allocation that becomes available at the Token Generation Event.",
      category: "investment"
    },
    {
      term: "Cliff",
      definition: "A period after TGE during which no tokens are unlocked.",
      category: "vesting"
    },
    {
      term: "Vesting",
      definition: "The process of gradually releasing tokens over time according to a predetermined schedule.",
      category: "vesting"
    },
    {
      term: "Vesting Period",
      definition: "The total duration over which all tokens will be released.",
      category: "vesting"
    },
    {
      term: "FDV",
      definition: "Fully Diluted Valuation - The theoretical value of a cryptocurrency project if all tokens were in circulation.",
      category: "valuation"
    },
    {
      term: "Market Cap",
      definition: "The total value of all circulating tokens, calculated by multiplying the current price by the circulating supply.",
      category: "valuation"
    },
    {
      term: "Bear Market",
      definition: "A market condition in which prices are falling and investor confidence is low.",
      category: "market"
    },
    {
      term: "Base Market",
      definition: "A market condition with moderate growth, representing the expected average case scenario.",
      category: "market"
    },
    {
      term: "Bull Market",
      definition: "A market condition in which prices are rising and investor confidence is high.",
      category: "market"
    },
    {
      term: "Unlock Schedule",
      definition: "The timeline detailing when tokens are released from vesting restrictions and become available for trading.",
      category: "vesting"
    },
    {
      term: "Break-even Point",
      definition: "The point at which the returns from an investment equal the cost of the investment.",
      category: "investment"
    }
  ];

  // Calculator parameters with detailed explanations
  const calculatorParams = [
    {
      name: "Token Price",
      icon: <FaDollarSign />,
      description: "The price per token during the presale or IDO. This is how much you pay for each token.",
      tips: "Usually much lower than the expected listing price on exchanges.",
      example: "$0.05 per token"
    },
    {
      name: "Investment Amount",
      icon: <FaDollarSign />,
      description: "The total amount of money you invest in the token sale.",
      tips: "Only invest what you can afford to lose.",
      example: "$1,000"
    },
    {
      name: "TGE %",
      icon: <FaPercentage />,
      description: "The percentage of your total token allocation released immediately at the Token Generation Event.",
      tips: "Lower TGE % means more tokens are locked in vesting.",
      example: "10% (of your tokens available at TGE)"
    },
    {
      name: "Cliff Period",
      icon: <FaClock />,
      description: "A period after TGE during which no additional tokens are unlocked.",
      tips: "Longer cliffs can be riskier as you can't sell during this time.",
      example: "3 months"
    },
    {
      name: "Vesting Period",
      icon: <FaLock />,
      description: "The total duration over which your remaining tokens (after TGE) will be gradually unlocked.",
      tips: "Shorter vesting periods are generally better for investors.",
      example: "12 months"
    },
    {
      name: "Total Token Supply",
      icon: <FaCoins />,
      description: "The total number of tokens that will ever exist for this project.",
      tips: "Used to calculate the fully diluted valuation (FDV).",
      example: "100,000,000 tokens"
    },
    {
      name: "Bear Price",
      icon: <FaRegChartBar />,
      description: "The estimated token price in a negative market scenario.",
      tips: "Always plan for this scenario to assess your risk.",
      example: "$0.08 per token (60% increase from IDO price)"
    },
    {
      name: "Base Price",
      icon: <FaRegChartBar />,
      description: "The estimated token price in a neutral market scenario.",
      tips: "This is the most likely outcome in many cases.",
      example: "$0.15 per token (200% increase from IDO price)"
    },
    {
      name: "Bull Price",
      icon: <FaRegChartBar />,
      description: "The estimated token price in a positive market scenario.",
      tips: "Be realistic - not every project will do 100x.",
      example: "$0.50 per token (900% increase from IDO price)"
    }
  ];

  return (
    <div className="education-page">
      <SEO 
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
      />

      {/* Hero Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h1 className="display-4 fw-bold mb-3">IDO ROI Simulator Education</h1>
              <p className="lead mb-4">
                Learn how to use our simulator to make informed token investment decisions.
                No prior crypto knowledge required.
              </p>
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleStartSimulating}
                className="mb-4"
              >
                Try the Simulator <FaArrowRight className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Introduction */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="border-0 shadow-sm mb-5">
                <Card.Body className="p-4">
                  <h2 className="mb-4">What is the IDO ROI Simulator?</h2>
                  <p>
                    The IDO ROI Simulator is a tool that helps you predict the potential return on investment (ROI) 
                    for token presales and Initial DEX Offerings (IDOs). It takes into account token unlock schedules, 
                    vesting periods, and various market scenarios to give you a realistic view of your investment 
                    potential.
                  </p>
                  <p>
                    Unlike simplified calculators that only consider fully diluted valuation (FDV), our simulator 
                    shows you exactly when your tokens will become available and what your returns might look like 
                    under different market conditions.
                  </p>
                  <div className="alert alert-info d-flex align-items-start">
                    <FaInfoCircle className="me-3 mt-1" />
                    <div>
                      <strong>Why this matters:</strong> Many investors are disappointed with their IDO returns because 
                      they don't account for token vesting schedules and changing market conditions. This simulator helps 
                      you set realistic expectations and make better investment decisions.
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How To Use Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="text-center mb-5">How to Use the Simulator</h2>
              
              <div className="d-flex flex-column gap-4">
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-3"
                           style={{ width: "48px", height: "48px", minWidth: "48px" }}>
                        <h3 className="mb-0">1</h3>
                      </div>
                      <h4 className="mb-0">Enter Your Investment Details</h4>
                    </div>
                    <div className="ms-5 ps-2">
                      <p>
                        Input the token price, your investment amount, and the number of tokens you'll receive.
                        These values should be available in the project's documentation or investment portal.
                      </p>
                      <div className="alert alert-light">
                        <strong>Example:</strong> Token price: $0.05, Investment: $1,000, Tokens: 20,000
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-3"
                           style={{ width: "48px", height: "48px", minWidth: "48px" }}>
                        <h3 className="mb-0">2</h3>
                      </div>
                      <h4 className="mb-0">Specify the Token Unlock Schedule</h4>
                    </div>
                    <div className="ms-5 ps-2">
                      <p>
                        Enter the TGE % (tokens available at launch), cliff period (waiting time before more tokens unlock),
                        and vesting period (how long until all tokens are released).
                      </p>
                      <div className="alert alert-light">
                        <strong>Example:</strong> TGE: 10%, Cliff: 1 month, Vesting: 12 months
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-3"
                           style={{ width: "48px", height: "48px", minWidth: "48px" }}>
                        <h3 className="mb-0">3</h3>
                      </div>
                      <h4 className="mb-0">Set Price Targets for Different Market Scenarios</h4>
                    </div>
                    <div className="ms-5 ps-2">
                      <p>
                        Define your expected token prices under bear (pessimistic), base (realistic),
                        and bull (optimistic) market conditions.
                      </p>
                      <div className="alert alert-light">
                        <strong>Example:</strong> Bear: $0.08, Base: $0.15, Bull: $0.50
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-3"
                           style={{ width: "48px", height: "48px", minWidth: "48px" }}>
                        <h3 className="mb-0">4</h3>
                      </div>
                      <h4 className="mb-0">Analyze the Results</h4>
                    </div>
                    <div className="ms-5 ps-2">
                      <p>
                        Review the generated unlock schedule, monthly ROI breakdown, and overall return
                        projections under each market scenario.
                      </p>
                      <div className="alert alert-light">
                        <strong>Key insights to look for:</strong>
                        <ul className="mb-0 mt-2">
                          <li>When you'll break even on your investment</li>
                          <li>How token unlocks affect your total holdings over time</li>
                          <li>Maximum potential ROI under different market conditions</li>
                        </ul>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Parameters Explained Section */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="text-center mb-5">Simulator Parameters Explained</h2>
              
              <Accordion className="parameter-accordion mb-4">
                {calculatorParams.map((param, index) => (
                  <Accordion.Item key={index} eventKey={index.toString()} className="mb-3 border-0 shadow-sm">
                    <Accordion.Header>
                      <div className="d-flex align-items-center">
                        <div className="me-3 text-primary">
                          {param.icon}
                        </div>
                        <span className="fw-bold">{param.name}</span>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="mb-3">{param.description}</div>
                      <div className="alert alert-info mb-2 d-flex align-items-start">
                        <FaInfoCircle className="me-2 mt-1" />
                        <div><strong>Tip:</strong> {param.tips}</div>
                      </div>
                      <div className="alert alert-light mb-0">
                        <strong>Example:</strong> {param.example}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Glossary Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="text-center mb-5">Glossary of Terms</h2>
              
              <div className="mb-4">
                <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center">
                  <Button variant="outline-secondary" size="sm" onClick={() => document.getElementById('all-terms').scrollIntoView({ behavior: 'smooth' })}>
                    All Terms
                  </Button>
                  <Button variant="outline-primary" size="sm" onClick={() => document.getElementById('general-terms').scrollIntoView({ behavior: 'smooth' })}>
                    General
                  </Button>
                  <Button variant="outline-info" size="sm" onClick={() => document.getElementById('investment-terms').scrollIntoView({ behavior: 'smooth' })}>
                    Investment
                  </Button>
                  <Button variant="outline-success" size="sm" onClick={() => document.getElementById('vesting-terms').scrollIntoView({ behavior: 'smooth' })}>
                    Vesting
                  </Button>
                  <Button variant="outline-warning" size="sm" onClick={() => document.getElementById('valuation-terms').scrollIntoView({ behavior: 'smooth' })}>
                    Valuation
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => document.getElementById('market-terms').scrollIntoView({ behavior: 'smooth' })}>
                    Market
                  </Button>
                </div>
                
                <div id="all-terms">
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h4 className="mb-3">All Terms</h4>
                      <Table responsive className="table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '30%' }}>Term</th>
                            <th>Definition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {glossaryTerms.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold">
                                {item.term}
                                <Badge 
                                  bg={
                                    item.category === 'general' ? 'primary' : 
                                    item.category === 'investment' ? 'info' :
                                    item.category === 'vesting' ? 'success' :
                                    item.category === 'valuation' ? 'warning' :
                                    'danger'
                                  } 
                                  className="ms-2"
                                >
                                  {item.category}
                                </Badge>
                              </td>
                              <td>{item.definition}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
                
                <div id="general-terms">
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h4 className="mb-3">General Terms</h4>
                      <Table responsive className="table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '30%' }}>Term</th>
                            <th>Definition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {glossaryTerms
                            .filter(item => item.category === 'general')
                            .map((item, index) => (
                              <tr key={index}>
                                <td className="fw-bold">{item.term}</td>
                                <td>{item.definition}</td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
                
                <div id="investment-terms">
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h4 className="mb-3">Investment Terms</h4>
                      <Table responsive className="table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '30%' }}>Term</th>
                            <th>Definition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {glossaryTerms
                            .filter(item => item.category === 'investment')
                            .map((item, index) => (
                              <tr key={index}>
                                <td className="fw-bold">{item.term}</td>
                                <td>{item.definition}</td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
                
                <div id="vesting-terms">
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h4 className="mb-3">Vesting Terms</h4>
                      <Table responsive className="table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '30%' }}>Term</th>
                            <th>Definition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {glossaryTerms
                            .filter(item => item.category === 'vesting')
                            .map((item, index) => (
                              <tr key={index}>
                                <td className="fw-bold">{item.term}</td>
                                <td>{item.definition}</td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
                
                <div id="valuation-terms">
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h4 className="mb-3">Valuation Terms</h4>
                      <Table responsive className="table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '30%' }}>Term</th>
                            <th>Definition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {glossaryTerms
                            .filter(item => item.category === 'valuation')
                            .map((item, index) => (
                              <tr key={index}>
                                <td className="fw-bold">{item.term}</td>
                                <td>{item.definition}</td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
                
                <div id="market-terms">
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                      <h4 className="mb-3">Market Terms</h4>
                      <Table responsive className="table-hover">
                        <thead>
                          <tr>
                            <th style={{ width: '30%' }}>Term</th>
                            <th>Definition</th>
                          </tr>
                        </thead>
                        <tbody>
                          {glossaryTerms
                            .filter(item => item.category === 'market')
                            .map((item, index) => (
                              <tr key={index}>
                                <td className="fw-bold">{item.term}</td>
                                <td>{item.definition}</td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Common Investor Mistakes Section */}
      <section className="py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <h2 className="text-center mb-5">Common Investor Mistakes</h2>
              
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-danger rounded-circle text-white d-flex align-items-center justify-content-center me-3 mt-1"
                         style={{ width: "32px", height: "32px", minWidth: "32px" }}>
                      <FaExclamationTriangle />
                    </div>
                    <div>
                      <h5 className="mb-2">Ignoring Vesting Schedules</h5>
                      <p className="mb-0">
                        Many investors focus only on the initial price without considering how token 
                        unlocks affect their actual returns. Remember that you can only sell tokens 
                        once they're unlocked, and by then, market conditions may have changed.
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-danger rounded-circle text-white d-flex align-items-center justify-content-center me-3 mt-1"
                         style={{ width: "32px", height: "32px", minWidth: "32px" }}>
                      <FaExclamationTriangle />
                    </div>
                    <div>
                      <h5 className="mb-2">Overestimating Market Performance</h5>
                      <p className="mb-0">
                        It's tempting to focus only on bull market scenarios, but reality often 
                        falls somewhere between base and bear cases. Always consider all scenarios 
                        when making investment decisions.
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start mb-4">
                    <div className="bg-danger rounded-circle text-white d-flex align-items-center justify-content-center me-3 mt-1"
                         style={{ width: "32px", height: "32px", minWidth: "32px" }}>
                      <FaExclamationTriangle />
                    </div>
                    <div>
                      <h5 className="mb-2">Not Understanding FDV (Fully Diluted Valuation)</h5>
                      <p className="mb-0">
                        Projects often promote their current valuation without mentioning the fully 
                        diluted valuation, which includes all tokens that will eventually enter 
                        circulation. This can lead to price surprises when more tokens are unlocked.
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-start">
                    <div className="bg-danger rounded-circle text-white d-flex align-items-center justify-content-center me-3 mt-1"
                         style={{ width: "32px", height: "32px", minWidth: "32px" }}>
                      <FaExclamationTriangle />
                    </div>
                    <div>
                      <h5 className="mb-2">Forgetting About Other Investors' Unlocks</h5>
                      <p className="mb-0">
                        Your tokens aren't the only ones being unlocked. When VCs, team members, 
                        and other early investors' tokens unlock, they may sell, creating downward 
                        price pressure at specific times.
                      </p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="fw-bold mb-4">Ready to Plan Your Investment?</h2>
              <p className="lead mb-4">
                Now that you understand how the simulator works and what the parameters mean,
                try it out with your own investment details.
              </p>
              <Button 
                variant="light" 
                size="lg"
                onClick={handleStartSimulating}
              >
                Go to the Simulator <FaArrowRight className="ms-2" />
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Education;
