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
(function () {
  "use strict";

  // Safely override the 'rwt' property on the window object
  function overrideRwt() {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(window, 'rwt');
      if (!descriptor || descriptor.configurable) {
        Object.defineProperty(window, 'rwt', {
          configurable: false,
          writable: false,
          value: function () { return true; }
        });
      } else {
        console.warn('window.rwt is not configurable; skipping override.');
      }
    } catch (e) {
      console.error('Failed to override rwt property:', e);
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
            realUrl = decodeURIComponent(match[1]);
          }
        } else {
          realUrl = url.searchParams.get('q') || url.searchParams.get('url');
        }

        if (realUrl) {
          realUrl = realUrl.split('&')[0];
          while (realUrl.includes('%')) {
            const decoded = decodeURIComponent(realUrl);
            if (decoded === realUrl) break;
            realUrl = decoded;
          }
          
          // Fix for Gmail links: Check if we should open in a new tab
          const shouldOpenInNewTab = 
            anchor.target === '_blank' || 
            window.location.hostname.includes('mail.google.com') ||
            anchor.getAttribute('rel')?.includes('noopener');
            
          if (shouldOpenInNewTab) {
            // Open in a new tab, preserving Gmail's expected behavior
            window.open(realUrl, '_blank', 'noopener');
          } else {
            // Use the original behavior for non-Gmail links
            window.location.href = realUrl;
          }
        }
      } catch (error) {
        console.error('Error processing redirect URL:', error);
      }
      event.stopImmediatePropagation();
    }
  }, true);

  // Helper function to clean a link
  function cleanLink(a) {
    if (a.pathname === '/url') {
      const originalUrl = new URL(a.href).searchParams.get('url');
      if (originalUrl) {
        a.href = originalUrl;
        return;
      }
    }

    if (a.pathname === '/aclk') {
      try {
        const url = new URL(a.href);
        const adUrl = url.searchParams.get('adurl');
        if (adUrl) {
          a.href = decodeURIComponent(adUrl);
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
          a.href = decodeURIComponent(match[1]);
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
})();
