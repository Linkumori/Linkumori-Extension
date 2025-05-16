/*
   SPDX-License-Identifier: GPL-3.0-or-later

Copyright (C) 2025 Subham Mahesh
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

/******************************************************************************/
import { readPurifyUrlsSettings, setDefaultSettings } from '../common/utils.js';
import { defaultSettings, SETTINGS_KEY, CANT_FIND_SETTINGS_MSG, STATS_KEY } from '../common/constants.js';
// DOM Helper Functions
function $(selector) {
    return document.querySelector(selector);
}

function createElement(tag, attributes = {}, textContent = '') {
    const element = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    
    if (textContent) {
        element.textContent = textContent;
    }
    
    return element;
}

/******************************************************************************/

// Enhanced reportedPage function to handle dropdown options
const reportedPage = (function() {
    const url = new URL(window.location.href);
    try {
        const pageURL = url.searchParams.get('url');
        if (pageURL === null) { return null; }
        
        const parsedURL = new URL(pageURL);
        parsedURL.username = '';
        parsedURL.password = '';
        parsedURL.hash = '';
        
        // Create URL variations for dropdown options
        const originalUrl = parsedURL.href;
        
        // Base domain URL
        const baseUrl = new URL(parsedURL.href);
        baseUrl.pathname = '/';
        baseUrl.search = '';
        
        return {
            hostname: parsedURL.hostname.replace(/^(m|mobile|www)\./, ''),
            cleanedUrl: url.searchParams.get('cleanedUrl'),
            originalUrl: pageURL,
            baseUrl: baseUrl.href
        };
    } catch (error) {
        console.error('Error processing URL parameters:', error);
        const errorMsg = createElement('p', { class: 'error' }, 
            'Error processing URL: ' + error.message);
        document.querySelector('section').prepend(errorMsg);
    }
    return null;
})();

/******************************************************************************/

// Function to populate the URL dropdown with actual values
function populateUrlDropdown() {
    const urlSelect = $('#urlSelect');
    
    // Clear existing options
    urlSelect.innerHTML = '';
    
    if (reportedPage) {
        // Add the full URL option
        const originalOption = createElement('option');
        originalOption.value = 'original';
        originalOption.textContent = reportedPage.originalUrl;
        urlSelect.appendChild(originalOption);
        
        // Add the domain-only option
        const domainOption = createElement('option');
        domainOption.value = 'domain';
        domainOption.textContent = reportedPage.baseUrl;
        urlSelect.appendChild(domainOption);
    }
    
    // Add the custom URL option
    const customOption = createElement('option');
    customOption.value = 'custom';
    customOption.textContent = 'Enter custom URL';
    urlSelect.appendChild(customOption);
}

/******************************************************************************/

function getIssueType() {
    return $('#issueTypeSelect').value;
}

/******************************************************************************/

// Function to update URL displayed based on dropdown selection
function handleUrlDropdownChange() {
    const urlSelect = $('#urlSelect');
    const customUrlContainer = $('#customUrlContainer');
    
    if (urlSelect.value === 'custom') {
        // Show custom URL input field
        customUrlContainer.style.display = 'block';
        $('#customUrlInput').focus();
    } else {
        // Hide custom URL input field
        customUrlContainer.style.display = 'none';
    }
}

// Function to get the selected URL (for report submission)
function getSelectedUrl() {
    const urlSelect = $('#urlSelect');
    
    if (!reportedPage) {
        return $('#customUrlInput').value.trim();
    }
    
    switch (urlSelect.value) {
        case 'original':
            return reportedPage.originalUrl;
        case 'domain':
            return reportedPage.baseUrl;
        case 'custom':
            return $('#customUrlInput').value.trim();
        default:
            return reportedPage.originalUrl;
    }
}

/******************************************************************************/

// Update the updateURLSelectVisibility function
function updateURLSelectVisibility() {
    const issueType = getIssueType();
    const validTypes = [
        'tracking-not-removed',
        'url-broken',
        'false-positive'
    ];
    
    const urlContainer = document.querySelector('.url-input-container');
    const nsfwContainer = document.querySelector('.nsfw-container');
    
    if (validTypes.includes(issueType)) {
        // For URL-related issue types, show URL options
        urlContainer.style.display = 'block';
        nsfwContainer.style.display = 'block';
    } else {
        // For other issue types, hide URL-related fields
        urlContainer.style.display = 'none';
        nsfwContainer.style.display = 'none';
    }
}

/******************************************************************************/

// Format data for better readability in the report
function renderData(data, depth = 0) {
    const indent = ' '.repeat(depth * 2); // Doubled indentation for better readability
    
    if (Array.isArray(data)) {
        if (data.length === 0) return `${indent}[]`;
        
        const out = [];
        for (let i = 0; i < data.length; i++) {
            out.push(`${indent}- ${renderData(data[i], depth + 1).trim()}`);
        }
        return out.join('\n');
    }
    
    if (typeof data !== 'object' || data === null) {
        return `${indent}${data}`;
    }
    
    if (Object.keys(data).length === 0) return `${indent}{}`;
    
    const out = [];
    for (const [name, value] of Object.entries(data)) {
        if (typeof value === 'object' && value !== null) {
            out.push(`${indent}${name}:`);
            out.push(renderData(value, depth + 1));
            continue;
        }
        out.push(`${indent}${name}: ${value}`);
    }
    
    return out.join('\n');
}

/******************************************************************************/

// Get configuration data to include in the report
async function getConfigData() {
    try {
        if (typeof chrome === 'undefined' || !chrome.runtime) {
            return 'Chrome API not available. This page must be loaded as a browser extension.';
        }
        
        const manifest = chrome.runtime.getManifest();
        
        // Get settings using readPurifyUrlsSettings
        const settings = await new Promise(resolve => readPurifyUrlsSettings(resolve));

        if (!Object.hasOwn(settings, SETTINGS_KEY)) {
            console.log(CANT_FIND_SETTINGS_MSG);
            setDefaultSettings();
            return 'Default settings applied - configuration was missing';
        }

        // Get all other storage items
        const storage = await chrome.storage.local.get([
            'historyApiProtection',
            'updateHyperlinkAuditing', 
            'updateBadgeOnOff',
            'PreventGoogleandyandexscript',
            'whitelist',
            'customRules',
            'disabledExceptionRules'
        ]);

        // Format settings object using getBrowserInfo() instead of navigator.userAgent
        const config = {
            name: manifest.name,
            version: manifest.version,
            settings: {
                enabled: settings[SETTINGS_KEY].status,
                historyApiProtection: storage.historyApiProtection || false,
                updateHyperlinkAuditing: storage.updateHyperlinkAuditing || false,
                updateBadgeOnOff: storage.updateBadgeOnOff || false,
                PreventGoogleandyandexscript: storage.PreventGoogleandyandexscript || false
            },
            whitelistedDomains: storage.whitelist || [],
            customRules: storage.customRules || [],
            disabledExceptionRules: storage.disabledExceptionRules || [],
            browser: getBrowserInfo()  // Use getBrowserInfo instead of navigator.userAgent
        };
        
        return renderData(config);
    } catch (error) {
        console.error('Error getting configuration data:', error);
        return 'Error retrieving configuration data: ' + error.message;
    }
}

/******************************************************************************/

// Send a message to the background script


/******************************************************************************/

// Open a URL
function openURL(url) {
    try {
        chrome.tabs.create({ url });
    } catch (error) {
        console.error('Error opening URL:', error);
        // Fallback to regular window.open if chrome API fails
        window.open(url, '_blank');
    }
}

/******************************************************************************/

// Add this helper function to get browser info
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = '';
    let version = '';
    let variant = '';

    // Chromium-based browsers need to be checked first in specific order
    if (/edg/i.test(ua)) {
        browser = 'Edge';
        version = ua.match(/edg\/([\d.]+)/i)?.[1] || '';
        variant = 'Chromium';
    } 
    // Brave needs to be checked before Chrome
    else if (navigator.brave?.isBrave?.()) {
        browser = 'Brave';
        version = ua.match(/chrome\/([\d.]+)/i)?.[1] || '';
        variant = 'Chromium';
    }
    // Opera needs to be checked before Chrome
    else if (/opr|opera/i.test(ua)) {
        browser = 'Opera';
        version = ua.match(/(opr|opera)\/([\d.]+)/i)?.[2] || '';
        variant = 'Chromium';
    }
    // Vivaldi needs to be checked before Chrome
    else if (/vivaldi/i.test(ua)) {
        browser = 'Vivaldi';
        version = ua.match(/vivaldi\/([\d.]+)/i)?.[1] || '';
        variant = 'Chromium';
    }
    // Generic Chrome/Chromium check
    else if (/chrome|chromium|crios/i.test(ua)) {
        browser = /chromium/i.test(ua) ? 'Chromium' : 'Chrome';
        version = ua.match(/(chrome|chromium|crios)\/([\d.]+)/i)?.[2] || '';
        // Check if it's ungoogled-chromium
        if (/chromium/i.test(ua) && !navigator.googlebot) {
            variant = 'Ungoogled';
        }
    }
    // Firefox variants
    else if (/firefox|fxios/i.test(ua)) {
        browser = 'Firefox';
        version = ua.match(/(firefox|fxios)\/([\d.]+)/i)?.[2] || '';
        // Check for Firefox forks
        if (/librewolf/i.test(ua)) {
            variant = 'LibreWolf';
        } else if (/waterfox/i.test(ua)) {
            variant = 'Waterfox';
        } else if (/palemoon/i.test(ua)) {
            variant = 'Pale Moon';
        }
    }
    // Safari specific check
    else if (/safari/i.test(ua) && !/chrome|chromium|crios/i.test(ua)) {
        browser = 'Safari';
        version = ua.match(/version\/([\d.]+)/i)?.[1] || '';
        // Check for Webkit nightly
        if (/webkit/i.test(ua)) {
            variant = 'WebKit';
        }
    }
    // Unknown browser
    else {
        browser = 'Unknown';
    }

    // Construct the browser string
    let browserString = browser;
    if (version) browserString += ` ${version}`;
    if (variant) browserString += ` (${variant})`;

    return browserString;
}

// Enhanced reportIssue function to handle both URL and non-URL related issues properly
async function reportIssue() {
    // Check if the user has provided consent
    if (!$('#consentCheckbox').checked) {
        alert('Please confirm that you understand how your data will be used by checking the consent box.');
        return;
    }

    const issueType = getIssueType();
    if (issueType === '[unknown]') {
        alert('Please select an issue type.');
        return;
    }
    
    const githubURL = new URL('https://github.com/Linkumori/Linkumori-Extension/issues/new');
    
    try {
        // Define which issue types are URL-related
        const urlRelatedTypes = ['tracking-not-removed', 'url-broken', 'false-positive'];
        const isUrlRelatedIssue = urlRelatedTypes.includes(issueType);
        
        // Only get and validate URL for URL-related issue types
        let finalUrl = '';
        if (isUrlRelatedIssue) {
            finalUrl = getSelectedUrl();
            
            if (!finalUrl) {
                alert('Please provide a URL.');
                return;
            }

            if (!validateUrl(finalUrl)) {
                alert('Please enter a valid URL.');
                return;
            }
        }

        // Get additional comments
        const additionalInfo = $('#additionalInfo').value.trim();
        
        // Determine title based on issue type
        let title;
        
        // For URL-specific issues, include domain in title
        if (isUrlRelatedIssue) {
            // Determine hostname for title
            let hostname = "unknown-domain";
            if (finalUrl) {
                try {
                    hostname = new URL(finalUrl).hostname.replace(/^(m|mobile|www)\./, '');
                } catch (e) {
                    console.error('Error parsing URL:', e);
                }
            }
            title = `${reportedPage?.hostname || hostname}: ${issueType}`;
        } else {
            // For general issues, just use the issue type with proper capitalization
            title = issueType.charAt(0).toUpperCase() + issueType.slice(1);
        }
        
        // Add NSFW tag if needed
        if ($('#isNSFW') && $('#isNSFW').checked) {
            title = `[nsfw] ${title}`;
        }
        
        githubURL.searchParams.set('title', title);
        
        // Build GitHub issue body - only include URL sections for URL-related issues
        const bodyParts = [
            `## Issue Type\n${issueType}`,
            '',
        ];
        
        // Only add URL information for URL-related issues
        if (isUrlRelatedIssue) {
            if (finalUrl) {
                bodyParts.push(`## URL\n\`${finalUrl}\``);
                bodyParts.push('');
            }
            
            if (reportedPage?.cleanedUrl) {
                bodyParts.push(`## Cleaned URL\n\`${reportedPage.cleanedUrl}\``);
                bodyParts.push('');
            }
        }
        
        // Add the rest of the information
        bodyParts.push(
            '## Browser Information',
            `\`${getBrowserInfo()}\``,
            '',
            additionalInfo ? `## Additional Comments\n${additionalInfo}` : '',
            '',
            '## Configuration Information',
            $('#configData').textContent,
            '',
            '## Current Settings',
            'The following settings were active when this issue occurred:',
            await getConfigData(),
            '```'
        );
        
        const body = bodyParts.filter(Boolean).join('\n');
        githubURL.searchParams.set('body', body);
        openURL(githubURL.href);
    } catch (error) {
        console.error('Error creating GitHub issue:', error);
        alert('Error creating GitHub issue: ' + error.message);
    }
}

/******************************************************************************/

// Find existing issues for the same domain
function findExistingIssues() {
    let hostname;
    
    // Try to get hostname from reportedPage or from URL input
    if (reportedPage) {
        hostname = reportedPage.hostname;
    } else {
        // For custom URL case, try to get it from the custom input
        const customUrlValue = $('#customUrlInput').value.trim();
        if (customUrlValue) {
            try {
                hostname = new URL(customUrlValue).hostname.replace(/^(m|mobile|www)\./, '');
            } catch (e) {
                alert('Please enter a valid URL to search for related issues.');
                return;
            }
        } else {
            alert('No URL information available. Please provide a URL first.');
            return;
        }
    }
    
    try {
        const url = new URL('https://github.com/Linkumori/Linkumori-Extension/issues');
        url.searchParams.set('q', `is:issue sort:updated-desc "${hostname}" in:title`);
        openURL(url.href);
    } catch (error) {
        console.error('Error finding existing issues:', error);
        alert('Error finding existing issues: ' + error.message);
    }
}

/******************************************************************************/

// URL validation function
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/******************************************************************************/

// Enhanced initialization for the report page
async function initReportPage() {
    try {
        // Get configuration data
        const config = await getConfigData();
        $('#configData').textContent = config;
        
        // Populate the URL dropdown with actual URLs
        populateUrlDropdown();
        
        // Add event listener for issue type selection
        $('#issueTypeSelect').addEventListener('change', updateURLSelectVisibility);
        
        // Add event listener for URL dropdown
        $('#urlSelect').addEventListener('change', handleUrlDropdownChange);
        
        // Set up event listeners for buttons
        $('#reportIssueButton').addEventListener('click', reportIssue);
        
        if ($('#findExistingButton')) {
            $('#findExistingButton').addEventListener('click', findExistingIssues);
        }
        
        // Initial visibility setup based on current issue type
        updateURLSelectVisibility();
    } catch (error) {
        console.error('Error initializing report page:', error);
        const errorMsg = createElement('p', { class: 'error' }, 
            'Error initializing page: ' + error.message);
        document.querySelector('section').prepend(errorMsg);
    }
}
 
/******************************************************************************/

// Setup theme toggle and NSFW checkbox functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
         themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            chrome.storage.local.set({ theme: newTheme });
        });
        const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

        chrome.storage.local.get(['theme'], (result) => {
            document.documentElement.setAttribute('data-theme', result.theme || getSystemTheme());
        });

        // Listen for theme changes from other parts of the extension
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === 'local' && changes.theme) {
                document.documentElement.setAttribute('data-theme', changes.theme.newValue);
            }
        });
    }

    // Add translation helper function
    function translateElement(element) {
        const messageKey = element.getAttribute('data-i18n');
        if (messageKey) {
            const translated = chrome.i18n.getMessage(messageKey);
            if (translated) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translated;
                } else if (element.tagName === 'TEXTAREA') {
                    element.placeholder = translated;
                } else {
                    element.textContent = translated;
                }
            }
        }

        // Handle placeholders in translations
        if (messageKey && messageKey === 'consentMessage') {
            const message = chrome.i18n.getMessage(messageKey, {
                link: "<a href='https://docs.github.com/site-policy/privacy-policies/github-privacy-statement' target='_blank'>GitHub's Privacy Statement</a>"
            });
            element.innerHTML = message;
        }
    }

    // Initialize translations
    function initTranslations() {
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(translateElement);
        
        // Special handling for dynamic elements
        const urlSelect = $('#urlSelect');
        if (urlSelect) {
            const customOption = urlSelect.querySelector('option[value="custom"]');
            if (customOption) {
                customOption.textContent = chrome.i18n.getMessage('enterCustomUrl');
            }
        }
    }

    // Initialize translations
    initTranslations();
});
    
    // Setup NSFW checkbox
    const nsfwCheckbox = document.getElementById('isNSFW');
    if (nsfwCheckbox) {
        const checkboxWrap = nsfwCheckbox.closest('.checkbox');
        nsfwCheckbox.addEventListener('change', function() {
            if (nsfwCheckbox.checked) {
                checkboxWrap.classList.add('checked');
            } else {
                checkboxWrap.classList.remove('checked');
            }
        });
    }
    
    // Initialize the report page after DOM is ready
    initReportPage();
