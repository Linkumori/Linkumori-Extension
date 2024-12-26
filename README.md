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

The following files are completely under the GNU General Public License v3 or any later version:

- `/rules/rules7.json`
- `/rules/rules8.json`
- `common/rules.js`
- `panel/option.js`
- `panel/option.html`
- `panel/cleanurls-tools.html`
- `panel/cleanurls-tools.js`
- `/panel/panelMenu.html`
- `/panel/panelMenu.js`
- `/content.js`
- `/panel/style.css`
- `/Linkumori-Artifact/Artifact.json`
- `/panel/first-install.html`
- `/panel/first-install.js`
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

For clarification, licenses embedded in the panelMenu.html file are not copyrighted by Subham Mahesh but by their respective owners.

### Mixed License (GPLv3 and MIT)

The following files contain a mix of GPLv3 and MIT licensed code:

- `background.js`  
- `common/constants.js`
- `common/utils.js`

GPLv3 portions: Copyright (c) 2024 Subham Mahesh
MIT portions: Copyright (c) 2022 Nick

### MIT License
The following files are licensed under MIT license:
- `panel/sun.svg`  
- `panel/moon.svg`

Original source:
- sun.svg: https://github.com/feathericons/feather/blob/main/icons/sun.svg
- moon.svg: https://github.com/feathericons/feather/blob/main/icons/moon.svg

Copyright (c) 2013-2023 Cole Bemis

### Rule Source Attribution
The AdGuard filter lists were developed by AdGuard Software Ltd. which is license under (GNU General Public License v3.0 only) and have been converted by subham mahesh to work with Chrome's newer Declarative NetRequest API specification.

Rule File Locations
rules/rules1.json
rules/rules2.json
rules/rules3.json
rules/rules4.json
rules/rules5.json
rules/rules6.json
Additional Information
Each JSON file contains two types of Declarative NetRequest static rules:

Converted rules from AdGuard's original filter lists
rules that are independently developed by Subham Mahesh
Modification Details
For detailed information about modifications, including dates and specific changes to the original work, please refer to the rules/notice.txt file in the extension source code.

### Font License

This project uses the Liberation Serif Regular font, located in the `./liberation-fonts` directory. The font is licensed under the SIL Open Font License, Version 1.1.The font is located in the `./liberation-fonts` directory.


### Font Awesome Icons
This project uses the Screwdriver Wrench icons and cog icons from Font Awesome Free, licensed under CC BY 4.0.

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

The Linkumori (URLs Purifier) extension incorporates MPL 2.0 licensed code from the MDN Web Extensions repository, specifically the clipboard-helper.js file (original source: https://github.com/mdn/webextensions-examples/blob/main/context-menu-copy-link-with-types/clipboard-helper.js). This code is located at './clipboard-helper.js' within the Linkumori extension. In accordance with MPL 2.0 Section 3.3, recipients of this larger work have the option to receive and use this specific file under either the terms of the Mozilla Public License 2.0 or alternatively under the GNU General Public License version 3. This dual-licensing option applies exclusively to the clipboard-helper.js file and does not extend to other components of the Linkumori extension. Recipients must comply with the terms of whichever license they choose (MPL 2.0 or GPL v3) for this specific file, including maintaining appropriate notices and making the source code available as required by the chosen license.

## Acknowledgments

- Based on the ERASER project by Nick (https://github.com/Psychosynthesis/Eraser/)
- Uses rules derived from AdguardTeam's AdguardFilters (https://github.com/AdguardTeam/AdguardFilters)
- Inspired by the need for greater privacy in online browsing

## Disclaimer

Linkumori is provided "as is" without warranty of any kind. Use at your own risk.

For full license texts, please see the [LICENSE](LICENSE) file in the project repository.