// Theme Switcher Component
export class ThemeSwitcher {
    constructor() {
        this.themeButton = document.getElementById('themeButton');
        this.themeDropdown = document.getElementById('themeDropdown');
        this.currentThemeText = document.getElementById('currentTheme');
        this.currentTheme = localStorage.getItem('theme') || 'vscode-dark';
        
        this.themes = {
            'vscode-dark': 'VS Code Dark',
            'monokai': 'Monokai',
            'dracula': 'Dracula',
            'one-dark': 'One Dark',
            'solarized-dark': 'Solarized Dark',
            'nord': 'Nord',
            'tokyo-night': 'Tokyo Night',
            'github-dark': 'GitHub Dark'
        };
        
        this.init();
    }
    
    init() {
        // Apply saved theme
        this.applyTheme(this.currentTheme);
        
        // Attach event listeners
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        // Toggle dropdown
        this.themeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.themeDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.themeButton.contains(e.target) && !this.themeDropdown.contains(e.target)) {
                this.themeDropdown.classList.remove('active');
            }
        });
        
        // Handle theme selection
        this.themeDropdown.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const theme = option.dataset.theme;
                this.switchTheme(theme);
                this.themeDropdown.classList.remove('active');
            });
        });
    }
    
    switchTheme(theme) {
        if (this.themes[theme]) {
            this.currentTheme = theme;
            this.applyTheme(theme);
            localStorage.setItem('theme', theme);
        }
    }
    
    applyTheme(theme) {
        // Set theme attribute on root element
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update current theme text
        if (this.currentThemeText) {
            this.currentThemeText.textContent = this.themes[theme];
        }
        
        // Update active state in dropdown
        this.themeDropdown.querySelectorAll('.theme-option').forEach(option => {
            if (option.dataset.theme === theme) {
                option.classList.add('active');
                option.querySelector('.codicon-check').style.display = 'block';
            } else {
                option.classList.remove('active');
                option.querySelector('.codicon-check').style.display = 'none';
            }
        });
    }
}
