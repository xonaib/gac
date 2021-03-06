import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';
// interfaces
import {Employee, Task, EmployeeTasksAndEffort, Effort, WeekStartAndEndDates, DayToDateMapping } from '../models';

@Injectable()
export class EmployeeService {
    private baseapi = environment.apiUrl;

    public httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });

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
    getallemployees(startDate: number, endDate: number): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.baseapi + `/employee/getall/${startDate}/${endDate}`);
    }

    // get list of tasks against employee
    getallTasksForEmployee(empId: number, startDate: number, endDate: number): Observable<EmployeeTasksAndEffort> {
        return this.http.get<EmployeeTasksAndEffort>(this.baseapi + `/employee/gettasks/${empId}/${startDate}/${endDate}`);
    }

    postEmployeeEffort(effort: Effort): Observable<boolean> {
        const url = `${this.baseapi}/employee/AddEffort`;

        const options = {
            headers: this.httpHeaders
        };

        return this.http.post<boolean>(url, effort, options);
    }

    postEmployeeEfforts(efforts: Effort[]): Observable<boolean> {
        const url = `${this.baseapi}/employee/AddEfforts`;

        const options = {
            headers: this.httpHeaders
        };

        return this.http.post<boolean>(url, efforts, options);
    }

    getWeekStartAndEndDates(weekNo: number = 0): WeekStartAndEndDates {
        if (weekNo === 0) {
            weekNo = moment().week();
        }
        const dateFormat: string = 'YYYYMMDD',
            current = moment().day('Monday').week(weekNo);

        const dates: WeekStartAndEndDates = {
            weekStartDate: Number(moment(current.toDate()).format(dateFormat)),
            weekEndDate: Number(moment(current.toDate()).add(7, 'day').format(dateFormat))
        };
        return dates;
    }

}
