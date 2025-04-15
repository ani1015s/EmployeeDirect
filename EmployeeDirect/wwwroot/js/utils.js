// Input Sanitization
export const sanitizeInput = (input) => {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
};

// Form Validation
export const validateForm = {
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            isValid: regex.test(email),
            message: 'Please enter a valid email address'
        };
    },
    phone: (phone) => {
        const regex = /^\+?[\d\s-]{10,}$/;
        return {
            isValid: regex.test(phone),
            message: 'Please enter a valid phone number (minimum 10 digits)'
        };
    },
    required: (value, fieldName) => {
        return {
            isValid: value.trim().length > 0,
            message: `${fieldName} is required`
        };
    },
    password: (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return {
            isValid: regex.test(password),
            message: 'Password must be at least 8 characters long and contain both letters and numbers'
        };
    }
};

// Notification System
export class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.getElementById('notification-container');
        if (container) return container;

        const newContainer = document.createElement('div');
        newContainer.id = 'notification-container';
        newContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(newContainer);
        return newContainer;
    }

    createNotification({ message, type = 'info', duration = 3000 }) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            margin-bottom: 10px;
            padding: 15px 25px;
            border-radius: 4px;
            font-size: 14px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease-in-out;
            background-color: var(--notification-${type}-bg);
            color: var(--notification-${type}-text);
            border: 1px solid var(--notification-${type}-border);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        `;

        notification.textContent = message;

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: inherit;
            font-size: 18px;
            cursor: pointer;
            padding: 0 5px;
        `;
        closeButton.onclick = () => this.removeNotification(notification);
        notification.appendChild(closeButton);

        this.container.appendChild(notification);

        // Trigger animation
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }

        return notification;
    }

    removeNotification(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentElement === this.container) {
                this.container.removeChild(notification);
            }
        }, 300);
    }

    success(options) {
        return this.createNotification({ ...options, type: 'success' });
    }

    error(options) {
        return this.createNotification({ ...options, type: 'error' });
    }

    info(options) {
        return this.createNotification({ ...options, type: 'info' });
    }

    warning(options) {
        return this.createNotification({ ...options, type: 'warning' });
    }
}

// Loading Spinner
export class LoadingSpinner {
    constructor() {
        this.createSpinner();
    }

    createSpinner() {
        const spinner = document.createElement('div');
        spinner.id = 'loading-spinner';
        spinner.innerHTML = `
            <div class="spinner-backdrop"></div>
            <div class="spinner-content">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
        spinner.style.display = 'none';
        document.body.appendChild(spinner);
    }

    show() {
        document.getElementById('loading-spinner').style.display = 'block';
    }

    hide() {
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

// API Helper with Loading State
export class ApiHelper {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.spinner = new LoadingSpinner();
        this.notifications = new NotificationSystem();
    }

    async request(endpoint, options = {}) {
        this.spinner.show();
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            this.notifications.show(error.message, 'error');
            throw error;
        } finally {
            this.spinner.hide();
        }
    }
}

// Add keyframe animations to document
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .spinner-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
    }
    .spinner-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
    }
`;
document.head.appendChild(style);

// Helper functions
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
}; 