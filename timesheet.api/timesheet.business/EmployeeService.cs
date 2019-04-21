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

        /// <summary>
        /// returns employees list, with their work hours
        /// week start end dates for current week are passed from UI, and used to show total hours        
        /// </summary>
        /// <param name="StartDate">start of week date</param>
        /// <param name="EndDate">end of week date</param>
        /// <returns></returns>
        public List<EmployeeDTO> GetEmployeesAndTime(int StartDate, int EndDate)
        {
            // left join, group by
            // stackoverflow.com/questions/46943961/entity-framework-linq-left-join-and-group-with-sum-and-count
            // docs.microsoft.com/en-us/dotnet/csharp/linq/perform-left-outer-joins
            // stackoverflow.com/questions/50736219/linq-get-data-from-2-tables-in-1-join-with-group-by
            var list = (from t1 in db.Employees
                        join t2 in db.Efforts on t1.Id equals t2.EmployeeId into ef 
                        from sb in ef.DefaultIfEmpty()
                        group sb by new { t1.Id, t1.Name, t1.Code } into g
                        select new EmployeeDTO
                        {
                            Id = g.Key.Id,
                            Name = g.Key.Name,
                            Code = g.Key.Code,
                            Hours = g.Sum(t => (t != null && (StartDate <= t.Date && t.Date <= EndDate) ? t.Hours : 0)),
                            AvgHours = Math.Round(((double)g.Sum(t => (t != null ? t.Hours : 0)) / 7), 3),
                        }).ToList();

            return list;

        }

        public EmployeeTasksAndEffort GetEmployeeTasksAndEffort(int empId, int StartDate, int EndDate)
        {
            EmployeeTasksAndEffort dto = new EmployeeTasksAndEffort();
            dto.Efforts = this.db.Efforts
                    .Where(e => e.EmployeeId == empId 
                    && StartDate <= e.Date && e.Date <= EndDate).ToList();
            dto.Tasks = this.db.Tasks.ToList();

            return dto;
        }

        public void AddEmployeeEffort(Effort effort)
        {
            this.db.Efforts.Add(effort);
            
            this.db.SaveChanges();
        }

        // add or update previously added efforts
        public void AddEmployeeEfforts(List<Effort> efforts)
        {
            this.db.Efforts.AddRange(efforts.Where(w => w.TaskId == 0).ToList());
            this.db.Efforts.UpdateRange(efforts.Where(w => w.TaskId > 0).ToList());

            this.db.SaveChanges();
        }
    }
}
