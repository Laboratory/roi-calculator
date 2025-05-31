import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRouter from './AppRouter';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Import i18n instance
import './i18n';

// Loading component for Suspense fallback
const Loading = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Check if the app is already rendered on the server (for hydration)
const rootElement = document.getElementById('root');
const hasChildNodes = rootElement.hasChildNodes();

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Initialize tooltips after the app is rendered
const initializeTooltips = () => {
  // Use setTimeout to ensure DOM is fully loaded
  setTimeout(() => {
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
          trigger: 'hover'
        });
      });
    }
  }, 100);
};

// Create the root
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <HelmetProvider>
        <ThemeProvider>
          <LanguageProvider>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </LanguageProvider>
        </ThemeProvider>
      </HelmetProvider>
    </Suspense>
  </React.StrictMode>
);

// Initialize tooltips after rendering
initializeTooltips();
