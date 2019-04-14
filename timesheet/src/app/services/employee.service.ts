import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// interfaces
import {Employee} from '../models';

@Injectable()
export class EmployeeService {
    private baseapi = environment.apiUrl;
    constructor(private http: HttpClient) { }

    getallemployees() : Observable<Employee[]> {
        return this.http.get<Employee[]>(this.baseapi + '/employee/getall');
    }
}