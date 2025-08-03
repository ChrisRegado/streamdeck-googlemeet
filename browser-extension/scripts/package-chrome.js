const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { buildDir, chromeDir } = require('./directories');

const outputFile = path.join(buildDir, 'chrome-extension.zip');

// Check if chrome build directory exists
if (!fs.existsSync(chromeDir)) {
  console.error('❌ Chrome build directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Remove existing zip file if it exists
if (fs.existsSync(outputFile)) {
  fs.unlinkSync(outputFile);
}

try {
  // Try to use zip command first (available on Linux and macOS)
  if (process.platform !== 'win32') {
    console.log('📦 Creating Chrome extension zip with zip command...');
    execSync('zip -r ../chrome-extension.zip *', {
      cwd: chromeDir,
      stdio: 'inherit'
    });
  } else {
    // On Windows, use PowerShell
    console.log('📦 Creating Chrome extension zip with PowerShell...');
    execSync('powershell -Command "Compress-Archive -Path * -DestinationPath ../chrome-extension.zip -Force"', {
      cwd: chromeDir,
      stdio: 'inherit'
    });
  }

  console.log('✅ Chrome extension packaged successfully: build/chrome-extension.zip');
} catch (error) {
  console.error('❌ Failed to create Chrome extension zip:', error.message);
  process.exit(1);
}
