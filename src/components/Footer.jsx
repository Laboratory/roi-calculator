import React, { useContext } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaDiscord, FaTelegram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import { trackLinkClick } from '../utils/analytics';

const Footer = () => {
  const {t} = useTranslation(['common', 'footer']);
  const { darkMode } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${darkMode ? 'dark-card-bg text-light' : 'bg-light'} mt-auto py-3`}>
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

        {/* Social Media Links */}
        <Row className="mt-3">
          <Col className="text-center">
            <div className="d-flex justify-content-center gap-3 mb-3">
              <a
                href="https://t.me/alphamind_official"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                onClick={() => trackLinkClick('https://t.me/alphamind_official', 'Telegram Group', 'footer')}
              >
                <FaTelegram size={20}/>
              </a>
              <a
                href="https://discord.gg/NB4hhuXkWz"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                onClick={() => trackLinkClick('https://discord.gg/NB4hhuXkWz', 'Discord', 'footer')}
              >
                <FaDiscord size={20}/>
              </a>
              <a
                href="https://twitter.com/alphamind_labs"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                onClick={() => trackLinkClick('https://twitter.com/alphamind_labs', 'Twitter', 'footer')}
              >
                <FaTwitter size={20}/>
              </a>
              <a
                href="https://www.youtube.com/@AlphaMind_labs"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                onClick={() => trackLinkClick('https://www.youtube.com/@AlphaMind_labs', 'YouTube', 'footer')}
              >
                <FaYoutube size={20}/>
              </a>
            </div>
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
