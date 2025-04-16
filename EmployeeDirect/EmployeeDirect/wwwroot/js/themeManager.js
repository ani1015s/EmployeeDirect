import { themes } from './config.js';
import { NotificationSystem } from './utils.js';

export class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.notification = new NotificationSystem();
        this.init();
    }

    init() {
        // Get saved theme from localStorage or use system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.setTheme(prefersDark ? 'dark' : 'light');
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setTheme(themeName) {
        if (!themes[themeName]) {
            this.notification.error({ message: `Theme "${themeName}" not found` });
            return;
        }

        // Apply theme variables to root element
        const root = document.documentElement;
        Object.entries(themes[themeName]).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Update theme-specific classes
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${themeName}`);

        // Store theme preference
        localStorage.setItem('theme', themeName);
        this.currentTheme = themeName;

        // Notify theme change
        this.notification.info({
            message: `Theme changed to ${themeName}`,
            duration: 2000
        });

        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: themeName }
        }));
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    // Apply theme-specific styles to a new element
    applyThemeToElement(element) {
        const theme = themes[this.currentTheme];
        Object.entries(theme).forEach(([property, value]) => {
            element.style.setProperty(property, value);
        });
    }
} 