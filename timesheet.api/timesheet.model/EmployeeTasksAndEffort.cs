using System;
using System.Collections.Generic;
using System.Text;

namespace timesheet.model
{
    public class EmployeeTasksAndEffort
    {
        public EmployeeTasksAndEffort()
        {
            tasks = new List<Task>();
            efforts = new List<Effort>();
        }
        public List<Task> tasks { get; set; }
        public List<Effort> efforts { get; set; }
    }
}
