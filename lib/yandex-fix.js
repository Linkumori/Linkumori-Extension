/***********************************************************************************************
 * Linkumori (URLs Purifier) Extension - yandex-fix.js
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
    if (!Object.getOwnPropertyDescriptor(window, '_borschik')) {
        Object.defineProperty(window, '_borschik', {
            value: function() { return false; },
            writable: false,
            configurable: false
        });
    }

    document.addEventListener('mouseover', function(event) {
        let a = event.target;
        if (a.tagName === 'A' || (a = a.closest('a'))) {
            try {
                if (a.hasAttribute('data-counter')) a.removeAttribute('data-counter');
                if (a.dataset.cthref) delete a.dataset.cthref;
            } catch(e) {
                console.warn('Failed to clean Yandex link:', e);
            }
        }
    }, true);
})(window);