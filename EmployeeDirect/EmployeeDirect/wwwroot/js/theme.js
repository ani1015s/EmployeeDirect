import { themes } from './config.js';
import { NotificationSystem } from './utils.js';

export class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.notification = new NotificationSystem();
        this.init();
    }

    init() {
        // Apply saved theme on load
        this.applyTheme(this.currentTheme);
        
        // Add theme toggle button to DOM
        this.createThemeToggle();
    }

    createThemeToggle() {
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle';
        toggleBtn.className = 'theme-toggle-btn';
        toggleBtn.innerHTML = `
            <span class="light-icon">☀️</span>
            <span class="dark-icon">🌙</span>
        `;
        
        document.body.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', () => {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.toggleTheme();
        });
    }

    applyTheme(theme) {
        const root = document.documentElement;
        const themeColors = themes[theme];

        // Apply theme colors to CSS variables
        Object.entries(themeColors).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });

        // Update body class
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);

        // Store theme preference
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        this.notification.show({
            message: `Switched to ${newTheme} theme`,
            type: 'info',
            duration: 2000
        });
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();
export default themeManager; 