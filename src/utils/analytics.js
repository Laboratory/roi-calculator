/**
 * Google Analytics tracking utility
 * This file contains functions for tracking events in Google Analytics
 */

/**
 * Track a custom event in Google Analytics
 * 
 * @param {string} eventName - Name of the event to track
 * @param {Object} eventParams - Parameters to send with the event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  // Only track if gtag is available
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log('📊 Tracked event:', eventName, eventParams);
  } else {
    console.warn('Google Analytics not available for tracking event:', eventName);
  }
};

/**
 * Track a page view in Google Analytics
 * 
 * @param {string} pagePath - Path of the page being viewed
 * @param {string} pageTitle - Title of the page being viewed
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });
    console.log('📊 Tracked page view:', pagePath, pageTitle);
  } else {
    console.warn('Google Analytics not available for tracking page view:', pagePath);
  }
};

/**
 * Track an error in Google Analytics
 * 
 * @param {string} errorType - Type of error (e.g. '404', 'api_error', 'form_validation')
 * @param {string} errorMessage - Error message
 * @param {string} errorLocation - Where the error occurred
 */
export const trackError = (errorType, errorMessage, errorLocation) => {
  trackEvent('error', {
    error_type: errorType,
    error_message: errorMessage,
    error_location: errorLocation,
    page_url: window.location.href,
  });
};

/**
 * Track a button click
 * 
 * @param {string} buttonId - ID or name of the button
 * @param {string} buttonText - Text displayed on the button
 * @param {string} location - Where the button is located
 */
export const trackButtonClick = (buttonId, buttonText, location) => {
  trackEvent('button_click', {
    button_id: buttonId,
    button_text: buttonText,
    location: location
  });
};

/**
 * Track a link click
 * 
 * @param {string} linkUrl - URL being navigated to
 * @param {string} linkText - Text of the link
 * @param {string} location - Where the link is located
 */
export const trackLinkClick = (linkUrl, linkText, location) => {
  trackEvent('link_click', {
    link_url: linkUrl,
    link_text: linkText,
    location: location
  });
};

/**
 * Track a form submission
 * 
 * @param {string} formName - Name of the form
 * @param {string} location - Where the form is located
 * @param {Object} formData - Additional data about the form submission
 */
export const trackFormSubmission = (formName, location, formData = {}) => {
  trackEvent('form_submission', {
    form_name: formName,
    location: location,
    ...formData
  });
};

/**
 * Track a tab change
 * 
 * @param {string} tabName - Name of the tab being switched to
 * @param {string} previousTab - Name of the previous tab
 */
export const trackTabChange = (tabName, previousTab) => {
  trackEvent('tab_change', {
    tab_name: tabName,
    previous_tab: previousTab
  });
};

/**
 * Track an input field change
 * 
 * @param {string} inputName - Name of the input field
 * @param {string} location - Where the input is located
 */
export const trackInputChange = (inputName, location) => {
  trackEvent('input_change', {
    input_name: inputName,
    location: location
  });
};
