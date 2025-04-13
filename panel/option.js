/*
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
.
*/

import { readPurifyUrlsSettings, setDefaultSettings } from '../common/utils.js';
import { defaultSettings, SETTINGS_KEY, CANT_FIND_SETTINGS_MSG, STATS_KEY } from '../common/constants.js';
import punycode from '../lib/punycode.js';

class OptionsMenuController {
    constructor() {
        this.state = {
            isEnabled: false,
            historyApiProtection: false,
            blockHyperlinkAuditing: false,
            whitelist: [],
            updateBadgeOnOff: false,
            PreventGoogleandyandexscript: false,
            customRules: [],
            stats: {
                summary: {
                    totalRedirect: 0,
                    totalParameter: 0
                }
            }
        };

        this.domElements = {
            toggleSwitch: null,
            toggleLabel: null,
            historyApiToggle: null,
            historyApiLabel: null,
            hyperlinkAuditingToggle: null,
            hyperlinkAuditingLabel: null,
            whitelistContainer: null,
            domainInput: null,
            searchInput: null,
            addCurrentButton: null,
            badgeOnOffToggle: null,
            badgeOnOffLabel: null,
            rulesContainer: null,
            ruleDomainInput: null,
            ruleParamInput: null,
            PreventGoogleandyandexscriptToggle: null,
            PreventGoogleandyandexscriptLabel: null,
            totalRedirects: null,
            totalParameters: null
        };

        this.exportWhitelist = this.exportWhitelist.bind(this);
        this.importWhitelist = this.importWhitelist.bind(this);
        this.setupURLExtractor();  // Already called here
        this.updateStats = this.updateStats.bind(this);
        this.updateStats = this.updateStats.bind(this);
        this.setupStats();

        this.init();
        this.setupNavigation();
        this.setupAboutSection();
        this.initializeI18n();
        this.setupUpdateChecker();  // Add this line
    }

    initializeI18n() {
        // Initialize text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = chrome.i18n.getMessage(key);
        });

        // Initialize placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = chrome.i18n.getMessage(key);
        });

        // Initialize links
        const githubLink = document.getElementById('githubLink');
        const officialSiteLink = document.getElementById('officialSiteLink');
        if (githubLink) {
            githubLink.textContent = chrome.i18n.getMessage('githubRepoLink');
        }
        if (officialSiteLink) {
            officialSiteLink.textContent = chrome.i18n.getMessage('officialWebsiteLink');
        }
    }

    async init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupDOM();
                this.setupVersion();
            });
        } else {
            this.setupDOM();
            this.setupVersion();
        }

        chrome.storage.onChanged.addListener(this.handleStorageChanges.bind(this));
        await this.loadInitialState();
    }

    async setupVersion() {
        try {
            const manifest = chrome.runtime.getManifest();
            const versionSpan = document.querySelector('.header span');
            if (versionSpan && manifest.version) {
                versionSpan.textContent = `Version ${manifest.version}`;
            }
        } catch (error) {
            console.error('Failed to fetch version:', error);
        }
    }

    async setupDOM() {
        this.domElements = {
            toggleSwitch: document.querySelector('.toggle-switch'),
            toggleLabel: document.querySelector('.toggle-label'),
            historyApiToggle: document.querySelector('#newToggleButton .toggle-switch'),
            historyApiLabel: document.querySelector('#newToggleButton .toggle-label'),
            hyperlinkAuditingToggle: document.querySelector('#blockHyperlinkAuditingToggle .toggle-switch'),
            hyperlinkAuditingLabel: document.querySelector('#blockHyperlinkAuditingToggle .toggle-label'),
            PreventGoogleandyandexscriptToggle: document.querySelector('#blockPreventGoogleandyandexscriptToggle .toggle-switch'),
            PreventGoogleandyandexscriptLabel: document.querySelector('#blockPreventGoogleandyandexscriptToggle .toggle-label'),
            whitelistContainer: document.getElementById('whitelistContainer'),
            domainInput: document.getElementById('domainInput'),
            searchInput: document.getElementById('searchDomain'),
            addCurrentButton: document.getElementById('addCurrentDomain'),
            badgeOnOffToggle: document.querySelector('#updateBadgeOnOff .toggle-switch'),
            badgeOnOffLabel: document.querySelector('#updateBadgeOnOff .toggle-label'),
            rulesContainer: document.getElementById('rulesContainer'),
            ruleDomainInput: document.getElementById('ruleDomainInput'),
            ruleParamInput: document.getElementById('ruleParamInput'),
            totalRedirects: document.getElementById('totalRedirects'),
            totalParameters: document.getElementById('totalParameters')
        };

        this.setupEventListeners();
    }
    setupEventListeners() {
        const exportBtn = document.getElementById('exportWhitelist');
        const importBtn = document.getElementById('importWhitelist');
        const addCustomRuleBtn = document.getElementById('addCustomRule');
        const getParamsButton = document.getElementById('getParameters');
        const resetStatsButton = document.getElementById('resetStats');

        // Update button texts with i18n
        if (getParamsButton) {
            getParamsButton.textContent = chrome.i18n.getMessage('getParametersButton');
        }
        if (resetStatsButton) {
            resetStatsButton.textContent = chrome.i18n.getMessage('resetStats');
        }
        if (addCustomRuleBtn) {
            addCustomRuleBtn.textContent = chrome.i18n.getMessage('addButton');
        }

        exportBtn?.addEventListener('click', this.exportWhitelist);
        importBtn?.addEventListener('click', this.importWhitelist);
        addCustomRuleBtn?.addEventListener('click', () => this.handleAddCustomRule());

        this.domElements.searchInput?.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.trim();
                this.renderWhitelist(searchTerm);
            }, 300);
        });

        document.getElementById('toggleButton')?.addEventListener('click', () => this.togglePurifyUrlsSettings());
        document.getElementById('newToggleButton')?.addEventListener('click', this.toggleHistoryApiProtection.bind(this));
        document.getElementById('blockHyperlinkAuditingToggle')?.addEventListener('click', () => this.toggleHyperlinkAuditing());
        document.getElementById('updateBadgeOnOff')?.addEventListener('click', () => this.toggleBadgeOnOff());
        document.getElementById('addDomain')?.addEventListener('click', () => this.handleAddDomain());
        document.getElementById('blockPreventGoogleandyandexscriptToggle')?.addEventListener('click', () => this.togglePreventGoogleandyandexscript());
        
        this.domElements.domainInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddDomain();
            }
        });

        this.domElements.ruleDomainInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.domElements.ruleParamInput?.value) {
                this.handleAddCustomRule();
            }
        });

        this.domElements.ruleParamInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.domElements.ruleDomainInput?.value) {
                this.handleAddCustomRule();
            }
        });

        // Add search rules event listener
        document.getElementById('searchRules')?.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                const searchTerm = e.target.value.trim();
                this.renderCustomRules(searchTerm);
            }, 300);
        });
    }

    async loadInitialState() {
        try {
            const settings = await new Promise(resolve => readPurifyUrlsSettings(resolve));

            if (!Object.hasOwn(settings, SETTINGS_KEY)) {
                console.log(CANT_FIND_SETTINGS_MSG);
                setDefaultSettings();
                return;
            }

            const { 
                whitelist = [], 
                enabled = false,
                historyApiProtection = false,
                updateHyperlinkAuditing = false,
                updateBadgeOnOff = false,
                customRules = [],
                PreventGoogleandyandexscript = false,
                stats = {
                    summary: {
                        totalRedirect: 0,
                        totalParameter: 0
                    }
                }
            } = await chrome.storage.local.get({
                whitelist: [], 
                enabled: false,
                historyApiProtection: false,
                updateHyperlinkAuditing: false,
                updateBadgeOnOff: false,
                customRules: [],
                PreventGoogleandyandexscript: false,
                [STATS_KEY]: {
                    summary: {
                        totalRedirect: 0,
                        totalParameter: 0
                    }
                }
            });

            this.state = {
                ...this.state,
                isEnabled: settings[SETTINGS_KEY].status,
                historyApiProtection,
                blockHyperlinkAuditing: updateHyperlinkAuditing,
                whitelist,
                updateBadgeOnOff,
                customRules,
                PreventGoogleandyandexscript,
                stats
            };

            this.updateUI();
        } catch (error) {
            console.error('Failed to load initial state:', error);
        }
    }

    handleStorageChanges(changes, area) {
        if (Object.hasOwn(changes, SETTINGS_KEY)) {
            const { newValue } = changes[SETTINGS_KEY];
            this.state.isEnabled = newValue.status;
            this.updateToggleUI();
        }
        
        if (Object.hasOwn(changes, 'historyApiProtection')) {
            this.state.historyApiProtection = changes.historyApiProtection.newValue;
            this.updateHistoryApiToggleUI();
        }

        if (Object.hasOwn(changes, 'updateBadgeOnOff')) {
            this.state.updateBadgeOnOff = changes.updateBadgeOnOff.newValue;
            this.updateBadgeOnOffToggleUI();
        }

        if (Object.hasOwn(changes, 'blockHyperlinkAuditing')) {
            this.state.blockHyperlinkAuditing = changes.blockHyperlinkAuditing.newValue;
            this.updateHyperlinkAuditingToggleUI();
        }
        
        if (Object.hasOwn(changes, 'whitelist')) {
            this.state.whitelist = changes.whitelist.newValue;
            this.renderWhitelist();
        }

        if (Object.hasOwn(changes, 'customRules')) {
            this.state.customRules = changes.customRules.newValue;
            this.renderCustomRules();
        }

        if (Object.hasOwn(changes, 'PreventGoogleandyandexscript')) {
            this.state.PreventGoogleandyandexscript = changes.PreventGoogleandyandexscript.newValue;
            this.updatePreventGoogleandyandexscriptToggleUI();
        }

        if (Object.hasOwn(changes, STATS_KEY)) {
            this.state.stats = changes[STATS_KEY].newValue;
            this.updateStatsUI();
        }
    }
    async togglePurifyUrlsSettings() {
        try {
            const newStatus = !this.state.isEnabled;
            
            await chrome.storage.local.set({
                [SETTINGS_KEY]: {
                    ...this.state,
                    status: newStatus,
                }
            });
            
            await chrome.runtime.sendMessage({
                action: 'updateRuleSet', 
                enabled: newStatus
            });
            
            this.state.isEnabled = newStatus;
            this.updateUI();
        } catch (error) {
            console.error('Failed to toggle settings:', error);
        }
    }

    async toggleBadgeOnOff() {
        try {
            const newStatus = !this.state.updateBadgeOnOff;
            
            await chrome.storage.local.set({ 
                updateBadgeOnOff: newStatus 
            });
            
            this.state.updateBadgeOnOff = newStatus;
            this.updateBadgeOnOffToggleUI();
            
            await chrome.runtime.sendMessage({
                action: 'updateBadgeOnOff',
                enabled: newStatus
            });
        } catch (error) {
            console.error('Failed to toggle Badge On/Off:', error);
        }
    }
    async setupStats() {
        setInterval(this.updateStats, 5000);
        this.updateStats();
     
        document.getElementById('resetStats')?.addEventListener('click', async () => {
            if (confirm(chrome.i18n.getMessage('confirmResetStats'))) {
                await chrome.runtime.sendMessage({action: 'resetStats'});
                this.updateStats(); 
            }
        });
     }



    // Add new method
    async updateStats() {
        try {
            const { [STATS_KEY]: stats } = await chrome.storage.local.get(STATS_KEY);
            if (stats) {
                this.state.stats = stats;
                this.updateStatsUI();
            }
        } catch (error) {
            console.error('Failed to update stats:', error);
        }
    }

    async resetStats() {
        try {
            // Send message to background script to reset stats
            await chrome.runtime.sendMessage({ action: 'resetStats' });
            
            // Remove stats from local storage
            await chrome.storage.local.remove(STATS_KEY);
            
            // Set default state
            this.state.stats = {
                summary: {
                    totalRedirect: 0,
                    totalParameter: 0
                }
            };
            
            // Update UI
            this.updateStatsUI();
        } catch (error) {
            console.error('Failed to reset stats:', error);
        }
    }

    updateStatsUI() {
        // Update new stats
        if (this.domElements.totalRedirects) {
            this.domElements.totalRedirects.textContent = 
                (this.state.stats.summary.totalRedirect || 0).toLocaleString();
        }
        
        if (this.domElements.totalParameters) {
            this.domElements.totalParameters.textContent = 
                (this.state.stats.summary.totalParameter || 0).toLocaleString();
        }
    }
   
    async toggleHyperlinkAuditing() {
        try {
            const { blockHyperlinkAuditing = false } = await chrome.storage.local.get('blockHyperlinkAuditing');
            const newStatus = !blockHyperlinkAuditing;
            
            await chrome.storage.local.set({
                blockHyperlinkAuditing: newStatus
            });
            
            this.state.blockHyperlinkAuditing = newStatus;
            this.updateHyperlinkAuditingToggleUI();
            
            await chrome.runtime.sendMessage({
                action: 'updateHyperlinkAuditing',
                enabled: newStatus
            });
        } catch (error) {
            console.error('Failed to toggle Hyperlink Auditing:', error);
        }
    }
    updateUI() {
        this.updateToggleUI();
        this.updateHistoryApiToggleUI();
        this.updateHyperlinkAuditingToggleUI();
        this.updateBadgeOnOffToggleUI();
        this.updatePreventGoogleandyandexscriptToggleUI();
        this.renderWhitelist();
        this.renderCustomRules();
        this.updateStatsUI();
    }
    updateToggleUI() {
        if (!this.domElements.toggleSwitch || !this.domElements.toggleLabel) {
            return;
        }
        
        if (this.state.isEnabled) {
            this.domElements.toggleSwitch.classList.add('active');
            this.domElements.toggleLabel.textContent = chrome.i18n.getMessage('statusOn');
        } else {
            this.domElements.toggleSwitch.classList.remove('active');
            this.domElements.toggleLabel.textContent = chrome.i18n.getMessage('statusOff');
        }
    }

    updateBadgeOnOffToggleUI() {
        if (!this.domElements.badgeOnOffToggle || !this.domElements.badgeOnOffLabel) {
            return;
        }
     
        // Keep track of badge state
        this.domElements.badgeOnOffToggle.classList.toggle('active', this.state.updateBadgeOnOff);
     
        const isExtensionEnabled = this.state.isEnabled;
        const isFeatureActive = this.state.updateBadgeOnOff;
        const isFeatureInactive = !isFeatureActive;
     
        if (isExtensionEnabled) {
            this.domElements.badgeOnOffToggle.classList.remove('disabled');
            this.domElements.badgeOnOffLabel.textContent = isFeatureActive ?
                chrome.i18n.getMessage('badgeOn') :
                chrome.i18n.getMessage('badgeOff');
        } else {
            this.domElements.badgeOnOffToggle.classList.add('disabled');
            this.domElements.badgeOnOffLabel.textContent = isFeatureInactive ?
                chrome.i18n.getMessage('badgeOff') :
                chrome.i18n.getMessage('badgeInactive');
        }
     }

    updateHistoryApiToggleUI() {
        if (!this.domElements.historyApiToggle || !this.domElements.historyApiLabel) {
            return;
        }
    
        // Keep track of historyApiProtection state regardless of extension state
        this.domElements.historyApiToggle.classList.toggle('active', this.state.historyApiProtection);
    
        // Update UI text based on combined states
        const isExtensionEnabled = this.state.isEnabled;
        const isFeatureActive = this.state.historyApiProtection;
        const isFeatureInactive = !isFeatureActive;
    
        if (isExtensionEnabled) {
            this.domElements.historyApiToggle.classList.remove('disabled');
            this.domElements.historyApiLabel.textContent = isFeatureActive ? 
                chrome.i18n.getMessage('historyProtectionOn') : 
                chrome.i18n.getMessage('historyProtectionOff');
        } else {
            this.domElements.historyApiToggle.classList.add('disabled');
            this.domElements.historyApiLabel.textContent = isFeatureInactive ? 
                chrome.i18n.getMessage('historyProtectionOff') : 
                chrome.i18n.getMessage('historyProtectionInactive');
        }
    }

    updateHyperlinkAuditingToggleUI() {
        if (!this.domElements.hyperlinkAuditingToggle || !this.domElements.hyperlinkAuditingLabel) {
            return;
        }
     
        // Keep track of blockHyperlinkAuditing state regardless of extension state
        this.domElements.hyperlinkAuditingToggle.classList.toggle('active', this.state.blockHyperlinkAuditing);
     
        // Update UI text based on combined states
        const isExtensionEnabled = this.state.isEnabled; 
        const isFeatureActive = this.state.blockHyperlinkAuditing;
        const isFeatureInactive = !isFeatureActive;
     
        if (isExtensionEnabled) {
            this.domElements.hyperlinkAuditingToggle.classList.remove('disabled');
            this.domElements.hyperlinkAuditingLabel.textContent = isFeatureActive ?
                chrome.i18n.getMessage('hyperlinkAuditingOn') :
                chrome.i18n.getMessage('hyperlinkAuditingOff');
        } else {
            this.domElements.hyperlinkAuditingToggle.classList.add('disabled');
            this.domElements.hyperlinkAuditingLabel.textContent = isFeatureInactive ?
                chrome.i18n.getMessage('hyperlinkAuditingOff') :
                chrome.i18n.getMessage('hyperlinkAuditingInactive');
        }
     }

     updatePreventGoogleandyandexscriptToggleUI() {
        if (!this.domElements.PreventGoogleandyandexscriptToggle || !this.domElements.PreventGoogleandyandexscriptLabel) {
            return;
        }
     
        // Keep track of PreventGoogleandyandexscript state
        this.domElements.PreventGoogleandyandexscriptToggle.classList.toggle('active', this.state.PreventGoogleandyandexscript);
     
        const isExtensionEnabled = this.state.isEnabled;
        const isFeatureActive = this.state.PreventGoogleandyandexscript;
        const isFeatureInactive = !isFeatureActive;
     
        if (isExtensionEnabled) {
            this.domElements.PreventGoogleandyandexscriptToggle.classList.remove('disabled');
            this.domElements.PreventGoogleandyandexscriptLabel.textContent = isFeatureActive ?
                chrome.i18n.getMessage('preventRedirectOn') :
                chrome.i18n.getMessage('preventRedirectOff');
        } else {
            this.domElements.PreventGoogleandyandexscriptToggle.classList.add('disabled');
            this.domElements.PreventGoogleandyandexscriptLabel.textContent = isFeatureInactive ?
                chrome.i18n.getMessage('preventRedirectOff') :
                chrome.i18n.getMessage('preventRedirectInactive');
        }
     }

    async handleAddDomain() {
        const domain = this.domElements.domainInput?.value.trim().toLowerCase();
        
        if (!domain) return;
        
        const domainRegex = /^[a-z0-9\u00A1-\uFFFF]+([\-\.]{1}[a-z0-9\u00A1-\uFFFF]+)*\.[a-z\u00A1-\uFFFF]{2,}$/;
        if (!domainRegex.test(domain)) {
            alert(chrome.i18n.getMessage('errorMessages_invalidDomain'));
            return;
        }
        
        try {
            const unicodeDomain = punycode.toUnicode(domain);
            if (!this.state.whitelist.includes(unicodeDomain)) {
                await this.handleWhitelistChange(unicodeDomain, true);
            } else {
                alert(chrome.i18n.getMessage('errorMessages_domainExists'));
            }
            
            if (this.domElements.domainInput) {
                this.domElements.domainInput.value = '';
            }
        } catch (error) {
            console.error('Failed to add domain:', error);
        }
    }

    async handleWhitelistChange(domain, shouldAdd) {
        try {
            const unicodeDomain = punycode.toUnicode(domain);
            let newWhitelist;
            if (shouldAdd) {
                newWhitelist = [...this.state.whitelist, unicodeDomain];
            } else {
                newWhitelist = this.state.whitelist.filter(d => d !== unicodeDomain);
            }
            
            await chrome.storage.local.set({ whitelist: newWhitelist });
            this.state.whitelist = newWhitelist;
            this.renderWhitelist();
        } catch (error) {
            console.error('Failed to update whitelist:', error);
        }
    }
    async setupURLExtractor() {
        const urlInput = document.getElementById('urlInput');
        const getParamsButton = document.getElementById('getParameters');
        const addSelectedButton = document.getElementById('addSelectedParams');
        const parameterInput = document.querySelector('.parameter-input');
        const extractedParams = document.getElementById('extractedParams');
    
        getParamsButton?.addEventListener('click', () => {
            this.extractParameters(urlInput?.value);
        });
    
        urlInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.extractParameters(urlInput.value);
            }
        });
    
        addSelectedButton?.addEventListener('click', () => {
            this.addParametersIndividually();
        });
    }
    
    extractParameters(url) {
        try {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            const parameterInput = document.querySelector('.parameter-input');
            const extractedParams = document.getElementById('extractedParams');
            
            if (!parameterInput || !extractedParams) return;
            
            extractedParams.innerHTML = '';
            let hasParams = false;
    
            // Store URL host as data attribute
            extractedParams.dataset.domain = urlObj.hostname;
    
            params.forEach((value, key) => {
                hasParams = true;
                const paramDiv = document.createElement('div');
                paramDiv.className = 'param-checkbox';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `param-${key}`;
                checkbox.value = key;
                
                const label = document.createElement('label');
                label.htmlFor = `param-${key}`;
                label.textContent = `${key} = ${value}`;
                
                paramDiv.appendChild(checkbox);
                paramDiv.appendChild(label);
                extractedParams.appendChild(paramDiv);
            });
    
            if (hasParams) {
                parameterInput.style.display = 'block';
            } else {
                parameterInput.style.display = 'none';
                alert(chrome.i18n.getMessage('errorMessages_noParamsFound'));
            }
        } catch (error) {
            alert(chrome.i18n.getMessage('errorMessages_invalidUrl'));
            console.error('Error parsing URL:', error);
        }
    }
    
    async addParametersIndividually() {
        const extractedParams = document.getElementById('extractedParams');
        const checkboxes = document.querySelectorAll('#extractedParams input[type="checkbox"]:checked');
        const domain = extractedParams?.dataset.domain;
        
        if (!domain || checkboxes.length === 0) {
            alert(chrome.i18n.getMessage('errorMessages_noParamsSelected'));
            return;
        }
        
        try {
            // Add each parameter as a separate rule
            for (const checkbox of checkboxes) {
                await chrome.runtime.sendMessage({
                    action: 'addCustomRule',
                    domain: domain,
                    param: checkbox.value
                });
            }
            
            // Update UI state
            const { customRules = [] } = await chrome.storage.local.get('customRules');
            this.state.customRules = customRules;
            this.renderCustomRules();
            
            // Clear the parameter display
            const parameterInput = document.querySelector('.parameter-input');
            if (parameterInput) {
                parameterInput.style.display = 'none';
            }
            if (extractedParams) {
                extractedParams.innerHTML = '';
            }
            
            // Clear URL input
            const urlInput = document.getElementById('urlInput');
            if (urlInput) {
                urlInput.value = '';
            }
    
            // Show success message
            alert(chrome.i18n.getMessage('successMessages_parameterAdded', [checkboxes.length]));
            
        } catch (error) {
            alert(error.message || 'Failed to add parameters');
            console.error('Failed to add parameters:', error);
        }
    }

    async exportWhitelist() {
        try {
            const blob = new Blob([JSON.stringify(this.state.whitelist, null, 2)], { 
                type: 'application/json' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'linkumori-whitelist.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export whitelist:', error);
            alert('Failed to export whitelist: ' + error.message);
        }
    }

    async importWhitelist() {
        try {
            const fileContent = await new Promise((resolve, reject) => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
     
                const handleChange = async (e) => {
                    input.removeEventListener('change', handleChange);
                    const file = e.target.files[0];
                    if (!file) {
                        reject(new Error(chrome.i18n.getMessage('errorMessages_noFileSelected')));
                        return;
                    }
     
                    try {
                        const text = await file.text();
                        resolve(text);
                    } catch (err) {
                        reject(err);
                    }
                };
     
                input.addEventListener('change', handleChange);
                input.click();
            });
     
            const importedWhitelist = JSON.parse(fileContent);
            const newWhitelist = [...new Set([...this.state.whitelist,...importedWhitelist])];
     
            if (await this.confirmImport(importedWhitelist.length)) {
                await chrome.storage.local.set({ whitelist: newWhitelist });
                alert(chrome.i18n.getMessage('successMessages_whitelistImport'));
            }
        } catch (error) {
            console.error('Failed to import whitelist:', error);
            alert(chrome.i18n.getMessage('errorMessages_whitelistImport', [error.message]));
        }
    }
     
    async confirmImport(count) {
        return confirm(chrome.i18n.getMessage('confirmationMessages_importWhitelist', [count]));
    }

    renderWhitelist(searchTerm = '') {
        if (!this.domElements.whitelistContainer) return;

        const container = this.domElements.whitelistContainer;
        container.innerHTML = '';

        const filteredDomains = searchTerm
            ? this.state.whitelist.filter(domain =>
                domain.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : this.state.whitelist;

        if (filteredDomains.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = searchTerm
                ? chrome.i18n.getMessage('noDomainsFound', [searchTerm])
                : chrome.i18n.getMessage('noDomainsWhitelisted');
            container.appendChild(noResults);
            return;
        }

        filteredDomains.forEach(domain => {
            const item = document.createElement('div');
            item.className = 'domain-item';

            const header = document.createElement('div');
            header.className = 'domain-header';

            const text = document.createElement('span');
            text.className = 'domain-text';
            text.textContent = punycode.toASCII(domain);

            const controls = document.createElement('div');
            controls.className = 'rule-controls';

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-rule-btn';
            removeBtn.textContent = chrome.i18n.getMessage('removeButton');
            removeBtn.onclick = () => this.handleWhitelistChange(domain, false);

            controls.appendChild(removeBtn);
            header.appendChild(text);
            header.appendChild(controls);
            item.appendChild(header);
            container.appendChild(item);
        });
    }

    async handleAddCustomRule() {
        const domain = this.domElements.ruleDomainInput?.value.trim().toLowerCase();
        const param = this.domElements.ruleParamInput?.value.trim();
        
        if (!domain || !param) return;
        
        const domainRegex = /^[a-z0-9\u00A1-\uFFFF]+([\-\.]{1}[a-z0-9\u00A1-\uFFFF]+)*\.[a-z\u00A1-\uFFFF]{2,}$/;
        if (!domainRegex.test(domain)) {
            alert(chrome.i18n.getMessage('errorMessages_invalidDomain'));
            return;
        }
        
        try {
            const unicodeDomain = punycode.toUnicode(domain);
            // Store expanded states before updating
            const expandedStates = this.getExpandedStates();
            
            await chrome.runtime.sendMessage({
                action: 'addCustomRule',
                domain: unicodeDomain,
                param
            });
            
            this.domElements.ruleDomainInput.value = '';
            this.domElements.ruleParamInput.value = '';
            
            const { customRules = [] } = await chrome.storage.local.get('customRules');
            this.state.customRules = customRules;
            
            // Restore expanded states after rendering
            this.renderCustomRules();
            this.restoreExpandedStates(expandedStates);
        } catch (error) {
            alert(error.message || 'Failed to add custom rule');
            console.error('Failed to add custom rule:', error);
        }
    }

    async handleRemoveCustomRule(domain) {
        try {
            const unicodeDomain = punycode.toUnicode(domain);
            await chrome.runtime.sendMessage({
                action: 'removeCustomRule',
                domain: unicodeDomain
            });
            
            const { customRules = [] } = await chrome.storage.local.get('customRules');
            this.state.customRules = customRules;
            this.renderCustomRules();
        } catch (error) {
            console.error('Failed to remove custom rule:', error);
        }
    }

    renderCustomRules(searchTerm = '') {
        if (!this.domElements.rulesContainer) return;

        const container = this.domElements.rulesContainer;
        container.innerHTML = '';

        const filteredRules = searchTerm
            ? this.state.customRules.filter(rule =>
                rule.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (Array.isArray(rule.params) 
                    ? rule.params.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
                    : (rule.param && rule.param.toLowerCase().includes(searchTerm.toLowerCase())))
            )
            : this.state.customRules;

        if (filteredRules.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = searchTerm
                ? chrome.i18n.getMessage('noRulesFound', [searchTerm])
                : chrome.i18n.getMessage('noRulesDefined');
            container.appendChild(noResults);
            return;
        }

        filteredRules.forEach(rule => {
            const item = document.createElement('div');
            item.className = 'domain-item';

            const header = document.createElement('div');
            header.className = 'domain-header';

            const leftSection = document.createElement('div');
            leftSection.className = 'domain-left';

            const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            arrow.setAttribute('viewBox', '0 0 24 24');
            arrow.setAttribute('width', '24');
            arrow.setAttribute('height', '24');
            arrow.setAttribute('class', 'dropdown-arrow');
            arrow.innerHTML = `<path fill="currentColor" d="M7 10l5 5 5-5H7z"/>`;

            const domainText = document.createElement('span');
            domainText.className = 'domain-text';
            domainText.textContent = punycode.toASCII(rule.domain);

            leftSection.appendChild(arrow);
            leftSection.appendChild(domainText);

            const ruleControls = document.createElement('div');
            ruleControls.className = 'rule-controls';

            const addParamBtn = document.createElement('button');
            addParamBtn.className = 'add-param-btn';
            addParamBtn.innerHTML = '+';
            addParamBtn.title = chrome.i18n.getMessage('addParameterButton');
            addParamBtn.onclick = (e) => {
                e.stopPropagation();
                this.addParameter(rule.domain);
            };

            const removeRuleBtn = document.createElement('button');
            removeRuleBtn.className = 'remove-rule-btn';
            removeRuleBtn.textContent = chrome.i18n.getMessage('removerule');
            removeRuleBtn.onclick = (e) => {
                e.stopPropagation();
                this.handleRemoveCustomRule(rule.domain);
            };

            ruleControls.appendChild(addParamBtn);
            ruleControls.appendChild(removeRuleBtn);

            header.appendChild(leftSection);
            header.appendChild(ruleControls);

            const content = document.createElement('div');
            content.className = 'domain-content';

            const paramsContainer = document.createElement('div');
            paramsContainer.className = 'params-container';

            const params = rule.params || [rule.param];
            params.forEach(param => {
                const paramTag = document.createElement('div');
                paramTag.className = 'param-tag';

                const paramText = document.createElement('span');
                paramText.textContent = param;

                const paramControls = document.createElement('div');
                paramControls.className = 'param-controls';

                const editBtn = document.createElement('button');
                editBtn.className = 'edit-param-btn';
                editBtn.textContent = chrome.i18n.getMessage('editButton');
                editBtn.title = chrome.i18n.getMessage('editParameter');
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.editParameter(rule.domain, param, paramTag);
                };

                const removeParamBtn = document.createElement('button');
                removeParamBtn.className = 'edit-param-btn';
                removeParamBtn.textContent = chrome.i18n.getMessage('removeparameter');
                removeParamBtn.title = chrome.i18n.getMessage('removeParameter');
                removeParamBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.removeParameter(rule.domain, param);
                };

                paramControls.appendChild(editBtn);
                paramControls.appendChild(removeParamBtn);

                paramTag.appendChild(paramText);
                paramTag.appendChild(paramControls);
                paramsContainer.appendChild(paramTag);
            });

            content.appendChild(paramsContainer);
            item.appendChild(header);
            item.appendChild(content);

            // Add click handler for dropdown
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.edit-param-btn') && 
                    !e.target.closest('.remove-rule-btn') && 
                    !e.target.closest('.add-param-btn')) {
                    content.classList.toggle('expanded');
                    if (content.classList.contains('expanded')) {
                        arrow.setAttribute('class', 'dropdown-arrow expanded');
                    } else {
                        arrow.setAttribute('class', 'dropdown-arrow');
                    }
                }
            });

            container.appendChild(item);
        });
    }

    async editParameter(domain, oldParam, paramTag) {
        const paramText = paramTag.querySelector('span');
        if (!paramText) return; // Guard against missing span element
    
        const inputContainer = document.createElement('div');
        inputContainer.className = 'param-edit-container';
    
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'param-edit-input';
        input.value = oldParam;
    
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'confirm-btn';
        confirmBtn.textContent = chrome.i18n.getMessage('confirmButton');
    
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = chrome.i18n.getMessage('cancelButton');
    
        inputContainer.appendChild(input);
        inputContainer.appendChild(confirmBtn);
        inputContainer.appendChild(cancelBtn);
    
        // Add gap between buttons
        confirmBtn.style.marginRight = '8px';
    
        const handleEdit = async () => {
            const newParam = input.value.trim();
            if (newParam && newParam !== oldParam) {
                try {
                    const expandedStates = this.getExpandedStates();
                    
                    await chrome.runtime.sendMessage({
                        action: 'editCustomRuleParam',
                        domain,
                        oldParam,
                        newParam
                    });
                    
                    const { customRules = [] } = await chrome.storage.local.get('customRules');
                    this.state.customRules = customRules;
                    this.renderCustomRules();
                    this.restoreExpandedStates(expandedStates);
                } catch (error) {
                    alert(error.message || 'Failed to edit parameter');
                }
            } else {
                handleCancel();
            }
            inputContainer.remove();
        };
    
        const handleCancel = () => {
            if (inputContainer.parentNode) {
                inputContainer.parentNode.replaceChild(paramText, inputContainer);
            }
        };
    
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleEdit();
            }
        });
    
        confirmBtn.addEventListener('click', handleEdit);
        cancelBtn.addEventListener('click', handleCancel);
    
        // Replace the text with input
        if (paramText.parentNode) {
            paramText.parentNode.replaceChild(inputContainer, paramText);
            input.focus();
            input.select();
        }
    
        // Prevent dropdown from collapsing when input or buttons are clicked
        inputContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    async addParameter(domain) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'param-edit-container';
    
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'param-edit-input new-param';
        input.placeholder = chrome.i18n.getMessage('newParameterPlaceholder');
    
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'confirm-btn';
        confirmBtn.textContent = chrome.i18n.getMessage('confirmButton');
    
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel-btn';
        cancelBtn.textContent = chrome.i18n.getMessage('cancelButton');
    
        inputContainer.appendChild(input);
        inputContainer.appendChild(confirmBtn);
        inputContainer.appendChild(cancelBtn);
    
        // Add gap between buttons
        confirmBtn.style.marginRight = '8px';
    
        const handleAdd = async () => {
            const param = input.value.trim();
            if (param) {
                try {
                    const expandedStates = this.getExpandedStates();
                    
                    await chrome.runtime.sendMessage({
                        action: 'addCustomRuleParam',
                        domain,
                        param
                    });
                    
                    const { customRules = [] } = await chrome.storage.local.get('customRules');
                    this.state.customRules = customRules;
                    this.renderCustomRules();
                    this.restoreExpandedStates(expandedStates);
                } catch (error) {
                    alert(error.message || 'Failed to add parameter');
                }
            } else {
                handleCancel();
            }
            inputContainer.remove();
        };
    
        const handleCancel = () => {
            if (inputContainer.parentNode) {
                inputContainer.remove();
            }
        };
    
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleAdd();
            }
        });
    
        confirmBtn.addEventListener('click', handleAdd);
        cancelBtn.addEventListener('click', handleCancel);
    
        // Prevent dropdown from collapsing when input or buttons are clicked
        inputContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    
        // Find the correct container by looking up from the clicked button
        const domainItem = document.querySelector(`.domain-item:has([data-domain="${domain}"])`);
        if (!domainItem) {
            // Fallback to finding domain item by text content
            const allDomainItems = document.querySelectorAll('.domain-item');
            for (const item of allDomainItems) {
                if (item.querySelector('.domain-text')?.textContent === domain) {
                    const paramsContainer = item.querySelector('.params-container');
                    if (paramsContainer) {
                        paramsContainer.appendChild(inputContainer);
                        input.focus();
                        input.select();
                        // Automatically expand the dropdown
                        const content = item.querySelector('.domain-content');
                        const arrow = item.querySelector('.dropdown-arrow');
                        content?.classList.add('expanded');
                        arrow?.setAttribute('class', 'dropdown-arrow expanded');
                        return;
                    }
                }
            }
        } else {
            const paramsContainer = domainItem.querySelector('.params-container');
            if (paramsContainer) {
                paramsContainer.appendChild(inputContainer);
                input.focus();
                input.select();
                // Automatically expand the dropdown
                const content = domainItem.querySelector('.domain-content');
                const arrow = domainItem.querySelector('.dropdown-arrow');
                content?.classList.add('expanded');
                arrow?.setAttribute('class', 'dropdown-arrow expanded');
                return;
            }
        }
    
        // If we get here, we couldn't find the container
        console.error('Could not find params container for domain:', domain);
    }
    
    async removeParameter(domain, param) {
        if (confirm(chrome.i18n.getMessage('confirmationMessages_removeParameter', [param, domain]))) {
            try {
                // Store expanded states before updating
                const expandedStates = this.getExpandedStates();
                
                await chrome.runtime.sendMessage({
                    action: 'removeCustomRuleParam',
                    domain,
                    param
                });
                
                // Refresh and restore expanded states
                const { customRules = [] } = await chrome.storage.local.get('customRules');
                this.state.customRules = customRules;
                this.renderCustomRules();
                this.restoreExpandedStates(expandedStates);
            } catch (error) {
                alert(chrome.i18n.getMessage('errorMessages_removingParameter'));
            }
        }
    }

    async toggleHistoryApiProtection() {
        this.state.historyApiProtection = !this.state.historyApiProtection;
        await chrome.storage.local.set({ historyApiProtection: this.state.historyApiProtection });
        this.updateUI();
    }

    async togglePreventGoogleandyandexscript() {
        try {
            const newStatus = !this.state.PreventGoogleandyandexscript;
            
            await chrome.storage.local.set({
                PreventGoogleandyandexscript: newStatus
            });
            
            this.state.PreventGoogleandyandexscript = newStatus;
            this.updatePreventGoogleandyandexscriptToggleUI();
            
        } catch (error) {
            console.error('Failed to toggle Prevent Google and Yandex script:', error);
        }
    }

    // Add these new helper methods
    getExpandedStates() {
        const states = new Map();
        document.querySelectorAll('.domain-item').forEach(item => {
            const domain = item.querySelector('.domain-text')?.textContent;
            const isExpanded = item.querySelector('.domain-content.expanded') !== null;
            if (domain) {
                states.set(domain, isExpanded);
            }
        });
        return states;
    }

    restoreExpandedStates(states) {
        states.forEach((isExpanded, domain) => {
            if (isExpanded) {
                const domainItem = Array.from(document.querySelectorAll('.domain-item'))
                    .find(item => item.querySelector('.domain-text')?.textContent === domain);
                if (domainItem) {
                    const content = domainItem.querySelector('.domain-content');
                    const arrow = domainItem.querySelector('.dropdown-arrow');
                    content?.classList.add('expanded');
                    arrow?.setAttribute('class', 'dropdown-arrow expanded');
                }
            }
        });
    }

    async updatedynamicurrentbutton() {
        const domain = await this.getCurrentTabDomain();
        if (!domain || !this.domElements.addCurrentButton) {
            if (this.domElements.addCurrentButton) {
                this.domElements.addCurrentButton.style.display = 'none';
            }
            return;
        }
        
        const isWhitelisted = this.state.whitelist.includes(domain);
        if (this.domElements.addCurrentButton) {
            this.domElements.addCurrentButton.textContent = isWhitelisted ? 
                `Remove ${punycode.toASCII(domain)} from Whitelist` : `Add ${punycode.toASCII(domain)} to Whitelist`;
            this.domElements.addCurrentButton.style.display = 'block';
        }
    }

    async updateDynamicWhitelistButton() {
        const domain = await this.getCurrentTabDomain();
        if (!domain || !this.domElements.dynamicWhitelistButton) {
            if (this.domElements.dynamicWhitelistButton) {
                this.domElements.dynamicWhitelistButton.style.display = 'none';
            }
            return;
        }
        
        const isWhitelisted = this.state.whitelist.includes(domain);
        if (this.domElements.dynamicWhitelistButton) {
            this.domElements.dynamicWhitelistButton.textContent = isWhitelisted ? 
                `Remove ${punycode.toASCII(domain)} from Whitelist` : `Add ${punycode.toASCII(domain)} to Whitelist`;
            this.domElements.dynamicWhitelistButton.style.display = 'block';
        }
    }

    setupNavigation() {
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and sections
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.section-content').forEach(section => {
                    section.classList.remove('active');
                });

                // Add active class to clicked tab and corresponding section
                tab.classList.add('active');
                const sectionId = `${tab.dataset.tab}Section`;
                document.getElementById(sectionId)?.classList.add('active');
            });
        });
    }

    async setupAboutSection() {
        try {
            const manifest = chrome.runtime.getManifest();
            const updateUrl = manifest.update_url || '';
            const aboutSourceSpan = document.getElementById('aboutSource');
            const aboutDetailsSpan = document.getElementById('aboutDetails');
            const versionSpan = document.getElementById('aboutVersion'); // Add this line
            const githubLink = document.getElementById('githubLink'); // Add this line
            const officialSiteLink = document.getElementById('officialSiteLink'); // Add this line
            const chromeWebStoreLink = document.getElementById('chromeWebStoreLink'); // Add this line

            if (updateUrl.includes('github')) {
                aboutSourceSpan.textContent = chrome.i18n.getMessage('aboutSourceGithub');
                aboutDetailsSpan.textContent = chrome.i18n.getMessage('aboutDetailsGithub');
            } else if (updateUrl.includes('google')) {
                aboutSourceSpan.textContent = chrome.i18n.getMessage('aboutSourceChrome');
                aboutDetailsSpan.textContent = chrome.i18n.getMessage('aboutDetailsChrome');
            } else {
                aboutSourceSpan.textContent = chrome.i18n.getMessage('aboutSourceUnknown');
                aboutDetailsSpan.textContent = chrome.i18n.getMessage('aboutDetailsUnknown');
            }

            if (versionSpan && manifest.version) { // Add this block
                versionSpan.textContent = `Version ${manifest.version}`;
            }

            if (githubLink) { // Add this block
                githubLink.href = 'https://github.com/Linkumori';
            }

            if (officialSiteLink) { // Add this block
                officialSiteLink.href = 'https://linkumori.com/';
            }

            if (chromeWebStoreLink) { // Add this block
                chromeWebStoreLink.href = 'https://chromewebstore.google.com/detail/linkumori-urls-cleaner/kcpfnbjlimolkcjllfooaipdpdjmjigg';
                chromeWebStoreLink.textContent = chrome.i18n.getMessage('chromeWebStoreLinkText') || 'Chrome Web Store';
            }

            const versionSourceLabel = document.querySelector('.version-source-label');
            if (versionSourceLabel) {
                versionSourceLabel.textContent = chrome.i18n.getMessage('versionLabel');
            }

            // Update repository and related buttons
        } catch (error) {
            console.error('Failed to setup about section:', error);
        }
    }

    
    setupUpdateChecker() {
        const updateButton = document.getElementById('checkUpdateButton');
        const updateContainer = document.getElementById('updateContainer');
        
        if (!updateButton || !updateContainer) return;
        
        let updateAvailable = false;
        
        updateButton.addEventListener('click', () => {
            if (updateAvailable) {
                updateButton.textContent = chrome.i18n.getMessage("applying_update");
                updateContainer.classList.add('updating');
                setTimeout(() => {
                    chrome.runtime.reload();
                }, 1000);
                return;
            }
    
            updateButton.textContent = chrome.i18n.getMessage("checking_update");
            updateButton.disabled = true;
            
            chrome.runtime.requestUpdateCheck((status, details) => {
                updateButton.disabled = false;
                
                if (status === "update_available") {
                    updateButton.textContent = chrome.i18n.getMessage("apply_update");
                    updateContainer.classList.add('update-available');
                    updateAvailable = true;
                }
                else if (status === "no_update") {
                    updateButton.textContent = chrome.i18n.getMessage("no_update");
                    updateContainer.classList.remove('update-available');
                    updateAvailable = false;
                }
                else if (status === "throttled") {
                    updateButton.textContent = chrome.i18n.getMessage("throttled");
                    updateContainer.classList.remove('update-available');
                    updateAvailable = false;
                }
            });
        });
    }
}

// Theme handling
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    
    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    chrome.storage.local.get(['theme'], (result) => {
        const savedTheme = result.theme || getSystemTheme();
        document.documentElement.setAttribute('data-theme', savedTheme);
    });
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        chrome.storage.local.get(['theme'], (result) => {
            if (!result.theme) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
            }
        });
    });

    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        chrome.storage.local.set({ theme: newTheme });
    });
});

// Advanced tools button handler
const advancedToolsBtn = document.getElementById('advancedTools');
if (advancedToolsBtn) {
    advancedToolsBtn.addEventListener('click', () => {
        chrome.tabs.create({
            url: 'panel/cleanurls-tools.html'
        });
    });
}
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.theme) {
        document.documentElement.setAttribute('data-theme', changes.theme.newValue);
    }
});
document.getElementById('repoLinkButton')?.addEventListener('click', () => {
    window.open('https://github.com/Linkumori/Linkumori-Extension/', '_blank');
});

document.getElementById('clipboardHelperButton')?.addEventListener('click', () => {
    window.open('https://github.com/mdn/webextensions-examples/blob/main/context-menu-copy-link-with-types/clipboard-helper.js', '_blank');
});
document.getElementById('adguardSourceButton')?.addEventListener('click', () => {
    window.open('https://github.com/AdguardTeam/AdguardFilters/blob/master/TrackParamFilter/sections/specific.txt', '_blank');
});

document.getElementById('fontAwesomeIconButton')?.addEventListener('click', () => {
    window.open('https://fontawesome.com/icons/screwdriver-wrench?f=classic&s=solid&pc=%23ffffff&sc=%23FFD43B%2F', '_blank');
});
document.getElementById('fontAwesomeIconButton1')?.addEventListener('click', () => {
    window.open('https://fontawesome.com/icons/screwdriver-wrench?f=classic&s=solid&pc=%23334155&sc=%23FFD43B%2F', '_blank');
});
document.getElementById('cog-dark.svg')?.addEventListener('click', () => {
    window.open('https://fontawesome.com/v5/icons/cog?f=classic&s=solid&sz=lg&pc=%23ffffff&sc=%23ffffff', '_blank');
});

document.getElementById('cog-light.svg')?.addEventListener('click', () => {
    window.open('https://fontawesome.com/v5/icons/cog?f=classic&s=solid&sz=lg&pc=%23334155&sc=%23334155', '_blank');
});
document.getElementById('sun.svg')?.addEventListener('click', () => {
    window.open('https://github.com/feathericons/feather/blob/main/icons/sun.svg', '_blank');
});
document.getElementById('moon.svg')?.addEventListener('click', () => {
    window.open('https://github.com/feathericons/feather/blob/main/icons/moon.svg', '_blank');
});

// Initialize the controller
const controller = new OptionsMenuController();
