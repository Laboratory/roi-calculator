import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * This script tests the optimizations made to the static HTML build
 * It verifies that all expected files and optimizations are present
 */

const testOptimizations = () => {
  console.log('Testing static HTML optimizations...');
  const distDir = path.resolve(__dirname, '../dist');
  
  // Check if dist directory exists
  if (!fs.existsSync(distDir)) {
    console.error('❌ Dist directory not found!');
    process.exit(1);
  }
  
  // Test 1: Check if static HTML files were generated
  const routePaths = [
    'index.html',
    'calculator/index.html',
    'about/index.html',
    'faq/index.html',
    'terms/index.html',
    'privacy/index.html',
    '404.html'
  ];
  
  console.log('\n1. Testing static HTML generation:');
  let allFilesExist = true;
  
  routePaths.forEach(routePath => {
    const filePath = path.join(distDir, routePath);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${routePath} exists`);
    } else {
      console.log(`  ❌ ${routePath} not found!`);
      allFilesExist = false;
    }
  });
  
  if (!allFilesExist) {
    console.error('❌ Some static HTML files are missing!');
  }
  
  // Test 2: Check for SEO optimizations
  console.log('\n2. Testing SEO optimizations:');
  
  // Expected page-specific meta descriptions
  const pageDescriptions = {
    'index.html': 'Calculate potential returns from token investments and visualize unlock schedules',
    'about/index.html': 'Learn how our Token ROI Calculator helps investors make informed decisions',
    'faq/index.html': 'Find answers to common questions about using our Token ROI Calculator',
    'terms/index.html': 'Read the terms of service for using our Token ROI Calculator',
    'privacy/index.html': 'Our privacy policy explains how we handle your data',
    '404.html': 'The page you\'re looking for doesn\'t exist'
  };
  
  // Check if each page has its specific meta description
  Object.entries(pageDescriptions).forEach(([page, expectedDescription]) => {
    const filePath = path.join(distDir, page);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(expectedDescription)) {
        console.log(`  ✅ ${page} has correct meta description`);
      } else {
        console.log(`  ❌ ${page} does not have expected meta description`);
      }
    }
  });
  
  // Check for other SEO elements
  const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  
  const seoChecks = [
    { name: 'Canonical URL', regex: /<link rel="canonical" href=".*?"/ },
    { name: 'Sitemap.xml', path: 'sitemap.xml' },
    { name: 'Robots.txt', path: '../public/robots.txt' }
  ];
  
  seoChecks.forEach(check => {
    if (check.regex) {
      if (check.regex.test(indexHtml)) {
        console.log(`  ✅ ${check.name} found`);
      } else {
        console.log(`  ❌ ${check.name} not found!`);
      }
    } else if (check.path) {
      const checkPath = path.join(distDir, check.path);
      if (fs.existsSync(checkPath)) {
        console.log(`  ✅ ${check.name} exists`);
      } else {
        console.log(`  ❌ ${check.name} not found!`);
      }
    }
  });
  
  // Test 3: Check for structured data in each page
  console.log('\n3. Testing structured data:');
  const structuredDataChecks = {
    'index.html': { type: 'WebApplication', name: 'Token ROI Calculator' },
    'about/index.html': { type: 'AboutPage', name: 'About the Token ROI Calculator' },
    'faq/index.html': { type: 'FAQPage' },
    'terms/index.html': { type: 'WebPage', name: 'Terms of Service' },
    'privacy/index.html': { type: 'WebPage', name: 'Privacy Policy' },
    '404.html': { type: 'WebPage', name: '404 - Page Not Found' }
  };
  
  Object.entries(structuredDataChecks).forEach(([page, expected]) => {
    const filePath = path.join(distDir, page);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const typeFound = content.includes(`"@type":"${expected.type}"`);
      const nameFound = expected.name ? content.includes(`"name":"${expected.name}"`) : true;
      
      if (typeFound && nameFound) {
        console.log(`  ✅ ${page} has correct structured data`);
      } else {
        console.log(`  ❌ ${page} does not have expected structured data`);
      }
    }
  });
  
  // Test 4: Check for PWA support
  console.log('\n4. Testing PWA support:');
  const pwaChecks = [
    { name: 'Web app manifest', path: '../public/manifest.json' },
    { name: 'Service worker', path: '../public/service-worker.js' },
    { name: 'PWA icons', path: '../public/icons' }
  ];
  
  pwaChecks.forEach(check => {
    const checkPath = path.join(distDir, check.path);
    if (fs.existsSync(checkPath)) {
      console.log(`  ✅ ${check.name} exists`);
      
      // Check if icons directory has files
      if (check.name === 'PWA icons') {
        const iconFiles = fs.readdirSync(checkPath);
        if (iconFiles.length > 0) {
          console.log(`  ✅ PWA icons directory contains ${iconFiles.length} files`);
        } else {
          console.log(`  ❌ PWA icons directory is empty!`);
        }
      }
    } else {
      console.log(`  ❌ ${check.name} not found!`);
    }
  });
  
  // Test 5: Check for caching strategy
  console.log('\n5. Testing caching strategy:');
  const cachingChecks = [
    { name: 'Cache headers file', path: '_headers' },
    { name: 'Netlify config', path: '../netlify.toml' }
  ];
  
  cachingChecks.forEach(check => {
    const checkPath = path.join(distDir, check.path);
    if (fs.existsSync(checkPath)) {
      console.log(`  ✅ ${check.name} exists`);
    } else {
      console.log(`  ❌ ${check.name} not found!`);
    }
  });
  
  // Test 6: Check for code splitting
  console.log('\n6. Testing code splitting:');
  const assetsDir = path.join(distDir, 'assets');
  const jsFiles = fs.readdirSync(assetsDir).filter(file => file.endsWith('.js'));
  
  if (jsFiles.length > 3) {
    console.log(`  ✅ Found ${jsFiles.length} JavaScript chunks (code splitting working)`);
  } else {
    console.log(`  ❌ Only found ${jsFiles.length} JavaScript files (code splitting may not be working)`);
  }
  
  // Test 7: Check for critical CSS
  console.log('\n7. Testing critical CSS:');
  if (indexHtml.includes('<style id="critical-css">')) {
    console.log('  ✅ Critical CSS found inline in HTML');
  } else {
    console.log('  ❌ Critical CSS not found inline in HTML');
  }
  
  console.log('\nOptimization testing complete!');
};

// Run the tests
testOptimizations();
