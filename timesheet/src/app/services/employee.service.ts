import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

// interfaces
import {Employee, Task, EmployeeTasksAndEffort, Effort } from '../models';

@Injectable()
export class EmployeeService {
    private baseapi = environment.apiUrl;

    private empListSubject = new Subject<any>();

    constructor(private http: HttpClient) { }

    // listeners for passing employees list
    emitEmployeeList(emps: Employee[]) {
        this.empListSubject.next(emps);
    }

    getEmployeeNode(): Observable<any> {
        return this.empListSubject.asObservable();
    }

    // get list of employees
    getallemployees() : Observable<Employee[]> {
        return this.http.get<Employee[]>(this.baseapi + '/employee/getall');
    }

    // get list of tasks against employee
    getallTasksForEmployee(empId: number) : Observable<EmployeeTasksAndEffort> {
        return this.http.get<EmployeeTasksAndEffort>(this.baseapi + `/employee/gettasks/${empId}`);
    }

}
