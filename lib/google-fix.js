/***********************************************************************************************
 * Linkumori (URLs Purifier) Extension - google-fix.js
 * ------------------------------------------------------------
   Original work Copyright (c) 2017 kodango
   Repository: https://github.com/kodango/Remove-Google-Redirection
   Licensed under MIT License
 * Modified work Copyright (c) 2024 Subham Mahesh
 * Licensed under GNU General Public License v3.0
 * 
 * Enhanced with comprehensive URL decoding for all redirect types
***********************************************************************************************/
(function () {
  "use strict";

  // Safely override the 'rwt' property on the window object
  function overrideRwt() {
    try {
      // First attempt: Try to delete the property before redefining
      delete window.rwt;
      
      // Second attempt: Use defineProperty with a closure to maintain state
      let rwtCalled = false;
      Object.defineProperty(window, 'rwt', {
        configurable: true,
        enumerable: false,
        get: function() {
          return function() {
            if (!rwtCalled) {
              rwtCalled = true;
              return true;
            }
            return true;
          };
        },
        set: function() {
          // Prevent modification
          return;
        }
      });

      // Third attempt: If the above fails, try to override using prototype
      if (typeof window.rwt === 'function') {
        window.rwt.prototype = Object.create(Function.prototype);
      }

      // Verify the override
      if (typeof window.rwt !== 'function') {
        throw new Error('Failed to set rwt property');
      }

    } catch (e) {
      // Final fallback: Try to intercept at document level
      console.warn('Primary rwt override failed, using fallback:', e);
      
      document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target && target.hasAttribute('ping')) {
          e.stopPropagation();
          target.removeAttribute('ping');
        }
      }, true);
    }
  }

  // Immediately invoke the override function.
  overrideRwt();

  // Remove unwanted data-cthref attributes on mouseover
  document.addEventListener('mouseover', event => {
    const anchor = event.target.closest('a');
    if (anchor) {
      anchor.removeAttribute('data-cthref');
      delete anchor.dataset.cthref;
    }
  }, true);

  // Clean and process links before navigation
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a');
    if (!anchor) return;

    cleanLink(anchor);

    if (
      anchor.href &&
      (anchor.href.includes('google.com/url?') ||
       anchor.href.includes('/url?q=') ||
       anchor.href.includes('google.com/aclk?') ||
       anchor.href.includes('/amp/'))
    ) {
      event.preventDefault();
      try {
        const url = new URL(anchor.href);
        let realUrl;

        if (url.pathname === '/aclk') {
          realUrl = url.searchParams.get('adurl');
        } else if (url.pathname.startsWith('/amp/')) {
          const match = url.pathname.match(/\/amp\/?s?\/(https?.+)/i);
          if (match) {
            realUrl = match[1];
          }
        } else {
          realUrl = url.searchParams.get('q') || url.searchParams.get('url');
        }

        if (realUrl) {
          // Apply our comprehensive URL decoding
          realUrl = decodeRedirectUrl(realUrl);
          
          if (realUrl) {
            // Fix for Gmail links: Check if we should open in a new tab
            const shouldOpenInNewTab = 
              anchor.target === '_blank' || 
              (window.location.hostname === 'mail.google.com' || window.location.hostname.endsWith('.mail.google.com')) ||
              anchor.getAttribute('rel')?.includes('noopener');
              
            navigateToUrl(realUrl, shouldOpenInNewTab);
          }
        }
      } catch (error) {
        console.error('Error processing redirect URL:', error);
      }
      event.stopImmediatePropagation();
    }
  }, true);

  // Helper function to navigate to a URL
  function navigateToUrl(url, openInNewTab) {
    if (openInNewTab) {
      // Open in a new tab
      window.open(url, '_blank', 'noopener');
    } else {
      // Navigate in current tab
      window.location.href = url;
    }
  }

  // Helper function to clean a link
  function cleanLink(a) {
    if (a.pathname === '/url') {
      const originalUrl = new URL(a.href).searchParams.get('url');
      if (originalUrl) {
        a.href = decodeRedirectUrl(originalUrl);
        return;
      }
    }

    if (a.pathname === '/aclk') {
      try {
        const url = new URL(a.href);
        const adUrl = url.searchParams.get('adurl');
        if (adUrl) {
          a.href = decodeRedirectUrl(adUrl);
          return;
        }
      } catch (e) {
        console.error('Error processing ad URL:', e);
      }
    }

    if (a.pathname.startsWith('/amp/')) {
      try {
        const match = a.pathname.match(/\/amp\/?s?\/(https?.+)/i);
        if (match) {
          a.href = decodeRedirectUrl(match[1]);
          return;
        }
      } catch (e) {
        console.error('Error processing AMP URL:', e);
      }
    }

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

  /**
   * Comprehensive URL decoder that handles multiple encoding formats
   */
  function decodeRedirectUrl(encodedUrl) {
    if (!encodedUrl) return null;
    
    // Step 1: Make a copy of the original URL in case all decoding attempts fail
    let originalUrl = encodedUrl;
    let decodedUrl = encodedUrl;
    
    // Step 2: First apply standard URL decoding (may need multiple passes)
    try {
      // Handle URL encoding (might be applied multiple times)
      let prevUrl;
      do {
        prevUrl = decodedUrl;
        if (decodedUrl.includes('%')) {
          decodedUrl = decodeURIComponent(decodedUrl);
        }
      } while (decodedUrl !== prevUrl && decodedUrl.includes('%'));
    } catch (error) {
      console.warn("Error during URL decoding:", error);
      decodedUrl = originalUrl; // Reset to original on error
    }
    
    // Step 3: Check if the result might be base64 encoded
    if (looksLikeBase64(decodedUrl)) {
      try {
        // Try to decode as base64
        const base64DecodedUrl = atob(decodedUrl);
        
        // Verify the result looks like a valid URL
        if (base64DecodedUrl && isValidUrl(base64DecodedUrl)) {
          return base64DecodedUrl;
        }
      } catch (error) {
        console.warn("Error during base64 decoding:", error);
        // Continue with the URL-decoded version
      }
    }
    
    // Step 4: Final check and cleanup
    
    // If the decoded URL doesn't look like a valid URL, return to original
    if (!isValidUrl(decodedUrl)) {
      if (isValidUrl(originalUrl)) {
        return originalUrl;
      }
      // If neither is valid, try with the split version (to remove tracking params)
      const splitUrl = decodedUrl.split('&')[0];
      if (isValidUrl(splitUrl)) {
        return splitUrl;
      }
    }
    
    // Return the best decoded URL we have
    return decodedUrl;
  }

  /**
   * Improved helper function to check if a string looks like base64
   */
  function looksLikeBase64(str) {
    // Basic validation
    if (!str || typeof str !== 'string' || str.length < 8) {
      return false;
    }
    
    // Check if it has only valid base64 characters
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    
    // Common prefixes for base64-encoded URLs
    const commonPrefixes = ['aHR0cDo', 'aHR0cHM'];
    
    // Check against our criteria
    if (base64Regex.test(str)) {
      // If it starts with a common HTTP/HTTPS prefix, it's very likely base64
      if (commonPrefixes.some(prefix => str.startsWith(prefix))) {
        return true;
      }
      
      // Additional checks
      if (str.length % 4 === 0 && !str.includes(' ') && !str.includes(',')) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Helper function to validate URLs
   */
  function isValidUrl(str) {
    try {
      // Check if it looks like a URL
      if (str && typeof str === 'string') {
        // For base64-decoded URLs, they should start with http:// or https://
        if (str.startsWith('http://') || str.startsWith('https://')) {
          new URL(str); // This will throw if invalid
          return true;
        }
        
        // For other URLs (that might be relative), we can be more lenient
        if (str.includes('.') && !str.includes(' ')) {
          try {
            new URL(str); // Try as-is first
            return true;
          } catch (e) {
            // If that fails, try with an https:// prefix
            try {
              new URL('https://' + str);
              return true;
            } catch (e2) {
              return false;
            }
          }
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  }
})();