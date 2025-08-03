# Release Guide

This document explains how to publish a new release of the Stream Deck plugin and browser extensions.

## First Time Firefox Add-on Setup

If you're setting up the project in a new GitHub repo (or you're creating a fork), there's some initial work you'll need to do to get Firefox extension signing configured.

First, prepare an (unsigned) build of the extension to submit to Mozilla for initial approval:

1. Create your own UUID to use as your Firefox extension ID. (On macOS or Linux, try running `uuidgen`.)
2. Update `browser-extension/manifest_firefox_stub.json` and change the `browser_specific_settings.gecko.id` field to be your new UUID wrapped in curly braces.
3. From within the `browser-extension` directory, run `npm install && npm run build && npm run package-firefox`. This should create a zip file named `browser-extension/build/stream_deck_google_meet_actions-0.0.1.zip`. We'll use that file soon.

Now we'll go to the Firefox Add-on website and create the add-on:

1. Go to the [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/) and create an account, or sign in with your Firefox account if you already have one.
2. Click [My Add-ons](https://addons.mozilla.org/developers/addons).
3. Click "Submit a New Add-on", and when asked "how you would like to distribute this version", select `On your own`. (Don't list the add-on on the public store.)
4. Upload the extension build artifact from earlier (`browser-extension/build/stream_deck_google_meet_actions-0.0.1.zip`).
5. Wait for approval from Mozilla. The plugin will likely get auto-approved within a few minutes.

Finally, we'll add auth tokens from the Firefox Add-on portal as GitHub Action secrets so you can have automated release builds in CI:

1. Go back to the Firefox Add-on Developer Hub and go to "Tools" --> "[Manage API Keys](https://addons.mozilla.org/en-US/developers/addon/api/key/)".
2. If you don't see any existing credentials on that page, create a new API key.
3. Save the `JWT issuer` and `JWT secret`.
4. In your GitHub repo (or fork), click on the Settings tab (e.g. https://github.com/ChrisRegado/streamdeck-googlemeet/settings), and click on "Secrets and variables" --> "Actions" in the sidebar.
5. Using the "New repository secret" button, create two new repository secrets:
    * A secret named `FIREFOX_JWT_ISSUER`, whose value must be set to the `JWT issuer` from the Firefox Add-on site.
    * A secret named `FIREFOX_JWT_SECRET`, whose value must be set to the `JWT secret` from the Firefox Add-on site.

## Releasing a New Version

Follow these steps each time you want to release a new version of the plugin and/or browser extension:

1. Manually update the version number of the Stream Deck plugin by editing `com.chrisregado.googlemeet.sdPlugin/manifest.json` and changing the `Version` field. Make sure that change gets merged into `master`. (We have CI jobs to manage version numbers for the browser extensions, so you don't need to touch those.)
2. On the Github page for your repo, click "Releases". (e.g. https://github.com/ChrisRegado/streamdeck-googlemeet/releases)
3. Click "Draft a new release".
4. Click the "Tag" button. We use semantic versioning with a "v" prefix for our releases. Enter a new version string (e.g. `v1.2.3`) and click "Create a new tag: v1.2.3 on publish". (Or if you already manually pushed a properly-formatted tag to origin, you can pick that tag in the dropdown.)
5. Use the same version string for the "Release title", and enter a description summarizing notable changes in this release.
6. Select the "Set as a pre-release" checkbox near the bottom of the page.
7. Click "Publish release".
8. Wait for our CI jobs to complete. If all goes well, in a few minutes you should see 3 attachments appear on the release: the `com.chrisregado.googlemeet.streamDeckPlugin` plugin, a zip of the Chrome extension, and an `.xpi` file for the Firefox extension.
9. Do a final manual validation of those release artifacts. (Download and install the plugin and browser extension, and verify basic functionality.)
10. Edit the release, uncheck the "Set as a pre-release" checkbox at the bottom of the page, select the "Set as the latest release" checkbox, and click "Update release".
