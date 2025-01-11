/***********************************************************************************************
 * Linkumori (URLs Purifier) Extension - constants.js
 * ------------------------------------------------------------
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

 
 Based on ERASER project script:https://github.com/Psychosynthesis/Eraser/blob/main/src/chrome/common/utils.js
 Copyright (c) 2022 Nick
 MIT License:
 license: MIT
 SPDX-License-Identifier: MIT

*
 ***********************************************************************************************/
import { defaultSettings, SETTINGS_KEY } from './constants.js';

export const readPurifyUrlsSettings = (callback) => {
	chrome.storage.local.get(callback);
};

export const setDefaultSettings = () => {
	chrome.storage.local.set({ [SETTINGS_KEY]: { ...defaultSettings} });
}
