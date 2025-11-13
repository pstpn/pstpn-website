// Tab Manager Component
export class TabManager {
    constructor() {
        this.tabs = [];
        this.activeTabId = null;
        this.tabBarElement = document.getElementById('tabBar');
        this.init();
    }
    
    init() {
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        // Handle tab clicks (switch and close)
        this.tabBarElement.addEventListener('click', (e) => {
            const tab = e.target.closest('.tab');
            if (!tab) return;
            
            const tabId = tab.dataset.tabId;
            
            // Close button clicked
            if (e.target.classList.contains('tab-close')) {
                e.stopPropagation();
                this.closeTab(tabId);
            } else {
                // Tab clicked - switch to it
                this.switchTab(tabId);
            }
        });
    }
    
    openTab(tabData) {
        // Check if tab already exists
        const existingTab = this.tabs.find(tab => tab.id === tabData.id);
        
        if (existingTab) {
            // Switch to existing tab
            this.switchTab(tabData.id);
        } else {
            // Create new tab
            this.createTab(tabData);
        }
    }
    
    createTab(tabData) {
        // Add tab to array
        this.tabs.push(tabData);
        
        // Create tab element
        const tab = document.createElement('div');
        tab.className = 'tab';
        tab.dataset.tabId = tabData.id;
        
        // Get icon based on language
        const icon = this.getIconForLanguage(tabData.language);
        const iconColor = this.getIconColorForLanguage(tabData.language);
        
        tab.innerHTML = `
            <i class="codicon ${icon} ${iconColor} tab-icon"></i>
            <span class="tab-label">${tabData.label}</span>
            <i class="codicon codicon-close tab-close"></i>
        `;
        
        this.tabBarElement.appendChild(tab);
        
        // Switch to new tab
        this.switchTab(tabData.id);
        
        // Attach close event
        const closeBtn = tab.querySelector('.tab-close');
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeTab(tabData.id);
        });
        
        // Attach click event
        tab.addEventListener('click', () => {
            this.switchTab(tabData.id);
        });
    }
    
    switchTab(tabId) {
        // Update active tab in array
        this.activeTabId = tabId;
        
        // Update UI
        document.querySelectorAll('.tab').forEach(tab => {
            if (tab.dataset.tabId === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Load content for this tab
        const tabData = this.tabs.find(tab => tab.id === tabId);
        if (tabData) {
            window.contentManager.loadContent(tabData.contentId, tabData.language);
            
            // Update status bar
            this.updateStatusBar(tabData);

            // Highlight corresponding file in the explorer (use contentId or label fallback)
            if (window.fileExplorer && typeof window.fileExplorer.highlightFileByContentId === 'function') {
                window.fileExplorer.highlightFileByContentId(tabData.contentId, tabData.label);
            }
        }
    }
    
    closeTab(tabId) {
        const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
        
        if (tabElement) {
            // Add closing animation
            tabElement.classList.add('closing');
            
            setTimeout(() => {
                // Remove from DOM
                tabElement.remove();
                
                // Remove from array
                this.tabs = this.tabs.filter(tab => tab.id !== tabId);
                
                // If closed tab was active, switch to another tab
                if (this.activeTabId === tabId) {
                    if (this.tabs.length > 0) {
                        // Switch to last tab
                        const lastTab = this.tabs[this.tabs.length - 1];
                        this.switchTab(lastTab.id);
                    } else {
                        // No tabs left, show welcome screen
                        this.activeTabId = null;
                        window.contentManager.showWelcomeScreen();
                        // Clear file selection in explorer
                        if (window.fileExplorer && typeof window.fileExplorer.clearSelection === 'function') {
                            window.fileExplorer.clearSelection();
                        }
                    }
                }
            }, 200);
        }
    }
    
    closeAllTabs() {
        this.tabs = [];
        this.activeTabId = null;
        this.tabBarElement.innerHTML = '';
        window.contentManager.showWelcomeScreen();
    }
    
    getActiveTab() {
        return this.tabs.find(tab => tab.id === this.activeTabId);
    }
    
    getIconForLanguage(language) {
        const icons = {
            'go': 'codicon-file-code',
            'python': 'codicon-file-code',
            'rust': 'codicon-file-code',
            'c': 'codicon-file-code',
            'pdf': 'codicon-file-pdf',
            'markdown': 'codicon-markdown',
            'json': 'codicon-json',
            'html': 'codicon-file-code',
            'css': 'codicon-file-code'
        };
        
        return icons[language] || 'codicon-file';
    }
    
    getIconColorForLanguage(language) {
        const colors = {
            'go': 'file-icon-go',
            'python': 'file-icon-python',
            'rust': 'file-icon-rust',
            'c': 'file-icon-c',
            'markdown': 'file-icon-md',
            'json': 'file-icon-json',
            'html': 'file-icon-html',
            'css': 'file-icon-css'
        };
        
        return colors[language] || '';
    }
    
    updateStatusBar(tabData) {
        const languageElement = document.getElementById('statusLanguage');
        const encodingElement = document.getElementById('statusEncoding');
        
        if (languageElement) {
            const languageNames = {
                'go': 'Go',
                'python': 'Python',
                'rust': 'Rust',
                'c': 'C',
                'pdf': 'PDF',
                'markdown': 'Markdown',
                'json': 'JSON',
                'html': 'HTML',
                'css': 'CSS'
            };
            
            languageElement.textContent = languageNames[tabData.language] || tabData.language;
        }
        
        if (encodingElement) {
            encodingElement.textContent = 'UTF-8';
        }
    }
    
    markTabAsModified(tabId, modified = true) {
        const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
        if (tabElement) {
            if (modified) {
                tabElement.classList.add('modified');
            } else {
                tabElement.classList.remove('modified');
            }
        }
    }
}
