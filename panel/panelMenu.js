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
import { readPurifyUrlsSettings, setDefaultSettings } from '../common/utils.js';
import { defaultSettings, SETTINGS_KEY, CANT_FIND_SETTINGS_MSG } from '../common/constants.js';
import punycode from '../lib/punycode.js';

// Add i18n helper function
function translateElement(element) {
    const messageKey = element.getAttribute('data-i18n');
    if (messageKey) {
        const translated = chrome.i18n.getMessage(messageKey);
        if (translated) {
            element.textContent = translated;
        }
    }
}

class PanelMenuController {
    constructor() {
        this.state = {
            isEnabled: false,
            historyApiProtection: false,
            blockHyperlinkAuditing: false, // Keep consistent with storage
            whitelist: [],
            activeTab: 'mainTab',
            updateBadgeOnOff: false
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
            mainContent: null,
            whitelistContent: null,
            licenseContent: null,
            addCurrentButton: null,
            dynamicWhitelistButton: null,
            tabs: {},
            badgeOnOffToggle: null,
            badgeOnOffLabel: null
        };

        // Bind methods
        this.exportWhitelist = this.exportWhitelist.bind(this);
        this.importWhitelist = this.importWhitelist.bind(this);
        
        this.init();
        this.initializeI18n();
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
        
        chrome.tabs.onActivated.addListener(() => this.updateAllDynamicButtons());
        chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
            if (changeInfo.status === 'complete') {
                this.updateAllDynamicButtons();
            }
        });
        
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
            whitelistContainer: document.getElementById('whitelistContainer'),
            domainInput: document.getElementById('domainInput'),
            mainContent: document.getElementById('mainContent'),
            whitelistContent: document.getElementById('whitelistContent'),
            licenseContent: document.getElementById('licenseContent'),
            addCurrentButton: document.getElementById('addCurrentDomain'),
            dynamicWhitelistButton: document.getElementById('singledynamicwhitelistunwhitelistbutton'),
            badgeOnOffToggle: document.querySelector('#updateBadgeOnOff .toggle-switch'),
            badgeOnOffLabel: document.querySelector('#updateBadgeOnOff .toggle-label'),
            tabs: {
                mainTab: document.getElementById('mainTab'),
                whitelistTab: document.getElementById('whitelistTab'),
                licenseTab: document.getElementById('licenseTab')
            }
        };
        const exportBtn = document.getElementById('exportWhitelist');
        const importBtn = document.getElementById('importWhitelist');

        if (exportBtn) {
            exportBtn.replaceWith(exportBtn.cloneNode(true));
            document.getElementById('exportWhitelist').addEventListener('click', this.exportWhitelist);
        }
        
        if (importBtn) {
            importBtn.replaceWith(importBtn.cloneNode(true));
            document.getElementById('importWhitelist').addEventListener('click', this.importWhitelist);
        }
        
        document.getElementById('toggleButton')?.addEventListener('click', 
            () => this.togglePurifyUrlsSettings());
        
        document.getElementById('newToggleButton')?.addEventListener('click',
            this.toggleHistoryApiProtection.bind(this));
            
        document.getElementById('blockHyperlinkAuditingToggle')?.addEventListener('click',
            () => this.toggleHyperlinkAuditing());

        document.getElementById('updateBadgeOnOff')?.addEventListener('click',
            () => this.toggleBadgeOnOff());
            
        document.getElementById('addDomain')?.addEventListener('click',
            () => this.handleAddDomain());

            this.domElements.domainInput?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleAddDomain();
                }
            });
            
            this.domElements.dynamicWhitelistButton?.addEventListener('click',
                () => this.handleDynamicWhitelistToggle());
                
            this.domElements.addCurrentButton?.addEventListener('click',
                () => this.handlecurrentbutton());
            
            Object.keys(this.domElements.tabs).forEach(tabId => {
                this.domElements.tabs[tabId]?.addEventListener('click', 
                    () => this.switchTab(tabId));
            });
            
            await this.updateAllDynamicButtons();

            // Set placeholder text using i18n
            if (this.domElements.domainInput) {
                this.domElements.domainInput.placeholder = chrome.i18n.getMessage('whitelistDomainPlaceholder');
            }
        }

        async loadInitialState() {
            try {
                const settings = await new Promise(resolve => 
                    readPurifyUrlsSettings(resolve));
                    
                if (!Object.hasOwn(settings, SETTINGS_KEY)) {
                    console.log(CANT_FIND_SETTINGS_MSG);
                     setDefaultSettings();
                    return;
                }
                
                const { 
                    whitelist = [], 
                    enabled = false,
                    historyApiProtection = false,
                    blockHyperlinkAuditing = false,
                    updateBadgeOnOff = false
                } = await chrome.storage.local.get({
                    whitelist: [], 
                    enabled: false,
                    historyApiProtection: false,
                    blockHyperlinkAuditing: false,
                    updateBadgeOnOff: false
                });
                
                this.state = {
                    ...this.state,
                    isEnabled: settings[SETTINGS_KEY].status,
                    historyApiProtection,
                    blockHyperlinkAuditing,
                    whitelist,
                    updateBadgeOnOff
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
    
            if (Object.hasOwn(changes, 'blockHyperlinkAuditing')) { // Keep consistent property name
                this.state.blockHyperlinkAuditing = changes.blockHyperlinkAuditing.newValue;
                this.updateHyperlinkAuditingToggleUI();
            }
            
            if (Object.hasOwn(changes, 'whitelist')) {
                this.state.whitelist = changes.whitelist.newValue;
                this.renderWhitelist();
                this.updateAllDynamicButtons();
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

    updateHistoryApiToggleUI() {
        if (!this.domElements.historyApiToggle || !this.domElements.historyApiLabel) {
            return;
        }
        
        if (!this.state.isEnabled) {
            if (this.state.historyApiProtection) {
                this.domElements.historyApiToggle.classList.add('active');
            } else {
                this.domElements.historyApiToggle.classList.remove('active');
            }
            this.domElements.historyApiLabel.textContent = chrome.i18n.getMessage('historyProtectionInactive');
            return;
        }
        
        if (this.state.historyApiProtection) {
            this.domElements.historyApiToggle.classList.add('active');
            this.domElements.historyApiLabel.textContent = chrome.i18n.getMessage('historyProtectionOn');
        } else {
            this.domElements.historyApiToggle.classList.remove('active');
            this.domElements.historyApiLabel.textContent = chrome.i18n.getMessage('historyProtectionOff');
        }
    }

    async toggleHyperlinkAuditing() {
        try {
            const newStatus = !this.state.blockHyperlinkAuditing;
            
            await chrome.storage.local.set({
                blockHyperlinkAuditing: newStatus // Keep consistent with storage
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
    
    async updateAllDynamicButtons() {
        await this.updateDynamicWhitelistButton();
        await this.addCurrentDomain();
    }
    
    async getCurrentTabDomain() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab?.url) return null;
            
            const specialProtocols = [
                'chrome://',
                'edge://',
                'chrome-extension://',
                'file:///'
            ];
            
            if (specialProtocols.some(protocol => tab.url.startsWith(protocol))) {
                return null;
            }
            
            const url = new URL(tab.url);
            return punycode.toUnicode(url.hostname.toLowerCase());
        } catch (error) {
            console.error('Failed to get current tab domain:', error);
            return null;
        }
    }

    async addCurrentDomain() {
        const domain = await this.getCurrentTabDomain();
        if (!domain || !this.domElements.addCurrentButton) {
            if (this.domElements.addCurrentButton) {
                this.domElements.addCurrentButton.style.display = 'none'; 
            }
            return;
        }
        
        const isWhitelisted = this.state.whitelist.includes(domain);
        if (this.domElements.addCurrentButton) {
            const messageId = isWhitelisted ? 'removeDomainFromWhitelist' : 'addDomainToWhitelist';
            const displayDomain = punycode.toUnicode(domain);
            this.domElements.addCurrentButton.textContent = chrome.i18n.getMessage(messageId, [displayDomain]);
            this.domElements.addCurrentButton.style.display = 'block';
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
            await this.updateAllDynamicButtons();
        } catch (error) {
            console.error('Failed to update whitelist:', error);
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
    async handleDynamicWhitelistToggle() {
        const domain = await this.getCurrentTabDomain();
        if (!domain) {
            alert(chrome.i18n.getMessage('errorMessages_getCurrentDomain'));
            return;
        }

        const unicodeDomain = punycode.toUnicode(domain);
        const isWhitelisted = this.state.whitelist.includes(unicodeDomain);
        await this.handleWhitelistChange(unicodeDomain, !isWhitelisted);
        this.updateDynamicWhitelistButton();
    }

    async handlecurrentbutton() {
        const domain = await this.getCurrentTabDomain();
        if (!domain) {
            alert(chrome.i18n.getMessage('errorMessages_getCurrentDomain'));
            return;
        }

        const unicodeDomain = punycode.toUnicode(domain);
        const isWhitelisted = this.state.whitelist.includes(unicodeDomain);
        await this.handleWhitelistChange(unicodeDomain, !isWhitelisted);
        this.addCurrentDomain();
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
            const messageId = isWhitelisted ? 'removeDomainFromWhitelist' : 'addDomainToWhitelist';
            const displayDomain = punycode.toASCII(domain); // Convert to ASCII for display
            this.domElements.dynamicWhitelistButton.textContent = chrome.i18n.getMessage(messageId, [displayDomain]);
            this.domElements.dynamicWhitelistButton.style.display = 'block';
        }
    }

    updateUI() {
        this.updateToggleUI();
        this.updateHistoryApiToggleUI();
        this.updateHyperlinkAuditingToggleUI();
        this.updateBadgeOnOffToggleUI();
        this.renderWhitelist();
        this.updateAllDynamicButtons();
        this.switchTab(this.state.activeTab);
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
     
        // Keep track of blockHyperlinkAuditing state
        this.domElements.hyperlinkAuditingToggle.classList.toggle('active', this.state.blockHyperlinkAuditing);
     
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
    
    switchTab(tabId) {
        this.state.activeTab = tabId;
        
        this.domElements.mainContent.style.display = 
            tabId === 'mainTab' ? 'flex' : 'none';
        this.domElements.whitelistContent.style.display = 
            tabId === 'whitelistTab' ? 'block' : 'none';
        this.domElements.licenseContent.style.display = 
            tabId === 'licenseTab' ? 'block' : 'none';
        
        Object.keys(this.domElements.tabs).forEach(key => {
            const tab = this.domElements.tabs[key];
            if (tab) {
                tab.classList.toggle('active', key === tabId);
            }
        });
    }
    
    renderWhitelist() {
        if (!this.domElements.whitelistContainer) return;
        
        const container = this.domElements.whitelistContainer;
        container.innerHTML = '';
        
        if (this.state.whitelist.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = chrome.i18n.getMessage('noDomainsWhitelisted');
            container.appendChild(emptyMessage);
            return;
        }
        
        this.state.whitelist.forEach(domain => {
            if (!domain) return; // Skip invalid domains
            
            const item = document.createElement('div');
            item.className = 'domain-item';
            
            const text = document.createElement('span');
            text.textContent = punycode.toASCII(domain);
            
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-rule-btn';
            removeButton.textContent = chrome.i18n.getMessage('removeButton');
            removeButton.onclick = () => this.handleWhitelistChange(domain, false);
            
            item.appendChild(text);
            item.appendChild(removeButton);
            container.appendChild(item);
        });
    }

    async toggleHistoryApiProtection() {
        this.state.historyApiProtection = !this.state.historyApiProtection;
        await chrome.storage.local.set({ historyApiProtection: this.state.historyApiProtection });
        this.updateUI();
    }

    initializeI18n() {
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(translateElement);
    }
}
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

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    
    // Function to get system color scheme
    const getSystemTheme = () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Check for saved theme preference or default to system preference
    chrome.storage.local.get(['theme'], (result) => {
        const savedTheme = result.theme || getSystemTheme();
        document.documentElement.setAttribute('data-theme', savedTheme);
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if there's no saved preference
        chrome.storage.local.get(['theme'], (result) => {
            if (!result.theme) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
            }
        });
    });

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        chrome.storage.local.set({ theme: newTheme });
    });
});

const advancedToolsBtn = document.getElementById('advancedTools');
if (advancedToolsBtn) {
    advancedToolsBtn.addEventListener('click', () => {
        // Open options.html in a new tab
        chrome.tabs.create({
            url: 'panel/cleanurls-tools.html'
        });
    });
}

const settingsBtn = document.getElementById('settings');
if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
        // Open options.html in a new tab
        chrome.tabs.create({
            url: 'panel/option.html'
        });
    });
}

// Initialize the controller
const controller = new PanelMenuController();
