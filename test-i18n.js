#!/usr/bin/env node

/**
 * Simple test script to verify i18n setup
 * 
 * Note: This script needs to be run with the --experimental-json-modules flag:
 * node --experimental-json-modules test-i18n.js
 */

// We need to use dynamic imports for ES modules
async function runTest() {
  try {
    // Dynamically import the i18n instance
    const { default: i18n } = await import('./src/i18n.js');
    
    // Wait for i18n to initialize
    await new Promise(resolve => {
      i18n.on('initialized', resolve);
      
      // If already initialized, resolve immediately
      if (i18n.isInitialized) {
        resolve();
      }
    });
    
    // Test all languages
    const languages = ['en', 'ru', 'es', 'tr'];
    const testKeys = [
      'navigation.home',
      'navigation.calculator',
      'theme.light',
      'theme.dark',
      'buttons.calculate'
    ];
    
    console.log('🌐 Testing i18n translations:\n');
    
    for (const lang of languages) {
      console.log(`\n🔤 Language: ${lang.toUpperCase()}`);
      await i18n.changeLanguage(lang);
      
      for (const key of testKeys) {
        const translation = i18n.t(key);
        console.log(`   ${key}: ${translation.substring(0, 60)}${translation.length > 60 ? '...' : ''}`);
      }
    }
    
    console.log('\n✅ i18n test completed successfully!');
  } catch (error) {
    console.error('❌ Error testing i18n:', error);
    console.error(error.stack);
  }
}

// Run the test
runTest();
