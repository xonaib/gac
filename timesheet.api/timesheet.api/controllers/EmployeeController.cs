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
        [HttpGet("gettasks/{Id}")]
        public IActionResult GetTasksForUser(int Id)
        {
            var dto = this.employeeService.GetEmployeeTasksAndEffort(Id);
            return new ObjectResult(dto);
        }


        [HttpPost()]
        public IActionResult AddEffort(Effort effort)
        {
            if (effort != null && ModelState.IsValid)
            {
                this.employeeService.AddEmployeeEffort(effort);

                return new ObjectResult(true);
            }

            return new ObjectResult(false);

        }

        [HttpPost()]
        public IActionResult AddEfforts(List<Effort> efforts)
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