# Stream Deck Google Meet Plugin

![Screenshot](keys_screenshot.png)

This is a plugin that allows the [Elgato Stream Deck](https://www.elgato.com/en/gaming/stream-deck) to control your camera and microphone in a Google Meet call. It provides toggle buttons that show whether your camera and mic are on or off, and they update whenever you press a Stream Deck button or mute/unmute directly in Meet. It also provides some other buttons to control various elements of the Meet web UI.

This plugin works in conjuction with our browser extension (Chrome or Firefox), which is required for this plugin to function.

Developed and tested primarily on macOS 15.0, Python 3.13.0, Chrome 130, Firefox 131, and Stream Deck app v6.6. It should work on Windows as well.

## Installing

1. If you're running on an Apple Silicon Mac (e.g. an M1 chip), you must have Apple's [Rosetta 2](https://support.apple.com/en-us/HT211861) installed. If you don't (or if you're not sure), open Terminal and run this command:

```
softwareupdate --install-rosetta --agree-to-license
```

2. From the [Releases page](https://github.com/ChrisRegado/streamdeck-googlemeet/releases), download the `com.chrisregado.googlemeet.streamDeckPlugin` package and open it. The Stream Deck desktop software will prompt you to install the plugin.

### Browser Extension Installation

Choose your browser and follow the appropriate installation method:

#### Chrome Installation
3a. The Chrome extension is not in the web store, so we'll install it manually from source. From the [Releases page](https://github.com/ChrisRegado/streamdeck-googlemeet/releases), download the source code zip and extract it somewhere you can keep it. (If you move the folder after installing, Chrome will remove the extension from your browser and you'll have to re-add it.)
4a. From Chrome's Extension settings (`chrome://extensions/`), turn on "Developer mode" using the toggle in the top-right corner.
5a. Click the "Load unpacked" button in the top-left corner, and select the `browser-extension` folder from the zip you extracted earlier.
6a. You can turn Developer mode back off now if you want.

#### Firefox Installation

**Option 1: Firefox Add-ons (Recommended)**
3b. Install the extension from [Firefox Add-ons](https://addons.mozilla.org) (search for "Stream Deck Google Meet Actions").
4b. When prompted, allow the extension to connect to localhost (this is required for Stream Deck communication).

**Option 2: Manual Installation (Development/Testing)**
If the extension is not yet available on Firefox Add-ons, you can install it temporarily:
3b. Download the `firefox-extension.zip` from the [Releases page](https://github.com/ChrisRegado/streamdeck-googlemeet/releases)
4b. Open Firefox and go to `about:debugging`
5b. Click "This Firefox" in the left sidebar
6b. Click "Load Temporary Add-on"
7b. Select the `firefox-extension.zip` file
8b. The extension will be loaded (but will be removed when Firefox restarts)

**Note**: Temporary installations must be reloaded every time Firefox restarts. For permanent installation, use Firefox Add-ons.

**Having trouble with Firefox installation?** See the [Firefox Development Installation Guide](browser-extension/install-firefox-dev.md) for detailed troubleshooting steps.

### Common Setup
7. If you use an ad blocker (such as uBlock Origin with the EasyPrivacy filter list), you may have to add meet.google.com as a trusted site in your blocker's settings to allow the extension to work. (Some filters block websockets to 127.0.0.1, which this extension needs to communicate with the Stream Deck.)
8. Add the buttons to your Stream Deck, and start a Google Meet call to try them out!

It's safe to delete the `com.chrisregado.googlemeet.streamDeckPlugin` file once it's installed. However, on Windows, you may need to quit the Stream Deck desktop software (by right clicking its icon in the Windows task tray and clicking Quit) and re-launch it to avoid "action can't be completed because the file is open" errors.

## Updating

To update the Stream Deck plugin, download and open the new plugin package just like when you initially installed it. If you experience any glitches after updating (such as on/off icons not changing on the toggle buttons), please try deleting your Meet buttons and re-adding them to your Stream Deck in the Stream Deck desktop app.

To update the browser extension:
- **Chrome**: Uninstall your existing version by clicking Remove on the Chrome Extension Settings page, and then follow the installation instructions again to install the new version.
- **Firefox**: Extensions from Firefox Add-ons update automatically. For manual installations, remove the old version and install the new one.

## Uninstalling

**Browser Extension:**
- **Chrome**: Go to your Extensions Settings page (`chrome://extensions/`), and click the Remove button for Stream Deck Google Meet Actions.
- **Firefox**: Go to Add-ons Manager (`about:addons`), find Stream Deck Google Meet Actions, and click Remove.

**Stream Deck Plugin:**
In the Stream Deck desktop app, right click on one of the Google Meet actions in the list on the right-hand side of the window, and click the "Uninstall..." button.

![Screenshot](uninstall_screenshot.png)

## Troubleshooting

* If Chrome won't let you enable the extension because it was not installed from the web store, you may need to allowlist the extension. On Windows, you can do this by editing the registry. Under both `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallWhitelist` and `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallAllowlist` add a string value, with the name "1" (or a greater number if "1" already exists). The value should be the extension ID, which you can get from [chrome://extensions/](chrome://extensions/) with Developer Mode on. If this does not work or you're on another operating system, you may find [this post](https://superuser.com/questions/767286/re-enable-extensions-not-coming-from-chrome-web-store-on-chrome-v35-with-enhan#) helpful.

## How It Works

The Stream Deck plugin launches a localhost-only Websocket server on port 2394, which our browser extension connects to. The plugin and browser extension send messages back and forth over that websocket to notify the Stream Deck when Meet changes its device on/off status, and simulates Meet mute button clicks in your browser when you press a key on your Stream Deck.

The Stream Deck plugin code is in the `streamdeck-plugin` directory. The browser extension code is in the `browser-extension` directory. The `com.chrisregado.googlemeet.sdPlugin` directory becomes our Stream Deck plugin distributable once we bundle our code, and contains our Stream Deck assets.

## Developing the Stream Deck Plugin

### First Time Setup

The plugin is written in Python. Create a venv to hold your package's dependencies, and install those dependencies:

MacOS:

```
cd streamdeck-plugin
python3 -m venv venv/
source venv/bin/activate
pip install -r requirements.txt
```

Windows:

```
cd streamdeck-plugin
python3 -m venv venv/
venv\Scripts\activate.bat
pip install -r requirements.txt
```

Remember that virtualenvs are not portable. If you move this folder at all, you'll have to delete the venv and re-create it.

### Running Unit Tests

MacOS:

```
cd streamdeck-plugin
source venv/bin/activate
python -m unittest
```

Windows:

```
cd streamdeck-plugin
venv\Scripts\activate.bat
python -m unittest
```

### Bundling

We use `pyinstaller` to bundle our code, dependencies, and a Python runtime environment into an executable. We put that executable into the `com.chrisregado.googlemeet.sdPlugin` folder, which in turn gets zipped up by the [Elgato DistributionTool](https://developer.elgato.com/documentation/stream-deck/sdk/packaging/) as our final distributable plugin package. That plugin package ends up including any assets we need (e.g. icons), the `manifest.json` file that defines our plugin for the Stream Deck desktop app, and our executable plugin code. Double-click that plugin package and the Stream Deck software will prompt you to install it.

To build the bundle:

MacOS:

```
cd streamdeck-plugin
source venv/bin/activate
rm -rf ../com.chrisregado.googlemeet.sdPlugin/dist/macos
pyinstaller --clean --dist "../com.chrisregado.googlemeet.sdPlugin/dist/macos" src/main.py
rm -rf build
```

Windows:

```
cd streamdeck-plugin
venv\Scripts\activate.bat
rmdir /q /s "..\com.chrisregado.googlemeet.sdPlugin\dist\windows"
pyinstaller --clean --dist "..\com.chrisregado.googlemeet.sdPlugin\dist\windows" src\main.py
rmdir /q /s build
```

Note that the resulting executable is only valid for the OS you built it on. MacOS and Windows bundles must be created separately from a machine/VM of that OS, and then combined into the `com.chrisregado.googlemeet.sdPlugin/dist/` folder with `macos` and `windows` subdirectories for release.

If you're just testing locally (so you only care about one OS), you can place any file in the other OS's executable location (`CodePath`s from `manifest.json`) to appease the Elgato DistributionTool. Example:

```
mkdir -p com.chrisregado.googlemeet.sdPlugin/dist/windows/main
touch com.chrisregado.googlemeet.sdPlugin/dist/windows/main/main.exe
```

Or, if you don't ever plan on publishing your local builds, delete the other OS's CodePath and `OS` entry in manifest.json so you don't have to worry about multi-OS support.

Finally, use the DistributionTool to bundle everything into the Stream Deck plugin distributable that you can send to users:

```
./DistributionTool -b -i ./com.chrisregado.googlemeet.sdPlugin -o ~/Desktop/
```

## Developing the Browser Extension

### Chrome Development
Follow the usual "Load unpacked" installation instructions described above, pointing Chrome at the `browser-extension` folder of your workspace. You can then reload the extension directly from source using the reload button on Chrome's Extension Settings page. See https://developer.chrome.com/extensions/getstarted for more details.

### Firefox Development

**Quick Testing (Recommended)**
```bash
cd browser-extension
npm install
npm run test-firefox
```
This will build the extension and launch Firefox with it loaded automatically.

**Manual Testing**
1. Open Firefox and go to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Select the `manifest_firefox.json` file from the `browser-extension` folder
5. The extension will be loaded temporarily and can be reloaded using the Reload button

### Cross-Browser Building
To build extensions for both browsers:
```bash
cd browser-extension
npm install          # Install dependencies (including web-ext)
npm run build        # Creates both Chrome and Firefox versions
npm run package-all  # Creates zip files for distribution
```

The packaging scripts are cross-platform compatible:
- **Windows**: Uses PowerShell for Chrome, web-ext for Firefox
- **Linux/macOS**: Uses zip command for Chrome, web-ext for Firefox

See `FIREFOX_PUBLISHING.md` for detailed Firefox publishing instructions.

## Publishing Extensions to Stores

This repository includes automated publishing workflows for both Chrome Web Store and Firefox Add-ons:

### Quick Start
1. **Setup**: Follow the detailed instructions in `PUBLISHING_SETUP.md`
2. **Validate**: Run `npm run validate-publishing` to check your setup
3. **Publish**: Run the GitHub Action manually or push a `publish-v*` tag
4. **Monitor**: Check the Actions tab and respective store dashboards

### Manual Publishing
- Go to GitHub Actions → "Publish browser extensions to stores"
- Choose which stores to publish to
- Select Chrome publish target (default/trustedTesters)

### Automated Publishing
```bash
git tag publish-v1.7.0
git push origin publish-v1.7.0
```

**Note**: Both extensions must be published manually at least once before automation works.

### GitHub Actions Workflows

The repository includes automated workflows for building and releasing:

#### Main Plugin Build (`.github/workflows/streamdeck-plugin-build.yml`)
- **Triggers**: Push to Stream Deck plugin or browser extension files
- **Builds**: Stream Deck plugin for macOS/Windows + both browser extensions
- **Artifacts**: Complete plugin package + browser extension zips
- **Releases**: Creates GitHub release on `v*` tags with all components

#### Browser Extension Build (`.github/workflows/browser-extension-build.yml`)
- **Triggers**: Push to browser extension files only
- **Builds**: Chrome and Firefox extensions
- **Artifacts**: Extension zips for testing
- **Releases**: Creates browser extension release on `browser-v*` tags

#### Release Process
```bash
# Full release (plugin + extensions)
git tag v1.7.0
git push origin v1.7.0

# Browser extension only release
git tag browser-v1.6.1
git push origin browser-v1.6.1

# Publish extensions to stores
git tag publish-v1.7.0
git push origin publish-v1.7.0
```

#### Extension Store Publishing (`.github/workflows/publish-extensions.yml`)
- **Triggers**: Manual dispatch or `publish-v*` tags
- **Publishes**: Chrome Web Store and Firefox Add-ons automatically
- **Setup**: Requires API credentials (see `PUBLISHING_SETUP.md`)
- **Features**: Selective publishing (Chrome/Firefox), trusted testers support

## Contributing

Feel free to contribute a feature or bug fix by opening a pull request. If you discover any problems or have any suggestions, please open a GitHub Issue.

## Credits

This project was inspired by https://github.com/JeroenVdb/streamdeck-googlemeet.

Neither this app nor its creator are affiliated with or endorsed by Google. The Google Meet name and logo are the exclusive property of Google.

Fonts for the actions and keys utilize rendered characters from the `Noto Emoji` and `Noto Color Emoji` fonts, under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

- https://fonts.google.com/noto/specimen/Noto+Color+Emoji?query=emoji&noto.query=emoji&preview.text=%F0%9F%92%96&preview.text_type=custom
- https://fonts.google.com/noto/specimen/Noto+Emoji?query=emoji&noto.query=emoji&preview.text=%F0%9F%92%96&preview.text_type=custom
