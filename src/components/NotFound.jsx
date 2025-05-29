import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaCalculator } from 'react-icons/fa';
import SEO from './SEO';
import { seoConfig } from '../config/seo';

const NotFound = () => {
  // Get SEO config for this page
  const { title, description, canonicalUrl, schema } = seoConfig.notFound;
  
  return (
    <Container className="py-5 text-center">
      <SEO 
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
      />
      
      <div className="mb-5">
        <h1 className="display-1 fw-bold">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button 
            as={Link} 
            to="/"
            variant="primary" 
            size="lg"
            className="d-flex align-items-center"
          >
            <FaCalculator className="me-2" />
            Go to Calculator
          </Button>
          
          <Button 
            onClick={() => window.history.back()} 
            variant="outline-secondary"
            size="lg"
            className="d-flex align-items-center"
          >
            <FaArrowLeft className="me-2" />
            Go Back
          </Button>
        </div>
      </div>
      
      <div className="mt-5">
        <h3>Looking for something?</h3>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-4 mt-3">
          <div>
            <h5>Learn More</h5>
            <ul className="list-unstyled">
              <li><Link to="/about" className="text-decoration-none">About the Calculator</Link></li>
              <li><Link to="/faq" className="text-decoration-none">Frequently Asked Questions</Link></li>
            </ul>
          </div>
          <div>
            <h5>Legal</h5>
            <ul className="list-unstyled">
              <li><Link to="/terms" className="text-decoration-none">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-decoration-none">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;
