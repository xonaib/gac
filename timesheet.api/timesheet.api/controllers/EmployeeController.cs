using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using timesheet.business;
using timesheet.model;

namespace timesheet.api.controllers
{
    [Route("api/v1/employee")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeService employeeService;
        public EmployeeController(EmployeeService employeeService)
        {
            this.employeeService = employeeService;
        }

        [HttpGet("getall")]
        public IActionResult GetAll()
        {
            var items = this.employeeService.GetEmployees();
            return new ObjectResult(items);
        }

        // get list of tasks, and time spent against each task by day
        [HttpGet("gettasks/{Id}/{StartDate}/{EndDate}")]
        public IActionResult GetTasksForUser(int Id, int StartDate, int EndDate)
        {
            var dto = this.employeeService.GetEmployeeTasksAndEffort(Id, StartDate, EndDate);
            return new ObjectResult(dto);
        }


        [HttpPost("AddEffort")]
        public IActionResult AddEffort([FromBody] Effort effort)
        {
            if (effort != null && ModelState.IsValid)
            {
                this.employeeService.AddEmployeeEffort(effort);

                return new ObjectResult(true);
            }

            return new ObjectResult(false);

        }

        [HttpPost("AddEfforts")]
        public IActionResult AddEfforts([FromBody] List<Effort> efforts)
        {
            if (efforts != null && ModelState.IsValid)
            {
                this.employeeService.AddEmployeeEfforts(efforts);

                return new ObjectResult(true);
            }

            return new ObjectResult(false);

        }

    }
}