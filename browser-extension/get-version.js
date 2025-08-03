const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getVersion() {
  try {
    // Try to get version from git tag
    const gitTag = execSync('git describe --tags --exact-match HEAD', { 
      encoding: 'utf8',
      stdio: 'pipe' 
    }).trim();
    
    // Remove 'v' prefix if present (e.g., v1.7.0 -> 1.7.0)
    return gitTag.replace(/^v/, '');
  } catch (error) {
    // If no exact tag match, try to get the latest tag
    try {
      const latestTag = execSync('git describe --tags --abbrev=0', { 
        encoding: 'utf8',
        stdio: 'pipe' 
      }).trim();
      
      console.warn(`Warning: Not on a tagged commit. Using latest tag: ${latestTag}`);
      return latestTag.replace(/^v/, '');
    } catch (tagError) {
      // Fallback to package.json version
      console.warn('Warning: No git tags found. Using package.json version.');
      const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
      return packageJson.version;
    }
  }
}

// Export for use in other scripts
module.exports = { getVersion };

// Allow running as standalone script
if (require.main === module) {
  console.log(getVersion());
} 