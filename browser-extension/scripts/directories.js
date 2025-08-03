/**
 * Define important build paths that are shared across build scripts.
 */

const path = require('path');

// The root of the project, i.e. where package.json lives.
const projectRoot = path.join(__dirname, '..');

// The directory to which we write all build artifacts.
const buildDir = path.join(projectRoot, 'build');

// Where our built artifacts for Chrome get written.
const chromeDir = path.join(buildDir, 'chrome');

// Where our built artifacts for Firefox get written.
const firefoxDir = path.join(buildDir, 'firefox');

// Export for use in other scripts
module.exports = {
    buildDir,
    chromeDir,
    firefoxDir,
    projectRoot
};
