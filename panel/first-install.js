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

document.getElementById('openSettings').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'openPopup' });
});


chrome.storage.local.get(['theme'], (result) => {
    if (!result.theme) {
        const initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        chrome.storage.local.set({ theme: initialTheme });
        document.documentElement.setAttribute('data-theme', initialTheme);
    } else {
        document.documentElement.setAttribute('data-theme', result.theme);
    }
});
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.theme) {
        document.documentElement.setAttribute('data-theme', changes.theme.newValue);
    }
});