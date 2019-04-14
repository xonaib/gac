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
        public int hours { get; set; }

        [ForeignKey("task")]
        public int taskId { get; set; }

        [ForeignKey("employee")]
        public int employeeId { get; set; }
       
        public Employee employee { get; set; }

        public Task task { get; set; }
    }
}
