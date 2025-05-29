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
    title: 'IDO ROI Simulator | Uncover real returns',
    description: 'Uncover real returns. Visualize token unlocks. Break free from FDV illusions. Simulate your returns from any token presale, forecast token unlocks, and plan smarter exits.',
    canonicalUrl: '/',
    ogImage: '/images/og-home.jpg',
    ogTitle: 'IDO ROI Simulator | Uncover real returns',
    ogDescription: 'Uncover real returns. Visualize token unlocks. Break free from FDV illusions. Simulate your returns from any token presale, forecast token unlocks, and plan smarter exits.',
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
    title: 'About the IDO ROI Simulator | How it works',
    description: 'Discover how our IDO ROI Simulator helps crypto investors make informed decisions. See how we calculate real returns based on token unlock schedules and market scenarios.',
    canonicalUrl: '/about',
    ogImage: '/images/og-about.jpg',
    ogTitle: 'About the IDO ROI Simulator | How it works',
    ogDescription: 'Discover how our IDO ROI Simulator helps crypto investors make informed decisions. See how we calculate real returns based on token unlock schedules and market scenarios.',
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
    title: 'Frequently Asked Questions | IDO ROI Simulator',
    description: 'Get answers to common questions about our IDO ROI Simulator. Learn about token unlock schedules, ROI calculations, price scenarios, and how to interpret simulation results.',
    canonicalUrl: '/faq',
    ogImage: '/images/og-faq.jpg',
    ogTitle: 'Frequently Asked Questions | IDO ROI Simulator',
    ogDescription: 'Get answers to common questions about our IDO ROI Simulator. Learn about token unlock schedules, ROI calculations, price scenarios, and how to interpret simulation results.',
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
    title: 'Terms of Service | IDO ROI Simulator',
    description: 'Read our Terms of Service for the IDO ROI Simulator. Understand the rules, limitations, and legal terms that govern your use of our token investment simulation tool.',
    canonicalUrl: '/terms',
    ogImage: '/images/og-terms.jpg',
    ogTitle: 'Terms of Service | IDO ROI Simulator',
    ogDescription: 'Read our Terms of Service for the IDO ROI Simulator. Understand the rules, limitations, and legal terms that govern your use of our token investment simulation tool.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Terms of Service',
      'description': 'Terms and conditions for using the Token ROI Calculator'
    }
  },
  
  // Privacy page
  privacy: {
    title: 'Privacy Policy | IDO ROI Simulator',
    description: 'Our Privacy Policy explains how we handle your data when using the IDO ROI Simulator. Learn about our data collection practices, cookies usage, and your privacy rights.',
    canonicalUrl: '/privacy',
    ogImage: '/images/og-privacy.jpg',
    ogTitle: 'Privacy Policy | IDO ROI Simulator',
    ogDescription: 'Our Privacy Policy explains how we handle your data when using the IDO ROI Simulator. Learn about our data collection practices, cookies usage, and your privacy rights.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Privacy Policy',
      'description': 'Privacy policy for the Token ROI Calculator website'
    }
  },
  
  // 404 page
  notFound: {
    title: 'Page Not Found | IDO ROI Simulator',
    description: "Sorry, the page you're looking for doesn't exist. Return to our IDO ROI Simulator to calculate potential returns from your token investments and visualize unlock schedules.",
    canonicalUrl: '/404',
    ogImage: '/images/og-404.jpg',
    ogTitle: 'Page Not Found | IDO ROI Simulator',
    ogDescription: "Sorry, the page you're looking for doesn't exist. Return to our IDO ROI Simulator to calculate potential returns from your token investments and visualize unlock schedules.",
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': '404 - Page Not Found',
      'description': 'This page could not be found'
    }
  }
};

export default seoConfig;
