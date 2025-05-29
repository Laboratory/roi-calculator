/**
 * SEO configuration for each page in the application
 * This file contains page-specific SEO metadata and structured data
 */

// Base URL for canonical URLs
export const baseUrl = 'https://tokencalculator.io';

export const seoConfig = {
  // Base URL for canonical URLs
  baseUrl,
  
  // Home/Calculator page
  home: {
    title: 'Token ROI Calculator - Visualize Token Unlock Schedules and Potential Returns',
    description: 'Calculate potential returns from token investments and visualize unlock schedules. Plan your investment strategy with our free, interactive ROI calculator.',
    canonicalUrl: '/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Token ROI Calculator',
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'Web',
      'description': 'Calculate potential returns and visualize token unlock schedules with our ROI calculator',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    }
  },
  
  // About page
  about: {
    title: 'About Our Token ROI Calculator - Transparent Investment Planning',
    description: 'Learn how our Token ROI Calculator helps investors make informed decisions with accurate unlock schedule visualization and return projections.',
    canonicalUrl: '/about',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'About the Token ROI Calculator',
      'description': 'Information about the Token ROI Calculator tool and its features',
      'mainEntity': {
        '@type': 'WebSite',
        'name': 'Token ROI Calculator',
        'url': baseUrl
      }
    }
  },
  
  // FAQ page
  faq: {
    title: 'Frequently Asked Questions - Token ROI Calculator Help Center',
    description: 'Find answers to common questions about using our Token ROI Calculator, understanding unlock schedules, and interpreting investment projections.',
    canonicalUrl: '/faq',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How does the Token ROI Calculator work?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Our calculator uses your investment amount, token price, and unlock schedule to project potential returns over time. It visualizes token unlocks and calculates ROI based on different market scenarios.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What is a token unlock schedule?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'A token unlock schedule defines when and how many tokens become available for trading after an initial token offering. Tokens are often released gradually over time according to predefined percentages.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How accurate are the ROI projections?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Our projections are based on the data you provide and market scenarios you select. While they offer valuable insights, cryptocurrency markets are volatile and actual returns may vary significantly.'
          }
        }
      ]
    }
  },
  
  // Terms page
  terms: {
    title: 'Terms of Service - Token ROI Calculator',
    description: 'Read the terms of service for using our Token ROI Calculator. Understand your rights and responsibilities when using our investment planning tool.',
    canonicalUrl: '/terms',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Terms of Service',
      'description': 'Terms and conditions for using the Token ROI Calculator'
    }
  },
  
  // Privacy page
  privacy: {
    title: 'Privacy Policy - Token ROI Calculator',
    description: 'Our privacy policy explains how we handle your data when you use the Token ROI Calculator. We prioritize your privacy and data security.',
    canonicalUrl: '/privacy',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Privacy Policy',
      'description': 'Privacy policy for the Token ROI Calculator website'
    }
  },
  
  // 404 page
  notFound: {
    title: 'Page Not Found - Token ROI Calculator',
    description: "The page you're looking for doesn't exist. Return to our Token ROI Calculator to plan your investment strategy.",
    canonicalUrl: '/404',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': '404 - Page Not Found',
      'description': 'This page could not be found'
    }
  }
};

export default seoConfig;
