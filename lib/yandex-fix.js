/***********************************************************************************************
 * Linkumori (URLs Purifier) Extension - yandex-fix.js
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
  
    // Safely override the _borschik property on the window object
    function overrideBorschik() {
      try {
        const descriptor = Object.getOwnPropertyDescriptor(window, '_borschik');
        if (!descriptor || descriptor.configurable) {
          Object.defineProperty(window, '_borschik', {
            value: function () {
              return false;
            },
            writable: false,
            configurable: false
          });
        } else {
          console.warn('window._borschik is not configurable; skipping override.');
        }
      } catch (e) {
        console.error('Failed to override _borschik property:', e);
      }
    }
  
    // Immediately override _borschik
    overrideBorschik();
  
    // Attach a mouseover listener to clean up certain attributes on anchor elements
    document.addEventListener(
      'mouseover',
      function (event) {
        const anchor = event.target.closest('a');
        if (anchor) {
          try {
            anchor.removeAttribute('data-counter');
            delete anchor.dataset.cthref;
          } catch (e) {
            console.error(e);
          }
        }
      },
      true
    );
  })();
  