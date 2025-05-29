import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script adds cache control headers to the _headers file
 * for Netlify or similar static hosting services.
 */

const addCacheHeaders = () => {
  const distDir = path.resolve(__dirname, '../dist');
  const headersPath = path.join(distDir, '_headers');
  
  // Define cache control headers
  const headers = `# Cache control headers for static files
  
# HTML files - short cache time to ensure fresh content
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# Root index.html - no caching to ensure latest version
/index.html
  Cache-Control: public, max-age=0, must-revalidate

# Sitemap and robots - short cache time
/sitemap.xml
  Cache-Control: public, max-age=3600
/robots.txt
  Cache-Control: public, max-age=3600

# CSS and JS with content hash - long cache time
/assets/*.css
  Cache-Control: public, max-age=31536000, immutable
/assets/*.js
  Cache-Control: public, max-age=31536000, immutable

# Images - medium cache time
/*.svg
  Cache-Control: public, max-age=86400
/*.png
  Cache-Control: public, max-age=86400
/*.jpg
  Cache-Control: public, max-age=86400
/*.webp
  Cache-Control: public, max-age=86400
/*.ico
  Cache-Control: public, max-age=86400

# Fonts - long cache time
/*.woff
  Cache-Control: public, max-age=31536000, immutable
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
`;

  // Write headers file
  fs.writeFileSync(headersPath, headers);
  console.log('Added cache control headers to _headers file');
  
  // Also create a netlify.toml file for additional configuration
  const netlifyConfig = `[build]
  publish = "dist"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  
[headers]
  for = "/assets/*"
    [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
  
  for = "/*.html"
    [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
`;

  const netlifyPath = path.resolve(__dirname, '../netlify.toml');
  fs.writeFileSync(netlifyPath, netlifyConfig);
  console.log('Created netlify.toml configuration file');
};

// Main execution
try {
  console.log('Adding cache control headers...');
  addCacheHeaders();
  console.log('Cache control headers added successfully!');
} catch (error) {
  console.error('Error adding cache control headers:', error);
  process.exit(1);
}
