# Extension Publishing Setup Guide

This guide explains how to set up automated publishing for both Chrome Web Store and Firefox Add-ons using GitHub Actions.

## Prerequisites

1. **Chrome Web Store Developer Account** ($5 one-time fee)
2. **Firefox Add-ons Developer Account** (free)
3. **GitHub repository with Actions enabled**
4. **Extensions already published manually once** (for getting IDs)

## Chrome Web Store Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Chrome Web Store API:
   - Go to "APIs & Services" → "Library"
   - Search for "Chrome Web Store API"
   - Click "Enable"

### Step 2: Create OAuth2 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Desktop application"
4. Name it "Chrome Extension Publishing"
5. Save the **Client ID** and **Client Secret**

### Step 3: Get Refresh Token

1. Install the [chrome-webstore-upload-cli](https://github.com/fregante/chrome-webstore-upload-cli):
   ```bash
   npm install -g chrome-webstore-upload-cli
   ```

2. Run the authentication flow:
   ```bash
   chrome-webstore-upload-cli --refresh-token \
     --client-id YOUR_CLIENT_ID \
     --client-secret YOUR_CLIENT_SECRET
   ```

3. Follow the instructions to get your **Refresh Token**

### Step 4: Get Extension ID

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Find your extension
3. Copy the **Extension ID** from the URL or extension details

## Firefox Add-ons Setup

### Step 1: Create API Credentials

1. Go to [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
2. Sign in with your Firefox account
3. Go to "Tools" → "API Key Management"
4. Click "Create new API key"
5. Name it "GitHub Actions Publishing"
6. Save the **JWT Issuer** and **JWT Secret**

### Step 2: Get Add-on GUID

1. Go to your [Firefox Add-ons Dashboard](https://addons.mozilla.org/developers/addons)
2. Find your extension
3. Click "Manage"
4. The **Add-on GUID** is shown in the extension details (format: `{12345678-1234-1234-1234-123456789012}`)

## GitHub Secrets Configuration

Add these secrets to your GitHub repository:

### Repository Settings → Secrets and Variables → Actions → New repository secret

#### Chrome Web Store Secrets:
- **CHROME_EXTENSION_ID**: Your Chrome extension ID
- **CHROME_CLIENT_ID**: OAuth2 client ID from Google Cloud
- **CHROME_CLIENT_SECRET**: OAuth2 client secret from Google Cloud
- **CHROME_REFRESH_TOKEN**: Refresh token from chrome-webstore-upload-cli

#### Firefox Add-ons Secrets:
- **FIREFOX_ADDON_GUID**: Your Firefox add-on GUID (with braces)
- **FIREFOX_JWT_ISSUER**: JWT Issuer from Firefox API key
- **FIREFOX_JWT_SECRET**: JWT Secret from Firefox API key

## Usage

### Manual Publishing

1. Go to your GitHub repository
2. Click "Actions" tab
3. Select "Publish browser extensions to stores"
4. Click "Run workflow"
5. Choose options:
   - ✅ Publish to Chrome Web Store
   - ✅ Publish to Firefox Add-ons
   - Select Chrome publish target (default/trustedTesters)
6. Click "Run workflow"

### Automated Publishing

Create a git tag starting with `publish-v`:

```bash
git tag publish-v1.7.0
git push origin publish-v1.7.0
```

This will automatically trigger publishing to both stores.

## Validating the Setup

Before publishing, you can validate your setup using the included validation script:

```bash
cd browser-extension
npm run validate-publishing
```

This will check:
- ✅ Build artifacts exist
- ✅ Manifest versions match
- ✅ Environment variables are set
- ✅ GitHub workflow is configured

## Testing the Setup

### Test Chrome Publishing

1. Ensure your Chrome extension is already published manually once
2. Make a small version bump in `manifest.json`
3. Run the GitHub Action with "trustedTesters" target first
4. Check Chrome Web Store Developer Dashboard for the update

### Test Firefox Publishing

1. Ensure your Firefox extension is already published manually once
2. Make a small version bump in `manifest_firefox.json`
3. Run the GitHub Action
4. Check Firefox Add-ons Developer Dashboard for the update

## Troubleshooting

### Chrome Web Store Issues

- **"Extension not found"**: Check CHROME_EXTENSION_ID
- **"Invalid credentials"**: Regenerate OAuth tokens
- **"Quota exceeded"**: Chrome has daily upload limits

### Firefox Add-ons Issues

- **"Add-on not found"**: Check FIREFOX_ADDON_GUID format
- **"Invalid JWT"**: Regenerate API keys
- **"Validation failed"**: Check extension manifest and code

### GitHub Actions Issues

- **"Secret not found"**: Verify all secrets are set correctly
- **"Permission denied"**: Check repository Actions permissions
- **"Build failed"**: Check the build logs for specific errors

## Version Management

The publishing workflow uses the version from:
- `manifest.json` for Chrome
- `manifest_firefox.json` for Firefox

Make sure to:
1. Update version numbers before publishing
2. Use semantic versioning (e.g., 1.6.0 → 1.6.1)
3. Keep both manifest versions synchronized

## Security Notes

- **Never commit API keys** to your repository
- **Use GitHub secrets** for all sensitive information
- **Rotate keys periodically** for security
- **Monitor API usage** in both developer dashboards

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Review the developer console for both stores
3. Verify all secrets are correctly configured
4. Ensure extensions were published manually at least once 