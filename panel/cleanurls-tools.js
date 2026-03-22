/*
           SPDX-License-Identifier: GPL-3.0-or-later

        Copyright (C) 2024 Subham Mahesh

        This program is free software: you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version.

        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with this program.  If not, see <http://www.gnu.org/licenses/>..
        */

        document.addEventListener('DOMContentLoaded', function() {
            // DOM elements
            const elements = {
                inputUrls: document.getElementById('inputUrls'),
                outputUrls: document.getElementById('outputUrls'),
                cleanUrls: document.getElementById('cleanUrls'),
                copyUrls: document.getElementById('copyUrls'),
                copyStatus: document.getElementById('copyStatus'),
                themeToggle: document.getElementById('themeToggle'),
                settingsBtn: document.getElementById('settings'),
                versionElement: document.querySelector('.version')
            };

            // State variables
            let processedUrls = [];
            let isProcessing = false;

            // Initialize the application
            async function init() {
                initI18n();
                initTheme();
                initEventListeners();
                await loadVersion();
            }

            // Initialize internationalization
            function initI18n() {
                // Translate elements with data-i18n attribute
                document.querySelectorAll('[data-i18n]').forEach(element => {
                    const message = chrome.i18n.getMessage(element.getAttribute('data-i18n'));
                    if (message) element.textContent = message;
                });

                // Translate placeholders
                document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
                    const message = chrome.i18n.getMessage(element.getAttribute('data-i18n-placeholder'));
                    if (message) element.placeholder = message;
                });

                // Translate aria-labels
                document.querySelectorAll('[data-i18n-aria]').forEach(element => {
                    const message = chrome.i18n.getMessage(element.getAttribute('data-i18n-aria'));
                    if (message) element.setAttribute('aria-label', message);
                });
            }

            // Initialize theme settings
            function initTheme() {
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

            // Load extension version
            async function loadVersion() {
                try {
                    const manifest = await chrome.runtime.getManifest();
                    elements.versionElement.textContent = chrome.i18n.getMessage('version', [manifest.version]);
                } catch (error) {
                    console.error('Failed to fetch version:', error);
                    elements.versionElement.textContent = chrome.i18n.getMessage('versionUnknown');
                }
            }

            // Set up all event listeners
            function initEventListeners() {
                // Theme toggle button
                elements.themeToggle.addEventListener('click', toggleTheme);
                
                // Settings button
                elements.settingsBtn.addEventListener('click', openSettings);
                
                // Clean URLs button
                elements.cleanUrls.addEventListener('click', handleCleanUrlsClick);
                
                // Copy URLs button
                elements.copyUrls.addEventListener('click', handleCopyUrlsClick);
                
                // Handle text input - allow Ctrl+Enter to clean URLs
                elements.inputUrls.addEventListener('keydown', handleInputKeydown);
                
                // Listen for cleaned URL from background script
                chrome.runtime.onMessage.addListener(handleBackgroundMessages);
            }

            // Toggle between light and dark theme
            function toggleTheme() {
                const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                chrome.storage.local.set({ theme: newTheme });
            }

            // Open settings page
            function openSettings() {
                chrome.tabs.create({
                    url: 'panel/option.html'
                });
            }

            // Handle messages from background script
            function handleBackgroundMessages(message) {
                if (message.action === "displayCleanedUrl") {
                    processedUrls.push(message.cleanedUrl);
                    elements.outputUrls.value = processedUrls.join('\n');
                }
            }

            // Handle Clean URLs button click
            function handleCleanUrlsClick() {
                const urls = elements.inputUrls.value.trim().split('\n')
                    .map(url => url.trim())
                    .filter(url => url.length > 0);

                if (urls.length === 0) return;
                
                // Use the cleanurls-tools action as requested
                processUrls(urls);
            }

            // Handle Copy URLs button click
            async function handleCopyUrlsClick() {
                const cleanedUrls = elements.outputUrls.value;
                if (!cleanedUrls) return;

                try {
                    await navigator.clipboard.writeText(cleanedUrls);
                    showCopyStatus(true);
                } catch (err) {
                    console.error('Failed to copy URLs:', err);
                    showCopyStatus(false);
                }
            }

            // Handle keydown events on input textarea
            function handleInputKeydown(e) {
                // Ctrl+Enter or Cmd+Enter to clean URLs
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    elements.cleanUrls.click();
                }
            }

            // Show copy success or error notification
            function showCopyStatus(success) {
                const statusMessage = success 
                    ? chrome.i18n.getMessage('copySuccessMessage') 
                    : chrome.i18n.getMessage('copyErrorMessage');
                
                elements.copyStatus.textContent = statusMessage;
                elements.copyStatus.style.color = success ? 'var(--button-primary)' : 'var(--button-danger)';
                elements.copyStatus.style.display = 'block';
                
                if (success) {
                    const originalText = elements.copyUrls.innerHTML;
                    elements.copyUrls.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 6L9 17l-5-5"/>
                        </svg>
                        Copied!
                    `;
                    elements.copyUrls.style.backgroundColor = 'var(--button-primary)';

                    setTimeout(() => {
                        elements.copyUrls.innerHTML = originalText;
                        elements.copyUrls.style.backgroundColor = '';
                        elements.copyStatus.style.display = 'none';
                    }, 2000);
                } else {
                    setTimeout(() => {
                        elements.copyStatus.style.display = 'none';
                    }, 2000);
                }
            }

            // Process URLs using the cleanurls-tools action
            async function processUrls(urls) {
                if (isProcessing) return;
                
                isProcessing = true;
                processedUrls = []; // Reset processed URLs
                elements.outputUrls.value = '';

                for (const url of urls) {
                    if (url.trim()) {  // Only process non-empty URLs
                        chrome.runtime.sendMessage({
                            action: "cleanurls-tools",
                            url: url.trim()
                        });
                        // Add a small delay between processing each URL
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                }
                
                isProcessing = false;
            }

            // Start initialization
            init();
        });
