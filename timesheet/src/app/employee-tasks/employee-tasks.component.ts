import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute } from '@angular/router';

import { Employee, EmployeeTasksAndEffort, Task, Effort } from '../models';
import * as moment from 'moment';

@Component({
  selector: 'app-employee-tasks',
  templateUrl: './employee-tasks.component.html',
  styleUrls: ['./employee-tasks.component.scss']
})
export class EmployeeTasksComponent implements OnInit {
  empId: number;
  empName: string;
  employees: Employee[];
  currentEmp: Employee;
  tasks: Task[];
  daysOfWeek: string[];
  displayWeek: number;
  minWeek: number;
  maxWeek: number;

  constructor(private employeeService: EmployeeService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.empId = this.route.snapshot.paramMap.get('id') != null ? Number(this.route.snapshot.paramMap.get('id')) : 0;

    /*this.employeeService.getEmployeeNode().subscribe((emps: Employee[]) => {
      this.employees = emps;

      console.log('in task', this.employees);
    }); */


    

    const today = moment();
    const from_date = today.startOf('week').isoWeekday(1); //today.startOf('isoWeek');
    const to_date = today.endOf('week').isoWeekday(0);
    console.log({
      from_date: from_date.toString(),
      today: moment().toString(),
      to_date: to_date.toString(),
    });
    this.displayWeek = moment().week();
    this.minWeek = 1;
    this.maxWeek = this.weeksInYear(moment().year());

    debugger;
    // https://stackoverflow.com/questions/18875649/moment-js-starting-the-week-on-monday-with-isoweekday
    // https://stackoverflow.com/questions/25905183/using-moment-js-to-create-an-array-with-days-of-the-week-and-hours-of-the-day
    this.daysOfWeek = Array.apply(null, Array(7)).map(function (_, i) {
      return moment(i, 'e').startOf('week').isoWeekday(i + 1).format('dddd');
    });

    // fetch employees
    this.employeeService.getallemployees().subscribe(data => {
      this.employees = data;

      this.updatePageForEmployeeChange();
    });

  }

  updatePageForEmployeeChange() {
    if (this.employees == null || this.employees.length === 0) {
      return;
    }

    this.currentEmp = this.employees.find(f => f.id === this.empId);

    if (this.currentEmp == null) {
      return;
    }

    this.empName = this.currentEmp.name;

    this.employeeService.getallTasksForEmployee(this.empId).subscribe((data: EmployeeTasksAndEffort) => {
      console.log(data);

      this.tasks = data.tasks;
    });
  }

  // on empId changed
  empChanged() {
    // because it was being passed as a string
    this.empId = Number(this.empId);

    this.updatePageForEmployeeChange();
  }

  // https://stackoverflow.com/questions/18478741/get-weeks-in-year
  weeksInYear(year: number): number {
    return Math.max(
             moment(new Date(year, 11, 31)).isoWeek()
           , moment(new Date(year, 11, 31 - 7)).isoWeek()
    );
 }

}
