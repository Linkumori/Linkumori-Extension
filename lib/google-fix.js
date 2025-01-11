/***********************************************************************************************
 * Linkumori (URLs Purifier) Extension - google-fix.js
 * ------------------------------------------------------------
   Original work Copyright (c) 2017 kodango
   Repository: https://github.com/kodango/Remove-Google-Redirection
   Licensed under MIT License
 * Modified work Copyright (c) 2024
 * Licensed under GNU General Public License v3.0

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

***********************************************************************************************/
'use strict';

(function(window) {
    try {
        Object.defineProperty(window, 'rwt', {
            value: function() { return true; },
            writable: false,
            configurable: false
        });
    } catch (e) {}

    function cleanGoogleLink(a) {
        if (!a.href) return;

        // Handle /url redirects
        const originalUrl = 
            a.pathname === '/url' && new URL(a.href).searchParams.get('url');
            
        if (originalUrl) {
            a.href = originalUrl;
            return;
        }

        // Handle Google Ads (aclk) URLs
        if (a.pathname === '/aclk') {
            try {
                const url = new URL(a.href);
                const adUrl = url.searchParams.get('adurl');
                if (adUrl) {
                    a.href = decodeURIComponent(adUrl);
                    return;
                }
            } catch (e) {}
        }

        // Handle Google AMP URLs
        if (a.pathname.startsWith('/amp/')) {
            try {
                // Remove /amp/s/ or /amp/ prefix and get the actual URL
                const ampMatch = a.pathname.match(/\/amp\/?s?\/(https?.+)/i);
                if (ampMatch) {
                    a.href = decodeURIComponent(ampMatch[1]);
                    return;
                }
            } catch (e) {}
        }

        // Handle standard Google redirects
        const urlMatch = /\/(?:url|imgres).*[&?](?:url|q|imgurl)=([^&]+)/i.exec(a.href);
        if (urlMatch) {
            try {
                let decodedUrl = urlMatch[1];
                // Handle multiple levels of encoding
                while (decodedUrl.includes('%')) {
                    const prevUrl = decodedUrl;
                    try {
                        decodedUrl = decodeURIComponent(decodedUrl);
                        if (decodedUrl === prevUrl) break;
                    } catch {
                        break;
                    }
                }
                a.href = decodedUrl;
            } catch (e) {
                a.href = urlMatch[1];
            }
        }

        // Clean tracking attributes
        if (a.hasAttribute('onmousedown')) {
            a.removeAttribute('onmousedown');
        }
        if (a.hasAttribute('data-cthref')) {
            a.removeAttribute('data-cthref');
        }
        if (a.hasAttribute('ping')) {
            a.removeAttribute('ping');
        }
        if (a.dataset.cthref) {
            delete a.dataset.cthref;
        }
    }

    document.addEventListener('mouseover', function(event) {
        let a = event.target;
        if (a.tagName === 'A' || (a = a.closest('a'))) {
            cleanGoogleLink(a);
        }
    }, true);

    document.addEventListener('click', function(event) {
        let el = event.target;
        while (el && (!el.tagName || el.tagName !== 'A')) {
            el = el.parentElement;
        }
        
        if (!el) return;
        
        cleanGoogleLink(el);

        // Additional handling for persistent redirects
        if (el.href && (
            el.href.includes('google.com/url?') || 
            el.href.includes('/url?q=') ||
            el.href.includes('google.com/aclk?') ||
            el.href.includes('/amp/')
        )) {
            event.preventDefault();
            try {
                const url = new URL(el.href);
                let realUrl;

                // Check for ad URLs first
                if (url.pathname === '/aclk') {
                    realUrl = url.searchParams.get('adurl');
                }
                // Check for AMP URLs
                else if (url.pathname.startsWith('/amp/')) {
                    const ampMatch = url.pathname.match(/\/amp\/?s?\/(https?.+)/i);
                    if (ampMatch) {
                        realUrl = ampMatch[1];
                    }
                }
                // Default to normal redirect URLs
                else {
                    realUrl = url.searchParams.get('q') || url.searchParams.get('url');
                }

                if (realUrl) {
                    // Clean up the URL and remove any trailing parameters
                    realUrl = realUrl.split('&')[0];
                    // Handle multiple encodings
                    while (realUrl.includes('%')) {
                        const prevUrl = realUrl;
                        try {
                            realUrl = decodeURIComponent(realUrl);
                            if (realUrl === prevUrl) break;
                        } catch {
                            break;
                        }
                    }
                    window.location.href = realUrl;
                }
            } catch (error) {
                console.error('Error processing URL:', error);
            }
        }
        
        event.stopImmediatePropagation();
    }, true);
})(window);