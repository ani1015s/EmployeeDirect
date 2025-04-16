let departments = [];
let employees = [];

async function loadDepartments() {
    try {
        const response = await fetch(`${API_BASE_URL}/Department`);
        if (!response.ok) throw new Error('Failed to fetch departments');
        departments = await response.json();
        displayDepartments();
    } catch (error) {
        notify('Error loading departments', 'error');
    }
}

async function loadEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/Employee`);
        if (!response.ok) throw new Error('Failed to fetch employees');
        employees = await response.json();
    } catch (error) {
        notify('Error loading employees', 'error');
    }
}

function displayDepartments() {
    const container = document.getElementById('departmentsContainer');
    container.innerHTML = departments.map(dept => `
        <div class="col-md-4 mb-4">
            <div class="card department-card" onclick="showEmployees(${dept.departmentID})">
                <div class="card-body">
                    <h5 class="card-title">${dept.departmentName}</h5>
                    <p class="card-text">
                        <i class="bi bi-people-fill"></i>
                        ${employees.filter(emp => emp.departmentID === dept.departmentID).length} employees
                    </p>
                </div>
            </div>
        </div>
    `).join('');
}

function showEmployees(departmentID) {
    const department = departments.find(dept => dept.departmentID === departmentID);
    const departmentEmployees = employees.filter(emp => emp.departmentID === departmentID);
    
    document.getElementById('departmentName').textContent = department.departmentName;
    
    const employeesList = document.getElementById('employeesList');
    employeesList.innerHTML = departmentEmployees.map(emp => `
        <div class="employee-item">
            <h6>${emp.firstName} ${emp.lastName}</h6>
            <p>${emp.designation}</p>
        </div>
    `).join('');
    
    new bootstrap.Modal(document.getElementById('employeesModal')).show();
}

document.addEventListener('DOMContentLoaded', () => {
    loadDepartments();
    loadEmployees();
});