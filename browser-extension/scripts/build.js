const fs = require('fs');
const path = require('path');
const { getVersion } = require('./get-version');
const { buildDir, chromeDir, firefoxDir, projectRoot } = require('./directories');

// Get version from git tag
const version = getVersion();
console.log(`Using version: ${version}`);

// Ensure build directories exist
if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir);
if (!fs.existsSync(chromeDir)) fs.mkdirSync(chromeDir);
if (!fs.existsSync(firefoxDir)) fs.mkdirSync(firefoxDir);

// Copy a list of source files to the given target directory, preserving the source file tree
function copyFiles(sourcePaths, targetDir) {
  sourcePaths.forEach(sourcePath => {
    const targetPath = path.join(targetDir, sourcePath);

    if (fs.statSync(sourcePath).isDirectory()) {
      // Copy entire directory recursively
      fs.cpSync(sourcePath, targetPath, { recursive: true });
    } else if (sourcePath == path.basename(sourcePath)) {
      // Copy to root of the output dir, no new dir creation needed
      fs.copyFileSync(sourcePath, targetPath);
    } else {
      // Create parent directories and copy file
      const parentDir = path.dirname(targetPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

// Update manifest version and write it to our output dir
function updateManifestVersion(manifestPath, outputPath, newVersion) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifest.version = newVersion;
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
}

// Add Firefox-specific manifest values overtop our Chrome manifest, update manifest version,
// and write it to our output dir
function renderFirefoxManifest(chromeManifestPath, firefoxStubPath, outputPath, newVersion) {
  const chromeManifest = JSON.parse(fs.readFileSync(chromeManifestPath, 'utf8'));
  const firefoxStub = JSON.parse(fs.readFileSync(firefoxStubPath, 'utf8'));
  const mergedManifest = Object.assign({}, chromeManifest, firefoxStub);
  mergedManifest.version = newVersion;
  fs.writeFileSync(outputPath, JSON.stringify(mergedManifest, null, 2));
}

// Parse a web extension manifest.json file to extract all referenced scripts
function listFilesInManifest(manifestPath) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return manifest.content_scripts?.flatMap(contentScript => {
    return contentScript.js;
  });
}

// Copy source files to both build directories
const sourceFilesInManifest = listFilesInManifest('manifest.json');
copyFiles(sourceFilesInManifest, chromeDir);
copyFiles(sourceFilesInManifest, firefoxDir);

// Copy and update manifest files with dynamic version
updateManifestVersion(
  path.join(projectRoot, 'manifest.json'),
  path.join(chromeDir, 'manifest.json'),
  version
);
// For Firefox, we use our Chrome manifest as a base and inject Firefox-specific fields
renderFirefoxManifest(
  path.join(projectRoot, 'manifest.json'),
  path.join(projectRoot, 'manifest_firefox_stub.json'),
  path.join(firefoxDir, 'manifest.json'),
  version
);

console.log('Build complete!');
console.log(`Version: ${version}`);
console.log('Chrome extension written to: ./build/chrome/');
console.log('Firefox extension written to: ./build/firefox/');
console.log('');
console.log('To package the extension, run:');
console.log('Chrome: npm run package-chrome');
console.log('Firefox: npm run package-firefox');
