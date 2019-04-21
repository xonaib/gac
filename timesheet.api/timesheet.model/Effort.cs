using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace timesheet.model
{
    public class Effort
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public int Id { get; set; }
        
        [Required]
        public long Date { get; set; }
        
        [Required]
        public int Hours { get; set; }

        [ForeignKey("task")]
        public int TaskId { get; set; }

        [ForeignKey("employee")]
        public int EmployeeId { get; set; }
       
        public Employee Employee { get; set; }

        public Task Task { get; set; }
    }
}
