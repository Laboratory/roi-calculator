import React, { useContext } from 'react';
import { Container, Card } from 'react-bootstrap';
import SEO from './SEO';
import { seoConfig } from '../config/seo';
import { ThemeContext } from '../context/ThemeContext';

const Privacy = () => {
  const { darkMode } = useContext(ThemeContext);
  
  // Get SEO config for this page
  const { title, description, canonicalUrl, schema } = seoConfig.privacy;

  return (
    <Container className="main-content">
      <SEO 
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        schema={schema}
      />
      
      <div className="page-header">
        <h1 className={`page-title ${darkMode ? "text-white" : ""}`}>Privacy Policy</h1>
        <p className={`page-subtitle ${darkMode ? "text-white-50" : "text-muted"}`}>Last updated: May 26, 2025</p>
      </div>

      <Card className="privacy-card mb-4">
        <Card.Body>
          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>1. Introduction</h2>
          <p className={darkMode ? "text-white" : ""}>
            TokenCalculator ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. Please read this policy carefully to understand our practices regarding your information.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>2. Information We Collect</h2>
          <h3 className={`subsection-title ${darkMode ? "text-white" : ""}`}>2.1 Information You Provide</h3>
          <p className={darkMode ? "text-white" : ""}>
            When using our calculator, you may provide information such as:
          </p>
          <ul className={darkMode ? "text-white" : ""}>
            <li>Token amounts and prices</li>
            <li>Investment parameters</li>
            <li>Unlock schedules</li>
          </ul>
          <p className={darkMode ? "text-white" : ""}>
            This information is processed locally in your browser and is not stored on our servers unless you explicitly save or share your calculations.
          </p>

          <h3 className={`subsection-title ${darkMode ? "text-white" : ""}`}>2.2 Automatically Collected Information</h3>
          <p className={darkMode ? "text-white" : ""}>
            When you access our website, we may automatically collect certain information, including:
          </p>
          <ul className={darkMode ? "text-white" : ""}>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Usage patterns and preferences</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>3. How We Use Your Information</h2>
          <p className={darkMode ? "text-white" : ""}>
            We use the information we collect to:
          </p>
          <ul className={darkMode ? "text-white" : ""}>
            <li>Provide, maintain, and improve our services</li>
            <li>Understand how users interact with our website</li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Develop new features and functionality</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>4. Cookies and Tracking Technologies</h2>
          <p className={darkMode ? "text-white" : ""}>
            We use cookies and similar tracking technologies to track activity on our website and to hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>5. Data Security</h2>
          <p className={darkMode ? "text-white" : ""}>
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>6. Third-Party Services</h2>
          <p className={darkMode ? "text-white" : ""}>
            Our website may contain links to third-party websites or services that are not owned or controlled by TokenCalculator. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>7. Children's Privacy</h2>
          <p className={darkMode ? "text-white" : ""}>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>8. Changes to This Privacy Policy</h2>
          <p className={darkMode ? "text-white" : ""}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>9. Your Rights</h2>
          <p className={darkMode ? "text-white" : ""}>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className={darkMode ? "text-white" : ""}>
            <li>The right to access the personal information we have about you</li>
            <li>The right to request correction or deletion of your personal information</li>
            <li>The right to restrict or object to our processing of your personal information</li>
            <li>The right to data portability</li>
          </ul>
          <p className={darkMode ? "text-white" : ""}>
            To exercise these rights, please contact us using the information provided below.
          </p>

          <h2 className={`section-title ${darkMode ? "text-white" : ""}`}>10. Contact Us</h2>
          <p className={darkMode ? "text-white" : ""}>
            If you have any questions or concerns about this Privacy Policy, please contact us at privacy@tokencalculator.com.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Privacy;
