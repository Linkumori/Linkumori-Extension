/***********************************************************************************************
 * Linkumori (URLs Purifier) Extension - Anti-history-api.js
 * ------------------------------------------------------------
 * 
  Linkumori (URLs Purifier) Extension for chromium based browsers
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
  along with this program.  If not, see <http://www.gnu.org/licenses/>.

  ***********************************************************************************************/




chrome.runtime.sendMessage({ action: "contentScriptReady" }, (response) => {
  if (chrome.runtime.lastError) {
  } else {
  }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.action === "updateUrl") {
    const currentUrl = window.location.href;
    if (currentUrl !== request.url) {
      window.history.replaceState(null, '', request.url);
      sendResponse({ status: "URL updated successfully" });
    } else {
      sendResponse({ status: "URL already up to date" });
    }
  } else {
    sendResponse({ status: "Unknown action" });
  }
  
  return true;  
});

chrome.runtime.sendMessage({ action: "cleanUrl", url: window.location.href }, (response) => {
  if (chrome.runtime.lastError) {
  } else if (response && response.cleanedUrl && response.cleanedUrl !== window.location.href) {
    window.history.replaceState(null, '', response.cleanedUrl);
  } else {
  }
});


