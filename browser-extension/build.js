const fs = require('fs');
const path = require('path');
const { getVersion } = require('./get-version');

// Get version from git tag
const version = getVersion();
console.log(`Using version: ${version}`);

// Create build directories
const buildDir = path.join(__dirname, 'build');
const chromeDir = path.join(buildDir, 'chrome');
const firefoxDir = path.join(buildDir, 'firefox');

// Ensure build directories exist
if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);
if (!fs.existsSync(chromeDir)) fs.mkdirSync(chromeDir);
if (!fs.existsSync(firefoxDir)) fs.mkdirSync(firefoxDir);

// Files to copy (exclude manifests and build directory)
const filesToCopy = [
  'event_handlers/',
  'main.js',
  'stream_deck_connection_manager.js',
  'errors.js'
];

// Copy files to both build directories
function copyFiles(sourceDir, targetDir) {
  filesToCopy.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      // Copy directory recursively
      fs.cpSync(sourcePath, targetPath, { recursive: true });
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

// Function to update manifest version
function updateManifestVersion(manifestPath, outputPath) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = version;
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
}

// Copy files to both directories
copyFiles(__dirname, chromeDir);
copyFiles(__dirname, firefoxDir);

// Copy and update manifest files with dynamic version
updateManifestVersion(
  path.join(__dirname, 'manifest.json'), 
  path.join(chromeDir, 'manifest.json')
);
updateManifestVersion(
  path.join(__dirname, 'manifest_firefox.json'), 
  path.join(firefoxDir, 'manifest.json')
);

console.log('Build complete!');
console.log(`Version: ${version}`);
console.log('Chrome extension: ./build/chrome/');
console.log('Firefox extension: ./build/firefox/');
console.log('');
console.log('To package:');
console.log('Chrome: npm run package-chrome');
console.log('Firefox: npm run package-firefox');
console.log('Both: npm run package-all'); 