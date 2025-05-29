import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script optimizes the static build output to ensure tooltip functionality
 * works correctly in the static HTML pages.
 */

// Process HTML files to add tooltip data attributes
const processHtmlFiles = () => {
  const distDir = path.resolve(__dirname, '../dist');
  
  // Find all HTML files in the dist directory and subdirectories
  const findHtmlFiles = (dir) => {
    let results = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        results = results.concat(findHtmlFiles(filePath));
      } else if (file.endsWith('.html')) {
        results.push(filePath);
      }
    }
    
    return results;
  };
  
  const htmlFiles = findHtmlFiles(distDir);
  
  // Process each HTML file
  htmlFiles.forEach(filePath => {
    let html = fs.readFileSync(filePath, 'utf8');
    
    // Add data attributes for tooltip-label class elements
    // This ensures tooltips work correctly when the page is loaded
    html = html.replace(
      /<([a-z]+)[^>]*class="[^"]*tooltip-label[^"]*"[^>]*>/gi,
      '<$1 $& data-bs-toggle="tooltip" data-bs-html="true">'
    );
    
    // Write the modified HTML back to the file
    fs.writeFileSync(filePath, html);
    console.log(`Processed tooltips in: ${path.relative(distDir, filePath)}`);
  });
};

// Add preload for tooltip-related JavaScript
const addTooltipPreload = () => {
  const indexHtmlPath = path.resolve(__dirname, '../dist/index.html');
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Add preload for tooltip JavaScript
  const preloadTag = '<link rel="preload" href="/assets/bootstrap.js" as="script" />';
  html = html.replace('</head>', `  ${preloadTag}\n  </head>`);
  
  // Write the modified HTML back to the file
  fs.writeFileSync(indexHtmlPath, html);
  console.log('Added tooltip JavaScript preload to index.html');
};

// Main execution
const optimizeStaticBuild = () => {
  try {
    console.log('Optimizing static build for tooltips...');
    processHtmlFiles();
    addTooltipPreload();
    console.log('Static build optimization complete!');
  } catch (error) {
    console.error('Error optimizing static build:', error);
    process.exit(1);
  }
};

optimizeStaticBuild();
