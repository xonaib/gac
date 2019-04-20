import { Component, OnInit, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute } from '@angular/router';

import { Employee, EmployeeTasksAndEffort, Task, Effort, DayToDateMapping } from '../models';
import * as moment from 'moment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
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

  // week
  daysOfWeek: DayToDateMapping[];
  displayWeek: number;
  minWeek: number;
  maxWeek: number;
  weekStartDate: string;
  weekEndDate: string;
  dateFormat: string = 'YYYYMMDD';

  // popup
  modalRef: BsModalRef;

  // form fields
  loggedTaskId: number;
  loggedHours: number;
  dayOfWork: number;
  @ViewChild('f') form: any;

  // tslint:disable-next-line:max-line-length
  constructor(private employeeService: EmployeeService, private route: ActivatedRoute, private modalService: BsModalService) { }

  ngOnInit() {
    this.empId = this.route.snapshot.paramMap.get('id') != null ? Number(this.route.snapshot.paramMap.get('id')) : 0;

    /*this.employeeService.getEmployeeNode().subscribe((emps: Employee[]) => {
      this.employees = emps;

      console.log('in task', this.employees);
    }); */

    this.displayWeek = moment().week();
    this.minWeek = 1;
    this.maxWeek = this.weeksInYear(moment().year());

    this.updateStartAndEndOfWeekFromWeekNumber();

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

  changeWeek(dir: number) {
    if (this.minWeek <= (this.displayWeek + dir) && (this.displayWeek + dir) <= this.maxWeek) {
      // allow change of direction
      this.displayWeek = this.displayWeek + dir;

      this.updateStartAndEndOfWeekFromWeekNumber();
    }
  }

  // https://til.hashrocket.com/posts/cxd9yl95ip--get-begining-and-end-of-week-with-momentjs
  // https://stackoverflow.com/questions/11154673/get-the-correct-week-number-of-a-given-date
  // https://stackoverflow.com/questions/2821035/c-sharp-get-start-date-and-last-date-based-on-current-date
  // https://stackoverflow.com/questions/18875649/moment-js-starting-the-week-on-monday-with-isoweekday
  // https://stackoverflow.com/questions/25905183/using-moment-js-to-create-an-array-with-days-of-the-week-and-hours-of-the-day
  updateStartAndEndOfWeekFromWeekNumber() {
    const current = moment().day('Monday').week(this.displayWeek),
      self = this;

    // this.weekStartDate = current.startOf('week').isoWeekday(1).format(this.dateFormat); //today.startOf('isoWeek');
    // this.weekEndDate = current.startOf('week').isoWeekday(1).add(7, 'day').format(this.dateFormat);
    // current.endOf('week').isoWeekday(0).format(this.dateFormat);

    this.daysOfWeek = Array.apply(null, Array(7)).map(function (_, i) {
      const dt = moment(current.toDate()).add(i, 'day');
      // moment(current.toDate()).add(i, 'day').startOf('week').isoWeekday(i + 1);
      // moment(i, 'e').startOf('week').isoWeekday(i + 1);
      return {
        day: dt.format('dddd'),
        date: dt.format(self.dateFormat)
      };
    });

    this.weekStartDate = this.daysOfWeek[0].date.toString();
    this.weekEndDate = this.daysOfWeek[this.daysOfWeek.length - 1].date.toString();
  }

  // https://stackoverflow.com/questions/18478741/get-weeks-in-year
  weeksInYear(year: number): number {
    return Math.max(
      moment(new Date(year, 11, 31)).isoWeek()
      , moment(new Date(year, 11, 31 - 7)).isoWeek()
    );
  }

  openModal(template: TemplateRef<any>) {
    // reset form
    this.loggedTaskId = this.tasks[0].id;
    this.dayOfWork = this.daysOfWeek[0].date;
    this.loggedHours = 0;

    this.modalRef = this.modalService.show(template);
  }

  addHours() {
    debugger;
    //if (!this.form.valid) {
    //  return;
    //}

    console.log('form was valid and was submitted');
    this.modalRef.hide();

    const effort: Effort = {
      employeeId: this.empId,
      Date: this.dayOfWork,
      hours: this.loggedHours,
      taskId: this.loggedTaskId,
      Id: 0
    };

    this.employeeService.postEmployeeEffort(effort).subscribe((data: boolean) => {
      console.log(data);
      debugger;
    });
  }

}
