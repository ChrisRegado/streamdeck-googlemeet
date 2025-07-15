# Automated Release Process

This document explains the streamlined automated release process for the Stream Deck Google Meet browser extensions and plugin.

## Overview

The build process now automatically:
1. **Extracts version from git tags** (e.g., `v1.7.0` → `1.7.0`)
2. **Publishes to extension stores** when releasing without the "prerelease" flag
3. **Skips publishing** for prereleases (allows manual download from GitHub)

## Workflow Structure

### 🔧 **ci-build.yml** (CI/CD Validation)
- **Purpose**: Continuous integration and validation of all components
- **Triggers**: Pull requests and pushes to `browser-extension/**`, `streamdeck-plugin/**`, `com.chrisregado.googlemeet.sdPlugin/**`
- **Builds**: Browser extensions + Stream Deck plugin (macOS & Windows)
- **Tests**: Unit tests for plugin, validation for extensions
- **Artifacts**: Build artifacts with 7-day retention for review
- **Branches**: `main`, `master`, `develop`

### 🚀 **browser-extension-release.yml** (Production Extension Release)
- **Purpose**: Automated browser extension releases with store publishing
- **Triggers**: GitHub releases (created via web UI or API)
- **Builds**: Browser extensions with dynamic versioning
- **Publishes**: Conditionally to Chrome Web Store & Firefox Add-ons
- **Tag pattern**: Any tag (e.g., `v1.7.0`, `v2.0.0-beta`)

### 📦 **streamdeck-plugin-build.yml** (Complete Plugin Package)
- **Purpose**: Build complete Stream Deck plugin package with bundled browser extensions
- **Triggers**: Changes to `streamdeck-plugin/**` or `com.chrisregado.googlemeet.sdPlugin/**`
- **Builds**: Multi-platform Stream Deck plugin + browser extensions
- **Releases**: Complete plugin package on `v*` tags
- **Tag pattern**: `v*` (e.g., `v1.7.0`)

## Development Workflow

### 🔄 **Pull Request Process**
1. **Make changes** to any component (`browser-extension/**`, `streamdeck-plugin/**`, `com.chrisregado.googlemeet.sdPlugin/**`)
2. **Create pull request** 
3. **Automated build** runs via `ci-build.yml`
   - Builds Stream Deck plugin for macOS & Windows
   - Builds browser extensions for Chrome & Firefox
   - Runs unit tests for plugin
   - Validates extension manifests
4. **Review artifacts** (All components available for download)
5. **Merge** when all builds pass and review is complete

### 🚀 **Release Process**
1. **Merge** changes to main branch
2. **Create release** via GitHub UI with appropriate tag
3. **Automated release** runs via `browser-extension-release.yml`
4. **Store publishing** (if not prerelease)

## Creating a Release

### 1. Tag and Release

```bash
# Create and push a tag
git tag v1.7.0
git push origin v1.7.0

# Or create a release via GitHub UI
# Go to: https://github.com/your-repo/releases/new
```

### 2. Release Types

#### **Production Release** (Auto-publishes to stores)
- ✅ **Prerelease**: Unchecked
- 🚀 **Result**: Automatically publishes to Chrome Web Store and Firefox Add-ons
- 📦 **Downloads**: Extensions also available from GitHub release

#### **Pre-release** (Manual download only)
- ☑️ **Prerelease**: Checked
- 🛑 **Result**: Does NOT publish to stores
- 📦 **Downloads**: Only available from GitHub release page

## Version Handling

### Git Tag Format
- Use semantic versioning with `v` prefix: `v1.7.0`, `v2.0.0-beta.1`, etc.
- The build process automatically strips the `v` prefix for manifest files

### Automatic Version Injection
- **Manifest files**: Version automatically updated during build
- **Package.json**: Updated via `npm run update-version`
- **No manual version bumping required**

## Build Validation

### CI/CD Checks
- ✅ **Stream Deck Plugin**: Python unit tests, multi-platform builds (macOS, Windows)
- ✅ **Browser Extensions**: Version extraction, build compilation, manifest validation
- ✅ **Extension Packaging**: ZIP file creation for Chrome and Firefox
- ✅ **Firefox Linting**: `web-ext lint` when available
- ✅ **Artifact Upload**: All components with 7-day retention

### Artifact Downloads
Pull request builds generate downloadable artifacts:
- `macos-plugin-build-{sha}` - macOS Stream Deck plugin
- `windows-plugin-build-{sha}` - Windows Stream Deck plugin
- `chrome-extension-build-{sha}` - Chrome extension ZIP
- `firefox-extension-build-{sha}` - Firefox extension ZIP
- `browser-extensions-build-{sha}` - Complete extension build directory

## Workflow Details

### Files Modified
- `browser-extension/get-version.js` - Version extraction logic
- `browser-extension/build.js` - Injects version into manifests
- `browser-extension/package.json` - Adds version update script
- `.github/workflows/ci-build.yml` - CI/CD validation workflow
- `.github/workflows/browser-extension-release.yml` - Extension release workflow
- `.github/workflows/streamdeck-plugin-build.yml` - Complete plugin package workflow

### Build Process
1. **Checkout code** with full git history
2. **Extract version** from git tag
3. **Update package.json** with current version
4. **Build extensions** with version-injected manifests
5. **Build plugin** (multi-platform)
6. **Upload to release** (release workflow only)
7. **Publish to stores** (release workflow, non-prerelease only)

## Store Publishing

### Chrome Web Store
- **Automatic**: ✅ Production releases
- **Manual**: ❌ Prereleases
- **Target**: Default (public)

### Firefox Add-ons
- **Automatic**: ✅ Production releases  
- **Manual**: ❌ Prereleases
- **Review**: Automatic approval for trusted developers

## Local Development

### Local Development
```bash
# Browser extensions
cd browser-extension
npm run build
npm run update-version
node get-version.js

# Stream Deck plugin
cd streamdeck-plugin
pip install -r requirements.txt
python -m unittest
```

### Testing Releases
1. Create a prerelease to test the workflow
2. Check that extensions are attached to the release
3. Verify that stores are NOT published to
4. Convert to production release when ready

## Migration from Old Process

### Before (Manual)
- Multiple workflows with duplicate browser extension builds
- Hardcoded versions in `manifest.json` and `package.json`
- Manual publishing via workflow_dispatch
- Required version bumping before commits

### After (Streamlined)  
- Single comprehensive CI/CD workflow for all components
- Separate workflow for browser extension releases
- Separate workflow for complete plugin packages
- Dynamic versioning from git tags
- Automatic publishing based on release type
- No manual version management needed

## Troubleshooting

### Build Failures
- **Plugin builds**: Check Python dependencies and unit tests
- **Extension builds**: Check Node.js dependencies and manifest validation
- **General**: Check the Actions tab for detailed error logs
- Verify that component changes trigger the appropriate builds

### Version Not Found
- Ensure you're on a tagged commit
- Check tag format: `v1.7.0` (with `v` prefix)
- Falls back to package.json version if no tags

### Publishing Failed
- Check repository secrets are configured
- Verify extension IDs and API keys
- Review workflow logs for specific errors

### Prerelease Published by Mistake
- Check the "prerelease" checkbox was selected
- Workflow will skip publishing if prerelease=true

## Repository Secrets Required

Ensure these secrets are configured in your repository:

```
CHROME_EXTENSION_ID
CHROME_CLIENT_ID
CHROME_CLIENT_SECRET
CHROME_REFRESH_TOKEN
FIREFOX_ADDON_GUID
FIREFOX_JWT_ISSUER
FIREFOX_JWT_SECRET
``` 