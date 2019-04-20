using System;
using System.Collections.Generic;
using System.Linq;
using timesheet.data;
using timesheet.model;

namespace timesheet.business
{
    public class EmployeeService
    {
        public TimesheetDb db { get; }
        public EmployeeService(TimesheetDb dbContext)
        {
            this.db = dbContext;
        }

        public IQueryable<Employee> GetEmployees()
        {
            return this.db.Employees;
        }

        public EmployeeTasksAndEffort GetEmployeeTasksAndEffort(int empId)
        {
            EmployeeTasksAndEffort dto = new EmployeeTasksAndEffort();
            dto.efforts = this.db.Efforts.Where(e => e.employeeId == empId).ToList();
            dto.tasks = this.db.Tasks.ToList();

            return dto;
        }

        public void AddEmployeeEffort(Effort effort)
        {
            this.db.Efforts.Add(effort);

            this.db.SaveChanges();
        }

        public void AddEmployeeEfforts(List<Effort> efforts)
        {
            this.db.Efforts.AddRange(efforts);

            this.db.SaveChanges();
        }
    }
}
