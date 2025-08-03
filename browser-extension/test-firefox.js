#!/usr/bin/env node

/**
 * Script to test Firefox extension locally
 * This script builds the extension and launches it in Firefox for testing
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🦊 Testing Firefox extension locally...\n');

// Check if web-ext is installed
const webExtPath = path.join(__dirname, 'node_modules', '.bin', 'web-ext');
if (!fs.existsSync(webExtPath) && !fs.existsSync(webExtPath + '.cmd')) {
  console.error('❌ web-ext not found. Please run: npm install');
  process.exit(1);
}

// Build the extension first
console.log('📦 Building extension...');
const buildProcess = spawn('node', ['build.js'], { 
  cwd: __dirname,
  stdio: 'inherit'
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Build failed');
    process.exit(1);
  }
  
  console.log('✅ Build complete');
  console.log('🚀 Launching Firefox with extension...\n');
  
  // Launch Firefox with the extension
  const isWindows = process.platform === 'win32';
  const npxCommand = isWindows ? 'npx.cmd' : 'npx';
  
  console.log(`Using command: ${npxCommand} web-ext run --source-dir=build/firefox --browser-console`);
  
  const firefoxProcess = spawn(npxCommand, ['web-ext', 'run', '--source-dir=build/firefox', '--browser-console'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: isWindows
  });
  
  firefoxProcess.on('close', (code) => {
    console.log('\n🦊 Firefox testing session ended');
  });
  
  firefoxProcess.on('error', (err) => {
    console.error('❌ Failed to start Firefox with npx:', err.message);
    console.log('🔄 Trying alternative method with npm...');
    
    // Try alternative method using npm run
    const npmProcess = spawn('npm', ['run', 'dev-firefox'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: isWindows
    });
    
    npmProcess.on('error', (npmErr) => {
      console.error('❌ Failed to start Firefox with npm:', npmErr.message);
      console.error('Make sure you have Firefox installed and npm available in PATH');
      process.exit(1);
    });
    
    npmProcess.on('close', (code) => {
      console.log('\n🦊 Firefox testing session ended');
    });
    
    // Handle Ctrl+C gracefully for npm process
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping Firefox testing...');
      npmProcess.kill();
      process.exit(0);
    });
  });
  
  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping Firefox testing...');
    firefoxProcess.kill();
    process.exit(0);
  });
});

buildProcess.on('error', (err) => {
  console.error('❌ Failed to start build process:', err.message);
  process.exit(1);
}); 