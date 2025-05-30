import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script generates an XML sitemap for the application routes
 * to improve SEO and search engine indexing.
 */

const generateSitemap = () => {
  const distDir = path.resolve(__dirname, '../dist');
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  
  // Define your application routes
  const routes = [
    '/',
    '/about',
    '/education',
    '/faq',
    '/terms',
    '/privacy'
  ];
  
  // Base URL for your site
  const baseUrl = 'https://roi.alphamind.co'; // Replace with your actual domain
  
  // Current date in ISO format for lastmod
  const today = new Date().toISOString().split('T')[0];
  
  // Generate XML sitemap content
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  
  // Add each route to the sitemap
  routes.forEach(route => {
    sitemap += `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>
`;
  });
  
  // Close the sitemap
  sitemap += `</urlset>`;
  
  // Ensure the dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Write the sitemap file
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`Generated sitemap at: ${path.relative(path.resolve(__dirname, '..'), sitemapPath)}`);
};

// Main execution
try {
  console.log('Generating sitemap...');
  generateSitemap();
  console.log('Sitemap generation complete!');
} catch (error) {
  console.error('Error generating sitemap:', error);
  process.exit(1);
}
