# Firefox Publishing Guide

## Prerequisites

1. **Firefox Developer Account**: Create an account at [addons.mozilla.org](https://addons.mozilla.org/developers/)
2. **Extension ID**: Update the `gecko.id` in `manifest_firefox.json` with your unique extension ID
3. **Signing**: All Firefox extensions must be signed by Mozilla

## Build Process

### 1. Build Firefox Extension
```bash
cd browser-extension
npm run build
```

### 2. Package for Firefox
```bash
npm run package-firefox
```

This creates `build/firefox-extension.zip` ready for submission.

**Note**: The build process now uses Mozilla's `web-ext` tool for proper Firefox extension packaging, which:
- Validates the extension manifest and code
- Creates properly formatted ZIP files
- Ensures compatibility with Firefox's extension system
- Provides better error messages for common issues

## Publishing Steps

### 1. Initial Submission
1. Go to [addons.mozilla.org/developers/addon/submit/](https://addons.mozilla.org/developers/addon/submit/)
2. Upload your `firefox-extension.zip`
3. Fill out the listing information:
   - **Name**: Stream Deck Google Meet Actions
   - **Summary**: Physical controls for Google Meet using Elgato Stream Deck
   - **Description**: Include details about Stream Deck plugin requirement
   - **Categories**: Productivity, Communication
   - **Tags**: streamdeck, google-meet, productivity, hardware

### 2. Review Process
- **Automatic Review**: Most extensions get automatic approval
- **Manual Review**: May take 1-7 days if flagged for manual review
- **Common Issues**: 
  - WebSocket connections (explain localhost usage)
  - External dependencies (mention Stream Deck plugin requirement)

### 3. Listing Details
```
Name: Stream Deck Google Meet Actions
Summary: Connects to Elgato Stream Deck plugin for physical Google Meet controls
Description: 
Control your Google Meet calls with physical Stream Deck buttons. Mute/unmute, 
toggle camera, leave calls, and more with tactile feedback.

Requirements:
- Elgato Stream Deck device
- Stream Deck Google Meet plugin (available separately)
- Google Meet in Firefox

Features:
- Mic mute/unmute with visual feedback
- Camera toggle
- Leave call button
- Chat toggle
- Participants panel
- Hand raise/lower
- And more...
```

### 4. Technical Notes for Review
Include in developer comments:
- WebSocket connection is to localhost:2394 (Stream Deck plugin)
- No external data collection
- No remote servers contacted
- Extension only works on meet.google.com

## Update Process

### 1. Version Updates
1. Update version in `manifest_firefox.json`
2. Rebuild and repackage
3. Upload new version through developer portal

### 2. Automatic Updates
Firefox handles automatic updates once approved.

## Firefox-Specific Considerations

### 1. WebSocket Permissions
Firefox may show additional security warnings for WebSocket connections. Users should:
- Click "Allow" when prompted
- Ensure Stream Deck plugin is running

### 2. Extension ID
The extension ID in `manifest_firefox.json` must be unique:
```json
"browser_specific_settings": {
  "gecko": {
    "id": "streamdeck-googlemeet@chrisregado.com",
    "strict_min_version": "109.0"
  }
}
```

### 3. Testing
Test on Firefox before submission:
1. Load extension in `about:debugging`
2. Test all Stream Deck functions
3. Verify WebSocket connections work
4. Check for console errors

### 4. Installation Methods for Users

**Important**: Firefox extensions cannot be installed directly from ZIP files unless they are signed by Mozilla. Here are the proper installation methods:

#### Method 1: Firefox Add-ons (Recommended)
- Extension is signed automatically by Mozilla
- Users can install normally with one click
- Automatic updates work

#### Method 2: Temporary Installation (Development/Testing)
If providing unsigned extensions for testing:
1. User opens Firefox and goes to `about:debugging`
2. Clicks "This Firefox" in the left sidebar
3. Clicks "Load Temporary Add-on"
4. Selects the `firefox-extension.zip` file
5. Extension loads but will be removed when Firefox restarts

#### Method 3: Developer Installation (Advanced Users)
1. Extract the ZIP file
2. Go to `about:debugging`
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extracted folder

**Note**: Methods 2 and 3 require the extension to be reloaded every time Firefox restarts.

## Distribution Strategy

### Dual Distribution
Maintain both Chrome Web Store and Firefox Add-ons listings:
- Use same version numbers
- Keep feature parity
- Update simultaneously when possible

### User Instructions
Update your documentation to include Firefox-specific installation:
1. Install Stream Deck plugin
2. Install Firefox extension from AMO
3. Navigate to Google Meet
4. Allow WebSocket connection when prompted 