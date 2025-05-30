import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seoConfig } from '../src/config/seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script generates placeholder Open Graph images for social media sharing
 */

const generateOgImages = () => {
  console.log('Generating Open Graph images for social media sharing...');
  const imagesDir = path.resolve(__dirname, '../public/images');
  
  // Create images directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  // Extract page information from seoConfig
  const pages = [];
  
  // Process each page in the seoConfig
  Object.entries(seoConfig).forEach(([key, config]) => {
    // Skip baseUrl property
    if (key === 'baseUrl') return;
    
    // Only process pages with ogImage property
    if (config.ogImage) {
      // Extract page name from ogImage path
      const ogImagePath = config.ogImage;
      const pageName = ogImagePath.split('/').pop().replace('og-', '').replace('.jpg', '');
      
      pages.push({
        name: pageName,
        title: config.ogTitle || config.title || 'IDO ROI Simulator',
        subtitle: config.ogDescription ? config.ogDescription.split('.')[0] : 'Token Investment Simulator'
      });
    }
  });
  
  // Generate an SVG placeholder for each page
  pages.forEach(page => {
    const svgContent = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#8A2BE2" />
      <rect x="50" y="50" width="1100" height="530" fill="#1A1A1A" rx="15" ry="15" />
      <text x="600" y="250" font-family="Arial" font-size="60" fill="#FFFFFF" text-anchor="middle">${page.title}</text>
      <text x="600" y="350" font-family="Arial" font-size="40" fill="#8A2BE2" text-anchor="middle">${page.subtitle}</text>
      <text x="600" y="450" font-family="Arial" font-size="30" fill="#CCCCCC" text-anchor="middle">https://roi.alphamind.co/</text>
    </svg>`;
    
    const filePath = path.join(imagesDir, `og-${page.name}.svg`);
    fs.writeFileSync(filePath, svgContent);
    console.log(`✅ Generated OG image: ${filePath}`);
    
    // Create a simple HTML placeholder for PNG fallback
    // In a production environment, you would convert SVG to PNG using a library
    const pngPlaceholder = `<html><body style="margin:0;padding:0;background:#8A2BE2;display:flex;align-items:center;justify-content:center;height:100vh;color:white;font-family:Arial;text-align:center;">
      <div>
        <h1 style="font-size:48px;margin:0;">${page.title}</h1>
        <h2 style="font-size:32px;margin:20px 0;color:#1A1A1A;">${page.subtitle}</h2>
        <p style="font-size:24px;">https://roi.alphamind.co/</p>
      </div>
    </body></html>`;
    
    const pngPath = path.join(imagesDir, `og-${page.name}.html`);
    fs.writeFileSync(pngPath, pngPlaceholder);
    console.log(`✅ Generated PNG placeholder: ${pngPath}`);
  });
  
  console.log('Open Graph image generation complete!');
};

// Execute the script
generateOgImages();
