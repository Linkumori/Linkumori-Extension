/***********************************************************************************************
 * Linkumori (URLs Purifier) Extension - google-fix.js
 * ------------------------------------------------------------
   Original work Copyright (c) 2017 kodango
   Repository: https://github.com/kodango/Remove-Google-Redirection
   Licensed under MIT License
 * Modified work Copyright (c) 2024 Subham Mahesh
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

// Function to safely decode URLs
function safeDecodeURL(encodedUrl) {
    if (!encodedUrl) return '';
    
    try {
        // Try parsing as a complete URL first
        try {
            new URL(encodedUrl);
            // If it's already a valid URL, we'll just do a single decode pass
            return decodeURIComponent(encodedUrl);
        } catch (e) {
            // Not a valid URL, proceed with careful decoding
        }
        
        // Handle multiple levels of encoding with care
        let decodedUrl = encodedUrl;
        let prevUrl;
        let decodingAttempts = 0;
        const MAX_DECODING_ATTEMPTS = 3; // Prevent infinite loops
        
        do {
            prevUrl = decodedUrl;
            try {
                decodedUrl = decodeURIComponent(prevUrl);
            } catch (e) {
                // If we can't decode further, return what we have
                return prevUrl;
            }
            decodingAttempts++;
        } while (decodedUrl !== prevUrl && decodingAttempts < MAX_DECODING_ATTEMPTS);
        
        return decodedUrl;
    } catch (e) {
        console.error('Error safely decoding URL:', e);
        return encodedUrl; // Return original on error
    }
}

function cleanGoogleLink(a) {
    if (!a.href) return;

    // Handle /url redirects
    if (a.pathname === '/url') {
        const originalUrl = new URL(a.href).searchParams.get('url');
        if (originalUrl) {
            a.href = safeDecodeURL(originalUrl);
            return;
        }
    }

    // Handle Google Ads (aclk) URLs
    if (a.pathname === '/aclk') {
        try {
            const url = new URL(a.href);
            const adUrl = url.searchParams.get('adurl');
            if (adUrl) {
                a.href = safeDecodeURL(adUrl);
                return;
            }
        } catch (e) {
            console.error('Error processing ad URL:', e);
        }
    }

    // Handle Google AMP URLs
    if (a.pathname.startsWith('/amp/')) {
        try {
            // Remove /amp/s/ or /amp/ prefix and get the actual URL
            const ampMatch = a.pathname.match(/\/amp\/?s?\/(https?.+)/i);
            if (ampMatch) {
                a.href = safeDecodeURL(ampMatch[1]);
                return;
            }
        } catch (e) {
            console.error('Error processing AMP URL:', e);
        }
    }

    // Clean tracking attributes
    if (a.hasAttribute('onmousedown')) {
        a.removeAttribute('onmousedown');
    }
    if (a.hasAttribute('data-cthref')) {
        a.removeAttribute('data-cthref');
    }
    if (a.dataset.cthref) {
        delete a.dataset.cthref;
    }
}

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
        el.href.includes('/amp/') ||
        el.href.includes('google.com/search?')
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
                    realUrl = safeDecodeURL(ampMatch[1]);
                }
            }
            // Default to normal redirect URLs
            else {
                realUrl = url.searchParams.get('q') || url.searchParams.get('url');
            }

            if (realUrl) {
                // Use safe decoding
                realUrl = safeDecodeURL(realUrl);
                
                // Check if the decoded URL might contain another Google redirect
                // This handles nested cases like search results containing ad links
                if (realUrl.includes('google.com/aclk?adurl=')) {
                    try {
                        // Extract the adurl parameter from the nested URL
                        const adUrlMatch = realUrl.match(/adurl=([^&]+)/i);
                        if (adUrlMatch && adUrlMatch[1]) {
                            const nestedUrl = safeDecodeURL(adUrlMatch[1]);
                            if (nestedUrl) {
                                realUrl = nestedUrl;
                            }
                        }
                    } catch (e) {
                        console.error('Error processing nested URL:', e);
                    }
                }
                
                // Fix common URL typos
                if (realUrl.startsWith('ttps://')) {
                    realUrl = 'h' + realUrl;
                }
                
                // Validate the URL before navigating
                try {
                    new URL(realUrl); // This will throw if the URL is invalid
                    window.location.href = realUrl;
                } catch (e) {
                    console.error('Invalid URL after processing:', realUrl);
                    // Try one more approach - prepend https:// if missing protocol
                    if (!realUrl.match(/^[a-z]+:\/\//i)) {
                        try {
                            const withProtocol = 'https://' + realUrl;
                            new URL(withProtocol);
                            window.location.href = withProtocol;
                        } catch (e2) {
                            console.error('Still invalid after adding protocol:', realUrl);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error processing URL:', error);
        }
        
        event.stopImmediatePropagation();
    }
}, true);