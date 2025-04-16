// Environment-specific configuration
export const config = {
    development: {
        apiBaseUrl: 'https://localhost:7179/api',
        enableLogging: true
    },
    production: {
        apiBaseUrl: 'https://api.employeedirect.com/api', // Replace with actual production URL
        enableLogging: false
    }
};

// Current environment
export const environment = process.env.NODE_ENV || 'development';

// Active configuration
export const activeConfig = config[environment];

// API endpoints
export const endpoints = {
    employees: '/employee',
    departments: '/department',
    adminLogin: '/admin/login',
    stats: '/stats'
};

// Theme configuration
export const themes = {
    light: {
        '--primary-color': '#007bff',
        '--secondary-color': '#6c757d',
        '--background-color': '#ffffff',
        '--surface-color': '#f8f9fa',
        '--text-color': '#212529',
        '--border-color': '#dee2e6',
        '--hover-color': '#e9ecef',
        '--shadow-color': 'rgba(0, 0, 0, 0.1)',
        
        // Notification colors
        '--notification-success-bg': '#d4edda',
        '--notification-success-text': '#155724',
        '--notification-error-bg': '#f8d7da',
        '--notification-error-text': '#721c24',
        '--notification-warning-bg': '#fff3cd',
        '--notification-warning-text': '#856404',
        '--notification-info-bg': '#d1ecf1',
        '--notification-info-text': '#0c5460',

        // Form elements
        '--input-bg': '#ffffff',
        '--input-border': '#ced4da',
        '--input-text': '#495057',
        '--input-placeholder': '#6c757d',
        '--input-focus-border': '#80bdff',
        '--input-focus-shadow': 'rgba(0, 123, 255, 0.25)',

        // Button colors
        '--button-primary-bg': '#007bff',
        '--button-primary-text': '#ffffff',
        '--button-secondary-bg': '#6c757d',
        '--button-secondary-text': '#ffffff'
    },
    dark: {
        '--primary-color': '#0d6efd',
        '--secondary-color': '#6c757d',
        '--background-color': '#212529',
        '--surface-color': '#343a40',
        '--text-color': '#f8f9fa',
        '--border-color': '#495057',
        '--hover-color': '#495057',
        '--shadow-color': 'rgba(0, 0, 0, 0.25)',

        // Notification colors
        '--notification-success-bg': '#051b11',
        '--notification-success-text': '#75b798',
        '--notification-error-bg': '#2c0b0e',
        '--notification-error-text': '#ea868f',
        '--notification-warning-bg': '#332701',
        '--notification-warning-text': '#ffda6a',
        '--notification-info-bg': '#032830',
        '--notification-info-text': '#6edff6',

        // Form elements
        '--input-bg': '#343a40',
        '--input-border': '#495057',
        '--input-text': '#e9ecef',
        '--input-placeholder': '#6c757d',
        '--input-focus-border': '#0d6efd',
        '--input-focus-shadow': 'rgba(13, 110, 253, 0.25)',

        // Button colors
        '--button-primary-bg': '#0d6efd',
        '--button-primary-text': '#ffffff',
        '--button-secondary-bg': '#6c757d',
        '--button-secondary-text': '#ffffff'
    }
};

// Table configuration
export const tableConfig = {
    pageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
    sortableColumns: ['employeeID', 'firstName', 'lastName', 'email', 'designation', 'departmentName']
}; 