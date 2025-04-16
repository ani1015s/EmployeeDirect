using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace EmployeeDirect.Models

{

    [Table("Admin")]

    public class Admin

    {

        [Key]
        public int AdminID { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        [StringLength(255)]  // For storing password hash
        public string Password { get; set; }

        [NotMapped]  // This property won't be stored in database
        public string? PlainPassword { get; set; }

    }

}
