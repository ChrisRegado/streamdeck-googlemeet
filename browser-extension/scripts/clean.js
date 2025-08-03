/**
 * A platform-agnostic script to clean out old build artifacts.
 */

const fs = require('fs');
const path = require('path');
const { projectRoot } = require('./directories');

// Which files/folders to delete, relative to the browser extension project root (where package.json is).
const PATHS_TO_DELETE = [
    "build"
]

function deleteRecursive(pathToDelete) {
  if (fs.existsSync(pathToDelete)) {
    console.log(`Deleting "${pathToDelete}"...`);
    fs.rmSync(pathToDelete, { recursive: true });
  }
}

console.log('Cleaning browser-extension working tree...');

PATHS_TO_DELETE.forEach((pathToDelete) => {
    deleteRecursive(path.join(projectRoot, pathToDelete));
});

console.log('Successfully cleaned working tree!');
