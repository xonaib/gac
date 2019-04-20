import { Component, OnInit, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { ActivatedRoute, Router  } from '@angular/router';

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
  showLoader: boolean;

  // week
  daysOfWeek: DayToDateMapping[];
  displayWeek: number;
  minWeek: number;
  maxWeek: number;
  weekStartDate: string;
  weekEndDate: string;
  dateFormat: string = 'YYYYMMDD';
  workHoursByDay: number[];

  // popup
  modalRef: BsModalRef;

  // form fields
  loggedTaskId: number;
  loggedHours: number;
  dayOfWork: number;
  empEfforts: Map<number, Effort[]>;
  @ViewChild('f') form: any;
  anyHoursLogged = false;

  // message
  modalTitle: string;
  modalMessage: string;
  buttonOneText: string;

  // tslint:disable-next-line:max-line-length
  constructor(private employeeService: EmployeeService, private route: ActivatedRoute, private modalService: BsModalService, private router: Router) { }

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

    this.currentEmp = this.employees.find(f => f.Id === this.empId);

    if (this.currentEmp == null) {
      return;
    }

    this.anyHoursLogged = false;
    this.empName = this.currentEmp.Name;

    this.employeeService.getallTasksForEmployee(this.empId, Number(this.weekStartDate), Number(this.weekEndDate))
      .subscribe((data: EmployeeTasksAndEffort) => {
        console.log(data);

        this.tasks = data.tasks;

        // initialize empty array with 7 number of days
        this.workHoursByDay = Array(7).fill(0);
        this.empEfforts = new Map<number, Effort[]>();

        // rows
        this.tasks.forEach((task: Task, idx: number) => {
          let taskEfforts: Effort[] = data.efforts.filter(f => f.taskId == task.Id),
            orderedTasks: Effort[] = [];
            //hoursForDay: number = 0;

          if (taskEfforts == null) {
            taskEfforts = [];
          }

          // cols
          this.daysOfWeek.forEach((day: DayToDateMapping, dayIdx: number) => {
            day.date = Number(day.date);
            let taskForDay: Effort = taskEfforts.find(f => f.Date == day.date);

            if (taskForDay == null) {
              taskForDay = {
                Id: 0,
                Date: day.date,
                hours: 0,
                taskId: task.Id,
                employeeId: this.empId
              };
            }

            this.workHoursByDay[dayIdx] += taskForDay.hours;
            // hoursForDay += taskForDay.hours;
            orderedTasks.push(taskForDay);
          });

          // this.empEfforts[task.id] = orderedTasks;
          this.empEfforts.set(task.Id, orderedTasks);
        });
        // empEfforts
      });
  }

  // on empId changed
  empChanged() {
    this.anyHoursLogged = false;
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
        date: dt.format(self.dateFormat),
        idx: i
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
    this.loggedTaskId = this.tasks[0].Id;
    this.dayOfWork = this.daysOfWeek[0].date;
    this.loggedHours = 1;

    this.modalRef = this.modalService.show(template);
  }

  keyEntry($event: any) {
    $event.preventDefault();
    return false;
  }

  addHours(modaltemplate: TemplateRef<any>) {

    //if (!this.form.valid) {
    //  return;
    //}
    this.modalRef.hide();
    this.loggedTaskId = Number(this.loggedTaskId);
    this.dayOfWork = Number(this.dayOfWork);
    this.loggedHours = Number(this.loggedHours);

    const taskId: number = this.loggedTaskId, // row
      dayOfWork = this.dayOfWork;

    // update correct item in grid
    let userEfforts: Effort[] = this.empEfforts.get(taskId);

    if (userEfforts != null) {
      let userEffortIdx = userEfforts.findIndex(f => f.Date == dayOfWork);

      // index of day, column
      if (userEffortIdx > -1) {
        this.anyHoursLogged = true;

        userEfforts[userEffortIdx].isDirty = true;
        userEfforts[userEffortIdx].hours = this.loggedHours;

        // reset hours for day to zero
        this.workHoursByDay[userEffortIdx] = 0;

        // calculate total hours for the day
        // for each row
        this.tasks.forEach((task: Task, idx: number) => {
          const efforts: Effort[] = this.empEfforts.get(task.Id);

          this.workHoursByDay[userEffortIdx] += efforts[userEffortIdx].hours;
        });
      }
    }

    // reset stuff
    this.loggedTaskId = this.tasks[0].id;
    this.dayOfWork = this.daysOfWeek[0].date;
    this.loggedHours = 1;

    // show message
    this.modalTitle = 'Saved';
    this.modalMessage = 'Record has been locally updated.';
    this.buttonOneText = 'OK';

    this.modalRef = this.modalService.show(modaltemplate);
  }

  goBack(modaltemplate: TemplateRef<any>) {
    if (this.anyHoursLogged) {
      // confirmation popup
    }

    this.router.navigate(['']);
  }

  postEfforts(modaltemplate: TemplateRef<any>) {
    let userAddedEfforts: Effort[] = [];
    this.tasks.forEach((task: Task, idx: number) => {
      const efforts: Effort[] = this.empEfforts.get(task.Id).filter(f => f.isDirty);

      if (efforts.length > 0) {
        userAddedEfforts = userAddedEfforts.concat(efforts);
      }
    });

    if (userAddedEfforts.length == 0) {
      // nothig to update, return

      this.modalTitle = 'Nothing to save';
      this.modalMessage = 'Please add hours against tasks to save.';
      this.buttonOneText = 'OK';

      this.modalRef = this.modalService.show(modaltemplate);
      return;
    }

    this.showLoader = true;
    console.log('form was valid and was submitted');

    this.employeeService.postEmployeeEfforts(userAddedEfforts).subscribe((result: boolean) => {
      console.log(result);
      this.showLoader = false;

      this.modalTitle = 'Saved';
      this.modalMessage = result ? 'Data was saved.' : 'Data could not be saved.';
      this.buttonOneText = 'OK';

      this.modalRef = this.modalService.show(modaltemplate);

      if (result) {
        this.updatePageForEmployeeChange();
      }
    });
  }

}
