const API_BASE_URL = 'https://localhost:7179/api';
let employees = [];
let departments = [];
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon();
    
    // Add theme switch event listener
    document.querySelector('.theme-switch').addEventListener('click', toggleTheme);
    
    // Add search and filter event listeners
    document.getElementById('searchInput').addEventListener('input', filterEmployees);
    document.getElementById('departmentFilter').addEventListener('change', filterEmployees);
    document.getElementById('designationFilter').addEventListener('change', filterEmployees);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Load data
    await Promise.all([
        loadEmployees(),
        loadDepartments()
    ]);
    
    // Initialize filters
    initializeFilters();
});

// Theme functions
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-switch i');
    if (themeIcon) {
        themeIcon.className = currentTheme === 'light' ? 'bi bi-moon-fill' : 'bi bi-sun-fill';
    }
}

// Data loading functions
async function loadEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/employee`);
        employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Error loading employees:', error);
        showError('Failed to load employees');
    }
}

async function loadDepartments() {
    try {
        const response = await fetch(`${API_BASE_URL}/department`);
        departments = await response.json();
    } catch (error) {
        console.error('Error loading departments:', error);
        showError('Failed to load departments');
    }
}

// Display functions
function displayEmployees(employeesToShow) {
    const container = document.getElementById('employeeCards');
    container.innerHTML = employeesToShow.map(emp => `
        <div class="col-md-6 col-lg-4">
            <div class="card employee-card">
                <div class="card-body position-relative">
                    <span class="badge bg-primary department-badge">
                        ${getDepartmentName(emp.departmentID)}
                    </span>
                    <div class="employee-avatar">
                        ${getInitials(emp.firstName, emp.lastName)}
                    </div>
                    <h5 class="card-title text-center mb-3">
                        ${emp.firstName} ${emp.lastName}
                    </h5>
                    <div class="employee-details">
                        <p class="mb-2">
                            <i class="bi bi-person-badge"></i>
                            ${emp.designation}
                        </p>
                        <p class="mb-2">
                            <i class="bi bi-envelope"></i>
                            ${emp.email}
                        </p>
                        <p class="mb-2">
                            <i class="bi bi-telephone"></i>
                            ${emp.phoneNumber}
                        </p>
                        <p class="mb-2">
                            <i class="bi bi-calendar-check"></i>
                            Joined: ${new Date(emp.doj).toLocaleDateString()}
                        </p>
                        <p class="mb-2">
                            <i class="bi bi-hash"></i>
                            ID: ${emp.employeeID}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter functions
function initializeFilters() {
    const departmentFilter = document.getElementById('departmentFilter');
    const designationFilter = document.getElementById('designationFilter');
    
    // Get unique departments
    const uniqueDepartments = [...new Set(departments.map(d => d.departmentName))];
    departmentFilter.innerHTML += uniqueDepartments
        .map(dept => `<option value="${dept}">${dept}</option>`)
        .join('');
    
    // Get unique designations
    const uniqueDesignations = [...new Set(employees.map(e => e.designation))];
    designationFilter.innerHTML += uniqueDesignations
        .map(desig => `<option value="${desig}">${desig}</option>`)
        .join('');
}

function filterEmployees() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const departmentFilter = document.getElementById('departmentFilter').value;
    const designationFilter = document.getElementById('designationFilter').value;
    
    const filtered = employees.filter(emp => {
        const matchesSearch = (
            emp.firstName.toLowerCase().includes(searchTerm) ||
            emp.lastName.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm)
        );
        
        const matchesDepartment = !departmentFilter || 
            getDepartmentName(emp.departmentID) === departmentFilter;
        
        const matchesDesignation = !designationFilter || 
            emp.designation === designationFilter;
        
        return matchesSearch && matchesDepartment && matchesDesignation;
    });
    
    displayEmployees(filtered);
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('departmentFilter').value = '';
    document.getElementById('designationFilter').value = '';
    displayEmployees(employees);
}

// Utility functions
function getDepartmentName(departmentId) {
    const department = departments.find(d => d.departmentID === departmentId);
    return department ? department.departmentName : 'Unknown';
}

function getInitials(firstName, lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
}

function showError(message) {
    // You can implement a proper error notification system here
    alert(message);
} 