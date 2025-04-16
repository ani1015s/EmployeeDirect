using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeDirect.Data;
using EmployeeDirect.Models;

namespace EmployeeDirect.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly EmployeeContext _context;
        private readonly ILogger<AdminController> _logger;

        public AdminController(EmployeeContext context, ILogger<AdminController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Admin loginAdmin)
        {
            try
            {
                if (string.IsNullOrEmpty(loginAdmin.Username) || string.IsNullOrEmpty(loginAdmin.Password))
                {
                    return BadRequest(new { message = "Username and password are required" });
                }

                var admin = _context.Admins.FirstOrDefault(a => a.Username == loginAdmin.Username);
                
                if (admin == null)
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                // Simple password comparison
                if (admin.Password != loginAdmin.Password)
                {
                    _logger.LogWarning($"Failed login attempt for username: {loginAdmin.Username}");
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                _logger.LogInformation($"Successful login for username: {loginAdmin.Username}");
                return Ok(new { message = "Login successful" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Login error: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] Admin newAdmin)
        {
            try
            {
                if (string.IsNullOrEmpty(newAdmin.PlainPassword))
                {
                    return BadRequest(new { message = "Password is required" });
                }

                // Check if username already exists
                if (_context.Admins.Any(a => a.Username == newAdmin.Username))
                {
                    return BadRequest(new { message = "Username already exists" });
                }

                // Hash the password
                newAdmin.Password = BCrypt.Net.BCrypt.HashPassword(newAdmin.PlainPassword);
                newAdmin.PlainPassword = null; // Clear the plain password

                _context.Admins.Add(newAdmin);
                _context.SaveChanges();

                return Ok(new { message = "Admin registered successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }
    }
}

