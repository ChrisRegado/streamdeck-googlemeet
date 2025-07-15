# Quick Firefox Extension Installation for Local Testing

## Method 1: Automatic (Recommended)
```bash
npm run test-firefox
```
This automatically builds and launches Firefox with the extension loaded.

## Method 2: Manual Temporary Installation
1. **Build the extension**:
   ```bash
   npm run build
   npm run package-firefox
   ```

2. **Install in Firefox**:
   - Open Firefox
   - Go to `about:debugging`
   - Click "This Firefox"
   - Click "Load Temporary Add-on"
   - Select `build/firefox-extension.zip` (or `stream_deck_google_meet_actions-1.6.0.zip`)

## Method 3: Extract and Load
1. Extract the ZIP file from `build/firefox-extension.zip`
2. Go to `about:debugging` → "This Firefox"
3. Click "Load Temporary Add-on"
4. Navigate to extracted folder and select `manifest.json`

## Method 4: Firefox Developer Edition
1. Download Firefox Developer Edition
2. Set `xpinstall.signatures.required` to `false` in `about:config`
3. Install the ZIP file directly

## Troubleshooting
- **"Could not be installed because it's not verified"**: Use temporary installation method
- **Extension not working**: Ensure Stream Deck plugin is running on port 2394
- **WebSocket errors**: Check that no firewall is blocking localhost connections

## Testing
Once installed, test by:
1. Going to `meet.google.com`
2. Joining a meeting
3. Checking that the extension connects to your Stream Deck plugin
4. Looking for any errors in the browser console (F12) 