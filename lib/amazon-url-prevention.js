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
.
*/
(function() {
    const CONFIG = {
        debug: false,
        maxDecodingAttempts: 3
    };

    // Core regex patterns - aggressive ref removal
    const REF_PATTERNS = [
        /\/ref=.*$/i,               // Remove everything after /ref=
        /\/ref%3[Dd].*$/i,         // URL-encoded version
        /\/%72%65%66=.*$/i,        // Hex-encoded version
        /[?&]ref=.*$/i             // Query parameter version
    ];

    function cleanAmazonUrl(url) {
        if (typeof url !== 'string') return url;

        try {
            let cleanedUrl = url;
            for (let i = 0; i < CONFIG.maxDecodingAttempts; i++) {
                try {
                    cleanedUrl = decodeURIComponent(cleanedUrl);
                } catch (error) {
                    break;
                }
            }

            REF_PATTERNS.forEach(pattern => {
                cleanedUrl = cleanedUrl.replace(pattern, '');
            });

            cleanedUrl = cleanedUrl
                .replace(/[?&]$/, '')
                .replace(/\?&/, '?')
                .replace(/\?$/, '')
                .replace(/([^:]\/)\/+/g, '$1');

            return cleanedUrl;
        } catch (error) {
            console.error('URL cleaning error:', error);
            return url;
        }
    }

    function interceptNavigation() {
        const originalPushState = history.pushState;
        history.pushState = function(state, title, url) {
            const cleanUrl = cleanAmazonUrl(url);
            return originalPushState.call(this, state, title, cleanUrl);
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function(state, title, url) {
            const cleanUrl = cleanAmazonUrl(url);
            return originalReplaceState.call(this, state, title, cleanUrl);
        };

        document.addEventListener('click', function(event) {
            const link = event.target.closest('a');
            if (link?.href) {
                const cleanUrl = cleanAmazonUrl(link.href);
                if (cleanUrl !== link.href) {
                    event.preventDefault();
                    window.location.href = cleanUrl;
                }
            }
        }, true);
    }

    function patchUrlApis() {
        const OriginalURL = window.URL;
        window.URL = class extends OriginalURL {
            constructor(url, base) {
                super(cleanAmazonUrl(url), base);
            }
        };
    }

    function observeAndCleanLinks() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const links = node.getElementsByTagName('a');
                            Array.from(links).forEach(link => {
                                const cleanHref = cleanAmazonUrl(link.href);
                                if (cleanHref !== link.href) {
                                    link.setAttribute('href', cleanHref);
                                }
                            });
                        }
                    });
                }
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    function cleanCurrentUrl() {
        const currentUrl = window.location.href;
        const cleanUrl = cleanAmazonUrl(currentUrl);
        
        if (cleanUrl !== currentUrl) {
            try {
                history.replaceState(history.state, document.title, cleanUrl);
            } catch (error) {
                console.error('Error cleaning current URL:', error);
            }
        }
    }

    function initialize() {
        const links = document.getElementsByTagName('a');
        Array.from(links).forEach(link => {
            const cleanHref = cleanAmazonUrl(link.href);
            if (cleanHref !== link.href) {
                link.setAttribute('href', cleanHref);
            }
        });

        interceptNavigation();
        patchUrlApis();
        observeAndCleanLinks();
        cleanCurrentUrl();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }
})();