# Firefox Development Installation Guide

If you downloaded the `firefox-extension.zip` from the releases page and are getting a "corrupt package" error, follow these steps:

## Why This Happens

Firefox doesn't allow direct installation of unsigned extensions from ZIP files. This is a security feature to protect users from malicious extensions.

## How to Install for Development/Testing

### Method 1: Load Temporary Add-on (Recommended)

1. **Open Firefox** and navigate to `about:debugging`
2. **Click "This Firefox"** in the left sidebar
3. **Click "Load Temporary Add-on"**
4. **Select the `firefox-extension.zip` file** you downloaded
5. The extension will be loaded and active

**Note**: This extension will be removed when Firefox restarts. You'll need to reload it each time.

### Method 2: Extract and Load

1. **Extract the ZIP file** to a folder on your computer
2. **Open Firefox** and navigate to `about:debugging`
3. **Click "This Firefox"** in the left sidebar
4. **Click "Load Temporary Add-on"**
5. **Navigate to the extracted folder** and select the `manifest.json` file
6. The extension will be loaded and active

## Verification

After loading the extension, you should see:
- "Stream Deck Google Meet Actions" in your Firefox extensions list
- No error messages in the browser console
- The extension working when you visit `meet.google.com`

## For Permanent Installation

For permanent installation without needing to reload every time:
1. **Wait for Firefox Add-ons release** (recommended)
2. **Or use Firefox Developer Edition** with signing disabled (advanced users only)

## Troubleshooting

- **"This add-on could not be installed"**: Make sure you're using the correct `manifest.json` file
- **Extension not working**: Ensure your Stream Deck plugin is running on port 2394
- **WebSocket errors**: Check that no firewall is blocking localhost connections

## Need Help?

If you're still having issues, please:
1. Check the [main README](../README.md) for complete setup instructions
2. Open an issue on the [GitHub repository](https://github.com/ChrisRegado/streamdeck-googlemeet/issues)
3. Include your Firefox version and any error messages 