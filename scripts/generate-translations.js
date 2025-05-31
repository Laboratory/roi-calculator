#!/usr/bin/env node

/**
 * Translation Generator Utility
 * 
 * This script helps copy English translation files to other language directories
 * as a starting point for translation. It can also merge missing keys from
 * the source language into target language files.
 * 
 * Usage: 
 *   - Create initial translation files: node generate-translations.js
 *   - Merge missing keys: node generate-translations.js --merge
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const sourceLanguage = 'en';
const targetLanguages = ['ru', 'es', 'tr'];
const localesDir = path.join(__dirname, '../public/locales');
const namespaces = [
  'common', 
  'calculator', 
  'about', 
  'education', 
  'faq', 
  'footer', 
  'language'
];

// Check if we're in merge mode
const mergeMode = process.argv.includes('--merge');

// Make sure all target language directories exist
targetLanguages.forEach(lang => {
  const langDir = path.join(localesDir, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
    console.log(`Created directory for ${lang}`);
  }
});

// Function to deep merge objects while preserving existing translations
function deepMerge(target, source) {
  const output = { ...target };
  
  for (const key in source) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      output[key] = deepMerge(target[key], source[key]);
    } else if (!(key in target)) {
      // Only add keys that don't exist in target
      output[key] = source[key];
    }
  }
  
  return output;
}

// Process each namespace
namespaces.forEach(namespace => {
  const sourceFile = path.join(localesDir, sourceLanguage, `${namespace}.json`);
  
  if (fs.existsSync(sourceFile)) {
    const sourceContent = fs.readFileSync(sourceFile, 'utf8');
    const sourceJson = JSON.parse(sourceContent);
    
    targetLanguages.forEach(lang => {
      const targetFile = path.join(localesDir, lang, `${namespace}.json`);
      
      if (!fs.existsSync(targetFile)) {
        // Create new file with source content
        fs.writeFileSync(targetFile, sourceContent);
        console.log(`Created ${namespace}.json for ${lang}`);
      } else if (mergeMode) {
        // Merge missing keys from source into target
        try {
          const targetContent = fs.readFileSync(targetFile, 'utf8');
          const targetJson = JSON.parse(targetContent);
          
          // Merge missing keys from source into target
          const mergedJson = deepMerge(targetJson, sourceJson);
          
          // Write merged content back to file
          fs.writeFileSync(
            targetFile, 
            JSON.stringify(mergedJson, null, 2)
          );
          
          console.log(`Updated ${namespace}.json for ${lang} with missing keys`);
        } catch (error) {
          console.error(`Error processing ${targetFile}:`, error.message);
        }
      } else {
        console.log(`File ${namespace}.json already exists for ${lang}`);
      }
    });
  } else {
    console.error(`Source file ${sourceFile} not found!`);
  }
});

if (mergeMode) {
  console.log('\nTranslation files have been updated with missing keys from the source language.');
  console.log('Please translate the newly added content in the target language files.');
} else {
  console.log('\nTranslation templates have been generated!');
  console.log('Please translate the content in the target language files.');
}

console.log('\nTip: Run with --merge flag to update existing files with missing keys.');
