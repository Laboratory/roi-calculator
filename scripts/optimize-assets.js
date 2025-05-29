import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script optimizes static assets in the build output
 * to improve loading performance of static HTML pages.
 */

// Optimize CSS by removing comments and unnecessary whitespace
const optimizeCss = () => {
  const distDir = path.resolve(__dirname, '../dist');
  
  // Find all CSS files in the dist directory
  const findCssFiles = (dir) => {
    let results = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        results = results.concat(findCssFiles(filePath));
      } else if (file.endsWith('.css')) {
        results.push(filePath);
      }
    }
    
    return results;
  };
  
  const cssFiles = findCssFiles(distDir);
  
  // Process each CSS file
  cssFiles.forEach(filePath => {
    let css = fs.readFileSync(filePath, 'utf8');
    
    // Remove comments
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove unnecessary whitespace
    css = css.replace(/\s+/g, ' ');
    css = css.replace(/\s*{\s*/g, '{');
    css = css.replace(/\s*}\s*/g, '}');
    css = css.replace(/\s*:\s*/g, ':');
    css = css.replace(/\s*;\s*/g, ';');
    css = css.replace(/\s*,\s*/g, ',');
    
    // Write the optimized CSS back to the file
    fs.writeFileSync(filePath, css);
    console.log(`Optimized CSS: ${path.relative(distDir, filePath)}`);
  });
};

// Add critical CSS inline to HTML
const inlineCriticalCss = () => {
  const distDir = path.resolve(__dirname, '../dist');
  const htmlFiles = [];
  
  // Find all HTML files
  const findHtmlFiles = (dir) => {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        findHtmlFiles(filePath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(filePath);
      }
    }
  };
  
  findHtmlFiles(distDir);
  
  // Critical CSS for the calculator app
  const criticalCss = `
    /* Critical CSS for above-the-fold content */
    body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#fff;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:transparent}
    .app-container{min-height:100vh;display:flex;flex-direction:column}
    .app-header{display:flex;align-items:center;justify-content:space-between;padding:1rem;background-color:#f8f9fa;border-bottom:1px solid #dee2e6}
    .brand{display:flex;align-items:center}
    .brand-logo{width:40px;height:40px;margin-right:0.5rem}
    .brand-title{font-size:1.25rem;font-weight:bold;color:#0d6efd}
    .nav-links{display:flex;gap:1.5rem}
    .nav-links a{color:#495057;text-decoration:none;font-weight:500}
    .nav-links a.active{color:#0d6efd;border-bottom:2px solid #0d6efd}
    .theme-toggle{padding:0.25rem 0.5rem}
    main{flex:1;padding-bottom:2rem}
    .container{width:100%;padding-right:var(--bs-gutter-x,.75rem);padding-left:var(--bs-gutter-x,.75rem);margin-right:auto;margin-left:auto}
    .py-4{padding-top:1.5rem!important;padding-bottom:1.5rem!important}
    .text-center{text-align:center!important}
    .mb-4{margin-bottom:1.5rem!important}
    .display-5{font-size:3rem;font-weight:300;line-height:1.2}
    .fw-bold{font-weight:700!important}
    .lead{font-size:1.25rem;font-weight:300}
    .tooltip-label{display:inline-flex;align-items:center;cursor:help}
    .info-icon{margin-left:0.25rem;font-size:0.875rem}
  `;
  
  // Add critical CSS to each HTML file
  htmlFiles.forEach(filePath => {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Add critical CSS to head
    const criticalCssTag = `<style id="critical-css">${criticalCss}</style>`;
    html = html.replace('</head>', `  ${criticalCssTag}\n  </head>`);
    
    // Write the modified HTML back to the file
    fs.writeFileSync(filePath, html);
    console.log(`Added critical CSS to: ${path.relative(distDir, filePath)}`);
  });
};

// Main execution
const optimizeAssets = () => {
  try {
    console.log('Optimizing static assets...');
    optimizeCss();
    inlineCriticalCss();
    console.log('Static asset optimization complete!');
  } catch (error) {
    console.error('Error optimizing assets:', error);
    process.exit(1);
  }
};

optimizeAssets();
