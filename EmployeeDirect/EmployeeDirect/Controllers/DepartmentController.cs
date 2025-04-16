using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeDirect.Data;
using EmployeeDirect.Models;
using System.Linq;

namespace EmployeeDirect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly EmployeeContext _context;
        private readonly ILogger<DepartmentController> _logger;

        public DepartmentController(EmployeeContext context, ILogger<DepartmentController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetDepartments()
        {
            try
            {
                var departmentsWithCounts = await _context.Departments
                    .Select(d => new
                    {
                        d.DepartmentID,
                        d.DepartmentName,
                        EmployeeCount = _context.Employees.Count(e => e.DepartmentID == d.DepartmentID),
                        Designations = _context.Employees
                            .Where(e => e.DepartmentID == d.DepartmentID)
                            .Select(e => e.Designation)
                            .Distinct()
                            .Count()
                    })
                    .ToListAsync();

                return Ok(departmentsWithCounts);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting departments: {ex.Message}");
                return StatusCode(500, new { message = "Error retrieving departments" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> GetDepartment(int id)
        {
            try
            {
                var dept = await _context.Departments.FindAsync(id);
                if (dept == null) return NotFound(new { message = $"Department with ID {id} not found" });

                var employeeCount = await _context.Employees.CountAsync(e => e.DepartmentID == id);
                var designationCount = await _context.Employees
                    .Where(e => e.DepartmentID == id)
                    .Select(e => e.Designation)
                    .Distinct()
                    .CountAsync();

                return Ok(new
                {
                    dept.DepartmentID,
                    dept.DepartmentName,
                    EmployeeCount = employeeCount,
                    Designations = designationCount
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting department {id}: {ex.Message}");
                return StatusCode(500, new { message = "Error retrieving department" });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Department>> PostDepartment(Department department)
        {
            try
            {
                _context.Departments.Add(department);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDepartment), new { id = department.DepartmentID }, department);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating department: {ex.Message}");
                return StatusCode(500, new { message = "Error creating department" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepartment(int id, Department department)
        {
            if (id != department.DepartmentID)
                return BadRequest(new { message = "Department ID mismatch" });

            try
            {
                _context.Entry(department).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentExists(id))
                    return NotFound(new { message = $"Department with ID {id} not found" });
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating department {id}: {ex.Message}");
                return StatusCode(500, new { message = "Error updating department" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            try
            {
                var dept = await _context.Departments.FindAsync(id);
                if (dept == null)
                    return NotFound(new { message = $"Department with ID {id} not found" });

                var hasEmployees = await _context.Employees.AnyAsync(e => e.DepartmentID == id);
                if (hasEmployees)
                    return BadRequest(new { message = "Cannot delete department with existing employees" });

                _context.Departments.Remove(dept);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting department {id}: {ex.Message}");
                return StatusCode(500, new { message = "Error deleting department" });
            }
        }

        private bool DepartmentExists(int id)
        {
            return _context.Departments.Any(e => e.DepartmentID == id);
        }
    }
}

