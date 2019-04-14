import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';

import { Employee } from '../models';

@Component({
    selector: 'employee-list',
    templateUrl: 'employee.component.html',
    styleUrls: ['./employee.component.scss']
})

export class EmployeeListComponent implements OnInit {
    employees: Employee[];
    constructor(private employeeService: EmployeeService) { }

    ngOnInit() {
        this.employeeService.getallemployees().subscribe(data => {
            console.log(data);
            this.employees = data;

            // emit event to pass emp list to child component
            this.employeeService.emitEmployeeList(this.employees);
        });
    }
}