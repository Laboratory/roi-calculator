/**
 * SEO configuration for each page in the application
 * This file contains page-specific SEO metadata and structured data
 */

// Base URL for canonical URLs
export const baseUrl = 'https://roi.alphamind.co';

export const seoConfig = {
  baseUrl,

  // Home/Simulator page
  home: {
    title: 'IDO ROI Simulator | Visualize Unlocks, Model Returns, Plan Smarter Exits',
    description: 'Use our free IDO ROI Simulator to model token unlocks, project real returns, and avoid presale pitfalls. Simulate your token investment across bear, base, and bull scenarios. No wallet, no login required.',
    canonicalUrl: '/',
    ogImage: '/images/og-home.jpg',
    ogTitle: 'IDO ROI Simulator | Visualize Unlocks, Model Returns, Plan Smarter Exits',
    ogDescription: 'Simulate token unlocks and ROI across market conditions. Understand FDV risk, break-even timing, and sell pressure — all without spreadsheets.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'IDO ROI Simulator',
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'Web',
      'description': 'Free token investment ROI simulator for retail investors. Visualize unlock schedules, model return paths, and evaluate real performance across market cycles.',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      }
    }
  },

  // About page
  about: {
    title: 'How the IDO ROI Simulator Works | Token Unlock Modeling & Risk Insights',
    description: 'Learn how the IDO ROI Simulator helps investors model token unlocks, assess real ROI timelines, and plan better exits from crypto presales.',
    canonicalUrl: '/about',
    ogImage: '/images/og-about.jpg',
    ogTitle: 'How the IDO ROI Simulator Works | Token Unlock Modeling & Risk Insights',
    ogDescription: 'Discover how this tool simulates token unlocks, return projections, FDV sensitivity and break-even timing based on presale terms and market movement.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      'name': 'How the IDO ROI Simulator Works',
      'description': 'Detailed explanation of the IDO ROI Simulator, including use cases for token unlock modeling, break-even planning, and investor decision-making.',
      'mainEntity': {
        '@type': 'WebSite',
        'name': 'IDO ROI Simulator',
        'url': baseUrl
      }
    }
  },

  // FAQ page
  faq: {
    title: 'FAQs | Token Unlocks, ROI Modeling & Presale Risk Analysis',
    description: 'Answers to common questions about how to simulate token unlock schedules, calculate ROI across scenarios, and evaluate crypto investment timing.',
    canonicalUrl: '/faq',
    ogImage: '/images/og-faq.jpg',
    ogTitle: 'FAQs | Token Unlocks, ROI Modeling & Presale Risk Analysis',
    ogDescription: 'Get clear answers about token unlock schedules, ROI projections, and how this simulator models returns under various market outcomes.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'How does the IDO ROI Simulator work?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The simulator lets you enter token presale terms — price, investment size, unlock schedule — and models ROI under bull, base, and bear scenarios. It shows break-even timing and cumulative returns month-by-month.'
          }
        },
        {
          '@type': 'Question',
          'name': 'What is a token unlock schedule?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'A token unlock schedule defines how and when tokens from a presale become available for trading. This usually involves TGE%, cliff periods, and vesting over time. The simulator visualizes this process clearly.'
          }
        },
        {
          '@type': 'Question',
          'name': 'How accurate are the ROI projections?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'The simulator gives ROI estimates based on user input and market assumptions. While not financial advice, it offers realistic projections to help investors understand risk and timeline.'
          }
        }
      ]
    }
  },

  // Education page
  education: {
    title: 'Crypto Investment Education | IDO ROI Simulator Guide & Terminology',
    description: 'Learn everything you need to know about token investments, unlock schedules, and ROI calculations. A complete guide for beginners to advanced investors.',
    canonicalUrl: '/education',
    ogImage: '/images/og-education.jpg',
    ogTitle: 'Crypto Investment Education | IDO ROI Simulator Guide & Terminology',
    ogDescription: 'Master token investment concepts with our comprehensive guide to vesting, TGE, cliffs, FDV, and market scenarios. No prior knowledge required.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'EducationalPage',
      'name': 'Crypto Investment Education Guide',
      'description': 'Comprehensive educational resource explaining token investment terminology, ROI calculations, and unlock schedules for crypto investors.',
      'educationalUse': 'Self-Study',
      'audience': {
        '@type': 'Audience',
        'audienceType': 'Retail Investors'
      },
      'teaches': 'Token investment, vesting schedules, ROI calculation, market scenarios analysis',
      'learningResourceType': 'Guide',
      'mainEntity': {
        '@type': 'WebSite',
        'name': 'IDO ROI Simulator',
        'url': baseUrl
      }
    }
  },

  // Terms page
  terms: {
    title: 'Terms of Service | IDO ROI Simulator',
    description: 'Read our Terms of Service for the IDO ROI Simulator to understand your use of this free crypto investment modeling tool.',
    canonicalUrl: '/terms',
    ogImage: '/images/og-terms.jpg',
    ogTitle: 'Terms of Service | IDO ROI Simulator',
    ogDescription: 'Review legal terms and usage conditions for the IDO ROI Simulator, a non-financial educational tool for ROI modeling.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Terms of Service',
      'description': 'Terms of use for the free web-based IDO ROI Simulator.'
    }
  },

  // Privacy page
  privacy: {
    title: 'Privacy Policy | IDO ROI Simulator',
    description: 'Learn how your data is handled using the IDO ROI Simulator. We don’t track, log, or store personal information.',
    canonicalUrl: '/privacy',
    ogImage: '/images/og-privacy.jpg',
    ogTitle: 'Privacy Policy | IDO ROI Simulator',
    ogDescription: 'This simulator is privacy-first by design. All ROI calculations are done locally in your browser.',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Privacy Policy',
      'description': 'No-login, no-tracking privacy policy for IDO ROI Simulator.'
    }
  },

  // 404 page
  notFound: {
    title: 'Page Not Found | IDO ROI Simulator',
    description: "This page doesn't exist. Return to the simulator to model your token presale ROI and unlock schedule.",
    canonicalUrl: '/404',
    ogImage: '/images/og-404.jpg',
    ogTitle: 'Page Not Found | IDO ROI Simulator',
    ogDescription: "This page doesn't exist. Return to the IDO ROI Simulator and calculate real-world token unlock outcomes.",
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': '404 - Page Not Found',
      'description': 'This page could not be found'
    }
  }
};

export default seoConfig;
