// Main Application Logic
import { FileExplorer } from './fileExplorer.js';
import { TabManager } from './tabManager.js';
import { ContentManager } from './contentManager.js';
import { AnimationController } from './animations.js';
import { ThemeSwitcher } from './themeSwitcher.js';
import { SyntaxHighlighter } from './syntaxHighlighter.js';

// Import Prism CSS

// Import content
import { aboutContent } from '../content/about.js';
import { projectsContent } from '../content/projects.js';
import { skillsContent } from '../content/skills.js';
import { experienceContent } from '../content/experience.js';
import { contactContent } from '../content/contact.js';

// Make content available globally
window.aboutContent = aboutContent;
window.projectsContent = projectsContent;
window.skillsContent = skillsContent;
window.experienceContent = experienceContent;
window.contactContent = contactContent;

class PortfolioApp {
    constructor() {
        this.fileExplorer = null;
        this.tabManager = null;
        this.contentManager = null;
        this.animationController = null;
        this.themeSwitcher = null;
        this.syntaxHighlighter = null;
        this.commandPalette = null;
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        // Initialize components
        this.contentManager = new ContentManager();
        this.tabManager = new TabManager();
        this.fileExplorer = new FileExplorer();
        this.animationController = new AnimationController();
        this.themeSwitcher = new ThemeSwitcher();
        this.syntaxHighlighter = new SyntaxHighlighter();
        
        // Make managers globally accessible
        window.fileExplorer = this.fileExplorer;
        window.tabManager = this.tabManager;
        window.contentManager = this.contentManager;
        window.animationController = this.animationController;
        window.themeSwitcher = this.themeSwitcher;
        window.syntaxHighlighter = this.syntaxHighlighter;
        
        // Setup event listeners
        this.setupKeyboardShortcuts();
        this.setupActivityBar();
        this.setupCommandPalette();
        this.setupMobileMenu();
        this.setupContactForm();
        
        // Show welcome screen
        this.contentManager.showWelcomeScreen();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Treat Ctrl (Windows/Linux) and Meta/Cmd (macOS) equivalently
            const cmdOrCtrl = e.ctrlKey || e.metaKey;
            const key = (e.key || '').toLowerCase();

            // Cmd/Ctrl + P - Command Palette
            if (cmdOrCtrl && key === 'p') {
                e.preventDefault();
                this.toggleCommandPalette();
            }

            // Cmd/Ctrl + B - Toggle Sidebar
            if (cmdOrCtrl && key === 'b') {
                e.preventDefault();
                this.toggleSidebar();
            }

            // Escape - Close Command Palette
            if (key === 'escape' || e.key === 'Escape') {
                this.closeCommandPalette();
            }
        });
    }
    
    setupActivityBar() {
        const activityIcons = document.querySelectorAll('.activity-icon');
        
        activityIcons.forEach(icon => {
            icon.addEventListener('click', () => {
                // Remove active class from all icons
                activityIcons.forEach(i => i.classList.remove('active'));
                
                // Add active class to clicked icon
                icon.classList.add('active');
                
                const view = icon.dataset.view;
                this.handleActivityView(view);
            });
        });
    }
    
    handleActivityView(view) {
        switch(view) {
            case 'explorer':
                // Show file explorer (already visible)
                break;
            case 'search':
                // Implement search functionality
                break;
            case 'git':
                // Implement git view
                break;
            case 'extensions':
                // Implement extensions view
                break;
            case 'settings':
                // Implement settings
                break;
        }
    }
    
    setupCommandPalette() {
        this.commandPalette = document.getElementById('commandPalette');
        const paletteInput = document.getElementById('paletteInput');
        const paletteResults = document.getElementById('paletteResults');
        
        // Start fully hidden to avoid layout/pointer issues
        if (this.commandPalette && !this.commandPalette.classList.contains('hidden')) {
            this.commandPalette.classList.add('hidden');
        }

        if (paletteInput) {
            paletteInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                this.filterFiles(query, paletteResults);
            });
            
            paletteInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const selectedItem = paletteResults.querySelector('.palette-item.selected');
                    if (selectedItem) {
                        selectedItem.click();
                    }
                }
            });
        }
    }
    
    filterFiles(query, resultsContainer) {
        if (!query) {
            resultsContainer.innerHTML = '';
            return;
        }
        
        const allFiles = this.fileExplorer.getAllFiles();
        const filtered = allFiles.filter(file => 
            file.name.toLowerCase().includes(query)
        );
        
        resultsContainer.innerHTML = '';
        
        filtered.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'palette-item';
            if (index === 0) item.classList.add('selected');
            
            const icon = this.tabManager.getIconForLanguage(file.language);
            const iconColor = this.tabManager.getIconColorForLanguage(file.language);
            
            item.innerHTML = `
                <i class="codicon ${icon} ${iconColor}"></i>
                <span>${file.path || file.name}</span>
            `;
            
            item.addEventListener('click', () => {
                this.tabManager.openTab({
                    id: file.contentId,
                    label: file.name,
                    language: file.language,
                    contentId: file.contentId,
                    url: file.url || null
                });
                this.contentManager.loadContent(file.contentId, file.language);
                this.closeCommandPalette();
            });
            
            resultsContainer.appendChild(item);
        });
    }
    
    toggleCommandPalette() {
        if (this.commandPalette.classList.contains('active')) {
            this.closeCommandPalette();
        } else {
            this.openCommandPalette();
        }
    }
    
    openCommandPalette() {
        // Show and then activate for transition
        this.commandPalette.classList.remove('hidden');
        requestAnimationFrame(() => {
            this.commandPalette.classList.add('active');
        });
        const input = document.getElementById('paletteInput');
        const results = document.getElementById('paletteResults');
        if (input) {
            const focusAndSelect = () => {
                input.setAttribute('autofocus', '');
                input.focus({ preventScroll: true });
                input.select();
                try { input.setSelectionRange(0, input.value.length); } catch {}
            };

            // Try immediately
            focusAndSelect();
            // Try on next frame
            requestAnimationFrame(focusAndSelect);
            // Try on next macrotask
            setTimeout(focusAndSelect, 0);
            // Try after transition completes (most reliable when CSS animates in)
            const onTransitionEnd = () => {
                focusAndSelect();
                this.commandPalette.removeEventListener('transitionend', onTransitionEnd, true);
            };
            this.commandPalette.addEventListener('transitionend', onTransitionEnd, true);
            // Final fallback after a short delay
            setTimeout(focusAndSelect, 200);

            // Populate results based on current query if any
            if (results) {
                const q = (input.value || '').toLowerCase();
                this.filterFiles(q, results);
            }
        } else if (results) {
            results.innerHTML = '';
        }
    }
    
    closeCommandPalette() {
        // Deactivate with transition then fully hide
        this.commandPalette.classList.remove('active');
        const hideDelay = 260; // sync with var(--transition-normal)
        setTimeout(() => {
            this.commandPalette.classList.add('hidden');
        }, hideDelay);
        const input = document.getElementById('paletteInput');
        if (input) {
            input.value = '';
            input.blur();
            input.removeAttribute('autofocus');
        }
        // Return focus to main editor area for seamless typing/navigation
        const editor = document.getElementById('editor');
        if (editor) editor.focus({ preventScroll: true });
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const container = document.querySelector('.vscode-container');
        if (!sidebar) return;

        const isCollapsed = sidebar.classList.contains('collapsed');

        if (isCollapsed) {
            // Opening: remove animation for instant reopen
            sidebar.classList.add('no-transition');
            sidebar.classList.remove('collapsed');
            if (container) container.classList.remove('sidebar-collapsed');
            // Force reflow to apply styles immediately
            void sidebar.offsetHeight;
            // Remove no-transition on next frame
            requestAnimationFrame(() => {
                sidebar.classList.remove('no-transition');
            });
        } else {
            // Closing: keep animation for a smooth hide
            sidebar.classList.remove('no-transition');
            sidebar.classList.add('collapsed');
            if (container) container.classList.add('sidebar-collapsed');
        }
    }
    
    setupMobileMenu() {
        // Create mobile menu toggle button if it doesn't exist
        const existingToggle = document.querySelector('.mobile-menu-toggle');
        if (!existingToggle && window.innerWidth <= 768) {
            const toggle = document.createElement('div');
            toggle.className = 'mobile-menu-toggle';
            toggle.innerHTML = '<i class="codicon codicon-menu"></i>';
            toggle.style.display = 'none';
            document.body.appendChild(toggle);
            
            const sidebar = document.getElementById('sidebar');
            const overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
            
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                overlay.classList.toggle('active');
            });
            
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            });
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const toggle = document.querySelector('.mobile-menu-toggle');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.querySelector('.sidebar-overlay');
            
            if (window.innerWidth <= 768) {
                if (toggle) toggle.style.display = 'flex';
            } else {
                if (toggle) toggle.style.display = 'none';
                if (sidebar) sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('active');
            }
        });
    }
    
    setupContactForm() {
        // Add form submission handler after content loads
        document.addEventListener('click', (e) => {
            if (e.target.closest('.form-button')) {
                e.preventDefault();
                this.handleContactFormSubmit();
            }
        });
    }
    
    handleContactFormSubmit() {
        const name = document.getElementById('name')?.value;
        const email = document.getElementById('email')?.value;
        const subject = document.getElementById('subject')?.value;
        const message = document.getElementById('message')?.value;
        
        if (name && email && subject && message) {
            // Show success message
            alert('Thank you for your message! I\'ll get back to you soon.');
            
            // Reset form
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('subject').value = '';
            document.getElementById('message').value = '';
        } else {
            alert('Please fill in all fields.');
        }
    }
}

// Initialize the application
const app = new PortfolioApp();
