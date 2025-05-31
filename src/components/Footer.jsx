import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
  const {t} = useTranslation(['common', 'footer']);
  const { darkMode } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${darkMode ? 'bg-dark text-light' : 'bg-light'} mt-auto py-3`}>
      <Container>
        <Row>
          <Col className="text-center">
            <p className={`${darkMode ? 'text-light' : 'text-muted'} mb-2 small`}>
              {t('footer:disclaimer')}
            </p>
            <p className={`${darkMode ? 'text-light' : 'text-muted'} small mb-0`}>
              {t('footer:disclaimerShort')}
            </p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <Link to="/" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-muted'} mx-2 small`}>
              {t('navigation.calculator')}
            </Link>
            <Link to="/about" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-muted'} mx-2 small`}>
              {t('navigation.about')}
            </Link>
            <Link to="/education" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-muted'} mx-2 small`}>
              {t('navigation.education')}
            </Link>
            <Link to="/faq" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-muted'} mx-2 small`}>
              {t('navigation.faq')}
            </Link>
            <Link to="/privacy" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-muted'} mx-2 small`}>
              {t('footer:privacyPolicy')}
            </Link>
            <Link to="/terms" className={`text-decoration-none ${darkMode ? 'text-light' : 'text-muted'} mx-2 small`}>
              {t('footer:termsOfService')}
            </Link>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <p className={`${darkMode ? 'text-light' : 'text-muted'} mb-0`}>
              {t('footer:copyright', {year: currentYear})}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
