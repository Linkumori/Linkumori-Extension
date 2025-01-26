# Linkumori (Clean URLs)

![GitHub release of extension (latest by date)](https://img.shields.io/github/v/release/subham8907/Linkumori?style=flat&label=Extension%20Github%20Release&color=blue)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kcpfnbjlimolkcjllfooaipdpdjmjigg?label=Chrome%20Web%20Store&logo=google-chrome&logoColor=white)](https://chromewebstore.google.com/detail/linkumori-clean-urls/kcpfnbjlimolkcjllfooaipdpdjmjigg)

![Linkumori](https://github.com/subham8907/Linkumori/blob/main/icons/default/icon128.png)

<a href="https://chromewebstore.google.com/detail/linkumori-clean-urls/kcpfnbjlimolkcjllfooaipdpdjmjigg"><img height="58" src="https://i.imgur.com/K9Yh8G9.png" alt="Chrome Web Store"></a>

Linkumori (URLs Cleaner) is a powerful browser extension for Chromium-based browsers that enhances your privacy by purifying URLs, removing tracking parameters, and blocking hyperlink auditing, all without interrupting your browsing experience.

## Features

- Cleans URLs by removing tracking parameters without blocking or redirecting
- Utilizes both static and dynamic Declarative Net Request (DNR) rules for efficient URL cleaning at the network level 
- Supports a wide range of websites and URL patterns
- Blocks hyperlink auditing for increased privacy
- Uses the History API to update URLs without page reloads
- Operates seamlessly in the background 
- Supports dark/light mode theme toggle
- Advanced tools interface for additional functionality

## How It Works

1. **Static DNR rules**: Predefined rules that clean common tracking parameters across various websites.
2. **Dynamic DNR rules**: Allows for more flexible and up-to-date URL cleaning based on the latest tracking methods.
3. **History API**: For URLs that can't be caught by DNR rules, Linkumori uses the History API to clean the URL without reloading the page.
4. **Hyperlink Auditing Block**: Prevents websites from tracking your clicks on links that leave their site.

## Installation 

### Load unpacked: Chrome, MS Edge or Brave (all desktop)

1. Clone this repository or download the source code to a permanent location (do not delete the folder after installation).
2. Open your Chromium-based browser (e.g., Chrome, Edge) and navigate to the extensions page. 
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

### CRX-file: other Chromium browsers (Opera/Vivaldi/Yandex)

1. Download the extension as a crx-file from latest release (right-click > save link as).
2. In your browser navigate to the extensions page 
3. Enable "Developer mode" in the top right corner.
4. Drag your crx-file anywhere on the page to import it.

## Usage

Once installed, Linkumori works automatically in the background:

1. The extension icon in the browser toolbar shows the current status.
2. Click the icon to toggle the extension on or off.
3. Browse normally - Linkumori will clean URLs as you navigate, without any noticeable interruption to your browsing.
4. Use the theme toggle to switch between dark and light modes.
5. Access advanced tools through the dedicated button in the interface.

## Interface Guide

### Main Tab
![Main Tab Interface](https://github.com/subham8907/Linkumori/blob/main/docs/images/main.png)
- Simple On/Off toggle switch  
- Current extension status display
- Theme toggle button
- Advanced tools access
- Clean, minimalist design
- History API Protection toggle
- Hyperlink Auditing Block toggle

### Whitelist Management
![Whitelist Interface](https://github.com/subham8907/Linkumori/blob/main/docs/images/whitelist-active.png)
- Domain input field with Add button
- "Add Current Domain" button for quick whitelisting
- List of whitelisted domains 
- Quick remove options for each domain

### License Information
![License Tab](https://github.com/subham8907/Linkumori/blob/main/docs/images/license.png)
- Complete license details
- User rights and obligations
- Scrollable interface for full license text
- Links to external repositories and licenses

## Whitelisting System

Linkumori includes a domain whitelisting system that allows you to exempt specific domains from URL cleaning. However, the domain matching requires careful attention to the domain format.

### Domain Matching Rules:
1. For URLs with `www` prefix (e.g. `www.example.com`):
   - Can whitelist as `www.example.com` OR `example.com` 
   - Both formats will work
2. For URLs without `www` prefix (e.g. `example.com`):
   - Must whitelist exactly as `example.com`
   - Using `www.example.com` will NOT work
3. For subdomains (e.g. `sub.example.com`):
   - Must whitelist exactly as `sub.example.com`

### Usage Examples:
✅ Correct Usage:
- For `https://www.example.com`:
  - Can use `www.example.com` OR `example.com` 
- For `https://example.com`:
  - Must use `example.com`
- For `https://sub.example.com`:
  - Must use `sub.example.com`

❌ Incorrect Usage:
- For `https://example.com`:
  - Using `www.example.com` won't work

### Best Practices:
1. Check the actual URL in your browser's address bar
2. For sites with `www`, you can use either format
3. For sites without `www`, must match exactly  
4. For subdomains, always match exactly
5. Test the whitelist entry by visiting different pages on the domain

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project uses multiple licenses:

### GPLv3 License

The following code in the linkurmori source code files are completely under the GNU General Public License v3 or (at your option) any later version.

- `/rules/rules9.json`
- `/rules/rules8.json`
- `/rules/rules16.json`
- `/rules/rules17.json`
- `/_locales/en/messages.json`
- `lib/amazon-url-prevention.js`
- `/panel/first-install.html`
- `/panel/first-install.js`
- `common/rules.js`
- `panel/option.js`
- `panel/cleanurls-tools.html`
- `panel/cleanurls-tools.js`
- `/panel/panelMenu.html`
- `/panel/panelMenu.js`
- `lib/Anti-history-api.js`
- `/panel/style.css`
- `/Linkumori-Artifact/Artifact.json`
- `icons/default/icon48.png`
- `icons/default/icon96.png`
- `icons/default/icon128.png`
- `icons/light/icon16.png`
- `icons/light/icon32.png`
- `icons/light/icon128.png`
- `icons/light/icon48.png`
- `icons/light/icon96.png`
- `icons/light/icon128.png`
- `icons/dark/icon16.png`
- `icons/dark/icon32.png`
- `icons/dark/icon128.png`
- `icons/dark/icon48.png`
- `icons/dark/icon96.png`
- `icons/dark/icon128.png`

Copyright (c) 2024 Subham Mahesh

"The license text embedded in panelMenu.html and option.html was originally authored by its respective creators, such as the Free Software Foundation (FSF) or other organizations responsible for drafting such licenses.
 Subham Mahesh is not the author of this license text, and it remains the property of its original authors."


### Mixed License (GPLv3 and MIT)

The following files contain a mix of GPLv3 and MIT licensed code:

1. Background and Common Files:
- `background.js`
- `common/constants.js`
- `common/utils.js`

GPLv3 portions: Copyright (c) 2024 Subham Mahesh
MIT portions: Copyright (c) 2022 Nick

2. Fix Scripts:
- `lib/google-fix.js`
- `lib/yandex-fix.js`

GPLv3 portions: Copyright (c) 2024 Subham Mahesh
MIT portions: Copyright (c) 2017 kodango

###  MIT License SVGS

The following files are licensed under MIT license:

1. Icons:
- `panel/sun.svg`
- `panel/moon.svg`

Original source:
- sun.svg: https://github.com/feathericons/feather/blob/main/icons/sun.svg
- moon.svg: https://github.com/feathericons/feather/blob/main/icons/moon.svg

Copyright (c) 2013-2023 Cole Bemis
###  MIT License Library

- `lib/punycode.js` 

Copyright Mathias Bynens

### Rule Source Attribution

The AdguardFilters filter lists were developed by AdGuard Software Ltd. which is licensed under GNU General Public License v3.0 only and have been converted by Subham Mahesh to work with Chrome's newer Declarative NetRequest API specification.

Rule File Locations:
- rules/rules1.json
- rules/rules2.json
- rules/rules3.json
- rules/rules4.json
- rules/rules5.json
- rules/rules6.json
- rules/rules7.json
- rules/rules10.json
- rules/rules11.json
- rules/rules12.json
- rules/rules13.json
- rules/rules14.json
- rules/rules15.json

Each JSON file contains two types of Declarative NetRequest static rules:
- Converted rules from AdGuard's original filter lists
- Rules independently developed by Subham Mahesh

For more information about the original work, please see: https://github.com/AdguardTeam/AdguardFilters

### Font License

This project uses the Liberation Serif Regular font, located in the `./liberation-fonts` directory. The font is licensed under the SIL Open Font License, Version 1.1.

Copyright:
- Digitized data copyright (c) 2010 Google Corporation with Reserved Font Arimo, Tinos and Cousine
- Copyright (c) 2012 Red Hat, Inc. with Reserved Font Name Liberation

### Font Awesome Icons

This project uses two Screwdriver Wrench icons and two cog icons from Font Awesome, licensed under CC BY 4.0.

Icon locations in source:
- `/panel/advanced-tools-dark.svg`
- `/panel/advanced-tools-light.svg`
- `/panel/cog-light.svg`
- `/panel/cog-dark.svg`

Original sources:
- Advanced tools (dark): https://fontawesome.com/icons/screwdriver-wrench?f=classic&s=solid&pc=%23ffffff&sc=%23FFD43B%2F
- Advanced tools (light): https://fontawesome.com/icons/screwdriver-wrench?f=classic&s=solid&pc=%23334155&sc=%23FFD43B%2F
- Cog (dark): https://fontawesome.com/v5/icons/cog?f=classic&s=solid&sz=lg&pc=%23ffffff&sc=%23ffffff
- Cog (light): https://fontawesome.com/v5/icons/cog?f=classic&s=solid&sz=lg&pc=%23334155&sc=%23334155

Copyright: © 2024 Fonticons, Inc.

### Mozilla Public License 2.0

The Linkumori extension includes the clipboard-helper.js file, sourced from the MDN Web Extensions repository and licensed under the Mozilla Public License 2.0 (MPL 2.0). Located in ./lib/clipboard-helper.js within the Linkumori source code, this file also distributed under the GNU General Public License version 3 (GPL v3) as a secondary license, since requirements are fulfilled under MPL 2.0 Section 3.3. This dual-licensing applies only to clipboard-helper.js and not to other parts of the Linkumori extension unless explicitly stated. Recipients must comply with the terms of their selected license.

Original source: https://github.com/mdn/webextensionsexamples/blob/main/context-menu-copy-link-with-types/clipboard-helper.js

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Based on the ERASER project by Nick (https://github.com/Psychosynthesis/Eraser/)
- Uses rules derived from AdguardTeam's AdguardFilters (https://github.com/AdguardTeam/AdguardFilters)
- Inspired by the need for greater privacy in online browsing

## Disclaimer

Linkumori is provided "as is" without warranty of any kind. Use at your own risk.

For complete license texts and additional details, please see the LICENSE file in the project repository.
By contributing to this project, you agree that all contributions are submitted under the terms of the GNU General Public License version 3 or any later version (GPL-3.0+).
