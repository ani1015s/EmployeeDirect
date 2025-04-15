using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeDirect.Data;
using EmployeeDirect.Models;

namespace EmployeeDirect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeContext _context;
        private readonly ILogger<EmployeeController> _logger;

        public EmployeeController(EmployeeContext context, ILogger<EmployeeController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            return await _context.Employees.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound();
            return employee;
        }

        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee(Employee employee)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrWhiteSpace(employee.FirstName) ||
                    string.IsNullOrWhiteSpace(employee.LastName) ||
                    string.IsNullOrWhiteSpace(employee.Email) ||
                    string.IsNullOrWhiteSpace(employee.PhoneNumber) ||
                    string.IsNullOrWhiteSpace(employee.Designation))
                {
                    return BadRequest(new { message = "All fields are required" });
                }

                // Validate email format
                if (!IsValidEmail(employee.Email))
                {
                    return BadRequest(new { message = "Invalid email format" });
                }

                // Validate department exists
                var departmentExists = await _context.Departments.AnyAsync(d => d.DepartmentID == employee.DepartmentID);
                if (!departmentExists)
                {
                    return BadRequest(new { message = "Invalid department selected" });
                }

                // Check for duplicate email
                var emailExists = await _context.Employees.AnyAsync(e => e.Email == employee.Email);
                if (emailExists)
                {
                    return BadRequest(new { message = "An employee with this email already exists" });
                }

                // Generate a unique employee ID
                var lastEmployee = await _context.Employees
                    .OrderByDescending(e => e.EmployeeID)
                    .FirstOrDefaultAsync();
                
                int newEmployeeId = 2395520; // Base ID
                if (lastEmployee != null)
                {
                    newEmployeeId = lastEmployee.EmployeeID + 1;
                }
                employee.EmployeeID = newEmployeeId;

                _context.Employees.Add(employee);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"New employee created: {employee.FirstName} {employee.LastName} (ID: {employee.EmployeeID})");
                return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeID }, employee);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating employee: {ex.Message}");
                return StatusCode(500, new { message = "Internal server error while creating employee" });
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, Employee employee)
        {
            if (id != employee.EmployeeID)
                return BadRequest("Employee ID mismatch");

            try
            {
                var existingEmployee = await _context.Employees.FindAsync(id);
                if (existingEmployee == null)
                    return NotFound($"Employee with ID {id} not found");

                // Update the existing employee's properties
                existingEmployee.FirstName = employee.FirstName;
                existingEmployee.LastName = employee.LastName;
                existingEmployee.Email = employee.Email;
                existingEmployee.PhoneNumber = employee.PhoneNumber;
                existingEmployee.DOJ = employee.DOJ;
                existingEmployee.Designation = employee.Designation;
                existingEmployee.DepartmentID = employee.DepartmentID;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                    return NotFound();
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating employee {id}: {ex.Message}");
                return StatusCode(500, "Internal server error while updating employee");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var employee = await _context.Employees.FindAsync(id);
                if (employee == null)
                    return NotFound($"Employee with ID {id} not found");

                _context.Employees.Remove(employee);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting employee {id}: {ex.Message}");
                return StatusCode(500, "Internal server error while deleting employee");
            }
        }

        private bool EmployeeExists(int id)
        {
            return _context.Employees.Any(e => e.EmployeeID == id);
        }
    }
}

