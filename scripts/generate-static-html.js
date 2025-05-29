import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script generates static HTML files for each route in the application
 * to improve SEO and initial page load performance.
 */

const generateStaticHtml = () => {
  const distDir = path.resolve(__dirname, '../dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  
  // Define your application routes
  const routes = [
    '/calculator',
    '/about',
    '/faq',
    '/terms',
    '/privacy'
  ];
  
  // Read the index.html file
  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`index.html not found at ${indexHtmlPath}`);
  }
  
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Process each route
  routes.forEach(route => {
    // Create directory for the route
    const routeDir = path.join(distDir, route.slice(1));
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    
    // Create index.html for the route
    const routeHtmlPath = path.join(routeDir, 'index.html');
    
    // Customize the HTML for each route (add route-specific meta tags)
    let routeHtml = indexHtml;
    
    // Update meta tags based on the route
    const routeTitles = {
      '/calculator': 'Token ROI Calculator',
      '/about': 'About the ROI Calculator',
      '/faq': 'Frequently Asked Questions | ROI Calculator',
      '/terms': 'Terms of Service | ROI Calculator',
      '/privacy': 'Privacy Policy | ROI Calculator'
    };
    
    const routeDescriptions = {
      '/calculator': 'Calculate potential returns and visualize token unlock schedules with our ROI calculator',
      '/about': 'Learn about the Token ROI Calculator and how it can help you make informed investment decisions',
      '/faq': 'Find answers to frequently asked questions about the Token ROI Calculator',
      '/terms': 'Terms of Service for using the Token ROI Calculator',
      '/privacy': 'Privacy Policy for the Token ROI Calculator'
    };
    
    // Update title
    if (routeTitles[route]) {
      routeHtml = routeHtml.replace(
        /<title>.*?<\/title>/,
        `<title>${routeTitles[route]}</title>`
      );
    }
    
    // Update description
    if (routeDescriptions[route]) {
      routeHtml = routeHtml.replace(
        /<meta name="description" content=".*?"/,
        `<meta name="description" content="${routeDescriptions[route]}"`
      );
    }
    
    // Update canonical URL
    routeHtml = routeHtml.replace(
      /<link rel="canonical" href=".*?"/,
      `<link rel="canonical" href="https://tokencalculator.io${route}"`
    );
    
    // Write the HTML file
    fs.writeFileSync(routeHtmlPath, routeHtml);
    console.log(`Generated static HTML for route: ${route}`);
  });
  
  // Create a 404.html file
  const notFoundHtml = indexHtml.replace(
    /<title>.*?<\/title>/,
    '<title>Page Not Found | ROI Calculator</title>'
  ).replace(
    /<meta name="description" content=".*?"/,
    '<meta name="description" content="The page you\'re looking for doesn\'t exist. Return to our Token ROI Calculator."'
  );
  
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml);
  console.log('Generated 404.html');
};

// Main execution
try {
  console.log('Generating static HTML files...');
  generateStaticHtml();
  console.log('Static HTML generation complete!');
} catch (error) {
  console.error('Error generating static HTML:', error);
  process.exit(1);
}
