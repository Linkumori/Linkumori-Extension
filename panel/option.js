/*
Linkumori(URLs Purifier)
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
*/

import { readPurifyUrlsSettings, setDefaultSettings } from '../common/utils.js';
import { defaultSettings, SETTINGS_KEY, CANT_FIND_SETTINGS_MSG } from '../common/constants.js';

class OptionsMenuController {
    constructor() {
        this.state = {
            isEnabled: false,
            historyApiProtection: false,
            blockHyperlinkAuditing: false,
            whitelist: [],
            updateBadgeOnOff: false,
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
        };

        this.exportWhitelist = this.exportWhitelist.bind(this);
        this.importWhitelist = this.importWhitelist.bind(this);

        this.init();
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
            whitelistContainer: document.getElementById('whitelistContainer'),
            domainInput: document.getElementById('domainInput'),
            searchInput: document.getElementById('searchDomain'),
            addCurrentButton: document.getElementById('addCurrentDomain'),
            badgeOnOffToggle: document.querySelector('#updateBadgeOnOff .toggle-switch'),
            badgeOnOffLabel: document.querySelector('#updateBadgeOnOff .toggle-label'),
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        const exportBtn = document.getElementById('exportWhitelist');
        const importBtn = document.getElementById('importWhitelist');

        exportBtn?.addEventListener('click', this.exportWhitelist);
        importBtn?.addEventListener('click', this.importWhitelist);

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
        this.domElements.domainInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddDomain();
            }
        });
        this.domElements.addCurrentButton?.addEventListener('click', () => this.handlecurrentbutton());
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
            } = await chrome.storage.local.get({
                whitelist: [], 
                enabled: false,
                historyApiProtection: false,
                updateHyperlinkAuditing: false,
                updateBadgeOnOff: false,
            });

            this.state = {
                ...this.state,
                isEnabled: settings[SETTINGS_KEY].status,
                historyApiProtection,
                blockHyperlinkAuditing: updateHyperlinkAuditing,
                whitelist,
                updateBadgeOnOff,
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
                        reject(new Error('No file selected'));
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
                alert('Whitelist imported successfully!');
            }
        } catch (error) {
            console.error('Failed to import whitelist:', error);
            alert('Failed to import whitelist: ' + error.message);
        }
    }
     
    async confirmImport(count) {
        return confirm(`This will add ${count} entries to your current whitelist. Continue?`);
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
    
    

   
        
    
    
    async handleAddDomain() {
        const domain = this.domElements.domainInput?.value.trim().toLowerCase();
        
        if (!domain) return;
        
        const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
        if (!domainRegex.test(domain)) {
            alert('Please enter a valid domain (e.g., example.com)');
            return;
        }
        
        try {
            if (!this.state.whitelist.includes(domain)) {
                await this.handleWhitelistChange(domain, true);
            } else {
                alert('Domain is already in the whitelist');
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
            let newWhitelist;
            if (shouldAdd) {
                newWhitelist = [...this.state.whitelist, domain];
            } else {
                newWhitelist = this.state.whitelist.filter(d => d !== domain);
            }
            
            await chrome.storage.local.set({ whitelist: newWhitelist });
            this.state.whitelist = newWhitelist;
            this.renderWhitelist();
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



    updateUI() {
        this.updateToggleUI();
        this.updateHistoryApiToggleUI();
        this.updateHyperlinkAuditingToggleUI();
        this.updateBadgeOnOffToggleUI();
        this.renderWhitelist();
    }

    updateToggleUI() {
        if (!this.domElements.toggleSwitch || !this.domElements.toggleLabel) {
            return;
        }
        
        if (this.state.isEnabled) {
            this.domElements.toggleSwitch.classList.add('active');
            this.domElements.toggleLabel.textContent = 'Extension status: On with Network level protection';
        } else {
            this.domElements.toggleSwitch.classList.remove('active');
            this.domElements.toggleLabel.textContent = 'Extension status: Off';
        }
    }

    updateBadgeOnOffToggleUI() {
        if (!this.domElements.badgeOnOffToggle || !this.domElements.badgeOnOffLabel) {
            return;
        }
        
        if (this.state.updateBadgeOnOff) {
            this.domElements.badgeOnOffToggle.classList.add('active');
        } else {
            this.domElements.badgeOnOffToggle.classList.remove('active');
        }

        if (!this.state.isEnabled) {
            this.domElements.badgeOnOffLabel.textContent = this.state.updateBadgeOnOff ? 
                'Badge: (Inactive)' : 
                'Badge: Off';
        } else {
            this.domElements.badgeOnOffLabel.textContent = this.state.updateBadgeOnOff ?
                'Badge: On' :
                'Badge: Off';
        }
    }

    updateHistoryApiToggleUI() {
        if (!this.domElements.historyApiToggle || !this.domElements.historyApiLabel) {
            return;
        }
        
        if (this.state.historyApiProtection) {
            this.domElements.historyApiToggle.classList.add('active');
        } else {
            this.domElements.historyApiToggle.classList.remove('active');
        }

        if (!this.state.isEnabled) {
            this.domElements.historyApiLabel.textContent = this.state.historyApiProtection ? 
                'History API Protection: (Inactive)' : 
                'History API Protection: Off';
        } else {
            this.domElements.historyApiLabel.textContent = this.state.historyApiProtection ?
                'History API Protection: On' : 
                'History API Protection: Off';
        }
    }

    updateHyperlinkAuditingToggleUI() {
        if (!this.domElements.hyperlinkAuditingToggle || !this.domElements.hyperlinkAuditingLabel) {
            return;
        }
        
        if (this.state.blockHyperlinkAuditing) {
            this.domElements.hyperlinkAuditingToggle.classList.add('active');
        } else {
            this.domElements.hyperlinkAuditingToggle.classList.remove('active');
        }

        if (!this.state.isEnabled) {
            this.domElements.hyperlinkAuditingLabel.textContent = this.state.blockHyperlinkAuditing ?
                'Block Hyperlink Auditing: (Inactive)' :
                'Block Hyperlink Auditing: Off';
        } else {
            this.domElements.hyperlinkAuditingLabel.textContent = this.state.blockHyperlinkAuditing ?
                'Block Hyperlink Auditing: On' :
                'Block Hyperlink Auditing: Off';
        }
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
                ? `No domains found matching "${searchTerm}"`
                : 'No domains in whitelist';
            container.appendChild(noResults);
            return;
        }

        filteredDomains.forEach(domain => {
            const item = document.createElement('div');
            item.className = 'domain-item';

            const text = document.createElement('span');
            text.textContent = domain;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.onclick = () => this.handleWhitelistChange(domain, false);

            item.appendChild(text);
            item.appendChild(removeBtn);
            container.appendChild(item);
        });
    }

    async toggleHistoryApiProtection() {
        this.state.historyApiProtection = !this.state.historyApiProtection;
        await chrome.storage.local.set({ historyApiProtection: this.state.historyApiProtection });
        this.updateUI();
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
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.theme) {
        document.documentElement.setAttribute('data-theme', changes.theme.newValue);
    }
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
// Initialize the controller
const controller = new OptionsMenuController();