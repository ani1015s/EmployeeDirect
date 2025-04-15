using EmployeeDirect.Models;

using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;

namespace EmployeeDirect.Data

{

    public class EmployeeContext : DbContext

    {

        public EmployeeContext(DbContextOptions<EmployeeContext> options) : base(options) { }

        public DbSet<Department> Departments { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Admin> Admins { get; set; }

    }

}

