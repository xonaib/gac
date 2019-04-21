import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';

import { Employee, WeekStartAndEndDates } from '../models';

@Component({
    selector: 'employee-list',
    templateUrl: 'employee.component.html',
    styleUrls: ['./employee.component.scss']
})

export class EmployeeListComponent implements OnInit {
    employees: Employee[];
    currentWeekStartAndEnd: WeekStartAndEndDates;

    constructor(private employeeService: EmployeeService) { }

    ngOnInit() {
        this.currentWeekStartAndEnd = this.employeeService.getWeekStartAndEndDates();

        this.employeeService.getallemployees(this.currentWeekStartAndEnd.weekStartDate, this.currentWeekStartAndEnd.weekEndDate)
            .subscribe(data => {
                this.employees = data;

                // emit event to pass emp list to child component
                this.employeeService.emitEmployeeList(this.employees);
        });
    }
}