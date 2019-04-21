using System;
using System.Collections.Generic;
using System.Text;

namespace timesheet.model
{
    public class EmployeeTasksAndEffort
    {
        public EmployeeTasksAndEffort()
        {
            Tasks = new List<Task>();
            Efforts = new List<Effort>();
        }
        public List<Task> Tasks { get; set; }
        public List<Effort> Efforts { get; set; }
    }

    public class EmployeeDTO : Employee
    {
        public int Hours { get; set; }
        public double AvgHours { get; set; }
    }
}
