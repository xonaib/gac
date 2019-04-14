using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace timesheet.model
{
    public class Employee
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }

        [StringLength(10)]
        [Required]
        public string Code { get; set; }

        [StringLength(260)]
        [Required]
        public string Name { get; set; }
    }
}
