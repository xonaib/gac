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

        public EmployeeTasksAndEffort GetEmployeeTasksAndEffort(int empId, int StartDate, int EndDate)
        {
            EmployeeTasksAndEffort dto = new EmployeeTasksAndEffort();
            dto.efforts = this.db.Efforts
                    .Where(e => e.employeeId == empId 
                    && StartDate <= e.Date && e.Date <= EndDate).ToList();
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
            this.db.Efforts.AddRange(efforts.Where(w => w.taskId == 0).ToList());
            this.db.Efforts.UpdateRange(efforts.Where(w => w.taskId > 0).ToList());

            this.db.SaveChanges();
        }
    }
}
