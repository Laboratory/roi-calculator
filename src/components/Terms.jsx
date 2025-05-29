import React, { useContext } from 'react';
import { Container, Card } from 'react-bootstrap';
import SEO from './SEO';
import { seoConfig } from '../config/seo';
import { ThemeContext } from '../context/ThemeContext';

const Terms = () => {
  const { darkMode } = useContext(ThemeContext);
  
  // Get SEO config for this page
  const { title, description, canonicalUrl, schema } = seoConfig.terms;

  return (
    <Container className="main-content">
      <SEO 
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
      />
      
      <div className="page-header">
        <h1 className={`page-title ${darkMode ? "text-white" : ""}`}>Terms of Service</h1>
        <p className={`page-subtitle ${darkMode ? "text-white-50" : "text-muted"}`}>Last updated: May 26, 2025</p>
      </div>

      <Card className="terms-card mb-4">
        <Card.Body>
          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>1. Introduction</h2>
          <p className={darkMode ? "text-white" : ""}>
            Welcome to TokenCalculator ("we," "our," or "us"). By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>2. Use of Services</h2>
          <p className={darkMode ? "text-white" : ""}>
            TokenCalculator provides tools for calculating potential returns on token investments. Our calculator is for informational purposes only and should not be considered financial advice.
          </p>
          <p className={darkMode ? "text-white" : ""}>
            You agree to use our services only for lawful purposes and in accordance with these Terms. You are prohibited from:
          </p>
          <ul className={darkMode ? "text-white" : ""}>
            <li>Using our services in any way that violates applicable laws or regulations</li>
            <li>Attempting to interfere with or disrupt the operation of our services</li>
            <li>Impersonating any person or entity, or falsely stating your affiliation</li>
            <li>Engaging in any activity that could harm our systems or other users</li>
          </ul>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>3. Disclaimer of Warranties</h2>
          <p className={darkMode ? "text-white" : ""}>
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className={darkMode ? "text-white" : ""}>
            We do not guarantee that our services will be uninterrupted, secure, or error-free, or that defects will be corrected. We make no warranty regarding the accuracy, reliability, or completeness of the content or information provided through our services.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>4. Limitation of Liability</h2>
          <p className={darkMode ? "text-white" : ""}>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL TOKENCALCULATOR, ITS AFFILIATES, OR THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF OR RELATING TO THE USE OF OR INABILITY TO USE OUR SERVICES.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>5. Risk Disclosure</h2>
          <p className={darkMode ? "text-white" : ""}>
            Cryptocurrency investments involve substantial risk. Past performance is not indicative of future results. The calculations and projections provided by our tools are based on the information you input and various assumptions that may not reflect actual market conditions. You should conduct your own research and consult with financial professionals before making investment decisions.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>6. Modifications to Terms</h2>
          <p className={darkMode ? "text-white" : ""}>
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on our website. Your continued use of our services after such modifications constitutes your acceptance of the updated Terms.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>7. Governing Law</h2>
          <p className={darkMode ? "text-white" : ""}>
            These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>8. Contact Information</h2>
          <p className={darkMode ? "text-white" : ""}>
            If you have any questions about these Terms, please contact us at support@tokencalculator.com.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Terms;
