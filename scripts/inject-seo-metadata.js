import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seoConfig } from '../src/config/seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script injects SEO metadata directly into the static HTML files
 * to ensure search engines can properly index the content.
 */

const injectSeoMetadata = () => {
  console.log('Injecting SEO metadata into static HTML files...');
  const distDir = path.resolve(__dirname, '../dist');
  
  // Map of file paths to their corresponding SEO config keys
  const pageConfigMap = {
    'index.html': 'home',
    'calculator/index.html': 'home',
    'about/index.html': 'about',
    'faq/index.html': 'faq',
    'terms/index.html': 'terms',
    'privacy/index.html': 'privacy',
    '404.html': 'notFound'
  };
  
  // Process each HTML file
  Object.entries(pageConfigMap).forEach(([filePath, configKey]) => {
    const fullPath = path.join(distDir, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      return;
    }
    
    let html = fs.readFileSync(fullPath, 'utf8');
    const config = seoConfig[configKey];
    
    if (!config) {
      console.log(`⚠️ SEO config not found for: ${configKey}`);
      return;
    }
    
    // Update title
    html = html.replace(
      /<title>.*?<\/title>/i,
      `<title>${config.title}</title>`
    );
    
    // Update or add meta description
    if (html.includes('<meta name="description"')) {
      html = html.replace(
        /<meta name="description" content=".*?"/i,
        `<meta name="description" content="${config.description}"`
      );
    } else {
      html = html.replace(
        /<\/title>/i,
        `</title>\n  <meta name="description" content="${config.description}">`
      );
    }
    
    // Update or add canonical URL
    const canonicalUrl = `${seoConfig.baseUrl || ''}${config.canonicalUrl}`;
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(
        /<link rel="canonical" href=".*?"/i,
        `<link rel="canonical" href="${canonicalUrl}"`
      );
    } else {
      html = html.replace(
        /<\/title>/i,
        `</title>\n  <link rel="canonical" href="${canonicalUrl}">`
      );
    }
    
    // Add structured data
    if (config.schema) {
      const structuredDataScript = `
  <script type="application/ld+json">
    ${JSON.stringify(config.schema)}
  </script>`;
      
      // Add before closing head tag
      html = html.replace(
        /<\/head>/i,
        `${structuredDataScript}\n</head>`
      );
    }
    
    // Write the modified HTML back to the file
    fs.writeFileSync(fullPath, html);
    console.log(`✅ Injected SEO metadata into: ${filePath}`);
  });
  
  console.log('SEO metadata injection complete!');
};

// Execute the script
injectSeoMetadata();
