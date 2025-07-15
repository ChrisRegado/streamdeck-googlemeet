#!/usr/bin/env node

/**
 * Validate publishing setup for Chrome Web Store and Firefox Add-ons
 * This script checks if all required environment variables are set.
 */

const fs = require('fs');
const path = require('path');

// Required secrets for publishing
const REQUIRED_SECRETS = {
  chrome: [
    'CHROME_EXTENSION_ID',
    'CHROME_CLIENT_ID',
    'CHROME_CLIENT_SECRET',
    'CHROME_REFRESH_TOKEN'
  ],
  firefox: [
    'FIREFOX_ADDON_GUID',
    'FIREFOX_JWT_ISSUER',
    'FIREFOX_JWT_SECRET'
  ]
};

// Check if build artifacts exist
function checkBuildArtifacts() {
  const buildDir = path.join(__dirname, 'build');
  const chromeZip = path.join(buildDir, 'chrome-extension.zip');
  const firefoxZip = path.join(buildDir, 'firefox-extension.zip');
  
  console.log('📦 Checking build artifacts...');
  
  if (!fs.existsSync(buildDir)) {
    console.log('⚠️  Build directory not found. Run "npm run build" first.');
    return false;
  }
  
  if (!fs.existsSync(chromeZip)) {
    console.log('⚠️  Chrome extension ZIP not found. Run "npm run package-chrome" first.');
    return false;
  }
  
  if (!fs.existsSync(firefoxZip)) {
    console.log('⚠️  Firefox extension ZIP not found. Run "npm run package-firefox" first.');
    return false;
  }
  
  console.log('✅ Build artifacts found');
  return true;
}

// Check manifests for version consistency
function checkManifests() {
  const chromeManifest = path.join(__dirname, 'manifest.json');
  const firefoxManifest = path.join(__dirname, 'manifest_firefox.json');
  
  console.log('\n📋 Checking manifests...');
  
  if (!fs.existsSync(chromeManifest)) {
    console.log('❌ Chrome manifest not found');
    return false;
  }
  
  if (!fs.existsSync(firefoxManifest)) {
    console.log('❌ Firefox manifest not found');
    return false;
  }
  
  try {
    const chromeData = JSON.parse(fs.readFileSync(chromeManifest, 'utf8'));
    const firefoxData = JSON.parse(fs.readFileSync(firefoxManifest, 'utf8'));
    
    if (chromeData.version !== firefoxData.version) {
      console.log(`⚠️  Version mismatch: Chrome ${chromeData.version} vs Firefox ${firefoxData.version}`);
      return false;
    }
    
    console.log(`✅ Manifest versions match: ${chromeData.version}`);
    return true;
  } catch (error) {
    console.log('❌ Error reading manifests:', error.message);
    return false;
  }
}

// Check environment variables
function checkEnvironmentVariables() {
  console.log('\n🔐 Checking environment variables...');
  
  const chromeSecrets = REQUIRED_SECRETS.chrome.filter(key => !process.env[key]);
  const firefoxSecrets = REQUIRED_SECRETS.firefox.filter(key => !process.env[key]);
  
  if (chromeSecrets.length === 0) {
    console.log('✅ Chrome Web Store secrets configured');
  } else {
    console.log('⚠️  Missing Chrome Web Store secrets:');
    chromeSecrets.forEach(secret => console.log(`   - ${secret}`));
  }
  
  if (firefoxSecrets.length === 0) {
    console.log('✅ Firefox Add-ons secrets configured');
  } else {
    console.log('⚠️  Missing Firefox Add-ons secrets:');
    firefoxSecrets.forEach(secret => console.log(`   - ${secret}`));
  }
  
  const allConfigured = chromeSecrets.length === 0 && firefoxSecrets.length === 0;
  
  if (!allConfigured) {
    console.log('\n💡 To set up publishing:');
    console.log('   1. Read PUBLISHING_SETUP.md for detailed instructions');
    console.log('   2. Add secrets to your GitHub repository');
    console.log('   3. For local testing, set environment variables');
  }
  
  return allConfigured;
}

// Check GitHub workflow file
function checkWorkflow() {
  const workflowFile = path.join(__dirname, '..', '.github', 'workflows', 'publish-extensions.yml');
  
  console.log('\n🔄 Checking GitHub workflow...');
  
  if (!fs.existsSync(workflowFile)) {
    console.log('❌ Publishing workflow not found');
    return false;
  }
  
  console.log('✅ Publishing workflow found');
  return true;
}

// Main validation function
function main() {
  console.log('🔍 Validating publishing setup...\n');
  
  const checks = [
    { name: 'Build artifacts', fn: checkBuildArtifacts },
    { name: 'Manifests', fn: checkManifests },
    { name: 'Environment variables', fn: checkEnvironmentVariables },
    { name: 'GitHub workflow', fn: checkWorkflow }
  ];
  
  const results = checks.map(check => ({ ...check, passed: check.fn() }));
  const allPassed = results.every(result => result.passed);
  
  console.log('\n📊 Summary:');
  results.forEach(result => {
    const status = result.passed ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });
  
  if (allPassed) {
    console.log('\n🎉 All checks passed! Publishing setup is ready.');
    console.log('💡 You can now run the GitHub Action to publish extensions.');
  } else {
    console.log('\n⚠️  Some checks failed. Please address the issues above.');
    console.log('📖 See PUBLISHING_SETUP.md for detailed setup instructions.');
  }
  
  process.exit(allPassed ? 0 : 1);
}

if (require.main === module) {
  main();
} 