/**
 * A platform-agnostic script to clean out old build artifacts.
 */

const fs = require('fs');

const PATHS_TO_DELETE = [
    "./build"
]

function deleteRecursive(path) {
  if (fs.existsSync(path)) {
    console.log(`Deleting "${path}"...`);
    fs.rmSync(path, { recursive: true });
  }
}

console.log('Cleaning browser-extension working tree...');

PATHS_TO_DELETE.forEach((path) => {
    deleteRecursive(path);
});

console.log('Successfully cleaned working tree!');
