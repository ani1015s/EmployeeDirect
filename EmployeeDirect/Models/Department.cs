using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeDirect.Models

{

    [Table("Department")]

    public class Department

    {

        public int DepartmentID { get; set; }

        public string DepartmentName { get; set; }

        // public List<Employee> Employees { get; set; }

    }

}

