/***********************************************************************************************
 * Linkumori (URLs Purifier) Extension - Background Service Worker
 * ------------------------------------------------------------
   SPDX-License-Identifier: GPL-3.0-or-later

Copyright (C) 2024-2025 Subham Mahesh

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


* Based on: ERASER project script :https://github.com/Psychosynthesis/Eraser/blob/main/src/chrome/background.js
* Copyright (c) 2022 Nick
 MIT License:
 license: MIT
 SPDX-License-Identifier: MIT

*
 ***********************************************************************************************/

// ===== Linkumori Engine Start =====//
import { readPurifyUrlsSettings, setDefaultSettings } from './common/utils.js';
import { defaultSettings, SETTINGS_KEY, CANT_FIND_SETTINGS_MSG } from './common/constants.js';
import { parameterRules,urlPatternRules  } from './common/rules.js';
import punycode from './lib/punycode.js';




let hasStarted = false;

async function start() {
  if (hasStarted) {
    console.log('Start function already executed');
    return Promise.resolve();
  }

  try {
    const rulesets = await chrome.declarativeNetRequest.getEnabledRulesets();
    if (rulesets.length > 0) {
      await linkumoriwrite({ LinkumoriEngineStart: true });
    } else {
      console.log('Start not executed');
      await linkumoriwrite({ needsReload: true }, { quickreload: true });
      await badstart();
      console.log('Bad start fix executed, will reload on next startup');
    }
    hasStarted = true;
    return Promise.resolve();
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

function linkumoriread(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
}

function linkumoriwrite(obj) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(obj, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

async function badstart() {
  const quickreload = await linkumoriread('quickreload');
  if (quickreload) {
    await linkumoriread({ quickreload: true });
    chrome.runtime.reload();
  }
  console.log('performing quickreload');
}

chrome.runtime.onStartup.addListener(async () => {
  linkumoriread({ needsReload: true }).then(needsReload => {
    if (needsReload) {
      chrome.runtime.reload();
     linkumoriwrite({ needsReload: false });
     console.log('fixed ya');
    }
  });
});

async function initialize() {
  await start();
}

initialize().then(() => {
}).catch(reason => {
  console.trace(reason);
  linkumoriread('LinkumoriEngineStart').then((value) => {
    if (value === false) { return; }
    linkumoriwrite({ LinkumoriEngineStart: false }).then(() => {
      chrome.runtime.reload();
    });
  });
});


async function firstInstalled() {
  return new Promise((resolve) => {
    chrome.storage.local.get('firstInstalled', (result) => {
      if (result.firstInstalled === undefined) {
        chrome.storage.local.set({ firstInstalled: true }, () => {
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const isFirstInstall = await firstInstalled(); 
  if (isFirstInstall) {
    setDefaultSettings();
    chrome.storage.local.set({ updateHyperlinkAuditing: true, firstInstalled: true, historyApiProtection: true,updateBadgeOnOff: true, PreventGoogleandyandexscript: true });
    updateHyperlinkAuditing(true);
    chrome.alarms.create('wakeUpAlarm', { periodInMinutes: 1/60 }); 
    chrome.tabs.create({
      url: 'panel/first-install.html',
  });
      return; 
  }

  const [updatesettings, badgesettings, settings, currentTheme] = await Promise.all([
    new Promise(resolve => {
      chrome.storage.local.get('updateHyperlinkAuditing', (result) => {
        resolve(result.updateHyperlinkAuditing);
      });
    }),
    new Promise(resolve => {
      chrome.storage.local.get('updateBadgeOnOff', (result) => {
        resolve(result.updateBadgeOnOff);
      });
    }),
    new Promise(resolve => {
      chrome.storage.local.get(SETTINGS_KEY, (result) => {
        resolve(result[SETTINGS_KEY]);
      });
    }),
    new Promise(resolve => {
      chrome.storage.local.get(['theme'], (result) => {
        resolve(result.theme);
      });
    })
  ]);

  // Update all settings and appearance
  updateRuleSet(settings.status);
  updateDNRRules(settings.status);
  badge(badgesettings);
  updateHyperlinkAuditing(updatesettings);
  updateExtensionIcon(currentTheme);
  updateAllDNRRules(settings.status);
});









async function updateRuleSet(enabled) {
  const allRulesets = ['ruleset_1', 'ruleset_2', 'ruleset_3', 'ruleset_4', 'ruleset_5', 'ruleset_6', 'ruleset_7', 'ruleset_8', 'ruleset_9', 'ruleset_10', 'ruleset_11', 'ruleset_12', 'ruleset_13', 'ruleset_14', 'ruleset_15', 'ruleset_16', 'ruleset_17','ruleset_18','ruleset_19'];

  await chrome.declarativeNetRequest.updateEnabledRulesets({
    disableRulesetIds: enabled ? [] : allRulesets,
    enableRulesetIds: enabled ? allRulesets : []
  });
}



  let config = [];

async function loadConfigAndCleanUrl(url) {
  try {
    const response = await fetch(chrome.runtime.getURL('./Linkumori-Artifact/Artifact.json'));
    config = await response.json();
  } catch (error) {
    console.error('Error loading configuration:', error);
    return url;
  }
  return cleanUrl(url);
}

function cleanUrl(url) {
  if (!config) {
    console.warn('Artifact is not defined. Returning original URL.');
    return url;
  }

  try {
    const urlObj = new URL(url);
    let paramsToRemove = [];

    for (const provider in config.providers) {
      const providerConfig = config.providers[provider];
      if (provider === 'all' || new RegExp(providerConfig.urlPattern).test(url)) {
        paramsToRemove = paramsToRemove.concat(providerConfig.param);
      }
    }

    paramsToRemove.forEach(param => {
      const regex = new RegExp(`^${param}$`);
      for (const key of urlObj.searchParams.keys()) {
        if (regex.test(key)) {
          urlObj.searchParams.delete(key);
        }
      }
    });

    return urlObj.toString();
  } catch (error) {
    return url;
  }
}

loadConfigAndCleanUrl();


async function injectContentScript(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    const url = tab.url;

    const { historyApiProtection } = await chrome.storage.local.get('historyApiProtection');
    if (!historyApiProtection) {
      return; 
    }

    if (url.startsWith('chrome://') || url.startsWith('https://chromewebstore.google.com/') || url.startsWith('edge://') || url.startsWith('file:///')
      || url.startsWith('chrome-extension://') || url.startsWith('https://microsoftedge.microsoft.com/addons/')) {
      return;
    }

    const settings = await new Promise((resolve) => {
      chrome.storage.local.get(SETTINGS_KEY, (result) => {
        resolve(result[SETTINGS_KEY]);
      });
    });

    if (!settings || !settings.status) {
      return;
    }

    const { whitelist } = await chrome.storage.local.get('whitelist');

    const isWhitelisted = whitelist.some(domain => url.includes(domain));
    if (isWhitelisted) {
      return; 
    }

    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['./lib/Anti-history-api.js']
    });
  } catch (error) {
  }
}


chrome.tabs.onUpdated.addListener(handleTabUpdate);

async function handleTabUpdate(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    await injectContentScript(tabId);

    if (changeInfo.url && config) {
      const cleanedUrl = cleanUrl(changeInfo.url);
      if (cleanedUrl !== changeInfo.url) {
        try {
          const response = await chrome.tabs.sendMessage(tabId, { action: "updateUrl", url: cleanedUrl });
        } catch (error) {
          console.error('Error sending updateUrl message:', error);
        }
      }
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'get-settings') {
    readPurifyUrlsSettings((settings) => {
      if (!Object.hasOwn(settings, SETTINGS_KEY)) {
        console.log(CANT_FIND_SETTINGS_MSG);
        setDefaultSettings();
        sendResponse(defaultSettings);
        updateRuleSet(defaultSettings.status);
        updateDNRRules(defaultSettings.status);
      } else {
        sendResponse(settings);
        updateRuleSet(settings[SETTINGS_KEY].status);
        updateDNRRules(settings[SETTINGS_KEY].status);
        updateAllDNRRules(settings[SETTINGS_KEY].status);
      }
    });
    return true; 
  } else if (message.action === 'updateRuleSet') {
    updateRuleSet(message.enabled);
    updateDNRRules(message.enabled);
    badge(message.enabled);
    updateAllDNRRules(message.enabled);
    chrome.storage.local.set({ [SETTINGS_KEY]: { status: message.enabled } });
    sendResponse({ success: true });
  } else if (message.action === "cleanUrl") {
    const cleanedUrl = cleanUrl(message.url);
    sendResponse({ cleanedUrl: cleanedUrl });
  } else if (message.action === "toggleExtension") {
    chrome.storage.local.get(SETTINGS_KEY, (settings) => {
      const newStatus = !settings[SETTINGS_KEY].status;
      chrome.storage.local.set({ [SETTINGS_KEY]: { status: newStatus } }, () => {
        updateRuleSet(newStatus);
        updateDNRRules(newStatus);
        badge(newStatus);
        updateAllDNRRules(newStatus);
        sendResponse({ status: newStatus ? "activated" : "deactivated" });
      });
    });
  } else if (message.action === 'updateHistoryApiProtection') {
    const { enabled } = message;
    chrome.storage.local.set({ historyApiProtection: enabled }, () => {
      sendResponse({ success: true });
    });
  } else if (message.action === 'updateHyperlinkAuditing') {
    const { enabled } = message;
    chrome.storage.local.set({ updateHyperlinkAuditing: enabled }, () => {
      updateHyperlinkAuditing(message.enabled);
      sendResponse({ success: true });
    });
  } else if (message.action === 'updateBadgeOnOff') {
    const { enabled } = message;
    chrome.storage.local.set({ updateBadgeOnOff: enabled }, () => {
      badge();
      sendResponse({ success: true });
    });
  } else if (message.action === 'editCustomRuleParam') {
    editCustomRuleParam(message.domain, message.oldParam, message.newParam)
      .then(rules => sendResponse({ success: true, rules }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  } else if (message.action === 'removeCustomRuleParam') {
    removeCustomRuleParam(message.domain, message.param)
      .then(rules => sendResponse({ success: true, rules }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  } else if (message.action === 'addCustomRuleParam') {
    const { domain, param } = message;
    chrome.storage.local.get('customRules', async ({ customRules = [] }) => {
        const rule = customRules.find(r => r.domain === domain);
        if (!rule) {
            sendResponse({ error: 'Rule not found' });
            return;
        }

        const params = rule.params || [rule.param];
        if (params.includes(param)) {
            sendResponse({ error: 'Parameter already exists' });
            return;
        }

        const updatedRules = customRules.map(r =>
            r.domain === domain
                ? { domain, params: [...params, param] }
                : r
        );

        await chrome.storage.local.set({ customRules: updatedRules });
        const settings = await chrome.storage.local.get(SETTINGS_KEY);
        if (settings[SETTINGS_KEY]?.status) {
            await updateAllDNRRules(true);
        }
        sendResponse({ success: true });
    });
    return true;
  }

  return true; 
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateRuleSet') {
    // Handle updateRuleSet action
    (async () => {
      try {
        // Call the existing update functions
        await updateRuleSet(message.enabled);
        await updateDNRRules(message.enabled);
        await badge(message.enabled);

        // Get available rule count
        await new Promise((resolve) => {
          chrome.declarativeNetRequest.getAvailableStaticRuleCount((count) => {
            resolve(count);
          });
        });

        // Get current hyperlink setting
        const result = await chrome.storage.local.get(['updateHyperlinkAuditing']);
        
        // If main extension is disabled or hyperlink is disabled, disable rule
        if (!message.enabled || !result.updateHyperlinkAuditing) {
          await chrome.declarativeNetRequest.updateStaticRules({
            rulesetId: "ruleset_8",
            disableRuleIds: [2]
          });
        }

        // Update storage with new status
        await chrome.storage.local.set({
          [SETTINGS_KEY]: { status: message.enabled }
        });

        sendResponse({ success: true });
      } catch (error) {
        console.error('Error updating ruleset:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true; // Will respond asynchronously
  }

  if (message.action === 'updateHyperlinkAuditing') {
    // Handle updateHyperlinkAuditing action
    updateHyperlinkAuditing(message.enabled)
      .then(success => sendResponse({ success }))
      .catch(error => {
        console.error('Error updating hyperlink auditing:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Will respond asynchronously
  }
});



// Listen for changes in extension status
chrome.storage.onChanged.addListener(async (changes, area) => {
  try {
    if (area === 'local' && changes[SETTINGS_KEY]) {
      const newStatus = changes[SETTINGS_KEY].newValue?.status;
      
      // Get the available rule count first
      await new Promise((resolve) => {
        chrome.declarativeNetRequest.getAvailableStaticRuleCount((count) => {
          resolve(count);
        });
      });

      // If main extension is being enabled
      if (newStatus) {
        // Check if hyperlink auditing was already enabled
        const { updateHyperlinkAuditing: hyperlinkEnabled } = 
          await chrome.storage.local.get('updateHyperlinkAuditing');
        
        if (hyperlinkEnabled) {
          // Enable rule 2 if both are now true
          await chrome.declarativeNetRequest.updateStaticRules({
            rulesetId: "ruleset_8",
            enableRuleIds: [2]
          });
        }
      } else {
        // Main extension disabled, ensure rule is disabled
        await chrome.declarativeNetRequest.updateStaticRules({
          rulesetId: "ruleset_8",
          disableRuleIds: [2]
        });
      }
    }
  } catch (error) {
    console.error('Error in storage change listener:', error);
  }
});

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area === 'local') {
    if (changes.PreventGoogleandyandexscript) {
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (tab.url && (isGoogleDomain(tab.url) || isYandexDomain(tab.url))) {
          chrome.tabs.reload(tab.id);
        }
      }
    }
  }
});






async function badge(enabled) {
  if (enabled) {
    const badgesettings = await new Promise((resolve) => {
      chrome.storage.local.get('updateBadgeOnOff', (result) => {
        resolve(result.updateBadgeOnOff);
      });
    });
    
    await chrome.declarativeNetRequest.setExtensionActionOptions({
      displayActionCountAsBadgeText: badgesettings
    });
  }
}


const RULE_ID_START = 1;

chrome.runtime.onInstalled.addListener(async () => {
  const {whitelist } = await chrome.storage.local.get(['whitelist']);
  if (!whitelist) {
    await chrome.storage.local.set({ whitelist: [] });
  }
});

function createAllowRule(domain, ruleId) {
  const punycodeDomain = punycode.toASCII(domain);
  return [{
    id: ruleId,
    priority: 1,
    action: {
      type: "allow"
    },
    condition: {
      requestDomains: [punycodeDomain],
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "ping",
        "xmlhttprequest"
      ]
    }
  },
  {
    id: ruleId + 1,
    priority: 1,
    action: {
      type: "allow"
    },
    condition: {
      initiatorDomains: [punycodeDomain],
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "ping",
        "xmlhttprequest"
      ]
    }
  }];
}

async function updateDNRRules(enabled) {
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);

    if (enabled) {
      const { whitelist = [] } = await chrome.storage.local.get('whitelist');
      const newRules = whitelist.flatMap((domain, index) => 
        createAllowRule(domain, (index * 2) + RULE_ID_START)
      );

      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
        addRules: newRules
      });
    } else {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
        addRules: []
      });
    }
  } catch (error) {
  }
}

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (changes.whitelist) {
    updateDNRRule();   
  }

  if (changes.updateBadgeOnOff) {
    console.log('Badge state changed:', changes.updateBadgeOnOff.newValue);
    chrome.declarativeNetRequest.setExtensionActionOptions({
      displayActionCountAsBadgeText: changes.updateBadgeOnOff.newValue
    });
    if (changes.updateBadgeOnOff.newValue === true) {
    } else {
    }
  }
});

async function updateDNRRule() {
  const settings = await new Promise((resolve) => {
    chrome.storage.local.get(SETTINGS_KEY, (result) => {
      resolve(result[SETTINGS_KEY]);
    });
  });
  const badgesettings = await new Promise((resolve) => {
    chrome.storage.local.get('updateBadgeOnOff', (result) => { 
      resolve(result.updateBadgeOnOff);    });
  });

  updateAllDNRRules(settings.status);
  updateDNRRules(settings.status);
  badge(badgesettings);
}



async function updateHyperlinkAuditing(enabled) {
  try {
    // Get main extension status
    const settings = await chrome.storage.local.get(SETTINGS_KEY);
    const isMainEnabled = settings[SETTINGS_KEY]?.status ?? false;

    // Get available rule count first
    const count = await new Promise((resolve) => {
      chrome.declarativeNetRequest.getAvailableStaticRuleCount((count) => {
        resolve(count);
      });
    });

    // If either main extension is disabled OR hyperlink setting is disabled,
    // then disable ruleset_1
    if (!isMainEnabled || !enabled) {
      await chrome.declarativeNetRequest.updateStaticRules({
        rulesetId: "ruleset_8",
        disableRuleIds: [2]
      });
    } else {
      // Both main extension and hyperlink setting are enabled
      await chrome.declarativeNetRequest.updateStaticRules({
        rulesetId: "ruleset_8",
        enableRuleIds: [2]
      });
    }

    // Update the storage with new setting
    await chrome.storage.local.set({ updateHyperlinkAuditing: enabled });
    
    return true;
  } catch (error) {
    console.error('Error updating hyperlink auditing:', error);
    return false;
  }
}





chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "Copy-clean-url",
    title: chrome.i18n.getMessage("menuItemCopyCleanUrl"),
    contexts: ["link"]
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "Copy-clean-url") {
      handleContextMenuClick(info, tab);
  }
});

function removeUrlParameters(url) {
  try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      
      let parametersToRemove = new Set();
      
      // Original functionality: Add global parameters
      parameterRules[0].removeParams.forEach(param => parametersToRemove.add(param));
      
      // Original functionality: Add domain-specific parameters
      for (let i = 1; i < parameterRules.length; i++) {
          if (hostname.includes(parameterRules[i].domain)) {
              parameterRules[i].removeParams.forEach(param => parametersToRemove.add(param));
          }
      }

      // New functionality: Check URL against regex patterns
      for (const rule of urlPatternRules) {
          try {
              const urlPatternRegex = new RegExp(rule.regexPattern);
              if (urlPatternRegex.test(url)) {
                  rule.removeParams.forEach(param => parametersToRemove.add(param));
              }
          } catch (patternError) {
              console.error('Error with URL pattern:', rule.regexPattern, patternError);
          }
      }
      
      // Remove parameters
      const searchParams = new URLSearchParams(urlObj.search);
      
      for (const param of parametersToRemove) {
          if (searchParams.has(param)) {
              searchParams.delete(param);
          }
          
          // Handle regex patterns
          try {
              const regexPattern = new RegExp(param);
              for (const [key] of searchParams.entries()) {
                  if (regexPattern.test(key)) {
                      searchParams.delete(key);
                  }
              }
          } catch (regexError) {
              console.error('Error with regex pattern:', param, regexError);
          }
      }
      
      // Rebuild URL
      urlObj.search = searchParams.toString();
      return urlObj.toString();
      
  } catch (error) {
      console.error('Error removing URL parameters:', error);
      return url;
  }
}

function htmlcanescape(str) {
  const decodeHtmlEntities = (s) => s
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, "\"")
      .replace(/&amp;/g, "&");

  const rawStr = decodeHtmlEntities(String(str));
  return rawStr
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;");
}

async function handleContextMenuClick(info, tab) {
  try {
      const cleanUrl = removeUrlParameters(info.linkUrl);
      
      const text = cleanUrl;
      const safeUrl = htmlcanescape(cleanUrl);
      const html = `<a href="${safeUrl}">${safeUrl}</a>`;

      const isFunction = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => typeof copyToClipboard === 'function'
      });


      if (!isFunction[0]?.result) {
          await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["./lib/clipboard-helper.js"]
          });
      }


      await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text, html) => copyToClipboard(text, html),
          args: [text, html]
      });
  } catch (error) {
      console.error("Failed to copy text:", error);
  }
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "cleanurls-tools") {
      try {
          const cleanedUrl = removeUrlParameters(request.url);
          // Send to options page
          chrome.runtime.sendMessage({
              action: "displayCleanedUrl",
              cleanedUrl: cleanedUrl
          });
          sendResponse({ success: true });
      } catch (error) {
          console.error('Error in cleanUrl handler:', error);
          sendResponse({ success: false, error: error.message });
      }
      return true;
  }
});
const icons = {
  light: {
    16: 'icons/light/icon16.png',
    32: 'icons/light/icon32.png',
    48: 'icons/light/icon48.png',
    96: 'icons/light/icon96.png',
    128: 'icons/light/icon128.png'
  },
  dark: {
    16: 'icons/dark/icon16.png',
    32: 'icons/dark/icon32.png',
    48: 'icons/dark/icon48.png',
    96: 'icons/dark/icon96.png',
    128: 'icons/dark/icon128.png'
  }
};

const updateExtensionIcon = (theme) => {
  chrome.action.setIcon({
    path: icons[theme]
  });
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.theme) {
    updateExtensionIcon(changes.theme.newValue);
  }
});




chrome.runtime.onStartup.addListener(async () => {
  await initializeExtension();  
});



async function initializeExtension() {
  const currentTheme = await new Promise(resolve => {
    chrome.storage.local.get(['theme'], (result) => {
      resolve(result.theme);
    });
  });

  updateExtensionIcon(currentTheme);
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'openPopup') {
    try {
      chrome.action.openPopup();
    } catch (error) {
      console.error('Error opening popup:', error);
    }
  }
});

function isGoogleDomain(url) {
  return /^https?:\/\/([a-zA-Z0-9-]+\.)*google\.(com|ad|ae|com\.af|com\.ag|com\.ai|al|am|co\.ao|com\.ar|as|at|com\.au|az|ba|com\.bd|be|bf|bg|com\.bh|bi|bj|com\.bn|com\.bo|com\.br|bs|bt|co\.bw|by|com\.bz|ca|cd|cf|cg|ch|ci|co\.ck|cl|cm|cn|com\.co|co\.cr|com\.cu|cv|com\.cy|cz|de|dj|dk|dm|com\.do|dz|com\.ec|ee|com\.eg|es|com\.et|fi|com\.fj|fm|fr|ga|ge|gg|com\.gh|com\.gi|gl|gm|gp|gr|com\.gt|gy|com\.hk|hn|hr|ht|hu|co\.id|ie|co\.il|im|co\.in|iq|is|it|je|com\.jm|jo|co\.jp|co\.ke|com\.kh|ki|kg|co\.kr|com\.kw|kz|la|com\.lb|li|lk|co\.ls|lt|lu|lv|com\.ly|co\.ma|md|me|mg|mk|ml|com\.mm|mn|ms|com\.mt|mu|mv|mw|com\.mx|com\.my|co\.mz|com\.na|com\.nf|com\.ng|com\.ni|ne|nl|no|com\.np|nr|nu|co\.nz|com\.om|com\.pa|com\.pe|com\.pg|com\.ph|com\.pk|pl|pn|com\.pr|ps|pt|com\.py|com\.qa|ro|ru|rw|com\.sa|com\.sb|sc|se|com\.sg|sh|si|sk|com\.sl|sn|so|sm|sr|st|com\.sv|td|tg|co\.th|com\.tj|tk|tl|tm|tn|to|com\.tr|tt|com\.tw|co\.tz|com\.ua|co\.ug|co\.uk|com\.uy|co\.uz|com\.vc|co\.ve|vg|co\.vi|com\.vn|vu|ws|rs|co\.za|co\.zm|co\.zw|cat)\/.*/i.test(url);
}

function isYandexDomain(url) {
  return /^https?:\/\/([a-zA-Z0-9-]+\.)*(yandex\.ru|yandex\.com|ya\.ru)\/.*/i.test(url);
}

// Listen for tab updates
function getStorageValue(key) {
  return new Promise(resolve => {
    chrome.storage.local.get(key, result => {
      resolve(result[key]);
    });
  });
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only process after the page fully loads and there is a URL
  if (changeInfo.status !== 'complete' || !tab.url) return;

  // Retrieve settings in parallel
  const [settings, preventFlag, whitelist] = await Promise.all([
    getStorageValue(SETTINGS_KEY),
    getStorageValue('PreventGoogleandyandexscript'),
    getStorageValue('whitelist'),
  ]);

  // If settings aren’t enabled or the PreventGoogleandyandexscript flag isn’t set, stop here.
  if (!settings || !settings.status || !preventFlag) {
    return;
  }

  // Ensure whitelist is an array before proceeding
  if (Array.isArray(whitelist) && whitelist.some(domain => tab.url.includes(domain))) {
    return; // Stop if the current URL is whitelisted
  }

  // Execute fix scripts based on the domain of the tab URL
  if (isGoogleDomain(tab.url)) {
    // Use world 'MAIN' if your injected code requires access to the page’s actual DOM/global object.
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['./lib/google-fix.js'],
      // Uncomment the following if you need your script to run in the page context:
      // world: 'MAIN'
    });
  }

  if (isYandexDomain(tab.url)) {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['./lib/yandex-fix.js'],
      // world: 'MAIN'  // Uncomment if necessary
    });
  }
});





const CUSTOM_RULE_ID_START = 40000;




async function saveCustomRule(domain, param) {
  const punycodeDomain = punycode.toASCII(domain);
  const { customRules: currentRules = [] } = await chrome.storage.local.get('customRules');
  
  // Find existing rule with same domain
  const existingRule = currentRules.find(rule => rule.domain === punycodeDomain);
  
  let updatedRules;
  if (existingRule) {
    // If rule exists, check for duplicate param
    const params = existingRule.params || [existingRule.param];
    if (params.includes(param)) {
      throw new Error('This parameter already exists for this domain');
    }
    
    // Update existing rule with new param
    updatedRules = currentRules.map(rule => 
      rule.domain === punycodeDomain 
        ? {
            domain: punycodeDomain,
            params: [...(rule.params || [rule.param]), param]
          }
        : rule
    );
  } else {
    // Add new rule
    updatedRules = [...currentRules, { domain: punycodeDomain, param }];
  }
  
  await chrome.storage.local.set({ customRules: updatedRules });
  
  const settings = await chrome.storage.local.get(SETTINGS_KEY);
  if (settings[SETTINGS_KEY]?.status) {
    await updateAllDNRRules(true);
  }
  
  return updatedRules;
}

async function removeCustomRule(domain) {
  const punycodeDomain = punycode.toASCII(domain);
  const { customRules: currentRules = [] } = await chrome.storage.local.get('customRules');
  const updatedRules = currentRules.filter(rule => rule.domain !== punycodeDomain);
  
  await chrome.storage.local.set({ customRules: updatedRules });
  
  const settings = await chrome.storage.local.get(SETTINGS_KEY);
  if (settings[SETTINGS_KEY]?.status) {
    await updateAllDNRRules(true);
  }
  
  return updatedRules;
}

async function updateAllDNRRules(enabled) {
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);
    
    if (enabled) {
      const {  customRules = [] } = await chrome.storage.local.get(['customRules']);
      
      
      // Create parameter removal rules
      const parameterRules = [];
      let ruleId = CUSTOM_RULE_ID_START;
      
      customRules.forEach(rule => {
        const params = rule.params || [rule.param];
        parameterRules.push({
          id: ruleId++,
          priority: 2,
          action: {
            type: "redirect",
            redirect: {
              transform: {
                queryTransform: {
                  removeParams: params
                }
              }
            }
          },
          condition: {
            requestDomains: [rule.domain],
            resourceTypes: ["main_frame", "sub_frame","xmlhttprequest"]
          }
        });
      });
      
      const allRules = [...parameterRules];
      
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
        addRules: allRules
      });
    } else {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
        addRules: []
      });
    }
  } catch (error) {
    console.error('Error updating DNR rules:', error);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'addCustomRule') {
    saveCustomRule(message.domain, message.param)
      .then(rules => sendResponse({ success: true, rules }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (message.action === 'removeCustomRule') {
    removeCustomRule(message.domain)
      .then(rules => sendResponse({ success: true, rules }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
  
  if (message.action === 'getCustomRules') {
    chrome.storage.local.get('customRules', (result) => {
      sendResponse({ rules: result.customRules || [] });
    });
    return true;
  }
});

async function editCustomRuleParam(domain, oldParam, newParam) {
  const punycodeDomain = punycode.toASCII(domain);
  console.log(`Editing custom rule param for domain: ${domain} (Punycode: ${punycodeDomain}) from ${oldParam} to ${newParam}`);
  const { customRules: currentRules = [] } = await chrome.storage.local.get('customRules');
  
  const rule = currentRules.find(r => r.domain === punycodeDomain);
  if (!rule) {
    throw new Error('Rule not found');
  }

  const params = rule.params || [rule.param];
  const paramIndex = params.indexOf(oldParam);
  if (paramIndex === -1) {
    throw new Error('Parameter not found');
  }

  if (params.includes(newParam)) {
    throw new Error('Parameter already exists');
  }

  params[paramIndex] = newParam;

  const updatedRules = currentRules.map(r => 
    r.domain === punycodeDomain 
      ? { domain: punycodeDomain, params }
      : r
  );

  await chrome.storage.local.set({ customRules: updatedRules });

  const settings = await chrome.storage.local.get(SETTINGS_KEY);
  if (settings[SETTINGS_KEY]?.status) {
    await updateAllDNRRules(true);
  }

  return updatedRules;
}

async function removeCustomRuleParam(domain, param) {
  const punycodeDomain = punycode.toASCII(domain);
  const { customRules: currentRules = [] } = await chrome.storage.local.get('customRules');
  
  const rule = currentRules.find(r => r.domain === punycodeDomain);
  if (!rule) {
    throw new Error('Rule not found');
  }

  const params = rule.params || [rule.param];
  if (params.length === 1) {
    // If this is the last parameter, remove the entire rule
    return removeCustomRule(domain);
  }

  const paramIndex = params.indexOf(param);
  if (paramIndex === -1) {
    throw new Error('Parameter not found');
  }

  params.splice(paramIndex, 1);

  const updatedRules = currentRules.map(r => 
    r.domain === punycodeDomain 
      ? { domain: punycodeDomain, params }
      : r
  );

  await chrome.storage.local.set({ customRules: updatedRules });

  const settings = await chrome.storage.local.get(SETTINGS_KEY);
  if (settings[SETTINGS_KEY]?.status) {
    await updateAllDNRRules(true);
  }

  return updatedRules;
}
function extractRealUrl(url) {
  try {
      const parsedUrl = new URL(url);
      
      // Handle Google Ads URLs
      if (parsedUrl.pathname === '/aclk') {
          const adUrl = parsedUrl.searchParams.get('adurl');
          if (adUrl) {
              return decodeURIComponent(adUrl);
          }
      }

      // Handle Google AMP URLs
      if (parsedUrl.pathname.startsWith('/amp/')) {
          const ampMatch = parsedUrl.pathname.match(/\/amp\/?s?\/(https?.+)/i);
          if (ampMatch) {
              return decodeURIComponent(ampMatch[1]);
          }
      }

      // Handle standard Google redirects
      if (parsedUrl.pathname === '/url') {
          const redirectUrl = parsedUrl.searchParams.get('url') || 
                            parsedUrl.searchParams.get('q');
          if (redirectUrl) {
              let decodedUrl = redirectUrl;
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
              return decodedUrl.split('&')[0];
          }
      }
  } catch (error) {
      console.error('Error extracting real URL:', error);
  }
  return null;
}

// Handle navigation events
chrome.webNavigation.onBeforeNavigate.addListener(
  function(details) {
      // Only handle main frame navigation
      if (details.frameId !== 0) return;
      
      try {
          const url = new URL(details.url);
          
          // Check if it's a Google domain
          if (url.hostname.includes('google.')) {
              const realUrl = extractRealUrl(details.url);
              
              if (realUrl) {
                  // Cancel current navigation and redirect to real URL
                  chrome.tabs.update(details.tabId, {
                      url: realUrl
                  });
              }
          }
      } catch (error) {
          console.error('Error in navigation handler:', error);
      }
  },
  {
      // Filter for Google URLs
      url: [
          { hostContains: 'google.' },
      ]
  }
);

        // Find existing rule effectiveness entry or create new one
        let stats = {
  summary: {
    totalRedirect: 0,      // Count of every internal redirect handled
    totalParameter: 0      // Total number of query parameters removed collectively
  }
};

const STATS_KEY = 'stats';

// Debounce function to prevent excessive storage writes
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Persistent storage update function
const updateStorageWithStats = debounce(async () => {
  try {
    await chrome.storage.local.set({ [STATS_KEY]: stats });
    console.log('Stats updated in local storage');
  } catch (error) {
    console.error('Error updating stats in local storage:', error);
  }
}, 500); // 500ms debounce to prevent rapid successive writes

// Load stats from storage on startup
async function loadStats() {
  try {
    const result = await chrome.storage.local.get(STATS_KEY);
    if (result[STATS_KEY] && typeof result[STATS_KEY] === 'object') {
      stats = result[STATS_KEY];
    } else {
      // Initialize stats in storage if not present
      await chrome.storage.local.set({ [STATS_KEY]: stats });
    }
    console.log('Stats loaded successfully:', stats);
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Initialize stats load on extension install and browser startup
chrome.runtime.onInstalled.addListener(async () => {
  await loadStats(); // Ensure stats are loaded on installation
});

chrome.runtime.onStartup.addListener(async () => {
  await loadStats(); // Ensure stats are loaded on browser startup
});

// Ensure stats are loaded during extension initialization
(async () => {
  await loadStats();
})();

// Listen for internal redirects
chrome.webRequest.onBeforeRedirect.addListener(
  (details) => {
    // Process only main_frame, sub_frame, and xmlhttprequest types with 307 status code
    if ((details.type === 'main_frame' ||
         details.type === 'sub_frame' ||
         details.type === 'xmlhttprequest') &&
         details.statusCode === 307 &&
         details.redirectUrl) {
      handleInternalRedirect(details);
    }
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame", "sub_frame", "xmlhttprequest"]
  }
);

async function handleInternalRedirect(details) {
  try {
    // Increment totalRedirect for every internal redirect event
    stats.summary.totalRedirect++;

    const originalUrl = new URL(details.url);
    const redirectUrl = new URL(details.redirectUrl);
    
    // Create sets of query parameter keys from original and redirect URLs
    const originalParams = new Set([...originalUrl.searchParams.keys()]);
    const redirectParams = new Set([...redirectUrl.searchParams.keys()]);
    
    // Find parameters that were removed during the redirect
    const removedParams = new Set(
      [...originalParams].filter(param => !redirectParams.has(param))
    );
    
    // Increment totalParameter by the number of parameters removed (if any)
    if (removedParams.size > 0) {
      stats.summary.totalParameter += removedParams.size;
    }
    
    // Update the stored stats with debouncing
    updateStorageWithStats();
  } catch (error) {
    console.error('Error handling internal redirect:', error);
  }
}

// Message listener for stats-related actions (reset and get stats)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'resetStats') {
    // Reset stats object
    stats = {
      summary: {
        totalRedirect: 0,
        totalParameter: 0
      }
    };
    
    // Update storage and send response
    chrome.storage.local.set({ [STATS_KEY]: stats }, () => {
      updateStorageWithStats();
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (message.action === 'getStats') {
    sendResponse({
      success: true,
      stats: stats
    });
    return true;
  }
});

// Periodic backup of stats every 60 seconds (additional safety net)
setInterval(async () => {
  try {
    await chrome.storage.local.set({ [STATS_KEY]: stats });
  } catch (error) {
    console.error('Error in periodic stats backup:', error);
  }
}, 60000);
