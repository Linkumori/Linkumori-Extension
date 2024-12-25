/*
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
*
* Based on:
*   ERASER
*   <https://github.com/Psychosynthesis/Eraser/blob/main/src/chrome/background.js>
*   Copyright (c) 2022 Nick
    MIT License:
*   You should have received a copy of the MIT License
*  If not <https://github.com/subham8907/Linkumori/blob/main/LICENSE-MAIN>

*/
// ===== Linkumori Engine Start =====//
import { readPurifyUrlsSettings, setDefaultSettings } from './common/utils.js';
import { defaultSettings, SETTINGS_KEY, CANT_FIND_SETTINGS_MSG } from './common/constants.js';
import { parameterRules,urlPatternRules  } from './common/rules.js';

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
    chrome.storage.local.set({ updateHyperlinkAuditing: true, firstInstalled: true, historyApiProtection: true,updateBadgeOnOff: true });
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
});








async function updateRuleSet(enabled) {
  const allRulesets = ['ruleset_1', 'ruleset_2', 'ruleset_3', 'ruleset_4', 'ruleset_5', 'ruleset_6','ruleset_7','ruleset_8'];

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
      files: ['content.js']
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
      }
    });
    return true; 
  } else if (message.action === 'updateRuleSet') {
    updateRuleSet(message.enabled);
    updateDNRRules(message.enabled);
    badge(message.enabled);
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
            console.log('Available static rule count:', count);
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
          console.log('Available static rule count:', count);
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
  return [{
    id: ruleId,
    priority: 1,
    action: {
      type: "allow"
    },
    condition: {
      requestDomains: [domain],
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
      initiatorDomains: [domain],
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
        console.log('Available static rule count:', count);
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
    title: 'Copy Cleaned Url',
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
  return String(str)
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/&/g, "&amp;")
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
              files: ["clipboard-helper.js"]
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

