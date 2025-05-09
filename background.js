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
import { defaultSettings, SETTINGS_KEY, CANT_FIND_SETTINGS_MSG, EXCEPTION_DISABLED_RULES_KEY, EXCEPTION_RULES_KEY } from './common/constants.js';
import { parameterRules, urlPatternRules } from './common/rules.js';
import punycode from './lib/punycode.js';
import base64 from './lib/base64.js';

// Use base64Module instead of base64

// === CONSOLIDATED STORAGE OPERATIONS ===
// Storage utilities
const Storage = {
  get(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          // Key can be a string or an array or null
          if (key === null) {
            resolve(result);
          } else if (typeof key === 'string') {
            resolve(result[key]);
          } else {
            resolve(result);
          }
        }
      });
    });
  },
  
  set(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(data, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  },
  
  // Convenience methods for settings
  async getExtensionStatus() {
    const settings = await this.get(SETTINGS_KEY);
    return settings?.status || false;
  },
  
  async setExtensionStatus(enabled) {
    return this.set({ [SETTINGS_KEY]: { status: enabled } });
  },
  
  // Generic settings helper
  async toggleSetting(key, value = null) {
    if (value === null) {
      // Toggle current value
      const currentValue = await this.get(key);
      return this.set({ [key]: !currentValue });
    } else {
      // Set to specific value
      return this.set({ [key]: value });
    }
  }
};

// Alias for backward compatibility
function linkumoriread(key) {
  return Storage.get(key);
}

function linkumoriwrite(obj) {
  return Storage.set(obj);
}

// === CONSOLIDATED RULE MANAGEMENT ===
// Rule Management System
const RuleManager = {
  // Constants for rule types
  RULE_TYPES: {
    STATIC: 'static',
    DYNAMIC: 'dynamic',
    CUSTOM: 'custom',
    EXCEPTION: 'exception'
  },
  
  // Constants for rule IDs
  RULE_ID_RANGES: {
    STATIC_START: 1,
    CUSTOM_START: 40000,
    EXCEPTION_START: 50000
  },
  
  // Update all rule types
  async updateAllRules(enabled) {
    try {
      await this.updateRuleSet(enabled);
      await this.updateDNRRules(enabled);
      await this.updateAllDNRRules(enabled);
      await this.updateExceptionRuleStates();
      console.log('All rules updated successfully, enabled:', enabled);
      return true;
    } catch (error) {
      console.error('Error updating all rules:', error);
      return false;
    }
  },
  
  // Static ruleset management (original functions, merged)
  async updateRuleSet(enabled) {
    const allRulesets = ['ruleset_1', 'ruleset_2', 'ruleset_3', 'ruleset_4', 'ruleset_5', 
                         'ruleset_6', 'ruleset_7', 'ruleset_8', 'ruleset_9', 'ruleset_10', 
                         'ruleset_11', 'ruleset_12', 'ruleset_13', 'ruleset_14', 'ruleset_15', 
                         'ruleset_16', 'ruleset_17', 'exception', 'ruleset_19'];

    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: enabled ? [] : allRulesets,
      enableRulesetIds: enabled ? allRulesets : []
    });
  },
  
  // Dynamic rule management
  async updateDNRRules(enabled) {
    try {
      const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
      const existingRuleIds = existingRules.map(rule => rule.id);

      if (enabled) {
        // Fix: Get whitelist safely with a default empty array
        const whitelist = await Storage.get('whitelist') || [];
        const newRules = whitelist.flatMap((domain, index) => 
          this.createAllowRule(domain, (index * 2) + this.RULE_ID_RANGES.STATIC_START)
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
      console.error('Error updating DNR rules:', error);
    }
  },
  
  // Custom rules management
  async updateAllDNRRules(enabled) {
    try {
      const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
      const existingRuleIds = existingRules.map(rule => rule.id);
      
      if (enabled) {
        // Fix: Get customRules safely with a default empty array
        const customRules = await Storage.get('customRules') || [];
        
        // Create parameter removal rules
        const parameterRules = [];
        let ruleId = this.RULE_ID_RANGES.CUSTOM_START;
        
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
              resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest"]
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
  },
  
  // Exception rule management
  async toggleExceptionRule(ruleId, enabled) {
    try {
      // Check if main extension is enabled
      const settings = await Storage.get(SETTINGS_KEY) || {};
      const isMainEnabled = settings.status || false;
      
      if (!isMainEnabled) {
        console.log(`Main extension is disabled, not toggling rule #${ruleId}`);
        return false;
      }
      
      // Convert rule ID to number
      const numericRuleId = parseInt(ruleId, 10);
      if (isNaN(numericRuleId)) {
        throw new Error(`Invalid rule ID: ${ruleId} is not a number`);
      }
      
      // Get current disabled rules
      const disabledRules = await Storage.get(EXCEPTION_DISABLED_RULES_KEY) || [];
      
      // Update disabled rules list
      let updatedDisabledRules;
      if (enabled) {
        updatedDisabledRules = disabledRules.filter(id => id !== numericRuleId);
      } else {
        updatedDisabledRules = disabledRules.includes(numericRuleId) 
          ? disabledRules 
          : [...disabledRules, numericRuleId];
      }
      
      // Save updated disabled rules
      await Storage.set({ [EXCEPTION_DISABLED_RULES_KEY]: updatedDisabledRules });
      
      // Update ruleset
      await this.updateRulesetWithExceptions(updatedDisabledRules);
      
      console.log(`Rule #${numericRuleId} ${enabled ? 'enabled' : 'disabled'} in exception ruleset`);
      return true;
    } catch (error) {
      console.error(`Error toggling exception rule #${ruleId}:`, error);
      throw error;
    }
  },

  async updateRulesetWithExceptions(disabledRules) {
    try {
      const enabledRulesets = await chrome.declarativeNetRequest.getEnabledRulesets();
      const isExceptionEnabled = enabledRulesets.includes('exception');

      // First, update enabled rulesets
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: isExceptionEnabled ? ['exception'] : [],
        enableRulesetIds: isExceptionEnabled ? [] : ['exception']
      });

      // Then, update rule states using updateStaticRules
      if (disabledRules.length > 0) {
        await chrome.declarativeNetRequest.updateStaticRules({
          removeRuleIds: [], // Don't remove any rules
          addRules: [], // Don't add any new rules
          disableRuleIds: disabledRules
        });
      }

      console.log('Exception ruleset updated with disabled rules:', disabledRules);
    } catch (error) {
      console.error('Error updating exception ruleset:', error);
      throw error;
    }
  },
  
  async updateExceptionRuleStates() {
    try {
      const settings = await chrome.storage.local.get(SETTINGS_KEY);
      const isMainEnabled = settings[SETTINGS_KEY]?.status || false;
      
      if (!isMainEnabled) {
        return false;
      }
      
      const { [EXCEPTION_RULES_KEY]: exceptionRules = [] } = 
        await chrome.storage.local.get(EXCEPTION_RULES_KEY);
      
      const disabledRuleIds = exceptionRules
        .filter(rule => rule.enabled === false)
        .map(rule => parseInt(rule.id, 10))
        .filter(id => !isNaN(id));
      
      await chrome.storage.local.set({ [EXCEPTION_DISABLED_RULES_KEY]: disabledRuleIds });
      
      await this.updateRulesetWithExceptions(disabledRuleIds);
      
      console.log('Exception rules updated, disabled rules:', disabledRuleIds);
      return true;
    } catch (error) {
      console.error('Error updating exception rule states:', error);
      return false;
    }
  },
  
  // Helper functions
  createAllowRule(domain, ruleId) {
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
  },
  
  // Custom rule CRUD operations
  async saveCustomRule(domain, param) {
    const punycodeDomain = punycode.toASCII(domain);
    const currentRules = await Storage.get('customRules') || [];
    
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
    
    await Storage.set({ customRules: updatedRules });
    
    // Fix: Get settings safely
    const settings = await Storage.get(SETTINGS_KEY);
    if (settings && settings.status) {
      await this.updateAllDNRRules(true);
    }
    
    return updatedRules;
  },
  
  async removeCustomRule(domain) {
    const punycodeDomain = punycode.toASCII(domain);
    const currentRules = await Storage.get('customRules') || [];
    const updatedRules = currentRules.filter(rule => rule.domain !== punycodeDomain);
    
    await Storage.set({ customRules: updatedRules });
    
    const settings = await Storage.get(SETTINGS_KEY) || {};
    if (settings.status) {
      await this.updateAllDNRRules(true);
    }
    
    return updatedRules;
  },
  
  async editCustomRuleParam(domain, oldParam, newParam) {
    const punycodeDomain = punycode.toASCII(domain);
    console.log(`Editing custom rule param for domain: ${domain} (Punycode: ${punycodeDomain}) from ${oldParam} to ${newParam}`);
    const currentRules = await Storage.get('customRules') || [];
    
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

    await Storage.set({ customRules: updatedRules });

    const settings = await Storage.get(SETTINGS_KEY) || {};
    if (settings.status) {
      await this.updateAllDNRRules(true);
    }

    return updatedRules;
  },
  
  async removeCustomRuleParam(domain, param) {
    const punycodeDomain = punycode.toASCII(domain);
    const currentRules = await Storage.get('customRules') || [];
    
    const rule = currentRules.find(r => r.domain === punycodeDomain);
    if (!rule) {
      throw new Error('Rule not found');
    }

    const params = rule.params || [rule.param];
    if (params.length === 1) {
      // If this is the last parameter, remove the entire rule
      return this.removeCustomRule(domain);
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

    await Storage.set({ customRules: updatedRules });

    const settings = await Storage.get(SETTINGS_KEY) || {};
    if (settings.status) {
      await this.updateAllDNRRules(true);
    }

    return updatedRules;
  }
};

// === CONSOLIDATED EVENT HANDLERS ===
// Event handlers manager
const EventHandlers = {
  async handleExtensionInstalled() {
    const isFirstInstall = await firstInstalled();
    if (isFirstInstall) {
      setDefaultSettings();
      await Storage.set({ 
        updateHyperlinkAuditing: true, 
        firstInstalled: true, 
        historyApiProtection: true,
        updateBadgeOnOff: true, 
        PreventGoogleandyandexscript: true 
      });
      updateHyperlinkAuditing(true);
      chrome.alarms.create('wakeUpAlarm', { periodInMinutes: 1/60 });
      chrome.tabs.create({
        url: 'panel/first-install.html',
      });
      return;
    }

    const [updatesettings, badgesettings, settings, currentTheme] = await Promise.all([
      Storage.get('updateHyperlinkAuditing'),
      Storage.get('updateBadgeOnOff'),
      Storage.get(SETTINGS_KEY),
      Storage.get('theme')
    ]);

    // Update all settings and appearance
    RuleManager.updateRuleSet(settings.status);
    RuleManager.updateDNRRules(settings.status);
    badge(badgesettings);
    updateHyperlinkAuditing(updatesettings);
    updateExtensionIcon(currentTheme);
    RuleManager.updateAllDNRRules(settings.status);
  },

  async handleExtensionStartup() {
    const needsReload = await Storage.get('needsReload');
    if (needsReload) {
      chrome.runtime.reload();
      await Storage.set({ needsReload: false });
      console.log('fixed ya');
    }
    
    await initializeExtension();
  },

  async handleTabUpdate(tabId, changeInfo, tab) {
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
  },

  async handleNavigation(details) {
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

  async handleRedirect(details) {
    // Process only main_frame, sub_frame, and xmlhttprequest types with 307 status code
    if ((details.type === 'main_frame' ||
         details.type === 'sub_frame' ||
         details.type === 'xmlhttprequest') &&
         details.statusCode === 307 &&
         details.redirectUrl) {
      handleInternalRedirect(details);
    }
  },

  async handleContextMenuClick(info, tab) {
    if (info.menuItemId === "Copy-clean-url") {
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
  },

  async handleStorageChanges(changes, area) {
    if (area === 'local') {
      // Handle settings changes
      if (changes[SETTINGS_KEY]) {
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
          const hyperlinkEnabled = await Storage.get('updateHyperlinkAuditing');
          
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

      // Handle whitelist changes
      if (changes.whitelist) {
        updateDNRRule();
      }

      // Handle badge state changes
      if (changes.updateBadgeOnOff) {
        console.log('Badge state changed:', changes.updateBadgeOnOff.newValue);
        chrome.declarativeNetRequest.setExtensionActionOptions({
          displayActionCountAsBadgeText: changes.updateBadgeOnOff.newValue
        });
      }

      // Handle theme changes
      if (changes.theme) {
        const newTheme = changes.theme.newValue;
        updateExtensionIcon(newTheme);
      }
      
      // Handle Google/Yandex script prevention changes
      if (changes.PreventGoogleandyandexscript) {
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
          if (tab.url && (isGoogleDomain(tab.url) || isYandexDomain(tab.url))) {
            chrome.tabs.reload(tab.id);
          }
        }
      }
    }
  },

  async handleMessages(message, sender, sendResponse) {
    // Handle common message types
    if (message === 'get-settings') {
      readPurifyUrlsSettings((settings) => {
        if (!Object.hasOwn(settings, SETTINGS_KEY)) {
          console.log(CANT_FIND_SETTINGS_MSG);
          setDefaultSettings();
          sendResponse(defaultSettings);
          RuleManager.updateRuleSet(defaultSettings.status);
          RuleManager.updateDNRRules(defaultSettings.status);
        } else {
          sendResponse(settings);
          RuleManager.updateRuleSet(settings[SETTINGS_KEY].status);
          RuleManager.updateDNRRules(settings[SETTINGS_KEY].status);
          RuleManager.updateAllDNRRules(settings[SETTINGS_KEY].status);
        }
      });
      return true;
    }
    
    // Action-based message handling
    if (message.action) {
      switch (message.action) {
        case 'updateRuleSet':
          RuleManager.updateRuleSet(message.enabled);
          RuleManager.updateDNRRules(message.enabled);
          badge(message.enabled);
          RuleManager.updateAllDNRRules(message.enabled);
          Storage.set({ [SETTINGS_KEY]: { status: message.enabled } });
          sendResponse({ success: true });
          break;
          
        case 'cleanUrl':
          const cleanedUrl = cleanUrl(message.url);
          sendResponse({ cleanedUrl: cleanedUrl });
          break;
          
        case 'toggleExtension':
          const settings = await Storage.get(SETTINGS_KEY);
          const newStatus = !settings.status;
          await Storage.set({ [SETTINGS_KEY]: { status: newStatus } });
          await RuleManager.updateRuleSet(newStatus);
          await RuleManager.updateDNRRules(newStatus);
          badge(newStatus);
          await RuleManager.updateAllDNRRules(newStatus);
          sendResponse({ status: newStatus ? "activated" : "deactivated" });
          break;
          
        case 'updateHistoryApiProtection':
          await Storage.set({ historyApiProtection: message.enabled });
          sendResponse({ success: true });
          break;
          
        case 'updateHyperlinkAuditing':
          await Storage.set({ updateHyperlinkAuditing: message.enabled });
          await updateHyperlinkAuditing(message.enabled);
          sendResponse({ success: true });
          break;
          
        case 'updateBadgeOnOff':
          await Storage.set({ updateBadgeOnOff: message.enabled });
          badge();
          sendResponse({ success: true });
          break;
          
        case 'editCustomRuleParam':
          try {
            const rules = await RuleManager.editCustomRuleParam(message.domain, message.oldParam, message.newParam);
            sendResponse({ success: true, rules });
          } catch (error) {
            sendResponse({ success: false, error: error.message });
          }
          break;
          
        case 'removeCustomRuleParam':
          try {
            const rules = await RuleManager.removeCustomRuleParam(message.domain, message.param);
            sendResponse({ success: true, rules });
          } catch (error) {
            sendResponse({ success: false, error: error.message });
          }
          break;
          
        case 'addCustomRuleParam':
          const { domain, param } = message;
          const customRules = await Storage.get('customRules') || [];
          const rule = customRules.find(r => r.domain === domain);
          
          if (!rule) {
            sendResponse({ error: 'Rule not found' });
            return true;
          }

          const params = rule.params || [rule.param];
          if (params.includes(param)) {
            sendResponse({ error: 'Parameter already exists' });
            return true;
          }

          const updatedRules = customRules.map(r =>
            r.domain === domain
                ? { domain, params: [...params, param] }
                : r
          );

          await Storage.set({ customRules: updatedRules });
          const extensionSettings = await Storage.get(SETTINGS_KEY);
          if (extensionSettings?.status) {
            await RuleManager.updateAllDNRRules(true);
          }
          sendResponse({ success: true });
          break;
          
        case 'toggleExceptionRule':
          try {
            const success = await RuleManager.toggleExceptionRule(message.ruleId, message.enabled);
            sendResponse({ success });
          } catch (error) {
            sendResponse({ success: false, error: error.message });
          }
          break;
          
        case 'updateAllExceptionRules':
        case 'updateExceptionRules':
          try {
            const success = await RuleManager.updateExceptionRuleStates();
            sendResponse({ success });
          } catch (error) {
            sendResponse({ success: false, error: error.message });
          }
          break;
          
        case 'addCustomRule':
          try {
            const rules = await RuleManager.saveCustomRule(message.domain, message.param);
            sendResponse({ success: true, rules });
          } catch (error) {
            sendResponse({ success: false, error: error.message });
          }
          break;
          
        case 'removeCustomRule':
          try {
            const rules = await RuleManager.removeCustomRule(message.domain);
            sendResponse({ success: true, rules });
          } catch (error) {
            sendResponse({ success: false, error: error.message });
          }
          break;
          
        case 'getCustomRules':
          const rules = await Storage.get('customRules') || [];
          sendResponse({ rules });
          break;
          
        case 'resetStats':
          // Reset stats object
          stats = {
            summary: {
              totalRedirect: 0,
              totalParameter: 0
            }
          };
          
          // Update storage and send response
          await Storage.set({ [STATS_KEY]: stats });
          updateStorageWithStats();
          sendResponse({ success: true });
          break;
          
        case 'getStats':
          sendResponse({
            success: true,
            stats: stats
          });
          break;
          
        case 'restart':
          // Attempt to restart the device (will only work in ChromeOS kiosk mode)
          try {
            chrome.runtime.reload();
          } catch (error) {
            console.error('Error restarting extension:', error);
          }
          break;
          
        case 'openPopup':
          chrome.runtime.openOptionsPage();
          sendResponse({ success: true });
          break;
          
        case "cleanurls-tools":
          try {
            const cleanedUrl = removeUrlParameters(message.url);
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
          break;
          
        default:
          console.log('Unknown message action:', message.action);
          break;
      }
      
      return true;
    }
  }
};

// === ENGINE STARTUP AND INITIALIZATION ===
let hasStarted = false;
let config = [];

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

async function badstart() {
  const quickreload = await linkumoriread('quickreload');
  if (quickreload) {
    await linkumoriread({ quickreload: true });
    chrome.runtime.reload();
  }
  console.log('performing quickreload');
}

async function initialize() {
  await start();
}

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

// === URL HANDLING FUNCTIONS ===
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

function extractRealUrl(url) {
  try {
    const parsedUrl = new URL(url);
    
    // Handle Google Ads URLs
    if (parsedUrl.pathname === '/aclk') {
      const adUrl = parsedUrl.searchParams.get('adurl');
      if (adUrl) {
        return decodeRedirectUrl(adUrl);
      }
    }

    // Handle Google AMP URLs
    if (parsedUrl.pathname.startsWith('/amp/')) {
      const ampMatch = parsedUrl.pathname.match(/\/amp\/?s?\/(https?.+)/i);
      if (ampMatch) {
        return decodeRedirectUrl(ampMatch[1]);
      }
    }

    // Handle standard Google redirects
    if (parsedUrl.pathname === '/url') {
      const redirectUrl = parsedUrl.searchParams.get('url') || 
                        parsedUrl.searchParams.get('q');
      if (redirectUrl) {
        return decodeRedirectUrl(redirectUrl); 
      }
    }
  } catch (error) {
    console.error('Error extracting real URL:', error);
  }
  return null;
}

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
      let base64DecodedUrl;
      
      try {
        // Try native browser function first if available
        if (typeof atob === 'function') {
          base64DecodedUrl = atob(decodedUrl);
        } else {
          // Fallback to the imported library
          base64DecodedUrl = base64.decode(decodedUrl);
        }
      } catch (e) {
        // If atob fails, try the imported library
        try {
          base64DecodedUrl = base64.decode(decodedUrl);
        } catch (libError) {
          console.error("Base64 library decode error:", libError);
        }
      }
      
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

// === CONTENT SCRIPT INJECTION ===
async function injectContentScript(tabId) {
  try {
    const tab = await chrome.tabs.get(tabId);
    const url = tab.url;

    const historyApiProtection = await Storage.get('historyApiProtection');
    if (!historyApiProtection) {
      return; 
    }

    if (url.startsWith('chrome://') || url.startsWith('https://chromewebstore.google.com/') || 
        url.startsWith('edge://') || url.startsWith('file:///') ||
        url.startsWith('chrome-extension://') || url.startsWith('https://microsoftedge.microsoft.com/addons/')) {
      return;
    }

    const settings = await Storage.get(SETTINGS_KEY);
    if (!settings || !settings.status) {
      return;
    }

    const whitelist = await Storage.get('whitelist') || [];
    const isWhitelisted = whitelist.some(domain => url.includes(domain));
    if (isWhitelisted) {
      return; 
    }

    await chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['./lib/Anti-history-api.js']
    });
  } catch (error) {
    console.error('Error injecting content script:', error);
  }
}

// === UI MANAGEMENT ===
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

function updateExtensionIcon(theme) {
  chrome.action.setIcon({
    path: icons[theme || 'light']
  });
}

async function badge(enabled) {
  if (enabled) {
    const badgesettings = await Storage.get('updateBadgeOnOff');
    
    await chrome.declarativeNetRequest.setExtensionActionOptions({
      displayActionCountAsBadgeText: badgesettings
    });
  }
}

async function updateHyperlinkAuditing(enabled) {
  try {
    // Get main extension status
    const settings = await Storage.get(SETTINGS_KEY);
    const isMainEnabled = settings?.status ?? false;

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
    await Storage.set({ updateHyperlinkAuditing: enabled });
    
    return true;
  } catch (error) {
    console.error('Error updating hyperlink auditing:', error);
    return false;
  }
}

async function updateDNRRule() {
  const settings = await Storage.get(SETTINGS_KEY);
  const badgesettings = await Storage.get('updateBadgeOnOff');

  RuleManager.updateAllDNRRules(settings?.status);
  RuleManager.updateDNRRules(settings?.status);
  badge(badgesettings);
}

async function initializeExtension() {
  const currentTheme = await Storage.get('theme') || 'light';
  updateExtensionIcon(currentTheme);
}

// === DOMAIN UTILITIES ===
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openPopup') {
    chrome.runtime.openOptionsPage();
    sendResponse({ success: true });
    return true;
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
   chrome.webNavigation.onBeforeNavigate.addListener(
    EventHandlers.handleNavigation,
    { url: [{ hostContains: 'google.' }] }
  );

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




// === STATS MANAGEMENT ===
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
    await Storage.set({ [STATS_KEY]: stats });
    console.log('Stats updated in local storage');
  } catch (error) {
    console.error('Error updating stats in local storage:', error);
  }
}, 500); // 500ms debounce to prevent rapid successive writes

// Load stats from storage on startup
async function loadStats() {
  try {
    const result = await Storage.get(STATS_KEY);
    if (result && typeof result === 'object') {
      stats = result;
    } else {
      // Initialize stats in storage if not present
      await Storage.set({ [STATS_KEY]: stats });
    }
    console.log('Stats loaded successfully:', stats);
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

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

// === INITIALIZE EXTENSION ===
// Setup context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "Copy-clean-url",
    title: chrome.i18n.getMessage("menuItemCopyCleanUrl"),
    contexts: ["link"]
  });
});

// Setup event listeners
function setupEventListeners() {
  // Extension lifecycle events
  chrome.runtime.onInstalled.addListener(EventHandlers.handleExtensionInstalled);
  chrome.runtime.onStartup.addListener(EventHandlers.handleExtensionStartup);
  
  // Tab and navigation events
  chrome.tabs.onUpdated.addListener(EventHandlers.handleTabUpdate);
 
  chrome.webRequest.onBeforeRedirect.addListener(
    EventHandlers.handleRedirect,
    { urls: ["<all_urls>"], types: ["main_frame", "sub_frame", "xmlhttprequest"] }
  );
  
  // Context menu events
  chrome.contextMenus.onClicked.addListener(EventHandlers.handleContextMenuClick);
  
  // Storage change events
  chrome.storage.onChanged.addListener(EventHandlers.handleStorageChanges);
  
  // Message events
  chrome.runtime.onMessage.addListener(EventHandlers.handleMessages);
}

// Initialize the extension on load
(async function() {
  try {
    loadStats();
    loadConfigAndCleanUrl();
    setupEventListeners();
    
    // Check whitelist
    const whitelist = await Storage.get('whitelist');
    if (!whitelist) {
      await Storage.set({ whitelist: [] });
    }
    
    // Initialize extension
    await initialize();
    await initializeExtension();
    
    // Set up periodic stats backup
    setInterval(async () => {
      try {
        await Storage.set({ [STATS_KEY]: stats });
      } catch (error) {
        console.error('Error in periodic stats backup:', error);
      }
    }, 60000);
    
    console.log('Linkumori extension initialized successfully');
  } catch (error) {
    console.error('Error initializing extension:', error);
  }
})();

// Main startup sequence
initialize().then(() => {
  console.log('Linkumori engine started successfully');
}).catch(reason => {
  console.trace(reason);
  linkumoriread('LinkumoriEngineStart').then((value) => {
    if (value === false) { return; }
    linkumoriwrite({ LinkumoriEngineStart: false }).then(() => {
      chrome.runtime.reload();
    });
  });
});