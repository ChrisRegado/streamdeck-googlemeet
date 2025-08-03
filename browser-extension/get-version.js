const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getVersion() {
  try {
    // Try to get semantic version from git tag for the current SHA
    const gitTag = execSync("git describe --tags --exact-match HEAD --match='v[0-9]*.[0-9]*.[0-9]*'", {
      encoding: 'utf8',
      stdio: 'pipe'
    }).trim();

    // Remove 'v' prefix (e.g., v1.7.0 -> 1.7.0)
    return gitTag.replace(/^v/, '');
  } catch (error) {
    // Fallback to package.json version
    console.warn('Warning: No git tags found. Using package.json version.');
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    return packageJson.version;
  }
}

// Export for use in other scripts
module.exports = { getVersion };

// Allow running as standalone script
if (require.main === module) {
  console.log(getVersion());
}
